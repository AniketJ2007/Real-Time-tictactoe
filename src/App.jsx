import { useState, useEffect } from "react";
import Team from "./components/Team";
import Board from "./components/Board";
import "../src/style.css";
import socket from "./socket";

function App() {
  const [disp, setDisp] = useState("flex"); 
  return (
    <>
      <Team disp={disp} setDisp={setDisp} />
      {disp === "none" && <Board/>} 
    </>
  );
}

export default App;