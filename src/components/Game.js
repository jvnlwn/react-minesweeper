import React from "react"
import classnames from "classnames"
import styled from "styled-components"
import Square from "./Square"
import {
  createBoard,
  activateBoard,
  revealBoard,
  flagBoard,
  flagSquare,
  getMergedSquare,
} from "./utils"
import { block } from "./styles"
import Dash from "./Dash"
import _hidden from "./_hidden"

const StyledContainer = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`

const StyledBoard = styled.div`
  padding: 6px;
  display: inline-block;
  background-color: #bdbdbd;
  border-top: 2px solid #fff;
  border-left: 2px solid #fff;
  border-right: 2px solid #7b7b7b;
  border-bottom: 2px solid #7b7b7b;
`

const StyledSquares = styled.table`
  margin: 0 auto;
  border-spacing: 0;
  display: inline-block;
  ${block}
`

const Game = (props) => {
  const { rows, columns, mines } = props

  const [isMouseDown, setIsMouseDown] = React.useState(false)

  const handleMouseDown = (e) => {
    if (!e.ctrlKey && e.button === 0) setIsMouseDown(true)
  }
  const handleMouseUp = (e) => setIsMouseDown(false)

  const [state, handlePosition] = React.useReducer(
    (state, { action, position }) => {
      let revealedBoard = null

      switch (action) {
        case "reveal":
          revealedBoard = revealBoard(position, props, state.revealedBoard)
          break
        case "flag":
          revealedBoard = flagSquare(position, state.revealedBoard)
          break
        case "restart":
          revealedBoard = createBoard(props)
          break
      }

      const counter = (...keys) =>
        revealedBoard.reduce(
          (count, row) =>
            count +
            row.filter((square) =>
              keys.every((key) => getMergedSquare(square)[key])
            ).length,
          0
        )

      const revealedCount = counter("isRevealed")
      const revealedMineCount = counter("isRevealed", "isMine")
      const flaggedCount = counter("isFlagged")
      const correctlyFlaggedCount = counter("isFlagged", "isMine")

      const hasWon =
        revealedCount + revealedMineCount + mines === rows * columns
      const hasLost = revealedMineCount > 0

      if (hasWon && correctlyFlaggedCount < mines) {
        // auto-flag all remaining mines
        revealedBoard = flagBoard(revealedBoard)
      }

      const hasStarted = !!position
      const hasEnded = hasWon || hasLost

      return {
        revealedBoard,
        flaggedCount,
        hasWon,
        hasLost,
        hasStarted,
        hasEnded,
      }
    },
    {
      revealedBoard: null,
      flaggedCount: 0,
      hasWon: false,
      hasLost: false,
      hasStarted: false,
      hasEnded: false,
    }
  )

  const {
    revealedBoard,
    flaggedCount,
    hasWon,
    hasLost,
    hasStarted,
    hasEnded,
  } = state

  const handleReveal = (position) => {
    if (!_hidden.board) {
      // game has begun
      _hidden.board = activateBoard(position, props)
    }

    handlePosition({ action: "reveal", position })
  }

  const handleFlag = (position) => {
    if (hasStarted) handlePosition({ action: "flag", position })
  }

  const handleRestart = () => {
    // game has been initialized/reset
    _hidden.board = null
    handlePosition({ action: "restart" })
  }

  // initialize first game
  React.useEffect(() => {
    handleRestart()
  }, [])

  return (
    !!revealedBoard && (
      <StyledContainer
        className={classnames("Minesweeper", {
          Minesweeper__won: hasWon,
          Minesweeper__lost: hasLost,
          ["Minesweeper__mouse-is-down-on-board"]: isMouseDown,
        })}
        onMouseUp={handleMouseUp}>
        <StyledBoard>
          <Dash
            mines={mines}
            flaggedCount={flaggedCount}
            hasStarted={hasStarted}
            hasEnded={hasEnded}
            onRestart={handleRestart}
          />
          <StyledSquares className={classnames("Board")}>
            <tbody onMouseDown={handleMouseDown}>
              {revealedBoard.map((row, ri) => (
                <tr key={ri}>
                  {row.map((square, si) => (
                    <Square
                      key={si}
                      {...(square.isRevealed
                        ? getMergedSquare(square)
                        : square)}
                      onToggleFlag={handleFlag}
                      onReveal={handleReveal}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </StyledSquares>
        </StyledBoard>
      </StyledContainer>
    )
  )
}

Game.displayName = "Game"

export default Game
