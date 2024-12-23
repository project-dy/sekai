import { clients, CommandParams } from "..";
import { rooms } from "../..";
/**
 * Register a new client
 * @param params 커맨드 파라미터
 * @returns 관리자 응답
 * @description 작업 성공시에만 관리자에게 반환. 클라이언트에게 반환할경우 룸에 있는 모든 클라이언트에게 반환되므로 이 대신 직접 보냄
 */
export default async (params: CommandParams) => {
  // console.log(params);
  const name = params.params.join(" ");
  // 중복 이름 체크
  if (clients[params.rn]) {
    // console.log(clients[params.rn], name);
    if (clients[params.rn].find((client) => client.name === name)) {
      return ["", ""];
      // return ["Name already exists", "Name already exists"];
    }
  }
  // 새로운 클라이언트 등록
  clients[params.rn] = clients[params.rn] || []; // 비어있으면 init
  clients[params.rn].push({ name, ws: params.ws, connected: true }); // 클라이언트 추가
  const roomName = rooms.find((room) => room.id === params.rn)?.name;
  params.ws.send("registered " + roomName);
  return ["register " + name, ""];
};
