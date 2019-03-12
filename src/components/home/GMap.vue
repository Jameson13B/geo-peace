<template>
  <div class="map">
    <div class="google-map" id="map"></div>
  </div>
</template>

<script>
import firebase from "firebase";
import db from "@/firebase/init";

export default {
  name: "GMap",
  data() {
    return {
      lat: 40,
      lng: -111.5
    };
  },
  methods: {
    renderMap() {
      const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: this.lat, lng: this.lng },
        zoom: 10,
        maxZoom: 15,
        minZoom: 3,
        streetViewControl: false
      });
      // get all users geolocations
      db
        .collection("users")
        .get()
        .then(users => {
          users.docs.forEach(doc => {
            let data = doc.data();
            if (data.geolocation) {
              // create new radius for each
              let circle = new google.maps.Circle({
                strokeColor: "blue",
                strokeOpacity: 0.8,
                fillColor: "blue",
                fillOpacity: 0.35,
                center: {
                  lat: data.geolocation.lat,
                  lng: data.geolocation.lng
                },
                radius: 500,
                map
              });
              let infowindow = new google.maps.InfoWindow({
                content: "<h1>Uluru</h1>"
              });
              circle.addListener("mouseover", () => {
                console.log("hover");
                infowindow.open(map, circle);
              });
              // add click event to marker
              circle.addListener("click", () => {
                this.$router.push({
                  name: "ViewProfile",
                  params: { id: doc.id }
                });
              });
            }
          });
        });
    }
  },
  mounted() {
    // get current user
    let user = firebase.auth().currentUser;
    console.log(user);
    // check if users browser accepts location
    if (navigator.geolocation) {
      // Call cloud function to see if user has location already
      let hasCoords = firebase.functions().httpsCallable("hasCoords");
      hasCoords({ uid: user.uid })
        .then(result => {
          console.log(result);
        })
        .catch(err => {
          console.log(err);
        });
      navigator.geolocation.getCurrentPosition(
        pos => {
          // Update map coords
          this.lat = pos.coords.latitude;
          this.lng = pos.coords.longitude;
          // find user in db and update coords
          db
            .collection("users")
            .where("user_id", "==", user.uid)
            .get()
            .then(snapshot => {
              snapshot.forEach(doc => {
                db
                  .collection("users")
                  .doc(doc.id)
                  .update({
                    geolocation: {
                      lat: pos.coords.latitude,
                      lng: pos.coords.longitude
                    }
                  });
              });
            })
            .then(() => {
              this.renderMap();
            });
        },
        err => {
          console.log(err);
          this.renderMap();
        },
        { enableHighAccuracy: false, maximumAge: 10000, timeout: 10000 }
      );
    } else {
      // position centre by default values
      this.renderMap();
    }
  }
};
</script>

<style>
.google-map {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  background: #fff;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
}
</style>
