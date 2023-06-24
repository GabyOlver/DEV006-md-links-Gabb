#!/usr/bin/env node

const colors = require('colors');
// const colors = require('colors/safe');
const { mdLinks } = require('./src/index.js');
const { simpleStats, statsValidate } = require('./src/stats.js')

const route = process.argv[2]
// const options = {validate: process.argv[3]}
const [, , ...args] = process.argv;
const validateOption = args.includes('--validate');
const statsOption = args.includes('--stats');

if(!validateOption && !statsOption) {
  mdLinks(route, {validate: false})
  .then((links) => {
    if(links.length === 0) {
      console.log(`No links found`.magenta)
    } else {
      console.log(links)
    }
  })
  .catch((err) => {
    console.log(colors.red(err))
  });
} else if (validateOption && !statsOption) {
  mdLinks(route, { validate: true })
  .then((links) => {
    if(links.length === 0) {
      console.log(`No links found`.magenta)
    } else {
      console.log(links)
    }
  })
  .catch((err) => {
    console.log(colors.red(err))
  });
} else if (statsOption && !validateOption) {
  mdLinks(route, { validate: false })
    .then((links) => {
      console.log(colors.blue(simpleStats(links)));
    })
    .catch((err) => {
      console.log(colors.red(err));
    });
} else if (validateOption && statsOption) {
  mdLinks(route, { validate: true })
    .then((links) => {
      console.log(colors.blue(statsValidate(links)));
      console.log(links);
    })
    .catch((err) => {
      console.log(colors.red(err));
    });
} else {
  console.log('Enter a valid option');
}


// node cli.js archivos/misProyectos.md true