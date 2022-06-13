<template>
  <div>
      <div>
          <button class="btns" @click="clickHandler">Pause</button>
      </div>
  </div>
</template>

<script lang="ts">
import { mapActions, mapState, mapGetters } from 'vuex'

export default {
  name: 'tetrisCell',
  methods: {
    ...mapActions([
      'isPlayingFalse',
      'gameIsOverFalse'
    ]),
    clickHandler() {
      this.isPlayingFalse()
      this.gameIsOverFalse()
    }
  }
}
</script>

<style>
  .btns{
       display: flex;
       margin: 0 0 20px 0;
       padding: 20px;
       min-height: 30px;
       width: 20%;
       border-radius: 20px;
       border: none;
       color: white;
       background: #333;
       font-size: 1rem;
       text-align: center;
  }
</style>
