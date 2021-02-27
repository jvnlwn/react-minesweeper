import React from "react"
import styled from "styled-components"
import classnames from "classnames"
import sprite from "../assets/sprite.gif"

const StyledFace = styled.div`
  background-image: url(${sprite});
  width: 26px;
  height: 26px;
  position: absolute;
  top: 3px;
  left: calc(50% - 13px);

  /* smile */
  background-position: 0 -55px;

  &.Face__mouse-is-down:hover {
    /* pressed */
    background-position: -26px -55px;
  }
  .Minesweeper__mouse-is-down-on-board & {
    /* ooh */
    background-position: -52px -55px;
  }
  .Minesweeper__lost & {
    /* dead */
    background-position: -78px -55px;
  }
  .Minesweeper__won & {
    /* sunglasses */
    background-position: -104px -55px;
  }
`

const Face = ({ onRestart }) => {
  const [mouse, setMouse] = React.useState("up")
  const faceRef = React.useRef(null)

  React.useEffect(() => {
    const onMouseUp = (e) => {
      // cliked down then up on face
      if (e.target === faceRef.current) {
        // newGame
        onRestart()
      }
      // order matters, setting "up" after starting new game
      setMouse("up")
    }

    document.addEventListener("mouseup", onMouseUp)

    return () => document.removeEventListener("mouseup", onMouseUp)
  }, [onRestart])

  const className = classnames("Face", {
    ["Face__mouse-is-down"]: mouse === "down",
  })

  return (
    <StyledFace
      ref={faceRef}
      className={className}
      onMouseDown={(e) => setMouse("down")}
    />
  )
}

Face.displayName = "Face"

export default Face
