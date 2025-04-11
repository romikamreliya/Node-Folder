const { Buffer } = require("node:buffer");
const crypto = require("crypto");

class Token {
  constructor() {
    this.algorithm = process.env.algorithm;
    this.tokenKey = process.env.tokenKey;
    this.iv = Buffer.alloc(16, this.tokenKey, "base64");
    this.key = Buffer.alloc(32, this.tokenKey, "base64");
  }

  generateToken = (data, key) => {
    try {
      const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
      let encryptedData = cipher.update(JSON.stringify({ data, key }), "utf-8", "hex") + cipher.final("hex");
      return { res: true, token: encryptedData };
    } catch (error) {
        return { res: false, token: null };
    }
  };
  
  tokenDecode = (data, key) => {
    try {
      const decipher = crypto.createDecipheriv(
        this.algorithm,
        this.key,
        this.iv
      );
      let decrypted = JSON.parse(
        decipher.update(data, "hex", "utf-8") + decipher.final("utf8")
      );
      return {
        res: key.includes(decrypted.key) ? true : false,
        data: key.includes(decrypted.key) ? decrypted.data : null,
      };
    } catch (error) {
      return { res: false, data: null };
    }
  };

  passwordGenerator = (data, key) => {
    try {
      const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
      let encryptedData = cipher.update(JSON.stringify({ data, key }), "utf-8", "hex") + cipher.final("hex");
      return encryptedData;
    } catch (error) {
        throw Error(error.message)
    }
  }
}
module.exports = new Token();
