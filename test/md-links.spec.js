const mdLinks = require('../index.js');


describe('mdLinks', () => {

  it('should be a function.', () => {
    expect(typeof mdLinks).toBe('function')
})
it('Should return an error when the path does not exist', () => {
  const testPath ='./some/path';
  return expect(mdLinks(testPath)).rejects.toEqual(`Path does not exist`)
})
});
