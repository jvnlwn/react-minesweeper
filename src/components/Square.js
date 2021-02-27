import React from "react"
import classnames from "classnames"
import styled from "styled-components"
import sprite from "../assets/sprite.gif"

const StyledSquares = styled.td`
  background-image: url(${sprite});
  background-position: 0px -39px;
  width: 16px;
  height: 16px;
  text-align: center;
  cursor: default;

  .Minesweeper__mouse-is-down-on-board
    &:not(.Square__isRevealed):not(.Square__isFlagged):hover,
  &.Square__isClicked {
    /* TODO: fix me... flash of clicked style when starting new game */
    background-position: 0 -23px;
  }
  &.Square__adjacentMines__0 {
    background-position: 0 -23px;
  }
  &.Square__adjacentMines__1 {
    background-position: -16px -23px;
  }
  &.Square__adjacentMines__2 {
    background-position: -32px -23px;
  }
  &.Square__adjacentMines__3 {
    background-position: -48px -23px;
  }
  &.Square__adjacentMines__4 {
    background-position: -64px -23px;
  }
  &.Square__adjacentMines__5 {
    background-position: -80px -23px;
  }
  &.Square__adjacentMines__6 {
    background-position: -96px -23px;
  }
  &.Square__adjacentMines__7 {
    background-position: -112px -23px;
  }
  &.Square__adjacentMines__8 {
    background-position: -128px -23px;
  }
  &.Square__isMine {
    background-position: -64px -39px;
  }
  &.Square__isFlagged {
    background-position: -16px -39px;
  }
  &.Square__mineDeath {
    background-position: -32px -39px;
  }
  &.Square__mineMisFlag {
    background-position: -48px -39px;
  }
  &.Question {
    background-position: -80px -39px;
  }
  &.QuestionPressed {
    background-position: -96px -39px;
  }
`

const Square = React.memo(function Square({
  numAdjacentMines,
  isMine,
  isRevealed,
  isFlagged,
  position,
  onReveal,
  onToggleFlag,
}) {
  const [isClicked, setIsClicked] = React.useState(false)

  React.useEffect(() => {
    if (!isRevealed && isClicked) setIsClicked(false)
  }, [isRevealed, isClicked])

  // preventing any upstream handlers
  const handleMouseDown = (e) => {
    if (isRevealed || isFlagged) {
      e.stopPropagation()
    }
  }

  // alternatively could handle right-click with "contextmenu" event
  const handleMouseUp = (e) => {
    e.preventDefault()
    // ensure mouse up on square comes after a mousedown on the Board
    if (
      e.target.closest(".Minesweeper__mouse-is-down-on-board") &&
      e.button === 0
    ) {
      if (!isRevealed && !isFlagged) {
        if (!isClicked) setIsClicked(true)
        if (!isFlagged) onReveal(position)
      }
    }

    return false
  }

  // handling right-click with "contextmenu" event
  const handleContextMenu = (e) => {
    e.preventDefault()

    if (!isRevealed) {
      if (!isClicked) setIsClicked(true)
      onToggleFlag(position)
    }

    return false
  }

  const className = classnames("Square", {
    [`Square__adjacentMines__${numAdjacentMines}`]: isRevealed,
    Square__isRevealed: isRevealed,
    Square__isFlagged: isFlagged,
    Square__isClicked: isClicked,
    Square__isMine: isMine && isRevealed,
    Square__mineDeath: isMine && isRevealed && isClicked,
    Square__mineMisFlag: isMine && isRevealed && isFlagged,
  })

  return (
    <StyledSquares
      onMouseUp={handleMouseUp}
      onMouseDown={handleMouseDown}
      onContextMenu={handleContextMenu}
      className={className}
    />
  )
})

Square.defaultProps = {
  numAdjacentMines: null, // if numAdjacentMines is null then square is a mine
  isMine: null,
  isRevealed: false,
  isClicked: false,
  isFlagged: false,
}

export default Square
