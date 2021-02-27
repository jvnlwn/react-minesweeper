import React from "react"
import styled from "styled-components"
import Face from "./Face"
import Counter from "./Counter"
import { block } from "./styles"

const StyledDash = styled.div`
  ${block}
  height: 36px;
  position: relative;
  margin-bottom: 6px;

  .Counter {
    position: absolute;
    top: 4px;
  }

  .Counter.Mines {
    left: 6px;
  }
  .Counter.Time {
    right: 6px;
  }
`

const Dash = ({ mines, flaggedCount, hasStarted, hasEnded, onRestart }) => {
  const timerIntervalRef = React.useRef(null)
  const [timeCounter, setTimeCounter] = React.useState(0)

  const handleTime = () => {
    const time = new Date().getTime()
    const interval = setInterval(() => {
      const count = Math.round((new Date().getTime() - time) / 1000)
      // increment at count + 1 to account for first second ellapsing
      setTimeCounter(count + 1)
    }, 1000)

    // start counter immediately at 1
    setTimeCounter(1)
    return interval
  }

  React.useEffect(() => {
    if (hasStarted) {
      timerIntervalRef.current = handleTime()
    } else {
      // game has possibly restarted
      setTimeCounter(0)
      clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
    }
  }, [hasStarted])

  React.useEffect(() => {
    if (hasEnded) {
      // game has terminated due to win or loss
      clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
    }
  }, [hasEnded])

  return (
    <StyledDash>
      <Counter className="Mines" count={mines - flaggedCount} />
      <Face onRestart={onRestart} />
      <Counter className="Time" count={timeCounter} />
    </StyledDash>
  )
}

Dash.displayName = "Dash"

export default Dash
