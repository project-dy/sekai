import { CommandParams } from "..";
// import { rooms } from "../..";
import fs from "fs";
import path from "path";
if (fs.existsSync("./quiz"))
  fs.readdirSync("./quiz").forEach((file) => {
    /*
    quiz/sample/quiz.json (quiz/{Quiz Suffix}/quiz.json)
    */
    const quizPath = path.resolve("./quiz", file);
    // 따라서 재귀로 폴더를 탐색해야 함 (1. 폴더인지 2. quiz.json이 있는지)
    // 1. 폴더인지
    if (!fs.lstatSync(quizPath).isDirectory()) return; // 아니면 스킵
    // 2. quiz.json이 있는지
    if (!fs.existsSync(path.resolve(quizPath, "quiz.json"))) return; // 없으면 스킵
    // 3. quiz.json을 읽어서 quizList에 추가
    // TODO: 만들어라
  });
/**
 * 퀴즈 리스트 가져오는거
 * @param params 커맨드 파라미터
 * @returns 관리자 응답
 * @description 작업 성공시에만 관리자에게 반환. 클라이언트에게 반환 안함
 */
export default async (params: CommandParams) => {
  console.log(params);
  // TODO: 만들어라 \n 귀찮
  return ["sample", ""];
};
