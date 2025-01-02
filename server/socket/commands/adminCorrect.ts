import { clients, CommandParams } from "..";
/**
 * 답 체크
 * @param params 커맨드 파라미터 (답)
 * @returns 관리자 응답
 * @description 작업 성공시에만 관리자에게 반환. 클라이언트에게 처리 완료 표시.
 */

// Example: adminCorrect nox0118 980
export default async (params: CommandParams) => {
  // console.log(params.params);
  // 클라에서 답 다 정리(특수문자 제거 공백 제거후 제출.)
  console.log(params.params.join(" "));
  console.log(clients[params.rn]);
  let done = false;
  clients[params.rn].forEach((client) => {
    if (!done && client.name === params.params[0]) {
      done = true;
      client.ws.send(`scoreAdd${params.params[1]}`);
    }
  });
  return [`process${params.name}$${params.params.join(" ")}`, ""];
};

/*

기본 1000점,25초 최대 1ms당 -0.04점

*/
