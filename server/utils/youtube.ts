import { exec } from "child_process";
import { readdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { metadataMap } from "../../types/index.d.ts";

export class Youtube {
  private playlist?: string =
    "https://www.youtube.com/playlist?list=PLg_-6HyedP074nICRharnuEmYt8jnsjOv";
  private from?: string = "1";
  private until?: string | undefined = "";
  private name?: string | undefined = "";
  constructor(name?: string, playlist?: string, from?: string, until?: string) {
    this.playlist = playlist;
    console.log(this.playlist);
    this.from = from;
    this.until = until;
    this.name = name;
  }
  async download() {
    const result = await exec(
      `yt-dlp --downloader aria2c --downloader-args '-c -j 3 -x 3 -s 3 -k 1M' ${this.playlist} -I ${this.from}:${this.until} -f bestaudio -o "./audio/${this.name}/%(playlist_index)s - %(title)s.%(ext)s"`,
    );
    console.log(result);
  }
  async get(trackNumber: string) {
    console.log(trackNumber);
    const res = await readdir(`./audio/${this.name}`);
    console.log(res);
    for (const e of res) {
      if (e.startsWith(trackNumber)) return e;
    }
    return "Not Found";
  }
  async list() {
    const res = await readdir(`./audio/${this.name}`);
    console.log(res);
    const list: string[] = [];
    for (const e of res) {
      list.push(e.split(" - ")[0]);
    }
    return list || "Not Found";
  }
  async jsonInit() {
    const folderRes = await readdir(`./audio/${this.name}`);
    console.log(folderRes);
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

const youtube = new Youtube(
  "info",
  "https://www.youtube.com/playlist?list=PLXrBBJfGINdu9uK-Lg2JSx4NenI-881Yw",
  "1",
  "",
);
// youtube.download();

// const youtube = new Youtube("info");
youtube.jsonInit();

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
