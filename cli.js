#!/usr/bin/env node

const colors = require('colors');
const figlet = require("figlet");
// const colors = require('colors/safe');
const { mdLinks } = require('./src/index.js');
const { simpleStats, statsValidate } = require('./src/stats.js')

const route = process.argv[2]
const [, , ...args] = process.argv;
const validateOption = args.includes('--validate');
const statsOption = args.includes('--stats');

const howToUse = 'Use: mdLinks + filepath + [--validate] and/or [--stats]';
const commands = '--validate: validates the status of found links\n --stats: Gives link statistics'
const description = 'It is a CLI tool that can find and extract links from an .md file. It allows to validate the status of each link and gives us statistics of the links found.'

if(!route) {
  figlet('Md-Links', (err, result) => {
    console.log(err || result)
    console.log(colors.blue(howToUse))
    console.log(colors.magenta(commands))
    console.log(colors.yellow(description))
  })
} else {
if (validateOption && statsOption) {
  mdLinks(route, { validate: true })
    .then((links) => {
      console.log(colors.blue(statsValidate(links)));
      console.log(links);
    })
    .catch((err) => {
      console.log(colors.red(err));
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
} else if(!validateOption && !statsOption) {
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
} else {
  console.log('Invalid command, enter --validate and/or --stats'.red.bold);
}
}

// node cli.js archivos/misProyectos.md true