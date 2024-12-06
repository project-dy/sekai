import { CommandParams } from "..";
// import { rooms } from "../.."; 
/**
 * 폼 전송 (admin이 전송을 하면 클라에게 뿌려줌)
 * @param params 커맨드 파라미터
 * @returns 관리자 응답
 * @description 작업 실패시에는 관리자에게만 반환. 기타 상황의 경우 모두에게 반환.
 */
export default async (params: CommandParams) => {
  console.log(params.params);
  return ["", ""];
};
