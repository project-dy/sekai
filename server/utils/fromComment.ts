import { execSync } from "child_process";
import { readdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { metadataMap } from "../../types/index.d.ts";

export class ChartDoongi {
  private meta?: string;
  private name?: string | undefined = "";
  private songList: string[];
  constructor(name: string, meta?: string) {
    this.meta = meta;
    // console.log(this.meta);
    this.name = name;
    if (!meta) {
      return;
    }
    let list = meta.trim().split("\n");
    list.forEach((e, i) => {
      const temp = e.substring(2);
      // console.log(temp.split(" "));
      list[i] = temp.split(" ").slice(0, -1).splice(1).join(" ").trim();
    });
    list = list.filter((item) => item !== "");
    this.songList = list;
    // console.log(this.songList);
  }
  async download() {
    this.songList.forEach((e, i) => {
      if (e == "") return;
      const result = execSync(
        `yt-dlp ytsearch:${'"' + (e + " 가사").replace(/(["'$`\\])/g, "\\$1") + '"'} -f bestaudio -o "./audio/${this.name}/${i + 1} - %(title)s.%(ext)s"`,
      );
      console.log(result);
    });
  }
  async get(trackNumber: string) {
    // console.log(trackNumber);
    const res = await readdir(`./audio/${this.name}`);
    // console.log(res);
    for (const e of res) {
      if (e.startsWith(trackNumber)) return e;
    }
    return "Not Found";
  }
  async list() {
    const res = await readdir(`./audio/${this.name}`);
    // console.log(res);
    const list: string[] = [];
    for (const e of res) {
      list.push(e.split(" - ")[0]);
    }
    return list || "Not Found";
  }
  async jsonInit() {
    const folderRes = await readdir(`./audio/${this.name}`);
    // console.log(folderRes);
    /*
    {
      id: string,
      fileName: string,
      correctAnswers: string[]
    }
    */
    // const list: metadata[] = [];
    let jsonMeta: string;
    try {
      jsonMeta = (await readFile(`./meta/${this.name}.json`)).toString();
    } catch {
      jsonMeta = "";
    }
    const list: metadataMap = jsonMeta ? JSON.parse(jsonMeta) : {};
    folderRes.forEach((e: string) => {
      const id = e.split(" - ")[0];
      const fileName = e;
      // console.log(JSON.stringify(path.parse(e)));
      const youtubeTitle = path.parse(e).name.replace(`${id} - `, "");
      const correctAnswers = [youtubeTitle];
      if (list[id] && list[id].id == id && list[id].fileName == fileName) {
        return;
      }
      // list.push({ id, fileName, youtubeTitle, correctAnswers });
      list[id] = { id, fileName, youtubeTitle, correctAnswers };
    });
    await writeFile(`./meta/${this.name}.json`, JSON.stringify(list, null, 2));
    jsonMeta = (await readFile(`./meta/${this.name}.json`)).toString();
    // console.log(JSON.parse(jsonMeta));
  }
  async getJSON() {
    const jsonMeta = (await readFile(`./meta/${this.name}.json`)).toString();
    // console.log(JSON.parse(jsonMeta));
    return jsonMeta;
  }
}

// const youtube = new Youtube("info", "https://www.youtube.com/playlist?list=PLXrBBJfGINdu9uK-Lg2JSx4NenI-881Yw", "1", "");
// youtube.download();

const chatDoongi = new ChartDoongi(
  "kpop",
  `
001. HOME SWEET HOME - 지드래곤(feat. 태양&대성) 00:01

002. APT. - 로제(ROSE) & Bruno Mars  03:31

003. Whiplash - aespa 06:22

004. POWER - G-DRAGON(지드래곤) 09:25

005. HAPPY - DAY6 11:49

006. toxic till the end - 로제 14:58

007. 이럴거면 다음생에 - 8TURN 17:35

008. 첫 눈 - EXO 20:29

009. UP(KARINA Solo) - aespa  23:56

010. 내게 사랑이 뭐냐고 물어본다면 - 로이킴 26:42

011. 나는 반딧불 - 황가람 30:26

012.  Pump Up The Volume! - PLAVE 34:01

013. 내 이름 맑음 - QWER 37:00

014. WAY 4 LUV - PLAVE 40:10

015. Mantra - 제니(JENNIE) 43:48

016. Welcome to the Show - DAY6 46:05

017.  Supernova - aespa 49:43

018. 한 페이지가 될 수 있게 - DAY6(데이식스) 52:41

019. 소나기 - 이클립스 56:07

020.  너와의 모든 지금 - 재쓰비 1:00:01

021. 예뻤어 - DAY6 1:02:54

022. Drowmomg - WOODZ 1:07:37

023. 우리영화 - PLAVE 천상연 - 이창섭 1:11:41

024. 달랐을까(나의 해리에게 OST) - 플레이브 1:14:23

025. Supersonic - 프로미스나인 1:18:15

026. 슬픈초대장 - 순순희(지환) 1:21:09

027. 녹아내려요 - DAY6 1:25:15

028. ALL I Want for Christmas - Mariah Carey 1:28:02

029.  lgloo- KISS OF LIFE  1:32:03

030.  How Sweet - NewJeans 1:34:15

031. 고민중독 - QWER 1:37:54

032. Dancing in the Moonnlight - RAY 1:40:50

033. Used Goods - JAKE $ING 1:43:35

034. 클락션 - 여자아이들 1:46:33

035. Kill These Butterflies - Cospe 1:49:28

036. 멈추지 않아 - PLAVE 1:52:10

037. 천상연 - 이창섭 멈추지 않아 - PLAVE 1:55:33

038. On My Level - plash 2:00:03

039. Sticky - KISS OF LIFE 2:01:49

040. Deep and Abinding - Victor Lundberg 2:04:46

041. number on girl - 로제 2:07:49

042. Already Know - AGST 2:11:26

043. Can I See You Again - JAKE $ING 2:14:04

044. 청춘만화 - 이무진 2:17:17

045. Life's a Playground - RAY 2:21:51

046. Stick Together - Elijah 2:24:11

047. Lovely Day - 콜린 2:27:27

048. Song for you - 요한 2:30:42

049. Just Bones - Zorro 2:32:26

050.  Letter To Myself - 태연 2:34:38
`,
);
chatDoongi.jsonInit();
// chatDoongi.download();

/*
function test(order) {
  try{window.audio.pause();}catch{}
  ws.send("adminYoutube info "+String(order).padStart(3, "0"));
  if (order==132) return;
  window.timeout = setTimeout(test, 2500, order+1);
}test(1)
*/

/*
function test(order) {
  try{window.audio.pause();}catch{}
  ws.send("adminYoutube info "+String(order).padStart(3, "0"));
  setTimeout(()=>{
    audio.loop = false;
    audio.onended = ()=>{
      console.log('1');
      test(order+1);
    }
  }, 100);
}test(1)
*/
