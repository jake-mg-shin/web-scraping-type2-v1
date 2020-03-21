const axios = require("axios"),
  cheerio = require("cheerio"),
  fs = require("fs");

const writeStream = fs.createWriteStream("fromInformAlberta.csv");

const url1 =
  "https://informalberta.ca/public/common/index_SearchPager.do;jsessionid=FC5A57D805AD9F47DB10C1FF924768BD?page=3#relevantListingsAnchor";
const url2 = "https://informalberta.ca/public/";

let links1 = [];
let links2 = [];

// Write header on CSV
writeStream.write(`fromInformAlberta \n`);

getData = async () => {
  await links2.forEach(link => {
    axios
      .get(link)
      .then(res => {
        // console.log(res);
        const $ = cheerio.load(res.data);
        const $bodyList = $("div#orgContact");

        $bodyList.each(function(i, el) {
          const name = $(this)
            .find("div#corpInfoHeading")
            .text();
          const address = $(this)
            .find("div#address")
            .text();
          const contact = $(this)
            .find("div#telephone")
            .text();
          const info = $(this)
            .find("div.expandableDataArea")
            .text();

          // Write row to CSV
          writeStream.write(`${name}, ${address}, ${contact}, ${info} \n`);
        });
      })
      .catch(err => {
        // console.log(err);
        console.log("getData request err");
      });
  });
};

makeUrl = () => {
  links1.forEach(link => {
    const _link = url2 + link.substring(3);
    // console.log(_link);

    links2.push(_link);
  });
  console.log(links2);

  getData();
};

getLinks = async () => {
  await axios
    .get(url1)
    .then(res => {
      const $ = cheerio.load(res.data);
      const $bodyList = $("span.solLink");

      $bodyList.each(function(i, el) {
        const link = $(this)
          .find("a")
          .attr("href");

        // console.log(link);
        links1.push(link);
      });
      console.log(links1);
    })
    .then(() => {
      makeUrl();
    })
    .catch(err => {
      console.log(err);
    });
};

init = () => {
  getLinks();
};

init();
