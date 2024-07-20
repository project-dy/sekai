const fs = require("fs");
const path = require("path");
const axios = require("axios");
const cheerio = require("cheerio");

class Admin {
  constructor() {
    this.name = "Admin";
  }

  room(params) {
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

  async crawl(params) {
    const util = new Util();
    const result = await util.crawl();
    // Util.crawl();
    //const result = Util.crawl(params);
    //console.log(result);
    //return result;
    const rootPath = path.resolve(__dirname, "../");
    const dataPath = path.resolve(rootPath, "data");
    fs.writeFileSync(
      path.resolve(dataPath, "crawled/iChart.json"),
      JSON.stringify({ data: result }),
      //String(result),
      { encoding: "utf8", flag: "w" },
    );
    return true;
  }

  async doIt(params) {
    const command = params.command;
    switch (command) {
      case "crawl":
        const res = await this.crawl(params);
        if (res) {
          return JSON.stringify({ c: 200, m: String(res) });
        }
        break;
      default:
        return "Command Not Found";
    }
  }
}

class Normal {}

class Sekai {
  constructor() {
    this.name = "Sekai";
    this.Util = Util;
    this.Admin = Admin;
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
}

class Util {
  constructor() {
    this.name = "Util";
  }

  async crawl() {
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

    let list = [];

    const first = $(".spage_score_item_1st");
    const firstAlbumArt = first.find(".ichart_score_img>div>img").attr("src");
    const firstSong = first
      .find(".ichart_score_song>div:nth-child(1)>b")
      .text();
    const firstAlbum = first
      .find(".ichart_score_song>div:nth-child(2)>span>a")
      .text();
    const firstRank = 1;
    const firstB = $(".spage_score_bottom");
    const firstJaksa = firstB
      .find(
        ".scoreinfo_top>.inner>.ichart_submenu>ul>li:nth-child(3)>span:nth-child(2)",
      )
      .attr("onclick")
      .split("('")[1]
      .split("')")[0];
    const firstJakgok = firstB
      .find(
        ".scoreinfo_top>.inner>.ichart_submenu>ul>li:nth-child(3)>span:nth-child(4)",
      )
      .attr("onclick")
      .split("('")[1]
      .split("')")[0];
    const firstPyeongok = firstB
      .find(
        ".scoreinfo_top>.inner>.ichart_submenu>ul>li:nth-child(3)>span:nth-child(6)",
      )
      .attr("onclick")
      .split("('")[1]
      .split("')")[0];

    const firstYoutube = firstB
      .find(".scoreinfo_top>.inner>.ichart_submenu>ul>li:nth-child(1)>a")
      .attr("href")
      .split(",'")[0]
      .split("')")[0];

    /*console.log(
      `rank: ${firstRank}, albumArt: ${firstAlbumArt}, song: ${firstSong}, album: ${firstAlbum}, Jaksa: ${firstJaksa}, Jakgok: ${firstJakgok}, Pyeongok: ${firstPyeongok}`,
    );*/

    list.push({
      rank: firstRank,
      albumArt: "https://" + firstAlbumArt,
      song: firstSong,
      album: firstAlbum,
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

module.exports = Sekai;
