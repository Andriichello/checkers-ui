import Board from "./Board";
import Cell from "./Cell";
import Journal from "./Journal";
import Move from "./Move";
import Player from "./Player";
import { Piece, PieceType } from "./pieces/Piece";

export class Game {
    readonly board: Board;
    readonly pieces: Piece[];
    readonly captures: Piece[];
    readonly players: Player[];
    readonly journal: Journal;

    constructor() {
        this.board = new Board();
        this.players = Factory.players();
        this.pieces = Factory.pieces(this.board, this.players[0], this.players[1]);
        this.captures = [];
        this.journal = new Journal();
    }

    /** Player, whose turn it is to make a move. */
    public player() {
        const moves = this.journal.getMoves();
        return this.players[moves.length % this.players.length]
    }

    public pieceAt(cell: Cell): Piece | null {
        let piece = null;

        if (cell) {
            this.pieces.forEach(p => {
                if (cell.isSame(p.current)) {
                    piece = p;
                    return;
                }
            });
        }
        
        return piece;
    }
    
    public piecesOf(player: Player): Piece[] {
        return this.pieces.filter(p => {
            return player.color === p.color;
        });
    }

    public capturesOf(player: Player): Piece[] {
        return this.captures.filter(p => {
            return player.color === p.color;
        });
    }

    public move(move: Move) {
        const piece = this.pieceAt(move.from);

        if (piece === null) {
            throw new Error(`There is no piece at ${move.from}.`);
        }

        piece.pushMove(move);
        this.journal.pushMove(move);

        if (move.capture) {
            this.captures.push(move.capture);
        }
    }

    public undo() {
        const move = this.journal.popMove();

        if (move.capture) {
            this.captures.pop();
        }
    }
}

export class Factory {
    public static players(): Player[] {
        return [
            new Player('White', 'white'),
            new Player('Black', 'black'),
        ];
    }

    public static pieces(board: Board, white: Player, black: Player): Piece[] {
        const pieces = [];

        // pieces for white
        for (let r = 0; r <= 2; r++) {
            for (let c = r % 2; c < board.cols; c += 2) {
                const cell = board.cells.at(r * board.cols + c);
                
                pieces.push(new Piece(PieceType.Checker, white.color, cell))
            }
        }

        // pieces for black
        for (let r = board.rows - 1; r >= board.rows - 3; r--) {
            for (let c = r % 2; c < board.cols; c += 2) {
                const cell = board.cells.at(r * board.cols + c);

                pieces.push(new Piece(PieceType.Checker, black.color, cell))
            }
        }

        return pieces;
    }
}

export class Calculator {
    public static moves(game: Game, player: Player = null): Map<Piece, Move[]> {        
        const pieces = game.piecesOf(player ?? game.player())
            .filter((p) => {
                return !game.captures.includes(p);
            });

        let hasAttacks = false;

        const movesMap = new Map<Piece, Move[]>();
        const attacksMap = new Map<Piece, Move[]>();

        pieces.forEach((p) => {
            const moves = Calculator.movesFor(p, game);
            const attacks = moves.filter((m) => {
                return m.capture;
            })

            if (attacks.length) {
                hasAttacks = true;
                attacksMap.set(p, attacks);
            }

            if (moves.length) {
                movesMap.set(p, moves);
            }
        });

        return hasAttacks ? attacksMap : movesMap;
    }

    public static movesFor(piece: Piece, game: Game): Move[] {        
        let isWhite = piece.color === game.players[0].color;

        const current = piece.current;

        const leftUp = game.board.cellAt(current.row + 1, current.col + 1); 
        const rightUp = game.board.cellAt(current.row + 1, current.col - 1); 
        const leftDown = game.board.cellAt(current.row - 1, current.col + 1); 
        const rightDown = game.board.cellAt(current.row - 1, current.col - 1); 

        const moves = [];

        if (piece.getType() === PieceType.Checker) {
            if (isWhite) {
                // if piece is white then it moves up
                if (leftUp) {
                    const leftUpPiece = game.pieceAt(leftUp);
                    if (leftUpPiece === null) {
                        moves.push(new Move(piece.current, leftUp));
                    } else if (leftUpPiece.color === piece.color) {
                        // ally piece is blocking the move
                    } else {
                        // enemy piece is there, so check further if it can be captured
                        const attack = this.attackAt(current, leftUpPiece, game);
                        
                        if (attack) {
                            moves.push(attack);
                        }
                    }
                }

                if (rightUp) {
                    const rightUpPiece = game.pieceAt(rightUp);
                    if (rightUpPiece === null) {
                        moves.push(new Move(piece.current, rightUp));
                    } else if (rightUpPiece.color === piece.color) {
                        // ally piece is blocking the move
                    } else {
                        // enemy piece is there, so check further if it can be captured
                        const attack = this.attackAt(current, rightUpPiece, game);
                        
                        if (attack) {
                            moves.push(attack);
                        }
                    }
                }
            } else {
                // if piece is black then it moves down
                if (leftDown) {
                    const leftDownPiece = game.pieceAt(leftDown);
                    if (leftDownPiece === null) {
                        moves.push(new Move(piece.current, leftDown));
                    } else if (leftDownPiece.color === piece.color) {
                        // ally piece is blocking the move
                    } else {
                        // enemy piece is there, so check further if it can be captured
                        const attack = this.attackAt(current, leftDownPiece, game);
                        
                        if (attack) {
                            moves.push(attack);
                        }
                    }
                }
            
                if (rightDown) {
                    const rightDownPiece = game.pieceAt(rightDown);
                    if (rightDownPiece === null) {
                        moves.push(new Move(piece.current, rightDown));
                    } else if (rightDownPiece.color === piece.color) {
                        // ally piece is blocking the move
                    } else {
                        // enemy piece is there, so check further if it can be captured
                        const attack = this.attackAt(current, rightDownPiece, game);
                        
                        if (attack) {
                            moves.push(attack);
                        }
                    }
                }
            }
        }

        return moves;
    }

    public static attackAt(from: Cell, target: Piece, game: Game): Move | null {  
        const targetCell = target.current;      
        
        const rowDiff = targetCell.row - from.row;
        const colDiff = targetCell.col - from.col;

        // continue moving in same direction
        const landingCell = game.board.cellAt(targetCell.row + rowDiff, targetCell.col + colDiff);

        if (landingCell === null) {
            // landing out of the board
            return null;
        }

        if (game.pieceAt(landingCell)) {
            // landing on another piece
            return null;
        }

        return new Move(from, landingCell, target);
    }
}