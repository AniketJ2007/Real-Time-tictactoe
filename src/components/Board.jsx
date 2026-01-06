import React, { useEffect, useState } from 'react';
import socket from '../socket';

const Board = () => {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [Winner,setWinner]=useState('')
  function click(i) {
    socket.emit('Clik',i);
    socket.on('GameOver',(winner)=>{
      setWinner(winner)
      setTimeout(()=>{
        setWinner('')
        setSquares(Array(9).fill(null))
      },5000)
    })
  }
  useEffect(()=>{
    socket.on('Board', (j) => {
      setSquares(j)
    });

    return () => {
      socket.off('Board'); 
    };
  },[])
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100 gap-15">
      <div className="grid grid-cols-3 gap-2 w-48">
        {squares.map((square, i) => (
          <button
            key={i}
            className="w-16 h-16 border border-gray-400 flex items-center justify-center text-2xl font-bold bg-white hover:bg-gray-200 transition-colors duration-200 shadow-md rounded-md"
            onClick={() => click(i)}
          >
            {square}
          </button>
        ))}
      </div>
      <div>
        <input type="text" id='display' value={Winner==='' ?"" : Winner==='none' ?'Match is Tied':`Winner is ${Winner}`} 
        className='w-100 h-10 text-3xl text-center'/>
      </div>
    </div>
  );
};

export default Board;