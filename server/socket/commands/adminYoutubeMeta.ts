import { Youtube } from "../../utils/youtube.ts";
import { CommandParams } from "..";
// import { rooms } from "../..";
/**
 * 오디오 메타데이터를 포함하는 JSON파일 읽기
 * @param params 커맨드 파라미터 (플리이름)
 * @returns 관리자 응답
 * @description 작업 성공시에만 관리자에게 반환. 클라이언트에게 반환 안함.
 */
export default async (params: CommandParams) => {
  // console.log(params.params);
  const youtube = new Youtube(params.params[0]);
  try {
    await youtube.jsonInit();
  } catch (_) {
    console.error(_);
  }
  const res = await youtube.getJSON();
  return [`ytMeta${res}`, ""];
};
