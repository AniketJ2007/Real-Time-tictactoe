import React, { useState } from "react";
import socket  from "../socket";
function Team({disp,setDisp}){
    const [ide,setide]=useState('')
    
    const JoinGame=()=>{
      console.log('Inside Join Game')
      if(ide===''){
        throw new Error('Invalid Id')
      }
      socket.emit('SearchRoom',ide)
      socket.on('FoundRoom',(k)=>{
        console.log('Entering Game')
        setDisp('none')
      })
      
    }
    const CreateGame=()=>{

     let st=""
     while (st.length<10){
      const f= Math.floor(33 + 94*Math.random())
      st+=String.fromCharCode(f)
     }
     setide(st)
     //automatically copy id to clipboard
     navigator.clipboard
       .writeText(st)
       .then(() => {
         alert("Room Number copied to clipboard!");
       })
       .catch((err) => {
         console.error("Could not copy text: ", err);
       });

    socket.emit('CreatedRoom',st)
       
     setTimeout(() => {
      setDisp('none')
     }, 2000);
    }
 return(
    <>
    <h1 className={`${disp==='none'?'hidden':""} text-center text-2xl mt-5`}>Welcome to TicTacToe </h1>
    <div className={`${disp==='none'?'hidden':""} flex flex-col min-h-screen justify-center items-center gap-5 `}>
      <div>
        <input type="text" id="enter" onChange={(e)=>setide(e.target.value)} className="p-3 border-2 m-5" placeholder="Room No"/>
      </div>
      <div>
        <button id="create" onClick={CreateGame} className="border-2 p-3">Create Room</button>
        <input type="text" id="enter"  className="p-3 border-2 m-5" placeholder="RoomNo"/>
      </div>
      <div>
        <button id="btn" onClick={JoinGame} className="border-2 p-3">Join</button>
      </div>
    </div>
    </>
 )
}
export default Team