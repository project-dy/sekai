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
}

class Normal {}

class Sekai {
  constructor() {
    this.name = "Sekai";
    this.Util = Util;
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
  }
}

module.exports = Sekai;
