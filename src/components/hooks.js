import React from "react"

export const usePreviousEffect = (fn, inputs = []) => {
  const previousInputsRef = React.useRef([...inputs])

  React.useEffect(() => {
    fn(previousInputsRef.current)
    previousInputsRef.current = [...inputs]
  }, inputs)
}
