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
    <h1 className={`${disp==='none'?'hidden':""} text-center text-4xl font-bold mt-8 text-gray-800`}>Welcome to TicTacToe</h1>
    <div className={`${disp==='none'?'hidden':""} flex flex-col min-h-screen justify-center items-center gap-8 bg-lr from-blue-50 to-purple-50`}>
      <div>
        <input type="text" id="enter" onChange={(e)=>setide(e.target.value)} className="p-4 border-2 border-gray-300 m-5 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64" placeholder="Room No"/>
      </div>
      <div>
        <button id="create" onClick={CreateGame} className="border-2 border-blue-500 bg-blue-500 text-white p-4 rounded-lg font-semibold hover:bg-blue-600 hover:border-blue-600 transition-all shadow-md hover:shadow-lg">Create Room</button>
        
      </div>
      <div>
        <button id="btn" onClick={JoinGame} className="border-2 border-blue-500 bg-blue-500 text-white p-4 rounded-lg font-semibold hover:bg-blue-600 hover:border-blue-600 transition-all shadow-md hover:shadow-lg px-8">Join</button>
      </div>
    </div>
    </>
 )
}
export default Team