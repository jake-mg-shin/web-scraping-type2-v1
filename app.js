var axios = require('axios'),
  cheerio = require('cheerio'),
  fs = require('fs');

var writeStream = fs.createWriteStream('DataOfRotaryClub.csv');

var url =
  'https://my.rotary.org/en/search/club-finder/location?location=Calgary%2C%20AB%2C%20Canada&distance=25&units=Miles&day=Any&time=Any&type=Rotary%20Club&toggle_state=search&latitude=51.04473309999999&longitude=-114.0718831&category=Club%20Location';

var links = [];

// Write header on CSV
writeStream.write(`DataOfRotaryClub \n`);

const getData = () => {
  links.forEach(link => {
    const url2 = `https://my.rotary.org` + link;
    // console.log(url2);

    axios
      .get(url2)
      .then(res => {
        if (res.status == 200) {
          var $ = cheerio.load(res.data);
          var $dataList = $('.content');
          // console.log($dataList);

          $dataList.each((i, el) => {
            const NameOfClub = $(el)
              .children('h1')
              .text();

            const Address = $(el)
              .children('.club-general')
              .find('.club-meeting-address')
              .text();

            const MeetingTime = $(el)
              .children('.club-general')
              .find('.club-meeting-time')
              .text();

            const Website = $(el)
              .find('.club-website')
              .children('a')
              .attr('href');

            // Write row to CSV
            writeStream.write(
              `${NameOfClub}, ${Address}, ${MeetingTime}, ${Website} \n`
            );
          });
        }
      })
      .catch(err => {
        console.log('getData request err');
        // console.log(err);
      });
  });
};

const getLinks = async () => {
  try {
    return await axios.get(url).then(res => {
      // console.log(res);

      var $ = cheerio.load(res.data);
      var $bodyList = $('.club-name-link').children('a');

      $bodyList.each((i, el) => {
        links[i] = $(el).attr('href');
      });
      // console.log(links);
    });
  } catch (err) {
    console.log('getLinks request err');
    // console.log(err);
  } finally {
    getData();
  }
};

function init() {
  getLinks();
}

init();
