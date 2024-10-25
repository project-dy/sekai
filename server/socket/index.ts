/*


Websocket: 실시간 통신 규격
웹 소켓
웹을 통한 소켓(해석기를 통한) (실시간) 통신
http 하이퍼       텍스트 트랜스퍼    프로토콜
     겁나 대단한  문자   교환(통신)  규약(방식)


     선언 상수 변수 함수 객체 리스트 튜플
     사용
     조건문
     반복문
     함수

const list = [
     [
        [0.1,0.2,0.3]
      ],2,3],
     [4,5,6],
     [7,8,9]
]

const 상수 = 3.14;
상수 = 123; // ㅂㄱㄴ

let 변수 = 3.14;
변수 = 123; // ㅆㄱㄴ

list[0]; // = [1,2,3]
list[0][0]; // = 1

function f(x) {
     return x * x;
}

f(3); // = 9

const 결과 = f(3);
console.log(결과); // = 9

*/

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
        "의 확장자가 잘못되었습니다. 확장자는 mjs, js, ts만 가능합니다.",
      );
    try {
      const command: { default: () => ["string1", "string2"] } = await import(
        "./commands/" + file
      );
      const commandName = file.substring(0, file.lastIndexOf("."));
      // _commands[commandName] = command[commandName];
      _commands[commandName] = command.default;
      console.log(
        `./server/socket/commands/${file} > ${commandName} 을(를) 로드했습니다.`,
      );
    } catch (error) {
      console.error(file, "로드 실패:", error);
    }
  });

const MITM_lol = async (
  param: CommandParams,
  originalFunc: (params: CommandParams) => Promise<[string, string]>,
) => {
  if (!param) {
    console.warn(
      "params가 없습니다. params를 확인해주세요. params는 CommandParams 타입이어야 합니다.",
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
  [key: string]: { ws: WebSocket; name: string }[];
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
    console.log(req.url);
    //const rn: string = req.url.split("?rn=")[1];
    if (!req.url?.includes("?rn=")) return;
    const rn: string = req.url.split("?rn=")[1].split("&")[0];
    console.log(`Client ${rn} connected`);

    // Store the WebSocket connection in the clients object
    if (!clients[rn]) clients[rn] = [];
    // const name = req.url.split("name=")[1];
    // const name = decodeURI(req.url.split("name=")[1]);
    // clients[rn].push({ ws, name: name }); // 옛날거
    // console.log(`$name: ${name}, ${rn.includes('admin')}`);
    // if (!rn.includes("admin")) {
    //   // Send a message to admin
    //   const adminWs = clients[`admin${rn}`];
    //   // console.log(`adminWs: ${adminWs}, ${JSON.stringify(clients)}`);
    //   if (adminWs) {
    //     adminWs.forEach((admin) => {
    //       // admin.ws.send(JSON.stringify({ c: `connected`, m: name }));
    //       admin.ws.send("connected");
    //       console.log(
    //         `Send a message to admin ${admin.name} from ${rn}:${name}`,
    //       );
    //     });
    //   }
    // }

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
              console.log(
                `admin${rnReal} ${clients[`admin${rnReal}`]} ${admin}`,
              );
              clients[`admin${rnReal}`].forEach((c) => c.ws.send(admin));
            }
            if (client && clients[rnReal])
              clients[rnReal].forEach((c) => {
                c.ws.send(client);
              });
          });
      } else {
        ws.send("Command not found");
      }
    });

    // Handle connection close
    ws.on("close", () => {
      // Remove the WebSocket connection from the stored clients
      delete clients[rn];
      console.log(`Client ${rn} disconnected`);
    });

    // Send a welcome message to the client
    //ws.send(`Welcome, client ${rn}!`);
    console.log(rooms);
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
