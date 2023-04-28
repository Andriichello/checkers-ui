import { Calculator, Game } from '@/core/Checkers';
import Move from '@/core/board/Move';
import { Piece } from '@/core/pieces/Piece';
import { defineStore } from 'pinia'

export const useCheckersStore = defineStore('checkers', {
  state: () => ({
    game: new Game(),
    selected: null,
    moves: null,
    highlights: []
  }),
  getters: {
    board: (state) => state.game.board, 
    pieces: (state) => state.game.pieces, 
    captures: (state) => state.game.captures, 
    player: (state) => state.game.player(), 
    players: (state) => state.game.players, 
    journal: (state) => state.game.journal,
    undos: (state) => state.game.undos,
    currentMoves: (state) => state.selected && state.moves ? state.moves.get(state.selected) : [],
  },
  actions: {
    newGame(game: Game = null) {
      this.game = game ?? new Game();
    },
    select(piece: Piece | null) {
      if (!piece) {
        this.selected = null;
        this.highlights = [];

        return;
      }

      if (piece.color !== this.player.color) {
        this.selected = null;
        this.highlights = [];

        return;
      }

      this.selected = piece;
      const highlights = [piece.current];

      if (!this.moves) {
        this.moves = Calculator.moves(this.game, this.player);
      }

      const movesOfPiece = this.moves.get(piece);

      if (movesOfPiece) {
        movesOfPiece.forEach((m) => {
          highlights.push(m.to);
        });
      }

      this.highlights = highlights;
    },
    move(move: Move) {
      const color = this.game.color;

      this.game.move(move);
      this.moves = null;

      if (color === this.game.color) {
        this.select(this.selected);
      } else {
        this.highlights = [];
      }
    },
    undo() {
      this.game.undo();

      this.selected = null;
      this.moves = null;
      this.highlights = [];
    
      const nextMove = this.undos.lastMove();

      if (nextMove) {
        this.select(this.game.pieceAt(nextMove.from));
      }
    },
    forward() {
      this.game.forward();

      this.selected = null;
      this.moves = null;
      this.highlights = [];

      const prevMove = this.undos.lastMove();

      if (prevMove) {
        this.select(this.game.pieceAt(prevMove.from));
      }
    },
  },
})
