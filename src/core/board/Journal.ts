import Move from "./Move";

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

    public popMove(): Move {
        return this.moves.pop();
    }

    public pushMove(move: Move): Journal {
        this.moves.push(move);
        return this;
    }
}