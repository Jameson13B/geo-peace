<template>
  <div class="navbar">
    <nav class="deep-purple darken-1">
      <div class="container">
        <router-link :to="{ name: 'GMap' }" class="left logo">GeoPeace!</router-link>
        <ul class="right">
          <li v-if="!user"><router-link :to="{ name: 'Signup' }">Signup</router-link></li>
          <li v-if="!user"><router-link :to="{ name: 'Login' }">Login</router-link></li>
          <li v-if="user"><a @click="bioModal" class="email">{{ user.email }}</a></li>
          <li v-if="user"><a @click="logout" class="logout">Logout</a></li>
        </ul>
      </div>
    </nav>
    
  </div>
</template>

<script>
import firebase from "firebase";
import db from "@/firebase/init";
import functions from "firebase/functions";

export default {
  name: "Navbar",
  data() {
    return {
      user: null,
      bio: null,
      seeBio: false,
      feedback: null
    };
  },
  methods: {
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.push({ name: "Login" });
        });
    },
    bioModal() {
      this.seeBio = !this.seeBio;
    }
  },
  created() {
    // set listern to check if user is logged in or not
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.user = user;
      } else {
        this.user = null;
      }
    });
  }
};
</script>

<style>
.navbar .logo {
  font-size: 2em;
}
@media (max-width: 600px) {
  .navbar .email {
    font-size: 0.75em;
  }
  .navbar .logout {
    font-size: 0.75em;
  }
  .navbar .logo {
    font-size: 1.25em;
  }
}
@media (max-width: 374px) {
  .navbar .email {
    font-size: 0.65em;
  }
  .navbar .logout {
    font-size: 0.65em;
  }
  .navbar .logo {
    font-size: 0.9em;
  }
}
</style>
