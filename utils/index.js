class Sekai {
  constructor() {
    this.name = 'Sekai';
  }

  greet() {
    console.log(`Hello, ${this.name}`);
  }

  register() {
    console.log('register');
    return {
      c: 500,
      m: "Not implemented",
    }
  }

}


module.exports = Sekai;