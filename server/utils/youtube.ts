import { exec } from "child_process";
import { readdir } from "fs/promises";

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
      `yt-dlp ${this.playlist} -I ${this.from}:${this.until} -f bestaudio -o "./audio/${this.name}/%(playlist_index)s - %(title)s.%(ext)s"`
    );
    console.log(result);
  }
  async get(trackNumber: string) {
    console.log(trackNumber);
    const res = (await readdir(`./audio/${this.name}`));
    console.log(res);
    for (const e of res) {
      if (e.startsWith(trackNumber)) return e;
    }
    return "Not Found";
  }
}

// const youtube = new Youtube("noneinfo01", "https://www.youtube.com/playlist?list=PLg_-6HyedP074nICRharnuEmYt8jnsjOv", "1", "");
// youtube.download();