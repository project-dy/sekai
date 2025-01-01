import { clients, CommandParams } from "..";
/**
 * 답 체크
 * @param params 커맨드 파라미터 (답)
 * @returns 관리자 응답
 * @description 작업 성공시에만 관리자에게 반환. 클라이언트에게 처리 완료 표시.
 */

// Example: adminCorrect nox0118 true[false]
export default async (params: CommandParams) => {
  // console.log(params.params);
  // 클라에서 답 다 정리(특수문자 제거 공백 제거후 제출.)
  console.log(params.params.join(" "));
  clients[params.rn].forEach((client) => {
    if (client.name === params.params[0]) {
      client.ws.send(params.params[1] === "true" ? "correct" : "incorrect");
    }
  });
  return [`answer${params.name}$${params.params.join(" ")}`, ""];
};
