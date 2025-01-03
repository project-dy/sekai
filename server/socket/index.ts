// import { fileURLToPath } from "url";
// const __dirname = fileURLToPath(new URL(".", import.meta.url));
//const __filename = fileURLToPath(import.meta.url);

//const WebSocket = require("ws"); // 웹소켓 모듈 불러오기
import WebSocket, { WebSocketServer } from "ws";
//const fs = require("fs"); // fs 모듈 불러오기: file system 파일 관리를 위한 모듈
//import fs from "fs";
//const path = require("path"); // path 모듈 불러오기 경로
//import path from "path";
//const rootPath = path.resolve(__dirname, "../../"); // public 폴더의 절대경로를 publicPath에 저장
//const dataPath = path.resolve(rootPath, "data"); // data 폴더의 절대경로를 dataPath에 저장

//const Sekai = require("../../../utils/index"); // utils 모듈 로드
// import Sekai from "../../utils/index";
// const sekai = new Sekai(); // Sekai 클래스 인스턴스 생성
//sekai.greet(); // Hello, Sekai 출력
//const admin = new sekai.Admin();
// const admin = sekai.getAdmin();

// import { rooms } from "../../utils/index";
import { rooms } from "..";

import { Server } from "http";

import fs from "fs";

export interface CommandParams {
  rn: string;
  name: string;
  isAdmin: boolean;
  params: string[];
  ws: WebSocket;
}

const _commands = {};

if (fs.existsSync("./server/socket/commands"))
  fs.readdirSync("./server/socket/commands").forEach(async (file: string) => {
    if (!["mjs", "js", "ts"].includes(file.split(".").at(-1) || ""))
      return console.warn(
        "./server/socket/commands/" + file,
        "의 확장자가 잘못되었습니다. 확장자는 mjs, js, ts만 가능합니다."
      );
    try {
      const command: { default: () => ["string1", "string2"] } = await import(
        "./commands/" + file
      );
      const commandName = file.substring(0, file.lastIndexOf("."));
      // _commands[commandName] = command[commandName];
      _commands[commandName] = command.default;
      console.log(
        `./server/socket/commands/${file} > ${commandName} 을(를) 로드했습니다.`
      );
    } catch (error) {
      console.error(file, "로드 실패:", error);
    }
  });

const MITM_lol = async (
  param: CommandParams,
  originalFunc: (params: CommandParams) => Promise<[string, string]>
) => {
  if (!param) {
    console.warn(
      "params가 없습니다. params를 확인해주세요. params는 CommandParams 타입이어야 합니다."
    );
    return;
  }
  const result = originalFunc(param);
  if (!(result instanceof Promise)) {
    console.warn("Not a promise.");
    return;
  }
  return await result;
};
const commands = new Proxy(_commands, {
  get(target, prop) {
    const originalFunc = target[prop];
    if (typeof originalFunc === "function")
      return (param: CommandParams) => MITM_lol(param, originalFunc);
    return originalFunc;
  },
});

// // Import commands from commands folder
// fs.existsSync("./server/socket/commands") && fs.readdirSync("./server/socket/commands").forEach((file) => {
//   if (!["mjs", "js", "ts"].includes(file.split(".").at(-1) || ""))
//     return console.warn(
//   "./server/socket/commands"+file, "의 확장자가 잘못되었습니다. js, mjs, ts 중 하나여야 합니다.");
//   try {
//     const command = import(`./commands/${file}`);
//     const commandName = file.split(".")[0];
//     _commands[commandName] = command;
//     console.log(file, "로드성공");
//   } catch (error) {
//     console.error(file, "로드실패\n", error);
//   }
// });

// Store connected clients
interface ClientsByRn {
  [key: string]: { ws: WebSocket; name: string; connected: boolean }[];
}
export const clients: ClientsByRn = {};

function webSocketServer(server: Server) {
  // Create a WebSocket server
  const wss = new WebSocketServer({ server });

  //const clientsByRn = {};
  // Handle incoming connections
  wss.on("connection", (ws, req) => {
    // Get the "rn" parameter from the request URL
    // const urlParams = new URLSearchParams(req.url);
    // const rn = urlParams.get('rn');
    //const rn = req.url.split('?rn=')[1];
    // console.log(rn);

    // Log the connection
    // console.log(req.url);
    //const rn: string = req.url.split("?rn=")[1];
    if (!req.url?.includes("?rn=")) return;
    // const rn: string = req.url.split("?rn=")[1].split("&")[0];

    const urlParameters = new URL(
      ("ws://localhost:3001" + req.url).replace("ws", "http")
    );
    const rn: string | null = urlParameters.searchParams.get("rn");
    if (rn == null) return;
    const name: string | null = urlParameters.searchParams.get("name");
    if (!name) ws.close();
    if (!name) return;
    console.log(`Client ${rn}:${name} connected`);
    {
      // console.log(params);
      // 중복 이름 체크
      if (clients[rn]) {
        // console.log(clients[params.rn], name);
        if (clients[rn].find((client) => client.name === name)) {
          ws.send("Name already exists");
        }
      }
      // 새로운 클라이언트 등록
      clients[rn] = clients[rn] || []; // 비어있으면 init
      clients[rn].push({ name, ws: ws, connected: true }); // 클라이언트 추가
      const roomName = rooms.find((room) => room.id === rn)?.name;
      ws.send("registered " + roomName);
      if (!rn.includes("admin")) {
        if (!clients[`admin${rn}`]) ws.close();
        if (!clients[`admin${rn}`]) return;
        clients[`admin${rn}`].forEach((c) => {
          if (c.name != "admin") return;
          c.ws.send("register " + name);
        });
        // console.log(clients[`admin${rn}`]);
      }
    }

    // Store the WebSocket connection in the clients object
    if (!clients[rn]) clients[rn] = [];

    // Handle incoming messages
    ws.on("message", (message) => {
      const msg = String(message);
      console.log(rn, msg);
      const rnReal = rn.includes("admin") ? rn.split("admin")[1] : rn;
      const isAdmin = rn.includes("admin");
      const params = msg.split(" ");
      const command = params.shift();
      const commandParams: CommandParams = {
        rn: rnReal,
        isAdmin,
        name,
        params,
        ws,
      };
      if (command && commands[command]) {
        // console.log(commands);
        // console.log(commands[command]);
        const isAdminOnly = command.startsWith("admin");
        if (!isAdminOnly || (isAdminOnly && isAdmin))
          // 관리자 전용이 아니거나 관리자 전용 명령을 관리자가 실행하는 경우
          commands[command](commandParams).then(([admin, client]) => {
            console.log(`admin: ${admin}, client: ${client}`);
            if (admin) {
              // console.log(
              //   `admin${rnReal} ${clients[`admin${rnReal}`]} ${admin}`
              // );
              clients[`admin${rnReal}`].forEach((c) => {
                if (c.name == "admin") c.ws.send(admin);
              });
            }
            if (client && clients[rnReal])
              clients[rnReal].forEach((c) => {
                console.log(c);
                if (c.name != "admin") c.ws.send(client);
              });
          });
      } else {
        ws.send("Command not found");
      }
    });

    // Handle connection close
    ws.on("close", () => {
      // Remove the WebSocket connection from the stored clients
      // delete clients[rn];
      const temp = clients[rn].findIndex((e) => e.ws === ws);
      // console.log(ws);
      if (clients[rn] && clients[rn][temp]) clients[rn][temp].connected = false;
      console.log(`Client ${rn} disconnected`);
    });

    // Send a welcome message to the client
    //ws.send(`Welcome, client ${rn}!`);
    // console.log(rooms);
    function getRoomName(id: string) {
      const room = rooms.find((room) => room.id === id);
      return room?.name;
    }
    const roomName = getRoomName(rn);
    ws.send(JSON.stringify({ m: `Welcome, client ${rn}! on ${roomName}` }));
  });
}

//module.exports = webSocketServer;
export default webSocketServer;
