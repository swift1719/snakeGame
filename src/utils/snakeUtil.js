export const getStartingSnakeCell=board=>{
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
export function randomIntFromInterval(min,max){
    return Math.floor(Math.random()*(max-min+1)+min)
}
