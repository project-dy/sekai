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
import Sekai from "../../utils/index";
const sekai = new Sekai(); // Sekai 클래스 인스턴스 생성
//sekai.greet(); // Hello, Sekai 출력
//const admin = new sekai.Admin();
const admin = sekai.getAdmin();

import { Server } from "http";

function webSocketServer(server: Server) {
  // Create a WebSocket server
  const wss = new WebSocketServer({ server });

  // Store connected clients
  interface ClientsByRn {
    [key: string]: { ws: WebSocket; name: string }[];
  }
  const clients: ClientsByRn = {};
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
    const name = decodeURI(req.url.split("name=")[1]);
    clients[rn].push({ ws, name: name });
    // console.log(`$name: ${name}, ${rn.includes('admin')}`);
    if (!rn.includes("admin")) {
      // Send a message to admin
      const adminWs = clients[`admin${rn}`];
      // console.log(`adminWs: ${adminWs}, ${JSON.stringify(clients)}`);
      if (adminWs) {
        adminWs.forEach((admin) => {
          admin.ws.send(JSON.stringify({ c: `connected`, m: name }));
          console.log(
            `Send a message to admin ${admin.name} from ${rn}:${name}`,
          );
        });
      }
    }

    // Handle incoming messages
    ws.on("message", (message) => {
      const parsed = JSON.parse(String(message));
      console.log(rn, parsed);
      if (rn.includes("admin")) {
        // console.log("admin!");
        admin.doIt(parsed).then((result) => {
          // const parsed = JSON.parse(String(message));
          // const json = JSON.parse(result);
          // console.log(json);
          const parsed = JSON.parse(result);
          const c = parsed.c;
          if (c === 200)
            {ws.send(result);}
          if (c === 100) {
            // Send a message to the client not admin
            // TODO: rn으로 찾아서 보내기
            const rnReal = rn.split("admin")[1];
            // console.log(clients, rnReal);
            const clientWs = clients[rnReal];
            if (clientWs) {
              clientWs.forEach((client) => {
                client.ws.send(result);
                console.log(
                  `Send a message to client ${client.name} from admin ${rnReal}`,
                );
              });
            }

          }
        });
      } else if (rn.includes("rn")) {
        const rnReal = rn.split("admin")[1];
        console.log(rnReal);
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
    ws.send(JSON.stringify({ m: `Welcome, client ${rn}!` }));
  });
}

//module.exports = webSocketServer;
export default webSocketServer;
