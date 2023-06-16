const fs = require('node:fs');
const { 
  pathIsAbsolute,
  pathExists,
  mdFile,
  readFile,
  findLinks,
  statusLink
} = require('./modules.js');


const mdLinks = (route, options) => {
  return new Promise((resolve, reject) => { // resolve y reject son callbacks, funciones que pasamos como parametro a .then y .catch
    const isAbsolute = pathIsAbsolute(route);

    pathExists(isAbsolute)
      .then((exists) => {
        console.log('The route exists?:', exists);
      })
      .catch((error) => {
        console.log('Error:', error)
      });

  });
}

// pathExists(rutaAbsoluta)
//     .then((exists) => {
//         console.log('The route exists?:', exists);
//     })


// console.log('Is a .md file?:', mdFile(rutaAbsoluta));

// readFile(rutaAbsoluta)
//     .then((data) => {
//         const enlacesEncontrados = findLinks(data, rutaAbsoluta);
//         console.log('Links encontrados', enlacesEncontrados);
//         for (const enlace of enlacesEncontrados) {
//             statusLink(enlace.href)
//                 .then((statusCode) => {
//                     console.log('Status:', statusCode);
//                 })
//                 .catch((error) => {
//                     console.log('Error:', error);
//                 })
//         }
//     })
//     .catch((error) => {
//         console.log('Error:', error)
//     });




module.exports = {
  mdLinks
};
