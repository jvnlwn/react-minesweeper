import React from "react"
import classnames from "classnames"
import styled from "styled-components"
import sprite from "../assets/sprite.gif"

const StyledCounter = styled.div`
  & > div {
    background-image: url(${sprite});
    height: 23px;
    width: 13px;
    float: left;
    display: inline-block;
  }
  & > div.Count__0 {
    background-position: 0 0;
  }
  & > div.Count__1 {
    background-position: -13px 0;
  }
  & > div.Count__2 {
    background-position: -26px 0;
  }
  & > div.Count__3 {
    background-position: -39px 0;
  }
  & > div.Count__4 {
    background-position: -52px 0;
  }
  & > div.Count__5 {
    background-position: -65px 0;
  }
  & > div.Count__6 {
    background-position: -78px 0;
  }
  & > div.Count__7 {
    background-position: -91px 0;
  }
  & > div.Count__8 {
    background-position: -104px 0;
  }
  & > div.Count__9 {
    background-position: -117px 0;
  }
  & > div.Count__- {
    background-position: -130px 0;
  }
`

const Counter = ({ className, count = 0 }) => {
  // get digits for hundres, tens, ones
  const [hundres, tens, ones] = ("00" + Math.min(count, 999))
    .slice(-3)
    .split("")

  return (
    <StyledCounter className={classnames("Counter", className)}>
      <div className={`Count__${hundres}`}></div>
      <div className={`Count__${tens}`}></div>
      <div className={`Count__${ones}`}></div>
    </StyledCounter>
  )
}

Counter.displayName = "Counter"

export default Counter
