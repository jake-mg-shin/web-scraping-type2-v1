const axios = require('axios'),
    cheerio = require('cheerio'),
    fs = require('fs');

const writeStream = fs.createWriteStream('FederationOfCalgaryCommunities.csv');
writeStream.write(`Community, Company, Web, Phone, Email, Address \n`);

let links = [];
const alphabet = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
];

getData = async () => {
    await links.forEach((link) => {
        axios
            .get(link)
            .then((res) => {
                // console.log(res);
                const $ = cheerio.load(res.data);
                const target = $('div.ca_list_wrapper ul.ca_list li');

                for (let i = 0; i < target.length; i++) {
                    const com = $(target[i]).find('h2.postitle').text();
                    const name = $(target[i]).find('h4').text();
                    const web = $(target[i]).find('div p a').attr('href');
                    const phone = $(target[i])
                        .find('div p span.fcc_ca_phone')
                        .text();
                    const email = $(target[i])
                        .find('div')
                        .children('p')
                        .slice(2, 3)
                        .text();
                    const address = $(target[i])
                        .find('div p span.fcc_ca_address')
                        .text();
                    // console.log(com, name);

                    writeStream.write(
                        `${com}, ${name}, ${web}, ${phone}, ${email}, ${address} \n`
                    );
                }
            })
            .catch((err) => {
                console.log(err);
                // console.log('getData request err');
            });
    });
};

makeUrl = () => {
    alphabet.forEach((a) => {
        const url = `https://calgarycommunities.com/communities/?letter=${a}`;
        // console.log(url);

        links.push(url);
    });
    // console.log(links);
    getData();
};

init = () => {
    makeUrl();
};

init();
