import { CommandParams } from "..";
// import { rooms } from "../..";
/**
 * 답 체크
 * @param params 커맨드 파라미터 (답)
 * @returns 관리자 응답
 * @description 작업 성공시에만 관리자에게 반환. 클라이언트에게 반환 안함.
 */

// Example: adminCorrect nox0118 correct[incorrect]
export default async (params: CommandParams) => {
  // console.log(params.params);
  // 클라에서 답 다 정리(특수문자 제거 공백 제거후 제출.)
  console.log(params.params.join(" "));
  return [`answer${params.name}$${params.params.join(" ")}`, ""];
};
