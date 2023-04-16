import Board from "./board/Board";
import Cell from "./board/Cell";
import Journal from "./Journal";
import Move from "./board/Move";
import Player from "./Player";
import { Piece, PieceType } from "./pieces/Piece";

export class Game {
    readonly board: Board;
    readonly pieces: Piece[];
    readonly captures: Piece[];
    protected color: string;
    readonly players: Player[];
    readonly journal: Journal;

    constructor() {
        this.board = new Board();
        this.players = Factory.players();
        this.color = this.players[0].color;
        this.pieces = Factory.pieces(this.board, this.players[0], this.players[1]);
        this.captures = [];
        this.journal = new Journal();
    }

    public playerOf(color: string): Player {
        return this.players.find((p) => {
            return this.color === p.color;
        })
    }

    /** Player, whose turn it is to make a move. */
    public player() {
        return this.playerOf(this.color);
    }

    /** Player, whose will make a move next. */
    public nextPlayer() {
        let index = this.players.indexOf(this.player());

        return this.players[(index + 1) % this.players.length]; 
    } 

    /** Player, whose was making a move previously. */
    public prevPlayer() {
        let index = this.players.indexOf(this.player());

        if (index === 0) {
            return this.players[this.players.length - 1];
        }

        return this.players[index - 1]; 
    } 

    public pieceAt(cell: Cell): Piece | null {
        let piece = null;

        if (cell) {
            this.pieces.forEach(p => {
                if (cell.isSame(p.current) && !this.captures.includes(p)) {
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

            const attacks = Calculator.movesFor(piece, this)
                .filter((m) => {
                    return m.capture;
                });
                
            // if there are attacks available, then do not switch 
            // to next player to force current one to capture 
            if (attacks.length) {
                return;
            }
        }

        // switch to next player 
        this.color = this.nextPlayer().color; 
    }

    public undo() {
        if (!this.journal.lastMove()) {
            return;
        }

        const move = this.journal.popMove();
        const piece = this.pieceAt(move.to);
        piece.popMove();

        if (move.capture) {
            this.captures.pop();

            const last = this.journal.lastMove();
            // if move before was a capture then do not switch to previous player
            // to make it possible to undo multiple captures in a row
            if (last && last.capture && last.capture.color == move.capture.color) {
                this.undo();
                return;
            }
        }

        // switch to previous player 
        this.color = this.prevPlayer().color; 
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

        pieces.push(new Piece(PieceType.Checker, black.color, board.cellAt(4, 4)))

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

        if (isWhite) {
            // if piece is white then it moves up
            if (leftUp) {
                const leftUpPiece = game.pieceAt(leftUp);
                if (leftUpPiece === null) {
                    moves.push(...this.movesInto(piece, piece.current, leftUp, game));
                } else if (leftUpPiece.color === piece.color) {
                    // ally piece is blocking the move
                } else {
                    // enemy piece is there, so check further if it can be captured
                    moves.push(...this.attackAt(piece, current, leftUpPiece, game));
                }
            }

            if (rightUp) {
                const rightUpPiece = game.pieceAt(rightUp);
                if (rightUpPiece === null) {
                    moves.push(...this.movesInto(piece, piece.current, rightUp, game));
                } else if (rightUpPiece.color === piece.color) {
                    // ally piece is blocking the move
                } else {
                    // enemy piece is there, so check further if it can be captured
                    moves.push(...this.attackAt(piece, current, rightUpPiece, game));

                }
            }

            if (leftDown) {
                const leftDownPiece = game.pieceAt(leftDown);
                if (leftDownPiece === null) {
                    // only queen can move backwards
                    if (piece.getType() === PieceType.Queen) {
                        moves.push(...this.movesInto(piece, piece.current, leftDown, game));
                    }
                } else if (leftDownPiece.color === piece.color) {
                    // ally piece is blocking the move
                } else {
                    // enemy piece is there, so check further if it can be captured
                    moves.push(...this.attackAt(piece, current, leftDownPiece, game));
                }
            }

            if (rightDown) {
                const rightDownPiece = game.pieceAt(rightDown);
                if (rightDownPiece === null) {
                    // only queen can move backwards
                    if (piece.getType() === PieceType.Queen) {
                        moves.push(...this.movesInto(piece, piece.current, rightDown, game));
                    }
                } else if (rightDownPiece.color === piece.color) {
                    // ally piece is blocking the move
                } else {
                    // enemy piece is there, so check further if it can be captured
                    moves.push(...this.attackAt(piece, current, rightDownPiece, game));
                }
            }
        } else {
            // if piece is black then it moves down
            if (leftDown) {
                const leftDownPiece = game.pieceAt(leftDown);
                if (leftDownPiece === null) {
                    moves.push(...this.movesInto(piece, piece.current, leftDown, game));
                } else if (leftDownPiece.color === piece.color) {
                    // ally piece is blocking the move
                } else {
                    // enemy piece is there, so check further if it can be captured
                    moves.push(...this.attackAt(piece, current, leftDownPiece, game));
                }
            }
        
            if (rightDown) {
                const rightDownPiece = game.pieceAt(rightDown);
                if (rightDownPiece === null) {
                    moves.push(...this.movesInto(piece, piece.current, rightDown, game));
                } else if (rightDownPiece.color === piece.color) {
                    // ally piece is blocking the move
                } else {
                    // enemy piece is there, so check further if it can be captured
                    moves.push(...this.attackAt(piece, current, rightDownPiece, game));
                }
            }

            if (leftUp) {
                const leftUpPiece = game.pieceAt(leftUp);
                if (leftUpPiece === null) {
                    // only queen can move backwards
                    if (piece.getType() === PieceType.Queen) {
                        moves.push(...this.movesInto(piece, piece.current, leftUp, game));
                    }
                } else if (leftUpPiece.color === piece.color) {
                    // ally piece is blocking the move
                } else {
                    // enemy piece is there, so check further if it can be captured
                    moves.push(...this.attackAt(piece, current, leftUpPiece, game));
                }
            }

            if (rightUp) {
                const rightUpPiece = game.pieceAt(rightUp);
                if (rightUpPiece === null) {
                    // only queen can move backwards
                    if (piece.getType() === PieceType.Queen) {
                        moves.push(...this.movesInto(piece, piece.current, rightUp, game));
                    }
                } else if (rightUpPiece.color === piece.color) {
                    // ally piece is blocking the move
                } else {
                    // enemy piece is there, so check further if it can be captured
                    moves.push(...this.attackAt(piece, current, rightUpPiece, game));
                }
            }
        }

        const attacks = moves.filter((m) => {
            return m.capture;
        });

        const result = attacks.length ? attacks : moves;

        let promotionRow = isWhite ? game.board.rows : game.board.cells[0].row;        
        // check if move destination is a promotion square 
        // and if it is then automatically promote to queen
        for (let i = result.length - 1; i >= 0; i--) {
            const move = result[i] as Move;

            if (move.to.row === promotionRow) {
                result[i] = new Move(move.from, move.to, move.capture, PieceType.Queen);
            }
        }

        return result;
    }

    public static attackAt(piece: Piece, from: Cell, target: Piece, game: Game): Move[] {  
        const targetCell = target.current;      
        
        const rowDiff = targetCell.row - from.row;
        const colDiff = targetCell.col - from.col;

        // continue moving in same direction
        const landingCell = game.board.cellAt(targetCell.row + rowDiff, targetCell.col + colDiff);

        if (landingCell === null) {
            // landing out of the board
            return [];
        }

        if (game.pieceAt(landingCell)) {
            // landing on another piece
            return [];
        }

        const attacks = [new Move(from, landingCell, target)]

        if (piece.getType() === PieceType.Queen) {
            const nextLandingCell = game.board.cellAt(landingCell.row + rowDiff, landingCell.col + colDiff)
            
            if (nextLandingCell) {
                this.movesInto(piece, landingCell, nextLandingCell, game)
                    .forEach((m) => {
                        attacks.push(new Move(from, m.to, target, m.promotion));
                    });
            }
        }
        
        return attacks;
    }

    public static movesInto(piece: Piece, from: Cell, into: Cell, game: Game): Move[] {
        if (game.pieceAt(into)) {
            // landing on another piece
            return [];
        }

        const rowDiff = into.row - from.row;
        const colDiff = into.col - from.col;

        const moves = [];
        
        if (piece.getType() === PieceType.Queen) {
            let prev = null;
            let next = into;
            let target = null;
    
            while (next && !target) {                
                moves.push(new Move(from, next));
                
                prev = next;
                next = game.board.cellAt(next.row + rowDiff, next.col + colDiff);
                target = game.pieceAt(next);
            }

            if (target && target.color !== piece.color) {
                const attacks = this.attackAt(piece, prev, target, game);
            
                attacks.forEach((m) => {
                    moves.push(new Move(piece.current, m.to, m.capture));
                });
            }
        } else {
            moves.push(new Move(from, into));
        }

        return moves;
    }
}