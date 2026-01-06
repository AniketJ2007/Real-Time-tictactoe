import e from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = e();
const serv = createServer(app);
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const io = new Server(serv, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
const availableGames = [];
let board = Array(9).fill(null);
const players = {};
let ROOM = "";
io.on("connection", (socket) => {
  console.log("New user connected");

  socket.on("CreatedRoom", (room) => {
    console.log("Room Created", room);
    availableGames.push(room);
    players[room] = { X: socket.id, O: null };
    socket.join(room);
    ROOM = room;
  });

  socket.on("SearchRoom", (room) => {
    let foundroom = false;
    availableGames.forEach((rom) => {
      if (rom === room) {
        foundroom = true;
      }
    });
    console.log(availableGames, foundroom);
    if (foundroom) {
      socket.emit("FoundRoom", room);
      if (players[room] && !players[room].O) {
        players[room].O = socket.id;
      }
      socket.join(room);
      ROOM = room;
    } else {
      console.log("Room not found");
    }
  });

  socket.on("Clik", (x) => {
    const currentPlayer =
      board.filter((square) => square !== null).length % 2 === 0 ? "X" : "O";

    if (
      ROOM &&
      players[ROOM][currentPlayer] === socket.id &&
      board[x] === null
    ) {
      board[x] = currentPlayer;
      io.to(ROOM).emit("Board", board);
    }
    let winner = "none";
    function handleGame(str) {
      winner = str;
      io.to(ROOM).emit("GameOver", winner);
      availableGames.splice(
        availableGames.findIndex((game) => game == ROOM),
        1
      );
      console.log(availableGames);
      console.log(winner);
      board = Array(9).fill(null);
      const temp = players[ROOM].O;
      players[ROOM].O = players[ROOM].X;
      players[ROOM].X = temp;
    }
    if (
      (board[0] === "X" && board[1] === "X" && board[2] === "X") ||
      (board[3] === "X" && board[4] === "X" && board[5] === "X") ||
      (board[6] === "X" && board[7] === "X" && board[8] === "X") ||
      (board[0] === "X" && board[3] === "X" && board[6] === "X") ||
      (board[1] === "X" && board[4] === "X" && board[7] === "X") ||
      (board[2] === "X" && board[5] === "X" && board[8] === "X") ||
      (board[0] === "X" && board[4] === "X" && board[8] === "X") ||
      (board[2] === "X" && board[4] === "X" && board[6] === "X")
    ) {
      handleGame("X");
    } else if (
      (board[0] === "O" && board[1] === "O" && board[2] === "O") ||
      (board[3] === "O" && board[4] === "O" && board[5] === "O") ||
      (board[6] === "O" && board[7] === "O" && board[8] === "O") ||
      (board[0] === "O" && board[3] === "O" && board[6] === "O") ||
      (board[1] === "O" && board[4] === "O" && board[7] === "O") ||
      (board[2] === "O" && board[5] === "O" && board[8] === "O") ||
      (board[0] === "O" && board[4] === "O" && board[8] === "O") ||
      (board[2] === "O" && board[4] === "O" && board[6] === "O")
    ) {
      handleGame("O");
    }

    if (board.every((square) => square !== null)) {
      handleGame("none");
    }
  });
  socket.emit("Board", board);
});
serv.listen(9000, () => {
  console.log("Listening on port 9000");
});
