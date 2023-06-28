const path = require('node:path');
const https = require('https');

jest.mock('https');

const { mdLinks } = require('../src/index.js');
const { 
  pathIsAbsolute,
  pathExists,
  mdFile,
  readFile,
  findLinks,
  statusLink,
} = require('../src/modules.js')

//MDLINKS

describe('mdLinks', () => {

  it('should be a function.', () => {
    expect(typeof mdLinks).toBe('function')
});
it('Debe existir el archivo en la ruta indicada', () => {
  return expect(pathExists('./archivos/misProyectos.md')).toBeTruthy()
})
it('Debe devolver un array vacio si no hay links', () => {
  return mdLinks('./archivos/noHayLink.md')
  .then((result) => {
    expect(result).toEqual([])
  })
})
it('should return an empty array', () => {
  return mdLinks('./archivos/misProyectos.md')
    .then((result) => {
      expect(result).toEqual([
            {
             "file": "C:\\Users\\gabyo\\OneDrive\\Escritorio\\DEV006-md-links-Gabb\\archivos\\misProyectos.md",
             "href": "https://gabyolver.github.io/",
             "text": "Cifrado César por Gaby Olvera",
           },
            {
             "file": "C:\\Users\\gabyo\\OneDrive\\Escritorio\\DEV006-md-links-Gabb\\archivos\\misProyectos.md",
             "href": "https://gabyolver.github.io/",
             "text": "Cifrado César por Gaby Olvera",
           },
            {
             "file": "C:\\Users\\gabyo\\OneDrive\\Escritorio\\DEV006-md-links-Gabb\\archivos\\misProyectos.md",
             "href": "https://gabyolver.giub.io/DEV006-data-lovers/src/",
             "text": "Data Lovers Harry Potter por Gaby Olvera y Claudia Urias",
           },
            {
             "file": "C:\\Users\\gabyo\\OneDrive\\Escritorio\\DEV006-md-links-Gabb\\archivos\\misProyectos.md",
             "href": "https://encuentra-a-tu-mascota.netlify.app/",   
             "text": "Social Network Mascotas por Gaby Olvera",       
           },
         ]);
    })
});
it('should return links with status and ok properties when validate option is true', () => {
  const filePath = './archivos/misProyectos.md';
  const options = { validate: true };
  return mdLinks(filePath, options)
  .then((result) => {
    expect(Array.isArray(result)).toBe(true);
    result.forEach((link) => {
      expect(link).toHaveProperty('status');
      expect(link).toHaveProperty('ok');
    });
  })
})
it('should log the correct message when it is not a .md file', () => {
  mdLinks('archivos/muchoTexto.txt')
  .then((links) => {
    console.log('found Links:', links);
  })
  .catch((error) => {
    console.error('Error:', error);
  })
})
it('Debe regresar un error si la ruta no existe', () => {
  mdLinks('archivos/muchoText.md')
  .catch((err) => {
    console.error(`ERROR ${err}`);
  })
})
});

// MODULES.JS TESTS

describe('pathIsAbsolute', () => {
  const relativePath = './some/relative/path'
  const absolutePath = path.resolve(relativePath);
  it('Should returns an absolute path when given a relative path', () => {
    expect(pathIsAbsolute(relativePath)).toEqual(absolutePath); 
  });
  it('Should return the path unchanged if the given path is absolute', () => {
    expect(pathIsAbsolute(absolutePath)).toEqual(absolutePath);
  });
});

describe('pathExists', () => {
  it('Should resolve the promise if the route exists', () => {
    const pathThatExists = './archivos/misProyectos.md'
    return expect(pathExists(pathThatExists)).resolves.toBe(true);
  });
  it('Should reject the promise if the route does not exist', () => {
    const thisRouteNotExists = './this/route/does/not/exist.md'
    return expect(pathExists(thisRouteNotExists)).rejects.toEqual('Path does not exist');
  });
});

describe('mdFile', () => {
  it('Should return true if it is a file with .md extension.', () => {
    const pathMd = './archivos/misProyectos.md'
    expect(mdFile(pathMd)).toBe(true)
  });
  it('Should return false if it is not a file with .md', () => {
    const noMd = './is/not/md/file.txt';
    expect(mdFile(noMd)).toBe(false)
  });
});

describe('readFile', () => {
  it('Should resolve the promise if the file can be read', () => {
  const pathTest = './archivos/prueba.md'
  return expect(readFile(pathTest)).resolves.toEqual('Holis DEV006')
})
it('Should reject the promise if the file cannot be read', () => {
  const pathTest = './archivos\prueba.md'
    return expect(readFile(pathTest)).rejects.toEqual('Cannot read file')
  });
});

// it('Deberia retornar una promesa que se resuelve con un array de objetos', (done) => {
//   const result = mdLinks(route, optionTrue)
//    expect(result).resolves.toEqual([
//     {
//       "file": "C:\\Users\\gabyo\\OneDrive\\Escritorio\\DEV006-md-links-Gabb\\archivos\\misProyectos.md",
//       "href": "https://gabyolver.github.io/",
//       "ok": "ok",
//       "status": 200,
//       "text": "Cifrado César por Gaby Olvera",
//     },
//     {
//       "file": "C:\\Users\\gabyo\\OneDrive\\Escritorio\\DEV006-md-links-Gabb\\archivos\\misProyectos.md",
//       "href": "https://gabyolver.github.io/",
//       "ok": "ok",
//       "status": 200,
//       "text": "Cifrado César por Gaby Olvera",
//     },
//     {
//       "file": "C:\\Users\\gabyo\\OneDrive\\Escritorio\\DEV006-md-links-Gabb\\archivos\\misProyectos.md",
//       "href": "https://gabyolver.giub.io/DEV006-data-lovers/src/",
//       "ok": "fail",
//       "status": 404,
//       "text": "Data Lovers Harry Potter por Gaby Olvera y Claudia Urias",
//     },
//     ]).then(done)
// });
// it('Deberia retornar una promesa que se resuelve con un array de objetos sin validar', (done) => {
//   const result = mdLinks(route, optionFalse)
//    expect(result).resolves.toEqual([
//         {
//          "file": "C:\\Users\\gabyo\\OneDrive\\Escritorio\\DEV006-md-links-Gabb\\archivos\\misProyectos.md",
//          "href": "https://gabyolver.github.io/",
//          "text": "Cifrado César por Gaby Olvera",
//        },
//         {
//          "file": "C:\\Users\\gabyo\\OneDrive\\Escritorio\\DEV006-md-links-Gabb\\archivos\\misProyectos.md",
//          "href": "https://gabyolver.giub.io/DEV006-data-lovers/src/",
//          "text": "Data Lovers Harry Potter por Gaby Olvera y Claudia Urias",
//        },
//         {
//          "file": "C:\\Users\\gabyo\\OneDrive\\Escritorio\\DEV006-md-links-Gabb\\archivos\\misProyectos.md",
//          "href": "https://encuentra-a-tu-mascota.netlify.app/",
//          "text": "Social Network Mascotas por Gaby Olvera",
//        },
//     ]).then(done)
// });