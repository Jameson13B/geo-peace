const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

exports.checkAlias = functions.https.onCall((data, context) => {
  const ref = admin
    .firestore()
    .collection("users")
    .doc(data.slug);
  return ref
    .get()
    .then(doc => {
      return { unique: !doc.exists };
    })
    .catch(err => {
      throw new functions.https.HttpsError("failed to connect");
    });
});

exports.updateProfile = functions.https.onCall((data, context) => {
  const ref = admin
    .firestore()
    .collection("users")
    .where("user_id", "==", data.uid);
  return ref.get().then(snapshot => {
    snapshot.forEach(doc => {
      admin
        .firestore()
        .collection("users")
        .doc(doc.id)
        .update({
          bio: data.bio
        })
        .catch(err => {
          throw new functions.https.HttpsError("failed to update");
        });
    });
  });
});

exports.hasCoords = functions.https.onCall((data, context) => {
  // const ref = admin.firestore().collection('users').doc()
  const ref = admin
    .firestore()
    .collection("users")
    .where("user_id", "==", data.uid)
    .where("geolocation", "==", "null");
  return ref.get().then(snapshot => {
    snapshot.forEach(doc => {
      return { coords: !doc.exists };
    });
  });
});
