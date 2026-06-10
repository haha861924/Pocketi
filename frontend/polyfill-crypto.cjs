const crypto = require("crypto");
if (!global.crypto) {
  // Node 15+ has webcrypto under require('crypto').webcrypto
  // But in Node 16 it might be experimental or need flag?
  // actually in Node 16 webcrypto is available.
  global.crypto = crypto.webcrypto;
}
