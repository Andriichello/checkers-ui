import { Game } from '@/core/board/Checkers';
import Move from '@/core/board/Move';
import { defineStore } from 'pinia'

export const useCheckersStore = defineStore('checkers', {
  state: () => ({
    game: new Game(),
  }),
  getters: {
    board: (state) => state.game.board, 
    pieces: (state) => state.game.pieces, 
    captures: (state) => state.game.captures, 
    player: (state) => state.game.player(), 
    players: (state) => state.game.players, 
    journal: (state) => state.game.journal,
  },
  actions: {
    newGame(game: Game = null) {
      this.game = game ?? new Game();
    },
    move(move: Move) {
      this.game.move(move);
    },
    undo() {
      this.game.undo();
    },
  },
})
