> # Snake Quest

> ## _It is a snake game made using React and basic linked list functionalities._

The entire game consists of the following three main components: Game Board, Snake, and Food Cells.

The game is created around the following points:
1. Create the Game Board using a Matrix 
1. Each cell in-board is identified using a unique id
1. Snake is handled using a Singly Linked List
1. Food is randomly generated using a utility function.
1. Initializing snake movement and food cell
1. Handling snake movements through arrow keys by attaching an event listener to the board
1. Whenever a snake consumes food, then handling the growth of snake.There are two kinds of food available to a snake, an apple or a frog.
     - In the case of an apple, the snake will consume it and grow in size by one cell. The score will be incremented by one.
     - In the case of a frog, the snake will consume it and grow in size by one cell. And the score will be incremented by two. Also, the snake will reverse its direction.
1. If the snake collides with itself or the boundary of the board then the game is over
1. Displaying score
1. Reset when game is over
