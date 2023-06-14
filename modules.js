const path = require('node:path');
const fs = require('node:fs');

      //Validar si la ruta es absoluta
      //Si la ruta no es absoluta convertirla a absoluta
      //Ver si es un archivo o un directorio
      //Si es un directorio se abre y se recorre que hay dentro. hay archivos .md?

const pathIsAbsolute = (route) => { //Se recibe la ruta
    const absoluteRoute = path.isAbsolute(route); //Validamos si es absoluta o relativa
    const convertRoute = !absoluteRoute ? path.resolve(route) : route;
    return convertRoute;
}

const rutaRelativa = 'ruta/relativa/archivo.txt';
const rutaAbsoluta = pathIsAbsolute(rutaRelativa);
console.log('Ruta:', rutaAbsoluta);


module.exports = { pathIsAbsolute };