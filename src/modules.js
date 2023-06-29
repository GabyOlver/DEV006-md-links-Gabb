const path = require('node:path');
const fs = require('node:fs');
const https = require('node:https');
const colors = require('colors');

//Validating route
const pathIsAbsolute = (route) => {
    const absoluteRoute = path.isAbsolute(route);
    const resolveRoute = !absoluteRoute ? path.resolve(route) : route; 
    return resolveRoute;
}

//Does the route exist?
const pathExists = (route) => { 
    return new Promise((resolve, reject) => {
        fs.access(route, fs.constants.F_OK, (err) => { 
            err ? reject('Path does not exist') : resolve(true);
        })
    })
}

//Validate extension
const mdFile = (route) => {
    const fileExt = path.extname(route); 
    return fileExt !== '.md' ? (() => {
        console.log(colors.red('No .md files found'));
        return false; //process.exit(); 
    })() : true;
}

//Validate if it is a directory
//Find files in the directory

// Validates if the contents of the file can be read
const readFile = (route) => {
    return new Promise((resolve, reject) => {
        fs.readFile(route, (err, data) => {
            err ? reject('Cannot read file') : resolve(data.toString());
        })
    })
}

//Searching for links in the archive
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

//STATUS
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
                resolve({ statusCode: 404, message: 'fail' })
            }
        })
    })
}

module.exports = {
    pathIsAbsolute,
    pathExists,
    mdFile,
    readFile,
    findLinks,
    statusLink
};
