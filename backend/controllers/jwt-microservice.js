const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const publicKeyPath = path.join(__dirname, "./../keys/public.pem");
const privateKeyPath = path.join(__dirname, "./../keys/private.pem");

// key imports
const publicKEY = fs.readFileSync(publicKeyPath, "utf-8");
const privateKEY = fs.readFileSync(privateKeyPath, "utf-8");

// options
const jENV = require("./../config/tokenOptions");


const logger = require("./../config/logger")

async function extractor(headerfile) {
  return new Promise(async (resolve, reject) => {
    if (headerfile !== undefined) {
      const stringer = headerfile;
      if (stringer.startsWith("Bearer ")) {
        var token = stringer.substring(8, stringer.length);
        resolve(token);
      } else {
        resolve(false);
      }
    } else {
      resolve(false);
    }
  });
}

async function verifier(token) {
  return new Promise(async (resolve, reject) => {
    jwt.verify(token, publicKEY, jENV.verifyOptions, function (
      err,
      decodedToken
    ) {
      if (err) {
        logger.error(err);
        resolve(false);
      } else {
        logger.info(decodedToken);
        resolve(decodedToken);
      }
    });
  });
}

module.exports = {
  verification: async function (token) {
    return new Promise(async (resolve, reject) => {
      jwt.verify(token, publicKEY, jENV.verifyOptions, function (
        err,
        decodedToken
      ) {
        if (err) {
          logger.error(err)
          resolve(false);
        } else {
          resolve(decodedToken);
        }
      });
    });
  },

  signing: function (username, role, name, grade, section) {
    return jwt.sign(
      {
        username: username,
        role: role,
        name: name,
        grade: grade,
        section: section,
      },
      privateKEY,
      jENV.signOptions
    );
  },

  extract: (headerfile) => {
    return new Promise(async (resolve, reject) => {
      const stringer = headerfile;
      if (stringer.startsWith("Bearer ")) {
        logger.debug(stringer);
        var token = stringer.substring(8);
        resolve(token);
      } else {
        resolve(false);
      }
    });
  },

  total_verification: (headerfile) => {
    return new Promise(async (resolve, reject) => {
      // first, we will send the authorization token to the extraction function
      const extracted_token = await extractor(headerfile);
      if (extracted_token !== false) {
        // then we send it to the verification option
        const decodedToken = await verifier(extracted_token);
        if (decodedToken !== false) {
          resolve(decodedToken);
        } else {
          logger.info ("Extraction OK, but decoding failed");
          resolve(false);
        }
      } else {
        logger.info("extraction failed");
        resolve(false);
      }
    });
  },
};
