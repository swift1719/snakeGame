import React,{useState,useEffect} from 'react';
import './board.css';

class LinkedListNode{
    constructor(value){
        this.value=value;
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
class Cell{
    constructor(row,col,value){
        this.row=row;
        this.col=col;
        this.value=value;
    }
}

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


const BOARD_SIZE=10;
const Board=()=>{
    const [board, setboard] = useState(createBoard(BOARD_SIZE));
    const [snakeCells, setsnakeCells] = useState(new Set([44]));//starting point of snake
    const [snake, setSnake] = useState(new SinglyLinkedList(44));
    const [direction, setDirection] = useState(DIRECTION.RIGHT);//initially snake starts moving right

    useEffect(()=>{
        setInterval(()=>{
            
        },1000);
        window.addEventListener('keydown',e=>{
            const newDirection=getDirectionFromKey(e.key);
            const isValidDirection = newDirection!=='';
            if(isValidDirection) setDirection(newDirection);
        })
    },[]);

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
    function moveSnake(){
        const currentHeadCoordinates={
            row:snake.head.value.row,
            col:snake.head.value.col,
        };
        const getNextHeadCoordinates=getNextHeadCoordinates(currentHeadCoordinates,direction);

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