import { Youtube } from "../../utils/youtube.ts";
import { CommandParams } from "..";
// import { rooms } from "../..";
/**
 * 오디오 url 가져오기
 * @param params 커맨드 파라미터 (플리이름, 오디오 번호)
 * @returns 관리자 응답
 * @description 작업 성공시에만 관리자에게 반환. 클라이언트에게 반환 안함.
 */
export default async (params: CommandParams) => {
  // console.log(params.params);
  const youtube = new Youtube(params.params[0]);
  const audio = await youtube.get(params.params[1]);
  return [`youtube/${params.params[0]}/${audio}`, ""];
};
