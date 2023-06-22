const path = require('node:path');
// const fs = require('node:fs');
const mdLinks = require('../index.js');
const { 
  pathIsAbsolute,
  pathExists,
  mdFile,
  readFile,
} = require('../modules.js')


describe('mdLinks', () => {

  it('should be a function.', () => {
    expect(typeof mdLinks).toBe('function')
})
// it('Should return an error when the path does not exist', () => {
//   const testPath ='./some/path';
//   return expect(mdLinks(testPath)).rejects.toEqual('Path does not exist')
// })
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
  })
});

describe('readFile', () => {
  it('Should resolve the promise if the file can be read', () => {
  const pathTest = './archivos/prueba.md'
  return expect(readFile(pathTest)).resolves.toEqual('Holis DEV006')
  })
  it('Should reject the promise if the file cannot be read', () => {
    const pathTest = './archivos\prueba.md'
    return expect(readFile(pathTest)).rejects.toEqual('Cannot read file')
  })
})
