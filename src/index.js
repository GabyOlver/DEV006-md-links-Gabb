const colors = require('colors');
const fs = require('node:fs');
const {
  pathIsAbsolute,
  pathExists,
  mdFile,
  readFile,
  findLinks,
  statusLink
} = require('./modules.js');

// const route = process.argv[2]
// const options = {validate: process.argv[3]}

const mdLinks = (route, options = {validate: false}) => {
  return new Promise((resolve, reject) => {
    const resolvedPath = pathIsAbsolute(route);
    pathExists(resolvedPath).then((exists) => {
      const isMdFile = mdFile(resolvedPath);
      if (isMdFile) {
        readFile(resolvedPath).then((data) => {
          const foundLinks = findLinks(data, resolvedPath);
          if (options.validate) {
            const linksArray = foundLinks.map((link) => {
              const linkProperties = {
                href: link.href,
                text: link.text,
                file: link.file,
              }
              const linkStatus = statusLink(link.href)
                .then((status) => {
                  return {
                    ...linkProperties,
                    status: status.statusCode,
                    ok: status.message,
                  }
                })
              return linkStatus;
            });
            return Promise.all(linksArray);
          } else {
            const foundLinks = findLinks(data, resolvedPath);
            return foundLinks;
          }
        })
          .then((results) => {
            const resultsArray = results.flat();
            resolve(resultsArray.length === 0 ? [] : resultsArray)
          })
          .catch((err) => {
            reject(err)
          })
      } else {
        console.log('It is not a .md file')
      }
    })
  })
}

// mdLinks(route, options)
//   .then((result) => {
//     console.log(colors.magenta(result));
//   })
//   .catch((err) => {
//     console.log(err)
//   })

module.exports = { mdLinks }

