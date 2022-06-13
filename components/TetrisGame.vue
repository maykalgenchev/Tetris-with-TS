<template>
  <div role="button" class="parentDiv" tabindex="0" @keydown="move">
    <gameover-window v-show="gameOver || !playing" />
    <!-- <tetris-stage :stage="updateStage"/> -->
       <div class="temp" v-for="(row, index) in updateStage" :key="index">
        <tetris-cell  v-for="(cell, x) in row" :key="x" :type="cell[0]" :test="cell[1]"/>
      </div>
      <div>
        <h3 class="title">Score</h3>
        <tetris-display :text="Number(rowsCleared) * 100" />
        <tetris-buttons />
      </div>
      <div class="miniStagePos">
        <div class="miniStage" v-for="(row, index) in updateMiniStage" :key="index">
          <tetris-cell  v-for="(cell, x) in row" :key="x" :type="cell[0]"/>
        </div>
      </div>
  </div>
</template>

<script lang="ts">
import TetrisStage from './TetrisStage.vue'
import TetrisDisplay from './TetrisDisplay.vue'
import TetrisButtons from './TetrisButtons.vue'
import TetrisCell from './TetrisCell.vue'
import GameoverWindow from './GameoverWindow.vue'
import { mapActions, mapState, mapGetters } from 'vuex'
import { checkCollision } from '../gameHelpers'
import Vue from 'vue'



export default Vue.extend({
  name: 'TetrisGame',
  computed: {
    ...mapState([
      'player',
      'stage',
      'gameOver',
      'rowsCleared',
      'playing',
      'miniStage'
    ]),
    ...mapGetters([
        'updateStage',
        'updateMiniStage'
    ]),
  },
  methods: {
    ...mapActions([
      'resetPlayer',
      'updatePos',
      'playerRotate',
      'xIncrement',
      'yIncrement',
      'resetValues',
      'setStageWhenMerged',
      'gameIsOverTrue',
      'isPlayingFalse'
    ]),
    movePlayer(dir: number) : void {
      if (this.playing) {
        if (!checkCollision(this.player, this.stage, dir, 0)) {
          this.xIncrement( dir )
          this.updatePos({collided: this.player.collided, stage: this.stage})
          this.resetValues()
        }
      }
    },
    drop () {
      if (this.playing) {
        if (!checkCollision(this.player, this.stage, 0, 1 )) {
          this.yIncrement()
          this.updatePos({collided: this.player.collided, stage: this.stage})
          this.resetValues()
        } else {
          if (this.player.pos.y < 1) {
            this.gameIsOverTrue()
            this.isPlayingFalse()
          } else{
            this.updatePos({collided: true, stage: this.stage})
            this.setStageWhenMerged()
            }
          }
        }
    },
    move ({ keyCode }: {keyCode: number}) {
      if (!this.gameOver) {
        if (keyCode === 37) {
          this.movePlayer(-1)
        } else if (keyCode === 39) {
          this.movePlayer(1)
        } else if (keyCode === 40) {
          this.drop()
        } else if (keyCode === 38 && this.playing) {
          this.playerRotate({ dir: 1})
        }
      }
    }
    
  },
  components: {
    TetrisStage,
    TetrisDisplay,
    TetrisButtons,
    TetrisCell,
    GameoverWindow
  }
})
</script>

<style>
    .temp{
        display: flex;
        flex-wrap: wrap;
        width: 400px;
        max-height: 600px;
        background-color: black;
    }
    .parentDiv{
      position: relative;

    }
    .title{
       box-sizing: border-box;
       display: flex;
       align-items: center;
       margin: 0 0 20px 0;
       padding: 20px;
       border: 4px solid #333;
       min-height: 30px;
       width: 20%;
       border-radius: 20px;
    }
    .miniStagePos{
        position:absolute;left:500px;top:0;width:200px;height:200px;
        width: 200px;
        max-height: 600px;
        background-color: black;
    }
    .miniStage{
        display: flex;
        flex-wrap: wrap;
    }
</style>
