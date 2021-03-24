import React,{useState,useEffect,useRef} from 'react';
import randomIntFromInterval from '../lib/utils';
import './board.css';

class Cell{
    constructor(row,col,cell){
        this.row=row;
        this.col=col;
        this.cell=cell;
    }
}
class LinkedListNode{
    constructor(value){
        this.value=new Cell(value);
        this.next=null;
    }
}
class SinglyLinkedList{
    constructor(value){
        const node=new LinkedListNode(value);
        this.head=node;
        this.tail=node;
    }
}

const BOARD_SIZE=10;
const PROBABILITY_OF_DIRECTION_REVERSAL_FOOD=0.3;

const createBoard = BOARD_SIZE => {
    let counter=1;
    const board=[];

    for(let row=0;row<BOARD_SIZE;row++){
        const currentRow=[];
        for(let col=0;col<BOARD_SIZE;col++){
            currentRow.push(counter++);
        }//every cell of board has a unique counter
        board.push(currentRow);
    }
    return board;
}
const getStartingSnakeLLValue=board=>{
    const rowSize = board.length;
    const colSize = board[0].length;
    const startingRow=Math.round(rowSize/3);
    const startingCol=Math.round(colSize/3);
    const startingCell=board[startingRow][startingCol];
    return{
        row:startingRow,
        col:startingCol,
        cell:startingCell
    }
}
//hashtable to return direction
const Direction={
    UP:'UP',
    RIGHT:'RIGHT',
    DOWN:'DOWN',
    LEFT:'LEFT',
};
//obtaining direction form key pressed
const getDirectionFromKey = key=>{
    switch (key) {
        case 'ArrowUp':
            return Direction.UP;
        case 'ArrowRight':
            return Direction.RIGHT;
        case 'ArrowDown':
            return Direction.DOWN;
        case 'ArrowLeft':
            return Direction.LEFT;
        default:
            return '';
    }
}



const Board=()=>{
    const [board, setBoard] = useState(createBoard(BOARD_SIZE));
    
    //starting point of snake
    const [snake, setSnake] = useState(
        new SinglyLinkedList(getStartingSnakeLLValue)
    );
    const [snakeCells, setSnakeCells] = useState(
        new Set([snake.head.value.cell])
    )
    const snakeCellsHookRef=useRef(snakeCells);
    const _setSnakeCells=newSnakeCells=>{
        snakeCellsHookRef.current=newSnakeCells;
        setSnakeCells(newSnakeCells);
    }
    //setting the starting food cell 5 cells away from starting snake cell
    const [foodCell,setFoodCell]=useState(snake.head.value.cell+5);

    const [direction, setDirection] = useState(Direction.RIGHT);//initially snake starts moving right
    const directionHookRef=useRef(direction);
    const _setDirection=direction=>{
        directionHookRef.current=direction;
        setDirection(direction);
    }
    
    const [foodShouldReverseDirection, setFoodShouldReverseDirection]=useState(
        false
    );

    const [score,setScore]=useState(0);

    useEffect(()=>{
        window.addEventListener('keydown',e=>{
            handleKeydown(e);
        });
    },[]);

    useInterval(()=>{
        moveSnake();
    },150);

    const handleKeydown=e=>{
        const newDirection=getDirectionFromKey(e.key);
        const isValidDirection=newDirection!=='';
        if(!isValidDirection)return;
        //checking if new direction is exactly opposite of current direction
        const snakeWillRunIntoItself=getOppostiteDirection(newDirection)===directionHookRef.current && snakeCellsHookRef.current.size>1;
        if(snakeWillRunIntoItself)return;
        setDirection(newDirection);
    }

    const moveSnake=()=>{
        const currentHeadCoordinates={
            row:snake.head.value.row,
            col:snake.head.value.col,
        };

        const nextHeadCoordinates=getNextHeadCoordinates(currentHeadCoordinates,direction);
  
        if(isOutOfBounds(nextHeadCoordinates,board)){
            handleGameOver();
            return;
        }
        
        const nextHeadCell=board[nextHeadCoordinates.row][nextHeadCoordinates.col];
        // to check if next cell is already part of snake then snake collides with itself
        if(snakeCells.has(nextHeadCell)){
            handleGameOver();
            return;
        }
        
        const newHead=new LinkedListNode({
            row:nextHeadCoordinates.row,
            col:nextHeadCoordinates.col,
            cell:nextHeadCell
        });
        const currentHead=snake.head;//check it out
        snake.head=newHead;
        currentHead.next=newHead;

        //updating cells in snake
        const newSnakeCells=new Set(snakeCells);
        newSnakeCells.delete(snake.tail.value.cell);
        newSnakeCells.add(nextHeadCell);

        //updating snake's tail
        snake.tail=snake.tail.next;
        if(snake.tail===null)snake.tail=snake.head;

        const foodConsumed= nextHeadCell===foodCell;
        if(foodConsumed){
            growSnake(newSnakeCells);
            if(foodShouldReverseDirection){
                reverseSnake()
            }
            handleFoodConsumption(newSnakeCells);
        }
    }

    
    const growSnake= newSnakeCells => {
        const growthNodeCoords=getGrowthNodeCoords(snake.tail,direction);
        if(isOutOfBounds(growthNodeCoords,board)){
            return;
        }
        const newTailCell=board[growthNodeCoords.row][growthNodeCoords.col];
        const newTail=new LinkedListNode({
            row:growthNodeCoords.row,
            col:growthNodeCoords.col,
            cell:newTailCell
        });
        const currentTail=snake.tail;
        snake.tail=newTail;
        snake.tail.next=currentTail;
        
        newSnakeCells.add(newTailCell);
        
    }

    const reverseSnake=()=>{
        const tailNextNodeDirection=getNextNodeDirection(snake.tail,direction);
        const newDirection=getOppostiteDirection(tailNextNodeDirection);
        setDirection(newDirection);
        //tail of the snake is actually the head of linked list
        //which is why we have to pass tail of the linked list to reverse snake
        reverseLinkedList(snake.tail);
        //after reversing head will become tail and vice-versa
        //updating head and tail 
        const snakeHead=snake.head;
        snake.head=snake.tail;
        snake.tail=snakeHead;
    }
    const handleFoodConsumption=()=>{
        const maxPossibleCellValue=BOARD_SIZE*BOARD_SIZE;
        let nextFoodCell;
        //food cell should be such that it's not already a snake cell or a food cell
        
        // In practice, this will never be a time-consuming operation. Even
    // in the extreme scenario where a snake is so big that it takes up 90%
    // of the board (nearly impossible), there would be a 10% chance of generating
    // a valid new food cell--so an average of 10 operations: trivial.
        while(true){
            nextFoodCell=randomIntFromInterval(1,maxPossibleCellValue);
            if(snakeCells.has(nextFoodCell) || foodCell===nextFoodCell)continue;
            break;
        }
        const nextFoodShouldReverseDirection=Math.random()<PROBABILITY_OF_DIRECTION_REVERSAL_FOOD;
        
        setFoodCell(nextFoodCell);
        setFoodShouldReverseDirection(nextFoodShouldReverseDirection);
        setScore(score+1);
    }

    const getNextHeadCoordinates=(currentHeadCoordinates,direction)=>{
        switch (direction) {
            case Direction.UP:
                return{
                    row:currentHeadCoordinates.row-1,
                    col:currentHeadCoordinates.col
                };
                
            case Direction.RIGHT:
                return{
                    row:currentHeadCoordinates.row,
                    col:currentHeadCoordinates.col+1
                };
                
            case Direction.DOWN:
                return{
                    row:currentHeadCoordinates.row+1,
                    col:currentHeadCoordinates.col
                };
                
            case Direction.LEFT:
                return{
                    row:currentHeadCoordinates.row,
                    col:currentHeadCoordinates.col-1
                };
            default:
                break;
        }
    }
    
    const getOppostiteDirection= direction=>{
        switch (direction) {
            case Direction.UP:
                return Direction.DOWN;
            case Direction.RIGHT:
                return Direction.LEFT;
            case Direction.DOWN:
                return Direction.UP;
            case Direction.LEFT:
                return Direction.RIGHT;
            default:
                break;
        }
    }

    const getGrowthNodeCoords=(snakeTail,currentDirection)=>{
        const tailNextNodeDirection=getNextNodeDirection(snakeTail,currentDirection);
        console.log(tailNextNodeDirection);
        const growthDirection=getOppostiteDirection(tailNextNodeDirection);
        const currentTailCoords={
            row:snake.tail.value.row,
            col:snake.tail.value.col,
        }
        console.log(growthDirection);
        const growthNodeCoords=getCoordsInDirection(
            currentTailCoords,
            growthDirection
        );
        console.log(growthNodeCoords);
        return growthNodeCoords;
    }
    
    return(
        <div className="board">
            {board.map((row,rowInd)=>(
                <div key={rowInd} className="row">
                {
                    row.map((cellValue,cellInd)=>(
                        <div key={cellInd} 
                        className={`cell ${true?'cell-green':''}`}
                        >
                            {cellValue}
                        </div>
                    ))
                }
                </div>
            ))}
        </div>
    )
}

export default Board;