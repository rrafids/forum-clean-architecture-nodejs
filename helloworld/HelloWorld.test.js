const printHelloWorld = require('./HelloWorld');

describe('printHelloWorld function', () => {
  it('should print Hello World!', async () => {
    // Arrange
    const string = printHelloWorld();

    // Assert
    expect(string).toEqual('Hello World');
  });
});
