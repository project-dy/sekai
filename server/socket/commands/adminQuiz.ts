import { CommandParams } from "..";
import fs from "fs";
// import { rooms } from "../..";
/**
 * 퀴즈 가져오는거
 * @param params 커맨드 파라미터
 * @returns 관리자 응답
 * @description 작업 성공시에만 관리자에게 반환. 클라이언트에게 반환 안함
 */
export default async (params: CommandParams) => {
  console.log(params.params[0]);
  
  let quiz: string;
  try {
    quiz = fs.readFileSync(`./quiz/${params.params[0]}/quiz.json`).toString();
    console.log(quiz);
  } catch (e) {
    console.error(e);
    return["404 Not Found", ""];
  }
  return [quiz, ""];
};
