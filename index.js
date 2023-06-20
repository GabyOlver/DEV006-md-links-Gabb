const fs = require('node:fs');
const {
  pathIsAbsolute,
  pathExists,
  mdFile,
  readFile,
  findLinks,
  statusLink
} = require('./modules.js');

const mdLinks = (route, options = { validate: true}) => {
  return new Promie((resolve, reject) => {
    const resolvedPath = pathIsAbsolute(route);
    pathExists(resolvedPath).then((exists) => {
      const isMdFile = mdFile(resolvedPath);
      if(isMdFile) {
        readFile(resolvedPath).then((data) => {
          const linksInFile = findLinks(data, resolvedPath);
          for( const linkInFile of linksInFile) {
            statusLink(enlace.href).then((statusCode) => {
              console.log(statusCode);
            })
            .catch((error) => {
              console.log('Error:', error);
            })
          }
        })
        .catch((error) => {
          console.log('Error:', error);
      })
      } 
    })
  })
}

module.exports = {
  mdLinks
};
