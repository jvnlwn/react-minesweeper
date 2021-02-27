import React from "react"
import "./App.css"
import Game from "./components/Game"

function App() {
  return (
    <div className="App">
      {/* <Game rows={16} columns={30} mines={99} /> */}
      <Game rows={16} columns={30} mines={10} />
      {/* <Game rows={16} columns={30} mines={1} /> */}
    </div>
  )
}

export default App
