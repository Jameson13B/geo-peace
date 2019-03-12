<template>
  <div class="edit-profile container">
    <div class="card">
      <h2 class="deep-purple-text center">Edit {{ profile.alias }} Profile</h2>
      <form @submit.prevent="editBio" class="form">
        <label for="bio">Enter your bio: (shift+enter to save)</label>
        <textarea type="text" name="bio" v-model="bio" @keypress.enter.shift.prevent="editBio"/>
        <p class="red-text" v-if="feedback">{{ feedback }}</p>
      </form>
      <button class="btn-large deep-purple" @click.prevent="updateLocation"><i class="material-icons left">location_on</i>Update Location</button>
    </div>
  </div>
</template>

<script>
import db from "@/firebase/init";

export default {
  name: "EditProfile",
  data() {
    return {
      profile: null,
      feedback: null
    };
  },
  created() {
    let ref = db.collection("users");
    // get profile user data
    ref
      .doc(this.$route.params.id)
      .get()
      .then(user => {
        this.profile = user.data();
      });
  },
  methods: {
    updateLocation() {
      console.log("Update location");
    },
    editBio() {
      if (this.bio) {
        let bio = this.bio;
        // find user in db and update bio
        let updateProfile = firebase.functions().httpsCallable("updateProfile");
        updateProfile({ uid: this.user.uid, bio: this.bio })
          .then(() => {
            console.log("Bio updated");
            this.feedback = null;
          })
          .catch(err => {
            this.feedback = err;
          });
        this.bio = null;
        this.seeBio = false;
      } else {
        this.feedback = "Enter a bio to save.";
      }
    }
  }
};
</script>

<style>
.edit-profile .card {
  padding: 20px;
  margin-top: 60px;
}
.edit-profile h2 {
  font-size: 2em;
  margin-top: 0;
}
.edit-profile form {
  margin: 0 auto;
  max-width: 400px;
}
.edit-profile textarea {
  resize: none;
  height: 7em;
}
.edit-profile button {
  display: block;
  margin: 0 auto;
  margin-top: 15px;
}
</style>
