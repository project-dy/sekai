//const fs = require("fs");
//const path = require("path");
//const axios = require("axios");
//const cheerio = require("cheerio");

import fs from "fs";
import path from "path";
import axios from "axios";
import * as cheerio from "cheerio";
import { exec } from "child_process";

//const search = require("youtube-search");
//const ytdl = require("@distube/ytdl-core");
//const dotenv = require("dotenv");
// import search from "youtube-search";
import ytdl from "@distube/ytdl-core";
import dotenv from "dotenv";
//dotenv.config();
// import { fileURLToPath } from "url";
// const __dirname = process.cwd();
// const __filename = fileURLToPath(import.meta.url);
dotenv.config();

// const key = process.env.YOUTUBE_API_KEY;

// const opts = {
//   maxResults: 1,
//   key: key,
// };

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

export async function crawl(params: Params) {
  // Util.crawl();
  //const result = Util.crawl(params);
  //console.log(result);
  //return result;
  // const rootPath = path.resolve(process.cwd());
  const dataPath = path.resolve(process.cwd(), "temp");
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
    const result = await crawliChart();
    fs.writeFileSync(
      path.resolve(dataPath, "crawled/iChart.json"),
      JSON.stringify({ data: result }),
      //String(result),
      { encoding: "utf8", flag: "w" }
    );
    //return true;
    return JSON.stringify({ data: result });
  }
  const result = await crawlMelon();
  fs.writeFileSync(
    path.resolve(dataPath, "crawled/melon.json"),
    JSON.stringify({ data: result }),
    //String(result),
    { encoding: "utf8", flag: "w" }
  );
  //return true;
  return JSON.stringify({ data: result });
}

async function download(params: Params) {
  // const util = new Util();
  // Util.downloadAudio();
  const chartSource = params.params[0]?.string;
  const until = Number(params.params[1]?.string);
  const chartFile = path.resolve(
    process.cwd(),
    `temp/crawled/${chartSource}.json`
  );
  const outputDir = path.resolve(
    process.cwd(),
    "temp/audio",
    "temp/downloadingAudio"
  );
  return downloadAllAudio(chartFile, outputDir, until);
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

async function downloadAllAudio(
  chartFile: string,
  folderPath: string,
  until = 100
): Promise<string[]> {
  const chart = JSON.parse(fs.readFileSync(chartFile, "utf-8")).data.slice(
    0,
    until
  );
  const audioList: string[] = [];
  for (const song of chart) {
    console.log(song);
    const name = song.title;
    const artist = song.artist;
    const audioPath = await this.downloadAudio(name, artist, folderPath);
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

// Function to run yt-dlp search and return the first result
async function search(query: string): Promise<string | undefined> {
  return new Promise((resolve, reject) => {
    exec(`yt-dlp "ytsearch1:${query}" --get-id`, (error, stdout, stderr) => {
      if (error) {
        reject(`exec error: ${error}`);
        return;
      }
      if (stderr) {
        reject(`stderr: ${stderr}`);
        return;
      }

      const videoId = stdout.trim();
      if (videoId) {
        resolve(videoId);
      } else {
        reject("No video found.");
      }
    });
  });
}

async function downloadAudio(
  name: string,
  artist: string,
  audioPath: string,
  tempPath: string
): Promise<string> {
  const searchValue = `${name} ${artist} lyrics`;
  const searchResult = await await search(searchValue);
  console.log(searchResult);
  if (typeof searchResult != "string") throw new Error("No video found");

  const videoId: string = searchResult;
  //const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  //const info = await ytdl.getInfo(videoUrl);
  //const audioFormats = ytdl.filterFormats(info.formats, "audioonly");
  // Get the date of now ex.20241231
  /*const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const audioPath = path.resolve(__dirname, `../data/audio/${date}`);*/
  // If there is no date folder, create one
  if (!fs.existsSync(audioPath)) {
    fs.mkdirSync(audioPath, { recursive: true });
  }
  if (!fs.existsSync(tempPath)) {
    fs.mkdirSync(tempPath, { recursive: true });
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
    path.resolve(audioPath, `${name}-${artist}.mp4`)
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

async function crawlMelon() {
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

async function crawliChart() {
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

  const list: iChartSong[] = [];

  const first = $(".spage_score_item_1st");
  const firstAlbumArt = first.find(".ichart_score_img>div>img").attr("src");
  const firstSong = first.find(".ichart_score_song>div:nth-child(1)>b").text();
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
      ".scoreinfo_top>.inner>.ichart_submenu>ul>li:nth-child(3)>span:nth-child(2)"
    )
    .attr("onclick")
    ?.split("('")[1]
    .split("')")[0];
  const firstJakgok = firstB
    .find(
      ".scoreinfo_top>.inner>.ichart_submenu>ul>li:nth-child(3)>span:nth-child(4)"
    )
    .attr("onclick")
    ?.split("('")[1]
    .split("')")[0];
  const firstPyeongok = firstB
    .find(
      ".scoreinfo_top>.inner>.ichart_submenu>ul>li:nth-child(3)>span:nth-child(6)"
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
    const albumArt = $(element).find(".ichart_score2_ment>div>img").attr("src");
    const song = $(element).find(".ichart_score2_song1").text().trim();
    const album = $(element).find(".ichart_score2_song2>span>a").text().trim();
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

//module.exports = Sekai;
// default Sekai;
