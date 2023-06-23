#!/usr/bin/env node
// // argumentos de linea de comandos
const colors = require('colors');
const { mdLinks } = require('./src/index.js');

const route = process.argv[2]
const options = {validate: process.argv[3]}

mdLinks(route, options)
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log(err)
  })

// mdLinks('/no/existe').then(() => {})
// .catch((error) => {
//     console.log(error)
// })