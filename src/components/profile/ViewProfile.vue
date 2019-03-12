<template>
  <div class="view-profile container">
    <div v-if="profile" class="card">
      <h2 class="deep-purple-text center">{{ profile.alias }}'s Wall</h2>
      <div class="center">
        <!-- <p>{{ profile.bio }}</p> -->
        <p class="sub"><i class="material-icons">arrow_downward</i>
        Realtime comment board
        <i class="material-icons">arrow_downward</i></p>
      </div>
      <ul class="comments collection">
        <li v-for="(comment, index) in comments" :key="index">
          <span class="deep-purple-text">{{ comment.from }}</span>
          <span class="grey-text text-darken-2">{{ comment.content }}</span>
          <div class="grey-text time">{{ comment.time }}</div>
        </li>
      </ul>
      <form @submit.prevent="addComment">
        <div class="field">
          <label for="comment">Add a comment</label>
          <input type="text" name="comment" v-model="newComment" />
          <p v-if="feedback" class="red-text center">{{ feedback }}</p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import db from "@/firebase/init";
import firebase from "firebase";
import moment from "moment";

export default {
  name: "ViewProfile",
  data() {
    return {
      profile: null,
      newComment: null,
      feedback: null,
      user: null,
      comments: []
    };
  },
  created() {
    let ref = db.collection("users");
    // get current user
    ref
      .where("user_id", "==", firebase.auth().currentUser.uid)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          (this.user = doc.data()), (this.user.id = doc.id);
        });
      });
    // get profile user data
    ref
      .doc(this.$route.params.id)
      .get()
      .then(user => {
        this.profile = user.data();
      });
    // get profile comments
    db
      .collection("comments")
      .where("to", "==", this.$route.params.id)
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type === "added") {
            this.comments.unshift({
              from: change.doc.data().from,
              content: change.doc.data().content,
              time: moment(change.doc.data().time).format("lll")
            });
          }
        });
      });
  },
  methods: {
    addComment() {
      if (this.newComment) {
        db
          .collection("comments")
          .add({
            to: this.$route.params.id,
            from: this.user.alias,
            content: this.newComment,
            time: Date.now()
          })
          .then(() => {
            this.newComment = null;
          });
        this.feedback = null;
      } else {
        this.feedback = "You must enter a comment to add it";
      }
    }
  }
};
</script>

<style>
.view-profile .card {
  padding: 20px;
  margin-top: 60px;
}
.view-profile h2 {
  font-size: 2em;
  margin-top: 0;
}
.view-profile li {
  padding: 10px;
  border-bottom: 1px solid #eee;
}
.view-profile .time {
  font-size: 0.8em;
}
.view-profile .sub {
  color: #bbb;
  font-style: italic;
}
.view-profile i {
  font-size: 1em;
}
</style>
