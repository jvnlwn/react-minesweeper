import flatten from "lodash/flatten"
import random from "lodash/random"
import _hidden from "./_hidden"

export const createMatrix = (options) =>
  Array.from({ length: options.rows }, () =>
    Array.from({ length: options.columns }, () => null)
  )

// creates surrounding grid of given position, excluding given position
export const createGrid = (position, options) => {
  const [x, y] = position
  const { rows, columns } = options

  const grid = [
    [x - 1, y - 1],
    [x - 1, y],
    [x - 1, y + 1],
    [x, y - 1],
    [x, y + 1],
    [x + 1, y - 1],
    [x + 1, y],
    [x + 1, y + 1],
  ]

  // filter out any position that is not contained insided the board
  return grid.filter(
    ([_x, _y]) => _x >= 0 && _x < rows && _y >= 0 && _y < columns
  )
}

export const createBoard = (options) =>
  createMatrix(options).map((row, ri) =>
    row.map((cell, ci) => ({ position: [ri, ci] }))
  )

export const activateBoard = (position, options) => {
  let board = createBoard(options)
  // List of positions that can be mines
  const { mines } = options

  const grid = createGrid(position, options).concat([position])

  // of the squares on the board, only those not in the initial grid can be mined
  const mineable = flatten(board).filter(
    ({ position }) =>
      !grid.find(([x, y]) => x === position[0] && y === position[1])
  )

  // disperse the mines
  const l = mineable.length
  while (mineable.length > l - mines) {
    const i = random(mineable.length - 1)
    const [x, y] = mineable[i].position
    board[x][y].isMine = true
    mineable.splice(i, 1)
  }
  // positions that are not mined
  const unmined = flatten(board).filter((square) => !square.isMine)

  // set the numbers
  unmined.forEach(({ position }) => {
    const [x, y] = position
    // grid of the 8 surrounding positions
    var grid = createGrid(position, options)
    // calculate the number of adjacent mines
    board[x][y].numAdjacentMines = grid.reduce(
      (mines, [x, y]) => (board[x][y].isMine ? mines + 1 : mines),
      0
    )
  })

  return board
}

export const revealBoard = (position, options, board) => {
  const [x, y] = position
  const revealedMine = _hidden.board[x][y].isMine

  const reveal = (grid, options, matrix) => {
    // if square is an actual square and has not been added to matrix of squares to be revealed...
    grid.forEach(([x, y]) => {
      if (!matrix[x][y]) {
        const square = _hidden.board[x][y]

        if (!square.isMine || revealedMine) {
          // add position to the matrix
          matrix[x][y] = square.position.slice()
        }
        if (!square.numAdjacentMines || revealedMine) {
          const grid = createGrid([x, y], options)
          // this is an empty square so check its neighboring squares
          reveal(grid, options, matrix)
        }
      }
    })

    return matrix
  }

  const revealedPositionsMatrix = reveal(
    [position],
    options,
    createMatrix(options)
  )

  // return next board with revealed squares
  return tweakBoard(board, (square) => {
    // reveal the squre if it is
    const [x, y] = square.position
    if (revealedPositionsMatrix[x][y]) {
      return {
        ...square,
        isRevealed: true, // the end goal of revealBoard is to flag squares that have become revealed
      }
    }
  })
}

// flag all remaining mines
export const flagBoard = (board) =>
  tweakBoard(board, (square) => {
    const mergedSquare = getMergedSquare(square)
    if (mergedSquare.isMine && !square.isFlagged) {
      return {
        ...square,
        isFlagged: true,
      }
    }
  })

export const flagSquare = (position, board) =>
  tweakBoard(board, (square) => {
    if (
      position[0] === square.position[0] &&
      position[1] === square.position[1]
    ) {
      return {
        ...square,
        isFlagged: !square.isFlagged,
      }
    }
  })

// helper for altering the board
export const tweakBoard = (board, tweaker) =>
  board.reduce(
    (board, row) => [...board, row.map((square) => tweaker(square) || square)],
    []
  )

// helper for merging the hidden square and the revealed square
export const getMergedSquare = (square) => {
  if (!_hidden.board) return square

  const [x, y] = square.position
  const _hiddenSquare = _hidden.board[x][y]

  return {
    ...square,
    ..._hiddenSquare,
  }
}
