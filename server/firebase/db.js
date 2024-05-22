const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
const { firebaseConfig } = require("./db_config.js");

const dbApp = initializeApp(firebaseConfig);
const db = getFirestore(dbApp);

module.exports = db;