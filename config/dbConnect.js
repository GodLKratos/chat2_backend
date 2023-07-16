const admin = require("firebase-admin");
const { initializeApp } = require("firebase/app");


var serviceAccount = require("../serviceKey.json");
var key  = process.env.CONFIG;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseApp = initializeApp(serviceAccount);
const db = admin.firestore();
const Auth = db.collection("Auths");
const Users = db.collection("Users");

// Get a reference to the storage service, which is used to create references in your storage bucket
module.exports ={firebaseApp,Auth,Users};
