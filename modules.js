const path = require('node:path');
const fs = require('node:fs');
const https = require('node:https');

//Valida si la ruta es absoluta, sino la convierte a absoluta
const pathIsAbsolute = (route) => { //Se recibe la ruta
    const absoluteRoute = path.isAbsolute(route); //Validamos si es absoluta o relativa
    const resolveRoute = !absoluteRoute ? path.resolve(route) : route; // Si la ruta no es absoluta se covierte a absoluta, si si es se entrega
    return resolveRoute;
}

//Valida si la ruta existe
const pathExists = (route) => { //Se va a validar si la ruta existe
    return new Promise((resolve, reject) => {
        fs.access(route, fs.constants.F_OK, (err) => { //fs.access verifica si se puede acceder a un archivo: path es la ruta a validar, fs.constants.F_OK Comprueba si el archivo o directorio existe. Y error  se ejecuta una vez que se completa la verificación. La función de devolución de llamada toma un parámetro de error, donde null indica que no se encontraron errores y, por lo tanto, se puede acceder al archivo o directorio.
            err ? reject(`Path ${route} does not exist`) : resolve(true);
        })
    })
}

//Valida si es un archivo .md
const mdFile = (route) => {
    //Función para saber si es un fichero markdown
    const fileExt = path.extname(route); //Saber cual es la extension del archivo
    const isMdFile = fileExt === '.md' ? true : false; // si es .md es true sino es false
    return isMdFile;
}

// Valida si se puede leer el contenido del archivo
const readFile = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            err ? reject(`Cannot read file ${filePath}`) : resolve(data.toString());
        })
    })
}

//Buscando Links en el archivo
const findLinks = (content, filePath) => {
    const linksInFile = [];
    const linksRegExp = /\[([\p{L}0-9._ -]+)\]\((?!#)(https?:\/\/[a-zA-Z0-9\/._ -]+)\)/gu

    let match;
    while ((match = linksRegExp.exec(content)) !== null) {
        const linkText = match[1];
        const linkUrl = match[2];
        const link = { href: linkUrl, text: linkText, file: filePath };
        linksInFile.push(link);
    }
    return linksInFile;
}

//STATUS DEL LINK
const statusLink = (url) => {
    return new Promise((resolve, reject) => {
        const req = https.get(url, (res) => {
            const statusCode = res.statusCode;
            let message;
            res.statusCode >= 400 ? message = 'fail' : message = 'ok';
            resolve({ statusCode, message });
        });
        req.on('close', () => {
            resolve({ message: 'connection_closed' });
        });
        req.on('error', (err) => {
            if (err.code === "ENOTFOUND") {
                reject({ statusCode: 404, message: 'fail' })
            }
        })
    })
}


//PRUEBAS DE FUNCIONES PARA RUTAS

// const rutaRelativa = 'archivos/misProyectos.md';
// const rutaAbsoluta = pathIsAbsolute(rutaRelativa);
// console.log('Route:', rutaAbsoluta);

// pathExists(rutaAbsoluta)
//     .then((exists) => {
//         console.log('The route exists?:', exists);
//     })
//     .catch((error) => {
//         console.error('Error:', error);
//     });

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
    pathIsAbsolute,
    pathExists,
    mdFile,
    readFile,
    findLinks,
    statusLink
};