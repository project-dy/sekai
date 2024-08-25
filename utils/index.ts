//const fs = require("fs");
//const path = require("path");
//const axios = require("axios");
//const cheerio = require("cheerio");

import fs from "fs";
import path from "path";
import axios from "axios";
import * as cheerio from "cheerio";

//const search = require("youtube-search");
//const ytdl = require("@distube/ytdl-core");
//const dotenv = require("dotenv");
import search from "youtube-search";
import ytdl from "@distube/ytdl-core";
import dotenv from "dotenv";
//dotenv.config();
import { fileURLToPath } from "url";
const __dirname = fileURLToPath(new URL(".", import.meta.url));
const __filename = fileURLToPath(import.meta.url);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const key = process.env.YOUTUBE_API_KEY;

const opts = {
  maxResults: 1,
  key: key,
};

interface Params {
  command: string;
  params: { string: string }[];
  flags: string[];
}

interface Room {
  id: string;
  name: string;
  users: string[];
}

export const rooms: Room[] = [];

class Admin {
  constructor() {
    //this.name = "Admin";
  }

  room(params: Params) {
    console.log("room");
    return {
      c: 501,
      m: "Not implemented",
    };
    if (params.flags[0] == "add") {
      console.log("add");
      return {
        c: 200,
        m: "Success",
      };
    }
  }

  async crawl(params: Params) {
    const util = new Util();
    // Util.crawl();
    //const result = Util.crawl(params);
    //console.log(result);
    //return result;
    const rootPath = path.resolve(__dirname, "../");
    const dataPath = path.resolve(rootPath, "data");
    // If there is no data folder, create one
    if (!fs.existsSync(dataPath)) {
      fs.mkdirSync(dataPath);
    }
    // If there is no crawled folder, create one
    if (!fs.existsSync(path.resolve(dataPath, "crawled"))) {
      fs.mkdirSync(path.resolve(dataPath, "crawled"));
    }

    //console.log(JSON.stringify({ data: params }));
    if (params.params[0]?.string === "iChart") {
      const result = await util.crawliChart();
      fs.writeFileSync(
        path.resolve(dataPath, "crawled/iChart.json"),
        JSON.stringify({ data: result }),
        //String(result),
        { encoding: "utf8", flag: "w" },
      );
      //return true;
      return JSON.stringify({ data: result });
    }
    const result = await util.crawlMelon();
    fs.writeFileSync(
      path.resolve(dataPath, "crawled/melon.json"),
      JSON.stringify({ data: result }),
      //String(result),
      { encoding: "utf8", flag: "w" },
    );
    //return true;
    return JSON.stringify({ data: result });
  }

  async download(params: Params) {
    const util = new Util();
    // Util.downloadAudio();
    const chartSource = params.params[0]?.string;
    const until = Number(params.params[1]?.string);
    const chartFile = path.resolve(
      __dirname,
      `../data/crawled/${chartSource}.json`,
    );
    const outputDir = path.resolve(__dirname, "../data/audio");
    return util.downloadAllAudio(chartFile, outputDir, until);
  }

  async doIt(params: Params): Promise<string> {
    const command = params.command;
    switch (command) {
      case "crawl": {
        const res = await this.crawl(params);
        if (res) {
          return JSON.stringify({ c: 200, m: String(res) });
        }
        break;
      }
      case "download": {
        const res = await this.download(params);
        if (res) {
          return JSON.stringify({ c: 200, m: String(res) });
        }
        break;
      }
      default:
        //return "Command Not Found";
        return JSON.stringify({ c: 404, m: "Command Not Found" });
    }
    return JSON.stringify({ c: 404, m: "Command Not Found" });
  }
}

class Normal {}

class Sekai {
  name: string;
  Util: typeof Util;
  Admin: typeof Admin;

  constructor() {
    this.name = "Sekai";
    this.Util = Util;
    this.Admin = Admin;
    /*this.Util = new Util();
		this.Admin = new Admin();*/
  }

  greet() {
    console.log(`Hello, ${this.name}`);
  }

  register() {
    console.log("register");
    return {
      c: 501,
      m: "Not implemented",
    };
  }

  getUtil() {
    return new Util();
  }

  getAdmin() {
    return new Admin();
  }
}

/*
    list.push({
      rank: firstRank,
      albumArt: "https://" + firstAlbumArt,
      song: firstSong,
      album: firstAlbum,
      artist: firstArtist,
      jaksa: firstJaksa,
      jakgok: firstJakgok,
      pyeonkok: firstPyeongok,
      youtube: "https://www.youtube.com/watch?v=" + firstYoutube,
    });
*/
interface iChartSong {
  rank: string;
  albumArt: string;
  song: string;
  album: string;
  artist: string;
  jaksa: string | undefined;
  jakgok: string | undefined;
  pyeonkok: string | undefined;
  youtube: string;
}

interface MelonSong {
  rank: string;
  albumArt: string | undefined;
  title: string;
  artist: string;
  album: string;
}

class Util {
  name: string;
  constructor() {
    this.name = "Util";
  }

  async downloadAllAudio(
    chartFile: string,
    folderPath: string,
    until = 100,
  ): Promise<string[]> {
    const chart = JSON.parse(fs.readFileSync(chartFile, "utf-8")).data.slice(
      0,
      until,
    );
    const audioList: string[] = [];
    for (const song of chart) {
      console.log(song);
      const rank = song.rank;
      const name = song.title;
      const artist = song.artist;
      const audioPath = await this.downloadAudio(
        rank,
        name,
        artist,
        folderPath,
      );
      audioList.push(audioPath);
    }
    /*const song = chart[0];
		console.log(song);
		const rank = song.rank;
		const name = song.title;
		const artist = song.artist;
		const audioPath = await this.downloadAudio(rank, name, artist, folderPath);
		audioList.push(audioPath);*/
    return audioList;
  }

  async downloadAudio(
    rank: string,
    name: string,
    artist: string,
    audioPath: string,
  ): Promise<string> {
    const searchValue = `${name} ${artist} lyrics`;
    const searchResult = (await search(searchValue, opts)).results;
    console.log(searchResult);
    const videoId = searchResult[0].link;
    //const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    //const info = await ytdl.getInfo(videoUrl);
    //const audioFormats = ytdl.filterFormats(info.formats, "audioonly");
    // Get the date of now ex.20241231
    /*const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const audioPath = path.resolve(__dirname, `../data/audio/${date}`);*/
    // If there is no audio folder, create one
    if (!fs.existsSync(path.resolve(__dirname, "../data/audio"))) {
      fs.mkdirSync(path.resolve(__dirname, "../data/audio"));
    }
    // If there is no date folder, create one
    if (!fs.existsSync(audioPath)) {
      fs.mkdirSync(audioPath);
    }
    /*ytdl.chooseFormat(info.formats, { quality: "highestaudio" }).pipe(
      fs.createWriteStream(
        path.resolve(audioPath, `${name}-${artist}.mp3`),
      ),
    );*/
    //console.log(videoId);
    /*ytdl(videoId).pipe(
			//ytdl(videoId, { quality: "highestaudio" }).pipe(
			fs.createWriteStream(
				path.resolve(audioPath, `${rank}-${name}-${artist}.mp4`),
			),
		);*/
    const info = await ytdl.getInfo(videoId);
    const audioFormats = ytdl.filterFormats(info.formats, "audioonly");
    console.log(audioFormats);
    //const audio = audioFormats.find((format) => format.container === "m4a");
    const audio = audioFormats.find((format) => format.container === "mp4");
    if (!audio) {
      throw new Error("No audio format found");
      //return;
    }
    const audioStream = ytdl.downloadFromInfo(info, {
      format: audio,
    });
    const audioFile = fs.createWriteStream(
      path.resolve(audioPath, `${name}-${artist}.mp4`),
    );
    audioStream.pipe(audioFile);
    /*await new Promise((resolve, reject) => {
			ytdl(videoId, { quality: "highestaudio" })
				.pipe(
					fs.createWriteStream(
						path.resolve(audioPath, `${name}-${artist}.mp4`),
					),
				)
				.on("finish", resolve)
				.on("error", reject);
		});*/

    return `${name}-${artist}.mp4`;
  }

  async crawlMelon() {
    const list: MelonSong[] = [];
    const melonURL = "https://www.melon.com/chart/index.htm";
    // Connect to the website and get tbody
    const html = await axios.get(melonURL);
    const $ = cheerio.load(html.data);
    const trList = $("tbody>tr");
    //console.log(trList);
    trList.each((index, element) => {
      const rank = $(element).find("td:nth-child(2)>div>span").text().trim();
      const albumArt = $(element)
        .find("td:nth-child(4)>div>a>img")
        .attr("src")
        ?.replace("/120", "/480");
      const title = $(element)
        .find("td:nth-child(6)>div>div>div:nth-child(1)>span>a")
        .text()
        .trim();
      const artist = $(element)
        .find("td:nth-child(6)>div>div>div:nth-child(3)>a")
        .text()
        .trim();
      const album = $(element)
        .find("td:nth-child(7)>div>div>div>a")
        .text()
        .trim();
      /*console.log(
        `rank: ${rank}, albumArt: ${albumArt}, title: ${title}, artist: ${artist}, album: ${album}`,
      );*/
      list.push({
        rank: rank,
        albumArt: albumArt,
        title: title,
        artist: artist,
        album: album,
      });
    });
    return list;
  }

  async crawliChart() {
    const iChartURL = "https://www.instiz.net/iframe_ichart_score.htm";
    // Connect to the website and get tbody
    const html = await axios.get(iChartURL);
    const $ = cheerio.load(html.data);
    /*
    root: .spage_intistore_body,
    first-i {
      root: .spage_score_item_1st,
      albumArt: root>.ichart_score_img>div>img,
      song: root>.ichart_score_song>div:nth-child(1)>b,
      album: root>.ichart_score_song>div:nth-child(2)>span>a,
      rank: 1,
    },
    first-b {
      root: .spage_score_bottom,
      youtube: root>div:nth-child(1)>.scoreinfo_top>.inner>.ichart_submenu>ul>li:nth-child(1)>a, // "https://www.youtube.com/watch?v="+href.split(",'")[0].split("')")[0]
      jaksa: root>div:nth-child(1)>.scoreinfo_top>.inner>.ichart_submenu>ul>li:nth-child(3)>span:nth-child(2), // onclick.split("('")[1].split("')")[0]
      jakgok: root>div:nth-child(1)>.scoreinfo_top>.inner>.ichart_submenu>ul>li:nth-child(3)>span:nth-child(4), // onclick.split("('")[1].split("')")[0]
      pyeongok: root>div:nth-child(1)>.scoreinfo_top>.inner>.ichart_submenu>ul>li:nth-child(3)>span:nth-child(6), // onclick.split("('")[1].split("')")[0]

    },
    other-i {
      root: .spage_score_item, // in spage_intistore_body. with nth-child 2nd is 7th, 3rd is 8th...
      rank: .ichart_score2_rank,
      albumArt: .ichart_score2_ment>div>img,
      song: .ichart_score2_song1,
      album: .ichart_score2_song2>span>a,
      artist: .ichart_score2_artist,

    },
    other-b {
      root: .ichart_submenu>ul, // in ichart_submenu. with nth-child 2nd is 8th, 3rd is 9th...
      youtube: .ichart_mv>a, // "https://www.youtube.com/watch?v="+href.split(",'")[0].split("')")[0]
      jaksa: .showinfo>span:nth-child(2), // onclick.split("('")[1].split("')")[0]
      jakgok: .showinfo>span:nth-child(4), // onclick.split("('")[1].split("')")[0]
      pyeongok: .showinfo>span:nth-child(6), // onclick.split("('")[1].split("')")[0]
    }

    */

    let list: iChartSong[] = [];

    const first = $(".spage_score_item_1st");
    const firstAlbumArt = first.find(".ichart_score_img>div>img").attr("src");
    const firstSong = first
      .find(".ichart_score_song>div:nth-child(1)>b")
      .text();
    const firstAlbum = first
      .find(".ichart_score_song>div:nth-child(2)>span>a")
      .text();
    const firstRank = "1위";
    const firstArtist = first
      .find(".ichart_score_artist>div:nth-child(1)>b")
      .text();
    const firstB = $(".spage_score_bottom");
    const firstJaksa = firstB
      .find(
        ".scoreinfo_top>.inner>.ichart_submenu>ul>li:nth-child(3)>span:nth-child(2)",
      )
      .attr("onclick")
      ?.split("('")[1]
      .split("')")[0];
    const firstJakgok = firstB
      .find(
        ".scoreinfo_top>.inner>.ichart_submenu>ul>li:nth-child(3)>span:nth-child(4)",
      )
      .attr("onclick")
      ?.split("('")[1]
      .split("')")[0];
    const firstPyeongok = firstB
      .find(
        ".scoreinfo_top>.inner>.ichart_submenu>ul>li:nth-child(3)>span:nth-child(6)",
      )
      .attr("onclick")
      ?.split("('")[1]
      .split("')")[0];

    const firstYoutube = firstB
      .find(".scoreinfo_top>.inner>.ichart_submenu>ul>li:nth-child(1)>a")
      .attr("href")
      ?.split(",'")[0]
      .split("')")[0];

    /*console.log(
      `rank: ${firstRank}, albumArt: ${firstAlbumArt}, song: ${firstSong}, album: ${firstAlbum}, Jaksa: ${firstJaksa}, Jakgok: ${firstJakgok}, Pyeongok: ${firstPyeongok}`,
    );*/

    list.push({
      rank: firstRank,
      albumArt: "https://" + firstAlbumArt,
      song: firstSong,
      album: firstAlbum,
      artist: firstArtist,
      jaksa: firstJaksa,
      jakgok: firstJakgok,
      pyeonkok: firstPyeongok,
      youtube: "https://www.youtube.com/watch?v=" + firstYoutube,
    });

    //console.log(list[0]);

    const other = $(".spage_score_item");
    other.each((index, element) => {
      const rank = $(element).find(".ichart_score2_rank").text().trim();
      const albumArt = $(element)
        .find(".ichart_score2_ment>div>img")
        .attr("src");
      const song = $(element).find(".ichart_score2_song1").text().trim();
      const album = $(element)
        .find(".ichart_score2_song2>span>a")
        .text()
        .trim();
      const artist = $(element).find(".ichart_score2_artist1").text().trim();
      const jaksa = $(element)
        .next()
        .find(".showinfo>span:nth-child(2)")
        .attr("onclick")
        ?.split("('")[1]
        ?.split("')")[0];
      const jakgok = $(element)
        .next()
        .find(".showinfo>span:nth-child(4)")
        .attr("onclick")
        ?.split("('")[1]
        ?.split("')")[0];
      const pyeongok = $(element)
        .next()
        .find(".showinfo>span:nth-child(6)")
        .attr("onclick")
        ?.split("('")[1]
        ?.split("')")[0];
      const youtube = $(element)
        .next()
        .find(".ichart_mv>a")
        .attr("href")
        ?.split(",'")[1]
        ?.split("')")[0];
      /*console.log(
        `rank: ${rank}, albumArt: ${albumArt}, song: ${song}, album: ${album}, jaksa: ${jaksa}, jakgok: ${jakgok}, pyeongok: ${pyeongok}, youtube: ${youtube}`,
      );*/
      list.push({
        rank: rank,
        albumArt: "https://" + albumArt,
        song: song,
        album: album,
        artist: artist,
        jaksa: jaksa,
        jakgok: jakgok,
        pyeonkok: pyeongok,
        youtube: "https://www.youtube.com/watch?v=" + youtube,
      });
    });

    console.log(list);
    return list;
  }

  /*async crawlMelon() {
    const melonURL = "https://www.melon.com/chart/index.htm";
    // Connect to the website and get tbody
    const html = await axios.get(melonURL);
    const $ = cheerio.load(html.data);
    const trList = $("tbody>tr");
    //console.log(trList);
    trList.each((index, element) => {
      const rank = $(element).find("td:nth-child(2)>div>span").text().trim();
      const albumArt = $(element)
        .find("td:nth-child(4)>div>a>img")
        .attr("src")
        .replace("/120", "/480");
      const title = $(element)
        .find("td:nth-child(6)>div>div>div:nth-child(1)>span>a")
        .text()
        .trim();
      const artist = $(element)
        .find("td:nth-child(6)>div>div>div:nth-child(3)>a")
        .text()
        .trim();
      const album = $(element)
        .find("td:nth-child(7)>div>div>div>a")
        .text()
        .trim();
      console.log(
        `rank: ${rank}, albumArt: ${albumArt}, title: ${title}, artist: ${artist}, album: ${album}`,
      );
    });
  }*/
}

//module.exports = Sekai;
export default Sekai;
