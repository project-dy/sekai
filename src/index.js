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
//webSocketServer(server); // socket 서버 실행
