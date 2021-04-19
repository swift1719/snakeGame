import React,{useState,useEffect,useRef} from 'react';
import {createBoard,isOutOfBounds,getCellClassName} from '../utils/boardUtil';
import {SinglyLinkedList,LinkedListNode,reverseLinkedList} from '../utils/singlyLL';
import {getStartingSnakeCell,randomIntFromInterval} from '../utils/snakeUtil';
import {
    Direction,
    getDirectionFromKey,
    getOppostiteDirection,
    getGrowthNodeCoords,
    getNextCoordInDirection,
    getNextNodeDirection
} from '../utils/coordUtil';
import {useInterval} from '../utils/intervalUtil';
import './board.css';
import Aside from './aside';
import scoreBoardImg from '../assets/borderGolden.png';
import appleImg from '../assets/apple.png';
import GreenBoard from '../assets/borderLeaves.png';
import frogImg from '../assets/frog.png';
const BOARD_SIZE=13;
const PROBABILITY_OF_DIRECTION_REVERSAL_FOOD=0.3;

const Board=()=>{

    // eslint-disable-next-line no-unused-vars
    const [board, setBoard] = useState(createBoard(BOARD_SIZE));
    
    //starting point of snake
    const [snake, setSnake] = useState(
        new SinglyLinkedList(getStartingSnakeCell(board))
    );
    const [snakeCells, setSnakeCells] = useState(
        new Set([snake.head.value.cell])
    )
    //useRef can be used keep track of variables without causing re-render of the component
    //Refs in React are used to store a reference to a React element and their values are persisted across re-render.
    // Refs are mutable objects, hence they can be updated explicitly and
    // can hold values other than a reference to a React element.
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        _setDirection(newDirection);
    }

    const moveSnake=()=>{
        const currentHeadCoordinates={
            row:snake.head.value.row,
            col:snake.head.value.col,
        };

        const nextHeadCoordinates=getNextCoordInDirection(currentHeadCoordinates,direction);
  
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
        //updating head
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

        // if food is consumed then grow
        const foodConsumed= nextHeadCell===foodCell;
        if(foodConsumed){
            growSnake(newSnakeCells);
            if(foodShouldReverseDirection){
                reverseSnake();
            }
            handleFoodConsumption(newSnakeCells);
        }
        _setSnakeCells(newSnakeCells);
    }

    const growSnake= newSnakeCells => {
        const growthNodeCoords=getGrowthNodeCoords(snake.tail,direction);
        //if snake's tail is already bordering with boundaries then growth is restricted
        //since direction of growth will be ambigous
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
        _setDirection(newDirection);
        //tail of the snake is actually the head of linked list
        //which is why we have to pass tail of the linked list to reverse snake
        reverseLinkedList(snake.tail);
        //after reversing head will become tail and vice-versa
        //updating head and tail 
        const snakeHead=snake.head;
        snake.head=snake.tail;
        snake.tail=snakeHead;
    }
    const handleFoodConsumption= newSnakeCells=>{
        const maxPossibleCellValue=BOARD_SIZE*BOARD_SIZE;
        let nextFoodCell;
        //food cell should be such that it's not already a snake cell or a food cell
        
        // In practice, this will never be a time-consuming operation. Even
    // in the extreme scenario where a snake is so big that it takes up 90%
    // of the board (nearly impossible), there would be a 10% chance of generating
    // a valid new food cell--so an average of 10 operations: trivial.
        while(true){
            nextFoodCell=randomIntFromInterval(1,maxPossibleCellValue);
            if(newSnakeCells.has(nextFoodCell) || foodCell===nextFoodCell) continue;
            break;
        }
        const nextFoodShouldReverseDirection=Math.random()<PROBABILITY_OF_DIRECTION_REVERSAL_FOOD;
        
        setFoodCell(nextFoodCell);
        setFoodShouldReverseDirection(nextFoodShouldReverseDirection);
        if(foodShouldReverseDirection){//if food is frog then score double
            setScore(score+2);
        }else{
            setScore(score+1);
        }
    }

    const handleGameOver=()=>{
        setScore(0);
        const snakeLLStartingValue=getStartingSnakeCell(board);
        setSnake(new SinglyLinkedList(snakeLLStartingValue));
        setFoodCell(snakeLLStartingValue.cell+5);
        setSnakeCells(new Set([snakeLLStartingValue.cell]));
        setDirection(Direction.RIGHT);
    }
    
    return(
        <>
            <Aside/>
            <div className="boardContainer" >
                
                <img style={{marginTop:"-10px"}} height="728px" width="800px" src={GreenBoard} alt="backBoard"/>
                
                <div className="board">
                {board.map((row,rowInd)=>(
                    <div key={rowInd} className="row">
                    {
                        row.map((cellValue,cellInd)=>{
                            const className=getCellClassName(
                                cellValue,
                                foodCell,
                                foodShouldReverseDirection,
                                snakeCells
                            );
                            return (
                                <div key={cellInd} 
                                className={className}></div>
                            )
                        })
                    }
                    </div>
                ))}
                </div>
            </div>
            <div className="scoreBoard">
                <img width="320px" height="320px" src={scoreBoardImg} alt="scoreBoardLayout" />
                <p>
                    <span style={{textDecorationLine:"underline"}} >Score </span>
                    <br/>
                    <img width="100px" height="100px" style={{marginTop:"0px",marginLeft:"-100px"}} src={appleImg} alt="apple.png" />
                    <span style={{position:"absolute",color:"red",marginTop:"30px",marginLeft:"0px"}}><strong>{score}</strong></span>
                    <img width="100px" height="100px" style={{marginTop:"0px",marginLeft:"30px",marginRight:"-100px"}} src={frogImg} alt="frog.png" />
                </p>
            </div>
        </>
    )
}
export default Board;