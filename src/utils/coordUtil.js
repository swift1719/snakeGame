//hashtable to return direction
export const Direction={
    UP:'UP',
    RIGHT:'RIGHT',
    DOWN:'DOWN',
    LEFT:'LEFT',
};
export const getDirectionFromKey = key=>{
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
export const getOppostiteDirection= direction=>{
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
export const getNextNodeDirection=(node,currentDirection)=>{
    if(node.next===null)return currentDirection;
    //since node value is an object with 3 values(row,col,cell)
    //thereby destructuring it to obtain row and col
    const {row:currentRow,col:currentCol}=node.value;
    const {row:nextRow,col:nextCol}=node.next.value;
    if(nextRow===currentRow && nextCol===currentCol+1){
        return Direction.RIGHT;
    }
    if(nextRow===currentRow && nextCol===currentCol-1){
        return Direction.LEFT;
    }
    if(nextCol===currentCol && nextRow===currentRow+1){
        return Direction.DOWN;
    }
    if(nextCol===currentCol && nextRow===currentRow-1){
        return Direction.UP;
    }
    return '';
}
export const getNextCoordInDirection=(currentCoord,direction)=>{
    switch (direction) {
        case Direction.UP:
            return{
                row:currentCoord.row-1,
                col:currentCoord.col
            };
            
        case Direction.RIGHT:
            return{
                row:currentCoord.row,
                col:currentCoord.col+1
            };
            
        case Direction.DOWN:
            return{
                row:currentCoord.row+1,
                col:currentCoord.col
            };
            
        case Direction.LEFT:
            return{
                row:currentCoord.row,
                col:currentCoord.col-1
            };
        default:
            break;
    }
}
export const getGrowthNodeCoords=(snakeTail,currentDirection)=>{
    //to obtain the current direction of movement of snake's tail based on it's neighbour node
    //as there might be a case when snake's head is moving towards left and ate food but 
    //snake's tail is moving from right to left
    const tailNextNodeDirection=getNextNodeDirection(snakeTail,currentDirection);
    // console.log(tailNextNodeDirection);
    const growthDirection=getOppostiteDirection(tailNextNodeDirection);
    const currentTailCoords={
        row:snakeTail.value.row,
        col:snakeTail.value.col,
    }
    // console.log(growthDirection);
    const growthNodeCoords=getNextCoordInDirection(currentTailCoords,growthDirection);
    // console.log(growthNodeCoords);
    return growthNodeCoords;
}   
