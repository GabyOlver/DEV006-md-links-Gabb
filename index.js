const fs = require('node:fs');
const {
  pathIsAbsolute,
  pathExists,
  mdFile,
  readFile,
  findLinks,
  statusLink
} = require('./modules.js');

const mdLinks = (route, options = { validate: false }) => {
  return new Promise((resolve, reject) => {
    const resolvedPath = pathIsAbsolute(route);
    pathExists(resolvedPath).then((exists) => {
      const isMdFile = mdFile(resolvedPath);
      if (isMdFile) {
        readFile(resolvedPath).then((data) => {
          if (options.validate) {
            const foundLinks = findLinks(data, resolvedPath);
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
                .catch((err) => {
                  return {
                    ...linkProperties,
                    status: err.statusCode,
                    ok: err.message,
                  };
                });
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
            reject(err.code)
          })
          .catch((err) => {
            console.log(err)
          })
      } else {
        console.log('It is not a .md file')
      }
    })
      .catch((err) => {
        console.log('\x1b[31m%s\x1b[0m', err)
      })
  })
}

const relativeRoute = 'archivos\muchoTexto.txt'

mdLinks(relativeRoute, options = {validate: false})
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = {
  mdLinks
};
