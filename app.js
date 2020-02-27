var axios = require('axios'),
  cheerio = require('cheerio'),
  request = require('request'),
  fs = require('fs');

var writeStream = fs.createWriteStream('members.csv');

// Write header
writeStream.write(`Member's data \n`);

function getLinks() {
  axios
    .get(
      'https://www.saot.ca/search-for-an-ot/?wpv_view_count=54581-TCPID54478&wpv-wpcf-city=Calgary&wpv-wpcf-what-are-your-areas-of-practice=&wpv_filter_submit=Search'
    )
    .then(res => {
      var $ = cheerio.load(res.data.toString());
      var $bodyList = $('tbody.wpv-loop tr');

      var links = [];

      $bodyList.each(function(i, el) {
        links[i] = $(el)
          .first('td')
          .find('a')
          .attr('href');
      });
      // console.log(links);

      for (var i = 0; i < links.length; i++) {
        axios
          .get(links[i])
          .then(res => {
            if (res.status == 200) {
              function getData() {
                var result = [];
                var $ = cheerio.load(res.data);
                var $dataList = $('div.entry-content');

                $dataList.each(function(el) {
                  result[i] = $(this).text();
                });
                // console.log(result);

                // Write row to CSV
                writeStream.write(`${result} \n`);
              }

              getData();
            }
          })
          .catch(err => {});
      }
    });
}

function init() {
  getLinks();
}

init();
