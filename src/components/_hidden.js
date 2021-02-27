/**
 * board hiding square data from inspection
 *
 * contains data on each square:
 *  - position Array [x, y], the x,y coordinates of this square on the board
 *  - isMine Boolean, whether this square is a mine
 *  - numAdjacentMines Number, the number of mines in this sqaure's grid where this square is at the grid's center
 */

const _hidden = {
  board: null,
}

export default _hidden
