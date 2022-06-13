import { randomTetromino } from '../tetrominos'
import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { checkCollision, createStage, createMiniStage, deepCopyFunction, rotate } from '../gameHelpers'

 export const state = () => ({
    stage: createStage() as (string | number)[][][],
    miniStage: createMiniStage() as (string | number)[][][],
    nextTetro: randomTetromino() as (string | number)[][],
    player: {
      pos: { x: 4, y: 0 } as {x: number, y: number},
      tetromino: randomTetromino() as (string | number)[][],
      collided: false as boolean
    },
    gameOver: false as boolean,
    playing: true as boolean,
    rowsCleared: 0 as number,
    x: 0 as number,
    y: 0 as number,
    showTetris: false as boolean
  })
  
  export type RootState = ReturnType<typeof state>

  export const getters: GetterTree<RootState, RootState> = {
    updateStage: (state: RootState) => {
        let newStage = state.stage.map(row =>
          row.map(cell => (cell[1] === 'clear' ? [cell[0], 'clear'] : cell))
        )

        state.player.tetromino.forEach((row, y) => {
          row.forEach((type, x) => {
            if (type !== 0) {
              newStage[y + state.player.pos.y][x + state.player.pos.x] = [
                type,
                `${state.player.collided ? 'merged' : 'clear'}`
              ]

            }
          })
        })

        return newStage
      },
      updateMiniStage: (state: RootState) => {
        const newStage = state.miniStage.map(row =>
          row.map(cell => (cell[1] === 'clear' ? [0, 'clear'] : cell))
        )
        state.nextTetro.forEach((row, y) => {
          row.forEach((type, x) => {
            if (type !== 0) {
              newStage[y + 1][x + 1] = [
                type,
                `${state.player.collided ? 'merged' : 'clear'}`
              ]
            }
          })
        })
        return newStage
      }
  }

  export const mutations: MutationTree<RootState> = {
    SHOW_TETRIS(state: RootState){
      state.showTetris = true
    },
    RESET_PLAYER (state: RootState) {
      state.player = {
        pos: { x: 4, y: 0 },
        tetromino: state.nextTetro,
        collided: false
      }
      state.nextTetro = randomTetromino()
    },
    RESET_GAME (state: RootState) {
        state.gameOver = false
        state.rowsCleared = 0
        state.stage = createStage()
      },
      MAKE_COLLIDED (state: RootState) {
        state.player.collided = true
      },
      UPDATE_POS (state: RootState, {collided, stage}) {
        if(!collided){
          state.player = {
            pos: { x: state.player.pos.x += state.x, y: state.player.pos.y += state.y },
            tetromino: state.player.tetromino,
            collided
          }
       } else{
        state.player = {
          pos: { x: state.player.pos.x, y: state.player.pos.y },
          tetromino: state.player.tetromino,
          collided
        }
       }
      },
      RESET_VALUES (state: RootState){
        state.x = 0
        state.y = 0
      },
      X_INCREMENT (state: RootState, dir:number){
        state.x = dir
      },
      Y_INCREMENT (state: RootState){
        state.y = 1
      },
      ROWS_INCREMENT (state: RootState){
        state.rowsCleared += 1
      },
      PLAYER_ROTATE(state: RootState, clonedPlayer: RootState["player"]){
        state.player = {...clonedPlayer}
      },
      SET_STAGE(state: RootState, newStage: RootState["stage"]){
        state.stage = newStage
      },
      GAME_OVER_FALSE (state: RootState){
        state.gameOver = false
      },      
      GAME_OVER_TRUE (state: RootState){
        state.gameOver = true
      },
      IS_PLAYING_TRUE (state: RootState){
        state.playing = true
      },
      IS_PLAYING_FALSE (state: RootState){
        state.playing = false
      },
      NEW_STAGE_SPLICE(state: RootState, {newStage, indexForSweep}){
        newStage.splice(indexForSweep, 1)
        return newStage
      },
      NEW_STAGE_UNSHIFT(state: RootState, newStage){
        newStage.unshift(new Array(newStage[0].length).fill([0, 'clear']))
        return newStage
      }

  }

export const actions: ActionTree<RootState, RootState> = {
  showTetrisAction ({ commit }: {commit: any}, state: RootState) {
    commit('SHOW_TETRIS', state)
  },
    updateStage ({ commit }: {commit: any}, state: RootState) {
      commit('updateStage', state)
    },
    gameIsOverTrue ({ commit }: {commit: any}, state: RootState) {
      commit('GAME_OVER_TRUE', state)
    },
    gameIsOverFalse ({ commit }: {commit: any}, state: RootState) {
      commit('GAME_OVER_FALSE', state)
    },
    isPlayingTrue ({ commit }: {commit: any}, state: RootState) {
      commit('IS_PLAYING_TRUE', state)
    },
    isPlayingFalse ({ commit }: {commit: any}, state: RootState) {
      commit('IS_PLAYING_FALSE', state)
    },
    updatePos ({ commit }: {commit: any}, {collided, stage}: {collided: boolean, stage: RootState["stage"]}) {
      commit('UPDATE_POS', {collided, stage})
    },
    resetGame ({ commit }: {commit: any}) {
      commit('RESET_GAME', {commit})
    },
    makeCollided ({ commit }: {commit: any}) {
      commit('MAKE_COLLIDED')
    },    
    xIncrement ({commit}: {commit: any}, paylod: number) {
      commit('X_INCREMENT', paylod)
    },
    yIncrement ({ commit }: {commit: any}) {
      commit('Y_INCREMENT')
    },
    resetValues ({ commit }: {commit: any}) {
      commit('RESET_VALUES')
    },
    sweepRows ({commit, state}: {commit: any, state: any, getters: any}) {
      const newStage: RootState["stage"] = deepCopyFunction(state.stage)
      newStage.reduce((ack: (string | number)[][], row: (string|number)[][]): any => {  
        if (row.findIndex(cell => cell[0] === 0) === -1) {
        const indexForSweep = newStage.indexOf(row)
        commit('NEW_STAGE_SPLICE', {newStage, indexForSweep})
        commit('ROWS_INCREMENT')
        commit('NEW_STAGE_UNSHIFT', newStage)
      }
      commit('SET_STAGE', newStage)
    })
  },
  playerRotate ({commit, state}: {commit: any, state: RootState}, {dir}: { dir: number} ) {
    const clonedPlayer: RootState["player"] = deepCopyFunction(state.player)
    clonedPlayer.tetromino = rotate(clonedPlayer.tetromino, dir)

    const pos: number = clonedPlayer.pos.x
    let offset = 1
    while (checkCollision(clonedPlayer, state.stage, 0, 0)) {
      clonedPlayer.pos.x += offset
      offset = -(offset + (offset > 0 ? 1 : -dir))
      if (offset > clonedPlayer.tetromino[0].length) {
        rotate(clonedPlayer.tetromino, -1)
        clonedPlayer.pos.x = pos
        return
      }
    }

    commit('PLAYER_ROTATE', clonedPlayer)
  },
  setStageWhenMerged({commit, getters, state, dispatch}: {commit: any, getters: any, state: RootState, dispatch: any}){
    if (state.player.collided) {
      if (state.gameOver !== true) {
        commit('SET_STAGE', getters.updateStage)
        dispatch('sweepRows')
        commit('RESET_PLAYER')
      }
    }
  }

}
