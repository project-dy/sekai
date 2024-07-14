const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();

/*app.get("/auth", (req, res) => {
  res.json({
    c: 500,
    m: "Not implemented",
  });
});*/

app.use(express.static('public'));

const webSocketServer = require('./socket/index'); // socket 모듈 로드


const server = app.listen(process.env.PORT, () => {
  console.log('Server is running on port http://localhost:' + process.env.PORT);
});
webSocketServer(server); // socket 서버 실행