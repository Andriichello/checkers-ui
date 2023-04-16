import Cell from "@/core/board/Cell";
import Move from "@/core/board/Move";

export enum PieceType {
    Checker = 'C', 
    Queen = 'Q', 
}

export class Piece {
    protected type: PieceType;
    protected previousTypes: PieceType[];
    readonly color: string;
    protected moves: Move[];
    readonly starting: Cell;

    constructor(type: PieceType, color: string, starting: Cell, moves: Move[] = []) {
        this.type = type;
        this.previousTypes = [];
        this.color = color;
        this.starting = starting;
        this.setMoves(moves);
    }

    public getType(): PieceType {
        return this.type;
    }

    public getMoves(): Move[] {
        return this.moves;
    }

    public setMoves(moves: Move[]): Piece {
        this.moves = moves;
        return this;
    }

    public popMove(): Move {
        const move = this.moves.pop()

        if (move.promotion) {
            this.type = this.previousTypes.pop();
        }

        return move;
    }

    public pushMove(move: Move): Piece {
        this.moves.push(move);

        if (move.promotion) {
            this.previousTypes.push(this.type);
            this.type = move.promotion;
        }

        return this;
    }

    get current(): Cell {
        return this.moves.length > 0 
        ? this.moves[this.moves.length - 1].to 
        : this.starting;
    }

    public toString() {
        return this.type;
    }
}