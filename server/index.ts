import dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();

app.use("/node_modules", express.static("node_modules"));
import webSocketServer from "./socket/index";

import http from "http";
const server = http.createServer(app);
server.listen(process.env.PORT || 3000, () => {
  console.log(
    "Server is running on port http://localhost:" + process.env.PORT || 3000
  );
});

// import Sekai from "../utils/index";
// const sekai = new Sekai(); // Sekai 클래스 인스턴스 생성
// sekai.greet(); // Hello, Sekai 출력
webSocketServer(server);

app.use(express.json());

app.get("*", express.static("build")); // 빌드된 파일 제공

app.get("/b/api", (req, res) => {
  res.json({
    c: 501,
    m: "Not implemented",
  });
});

// import { rooms } from "../utils/index";
interface Room {
  id: string;
  name: string;
  users: string[];
  currentSong: string;
  currentAnswers: string[];
}

export const rooms: Room[] = [];
// app.get("/b/api/room", (req, res) => {
//   res.json(rooms);
// });

function checkRoom(name) {
  return rooms.find((room) => room.name === name);
}

export function getRoomIndex(id: string): number {
  id = id.padStart(6, "0");
  const index = rooms.findIndex((room) => room.id === id);
  if (index === -1) {
    // console.log(rooms);
    throw new Error(id + "Room not found");
  }
  return index;
}

app.post("/b/api/room/create", (req, res) => {
  const name = req.body.name;
  // 6자리 랜덤 숫자 생성
  let random = Math.floor(Math.random() * 1000000);
  // 유무 확인
  let result = checkRoom(random);
  while (result) {
    random = Math.floor(Math.random() * 1000000);
    result = checkRoom(random);
  }
  // 6자리 문자열로 변환
  const randomStr = random.toString().padStart(6, "0");
  const room = {
    id: randomStr,
    name: name,
    users: [],
    currentSong: "",
    currentAnswers: [],
  };
  rooms.push(room);
  res.json(room);
});

app.get("/b/api/room/:id", (req, res) => {
  const id = req.params.id;
  const room = rooms.find((room) => room.id === id);
  if (!room) {
    res.status(404).json({
      c: 404,
      m: "Room not found",
    });
    return;
  }
  res.json(room);
});

app.post("/b/api/room/:id", (req, res) => {
  const id = req.params.id;
  const user = req.body.name;
  const room = rooms.find((room) => room.id === id);
  if (!room) {
    res.status(404).json({
      c: 404,
      m: "Room not found",
    });
    return;
  }
  // 중복 닉네임 확인
  const duplicate = room.users.find((u) => u === user);
  if (duplicate) {
    res.status(409).json({
      c: 409,
      m: "Duplicate nickname",
    });
    return;
  }
  room.users.push(user);
  res.json(room);
});

app.use("/b/audio", express.static("audio"));

//
app.use(express.static("build")); // 빌드된 파일 제공
