let store = {
  user: [],
  music: [],
};

let template = {
  user: {
    name: "",
    sn: "",
    order: "", // 입장 순서
    solved: "", // 푼 문제
    correct: [], // 정답 여부 배열
    score: 0, // 점수
  },
  music: {
    title: "",
    artist: "",
    source: "", // is Downloaded(local) or from http
    url: "",
    answer: "",
    hint: "",
    score: 0,
  },
};

const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();

// nunjucks 설정
const nunjucks = require("nunjucks");
nunjucks.configure("public", {
  express: app,
});
app.set("view engine", "html");
app.engine("html", nunjucks.render);

/*app.get("/auth", (req, res) => {
  res.json({
    c: 500,
    m: "Not implemented",
  });
});*/

app.use(express.static("public"));
app.use("/node_modules", express.static("node_modules"));

// 기본적으로 nunjucks를 이용한 redering을 모든 get요청에 대하여 처리
app.get("/", (req, res) => {
  res.render("index");
});

const webSocketServer = require("./socket/index"); // socket 모듈 로드

const server = app.listen(process.env.PORT, () => {
  console.log("Server is running on port http://localhost:" + process.env.PORT);
});

const Sekai = require("../utils/index"); // utils 모듈 로드
const sekai = new Sekai(); // Sekai 클래스 인스턴스 생성
sekai.greet(); // Hello, Sekai 출력
webSocketServer(server); // socket 서버 실행

app.get("/api", (req, res) => {
  res.json({
    c: 501,
    m: "Not implemented",
  });
});

const util = new sekai.Util();
util.crawl();

// /api/list 접속자 리스트
app.get("/api/list", (req, res) => {
  res.json({
    c: 501,
    m: "Not implemented",
  });
});
