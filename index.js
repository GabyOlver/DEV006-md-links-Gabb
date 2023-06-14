const fs = require('node:fs');
const { pathIsAbsolute } = require('./modules.js');

const mdLinks = (route, options) => {
  return new Promise((resolve, reject) => { // resolve y reject son callbacks, funciones que pasamos como parametro a .then y .catch
    // Identificar si la ruta existe
    if (fs.existsSync(route)) {
    }else {
      //Si no existe la ruta rechazamos la promesa
      reject({ 
        error: true,
        message: 'La ruta no es valida' 
      });
    }
  });
}

mdLinks('/no/existe').then(() => {})
.catch((error) => {
    console.error(error.message);
})

module.exports = {
  mdLinks
};
