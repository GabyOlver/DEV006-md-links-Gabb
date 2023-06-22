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
            err ? reject(`Path does not exist`) : resolve(true);
        })
    })
}

//Valida si es un archivo .md
const mdFile = (route) => {
    const fileExt = path.extname(route); //Saber cual es la extension del archivo
    return fileExt !== '.md' ? (() => {
        console.log('No .md files found');
        process.exit(); // return false;?
    })() : true;
}

//Validar si es un directorio
//Buscar archivos en el directorio

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

const rutaRelativa = 'archivos/misProyectos.md';

const mdLinks = (route, options = { validate: false }) => {
    return new Promise((resolve, reject) => {
        const resolverRuta = pathIsAbsolute(route);
        pathExists(resolverRuta).then((exists) => {
            const isMdFile = mdFile(resolverRuta);
            if (isMdFile) {
                readFile(resolverRuta)
                    .then((data) => {
                        if (options.validate) {
                            const enlacesEncontrados = findLinks(data, resolverRuta);
                            const newArr = enlacesEncontrados.map((enlace) => {
                                const link = {
                                    href: enlace.href,
                                    text: enlace.text,
                                    file: enlace.file,
                                }
                                const props = statusLink(enlace.href)
                                    .then((code) => {
                                        return {
                                            ...link,
                                            status: code.statusCode,
                                            ok: code.message,
                                        };
                                    })
                                    .catch((err) => {
                                        return {
                                            ...link,
                                            status: err.statusCode,
                                            ok: err.message,

                                        };
                                    });
                                return props
                            });
                            return Promise.all(newArr)
                        } else {
                            const enlacesEncontrados = findLinks(data, resolverRuta);
                            const urlsArray = enlacesEncontrados.map((enlace) => {
                                return {
                                    href: enlace.href,
                                }
                            })
                            return Promise.all(urlsArray);
                        }
                    })

                    .then((results) => {
                        const resultsArray = results.flat();
                        resolve(resultsArray.length === 0 ? [] : resultsArray)
                    })
                    .catch((error) => {
                        reject(error);
                    })
            } else {
                console.log('No es .md terminamos')
            }
        })
        .catch((err) => {
            console.log(err)
        })
    })
}

// mdLinks(rutaRelativa, options = { validate: false})
//     .then((result) => {
//         console.log(result);
//     })
//     .catch((err) => {
//         console.log('Error:', err)
//     });


module.exports = {
    pathIsAbsolute,
    pathExists,
    mdFile,
    readFile,
    findLinks,
    statusLink
};
