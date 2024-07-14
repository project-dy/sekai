const WebSocket = require('ws');
const fs = require('fs'); // fs 모듈 불러오기
const path = require('path'); // path 모듈 불러오기
const rootPath = path.resolve(__dirname, '../../'); // public 폴더의 절대경로를 publicPath에 저장
const dataPath = path.resolve(rootPath, 'data'); // data 폴더의 절대경로를 dataPath에 저장

const Sekai = require('../../utils/index'); // utils 모듈 로드
const sekai = new Sekai(); // Sekai 클래스 인스턴스 생성
sekai.greet(); // Hello, Sekai 출력

function webSocketServer( server ) {
  // Create a WebSocket server
  const wss = new WebSocket.Server({ server });
  
  // Store connected clients
  const clients = [];
  // Handle incoming connections
  wss.on('connection', (ws, req) => {
    // Get the "rn" parameter from the request URL
    // const urlParams = new URLSearchParams(req.url);
    // const rn = urlParams.get('rn');
    const rn = req.url.split('?rn=')[1];
    // console.log(rn);

    //

    // Handle incoming messages
    ws.on('message', (message) => {
      
    });

    // Handle connection close
    ws.on('close', () => {
      // Remove the WebSocket connection from the stored clients
      delete clients[rn];
      console.log(`Client ${rn} disconnected`);
    });

    // Send a welcome message to the client
    ws.send(`Welcome, client ${rn}!`);
  });
}

module.exports = webSocketServer;