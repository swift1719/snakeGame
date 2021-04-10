export const createBoard = BOARD_SIZE => {
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

export const isOutOfBounds=(coordinates,board)=>{
    const {row,col}=coordinates;
    if(row<0 || col<0)return true;
    if(row>=board.length || col>=board[0].length)return true;
    return false;
}
export const getCellClassName=(cellValue,foodCell,foodShouldReverseDirection,snakeCells)=>{
    let className='cell';
    if(cellValue===foodCell){
        if(foodShouldReverseDirection){
            className ='cell cell-purple';
        }else{
            className='cell cell-red';
        }
    }
    if(snakeCells.has(cellValue)){
        className='cell cell-green';
    }
    return className;
}
