import Move from "./board/Move";

export default class Journal {
    protected moves: Move[];

    constructor(moves: Move[] = []) {
        this.moves = moves;
    }

    public getMoves(): Move[] {
        return this.moves;
    }

    public setMoves(moves: Move[]): Journal {
        this.moves = moves;
        return this;
    }

    public clear(): Journal {
        this.moves = [];
        return this;
    }

    public popMove(): Move {
        return this.moves.pop();
    }

    public pushMove(move: Move): Journal {
        this.moves.push(move);
        return this;
    }

    public lastMove(offset: number = 1): Move | null {
        const len = this.moves.length;

        if (!len || offset < 1) {
            return null;
        }

        if ((len - offset) < 0) {
            return null;
        }

        return this.moves[len - offset];
    }
}