var axios = require('axios'),
  cheerio = require('cheerio'),
  fs = require('fs');

var writeStream = fs.createWriteStream('members.csv');

var targetedUrl =
  'https://www.saot.ca/search-for-an-ot/?wpv_view_count=54581-TCPID54478&wpv-wpcf-city=Calgary&wpv-wpcf-what-are-your-areas-of-practice=&wpv_filter_submit=Search';
var links = [];
var linksErr = [];
var result = [];
var resultErr = [];

// Write header on CSV
writeStream.write(`Member's data \n`);

function getData() {
  links.forEach(async link => {
    await axios
      .get(link)
      .then(res => {
        if (res.status == 200) {
          var $ = cheerio.load(res.data);
          var $dataList = $('div.entry-content');

          $dataList.each(function(element) {
            result = $(this).text();
          });
          // console.log(result);

          // Write row to CSV
          writeStream.write(`${result} \n`);
        }
      })
      .catch(err => {
        console.log('getData request err');

        resultErr.push(link);
      });
  });
}

function getLinks() {
  axios
    .get(targetedUrl)
    .then(res => {
      // console.log(typeof res);

      var $ = cheerio.load(res.data);
      var $bodyList = $('tbody.wpv-loop tr');

      $bodyList.each(function(i, element) {
        links[i] = $(element)
          .first('td')
          .find('a')
          .attr('href');
      });
      // console.log(links);

      getData();
    })
    .catch(err => {
      console.log('getLinks request err');

      // linksErr.push(link);
      //   console.log(linksErr);
    });
}

function init() {
  getLinks();
}

init();
