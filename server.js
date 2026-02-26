const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let players = {};
let timer = 120;

io.on("connection", (socket) => {

  players[socket.id] = {
    x: Math.random() * 200 - 100,
    z: Math.random() * 200 - 100,
    energy: false
  };

  if (Object.keys(players).length === 1) {
    players[socket.id].energy = true;
  }

  socket.on("move", (data) => {
    if (players[socket.id]) {
      players[socket.id].x = data.x;
      players[socket.id].z = data.z;

      for (let id in players) {
        if (id !== socket.id) {
          let dx = players[id].x - players[socket.id].x;
          let dz = players[id].z - players[socket.id].z;
          let distance = Math.sqrt(dx * dx + dz * dz);

          if (distance < 8 && players[socket.id].energy) {
            players[id].energy = true;
          }
        }
      }
    }
  });

  socket.on("disconnect", () => {
    delete players[socket.id];
  });
});

setInterval(() => {
  if (timer > 0) timer--;
  io.emit("state", { players, timer });
}, 1000);

server.listen(process.env.PORT || 3000, () => {
  console.log("Servidor iniciado");
