import { Youtube } from "../../utils/youtube.ts";
import { CommandParams } from "..";
import { getRoomIndex, rooms } from "../..";

interface Song {
  id: string;
  fileName: string;
  youtubeTitle: string;
  correctAnswers: string[];
}
/**
 * 노래 선택
 * @param params 커맨드 파라미터 (플리이름, 오디오 번호)
 * @returns 관리자 응답
 * @description 작업 성공시에만 관리자에게 반환. 클라이언트에게 반환 안함.
 */
// adminSetSong info 100
export default async (params: CommandParams) => {
  // console.log(params.params);
  const youtube = new Youtube(params.params[0]);
  const json: { [key: string]: Song } = JSON.parse(await youtube.getJSON());
  const song = json[params.params[1]];
  // console.log(json);
  console.log(song);
  rooms[getRoomIndex(params.rn)].currentSong = params.params[1];
  rooms[getRoomIndex(params.rn)].currentAnswers = song.correctAnswers;
  return [
    `setSong${params.params[1]}$${JSON.stringify(rooms[getRoomIndex(params.rn)].currentAnswers)}`,
    "",
  ];
};
