// // argumentos de linea de comandos
// //requerir mdLinks
const { mdLinks } = require('./index.js');

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