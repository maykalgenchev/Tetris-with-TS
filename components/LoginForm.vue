<template>
  <div>
    <div>
      <p>Username</p>
      <input class="input" type="text" v-model="username" placeholder="Insert Username" />
    </div>

    <div>
      <p>Password</p>
      <input class="input" type="password" v-model="password" placeholder="Insert Password" />
    </div>

    <button :disabled="username.length < 1 || password.length < 1" @click="clickHandler">Login</button>
  </div>
</template>

<script lang="ts">
import { mapState, mapActions } from 'vuex'
export default {
    computed: {
    ...mapState([
      'showTetris'
    ])},
  name: 'LoginForm',
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
      ...mapActions([
      'showTetrisAction'
    ]),
    clickHandler() {
      this.showTetrisAction()
    }
  }
}
</script>
