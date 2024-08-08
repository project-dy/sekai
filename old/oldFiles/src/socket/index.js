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

const WebSocket = require("ws"); // 웹소켓 모듈 불러오기
const fs = require("fs"); // fs 모듈 불러오기: file system 파일 관리를 위한 모듈
const path = require("path"); // path 모듈 불러오기 경로
const rootPath = path.resolve(__dirname, "../../"); // public 폴더의 절대경로를 publicPath에 저장
const dataPath = path.resolve(rootPath, "data"); // data 폴더의 절대경로를 dataPath에 저장

const Sekai = require("../../utils/index"); // utils 모듈 로드
const sekai = new Sekai(); // Sekai 클래스 인스턴스 생성
//sekai.greet(); // Hello, Sekai 출력
const admin = new sekai.Admin();

function webSocketServer(server) {
  // Create a WebSocket server
  const wss = new WebSocket.Server({ server });

  // Store connected clients
  const clients = [];
  const clientsByRn = {};
  // Handle incoming connections
  wss.on("connection", (ws, req) => {
    // Get the "rn" parameter from the request URL
    // const urlParams = new URLSearchParams(req.url);
    // const rn = urlParams.get('rn');
    //const rn = req.url.split('?rn=')[1];
    // console.log(rn);

    // Log the connection
    console.log(req.url);
    const rn = req.url.split("?rn=")[1];
    console.log(`Client ${rn} connected`);

    // Store the WebSocket connection in the clients object
    if (!clients[rn]) clients[rn] = [];
    clients[rn].push(ws);

    // Handle incoming messages
    ws.on("message", (message) => {
      const parsed = JSON.parse(message);
      console.log(parsed);
      if (rn == "admin") {
        //console.log("admin!");
        admin.doIt(parsed).then((result) => {
          ws.send(result);
        });
      }
    });

    // Handle connection close
    ws.on("close", () => {
      // Remove the WebSocket connection from the stored clients
      delete clients[rn];
      console.log(`Client ${rn} disconnected`);
    });

    // Send a welcome message to the client
    ws.send(`Welcome, client ${rn}!`);
  });
}

module.exports = webSocketServer;
