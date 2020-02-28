var axios = require('axios'),
  cheerio = require('cheerio'),
  request = require('request'),
  fs = require('fs');

var writeStream = fs.createWriteStream('members.csv');

var targetedUrl =
  'https://www.saot.ca/search-for-an-ot/?wpv_view_count=54581-TCPID54478&wpv-wpcf-city=Calgary&wpv-wpcf-what-are-your-areas-of-practice=&wpv_filter_submit=Search';

// Write header on CSV
writeStream.write(`Member's data \n`);

function getLinks() {
  var links = [];

  axios
    .get(targetedUrl)
    .then(res => {
      var $ = cheerio.load(res.data.toString());
      var $bodyList = $('tbody.wpv-loop tr');

      $bodyList.each(function(i, element) {
        links[i] = $(element)
          .first('td')
          .find('a')
          .attr('href');
      });
      // console.log(links);
    })
    .then(function getData() {
      for (var i = 0; i < links.length; i++) {
        axios
          .get(links[i])
          .then(res => {
            if (res.status == 200) {
              function eachData() {
                var result = [];
                var $ = cheerio.load(res.data);
                var $dataList = $('div.entry-content');

                $dataList.each(function(element) {
                  result[i] = $(this).text();
                });
                // console.log(result);

                // Write row to CSV
                writeStream.write(`${result} \n`);
              }

              eachData();
            }
          })
          .catch(function failHandler(err) {
            setTimeout(() => {
              console.log('delaying for 10s');
            }, 10000);
          });
      }
    });
}

function init() {
  getLinks();
}

init();
