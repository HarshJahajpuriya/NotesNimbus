class Error {
  source = "";
  message = "";
  constructor(src, msg) {
    this.source = src;
    this.message = msg;
  }
}

module.exports = Error;