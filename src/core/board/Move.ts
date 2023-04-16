import Cell from "./Cell";
import { Piece, PieceType } from "@/core/pieces/Piece";

export default class Move {
    readonly from: Cell;
    readonly to: Cell;
    readonly capture: Piece | null;
    readonly promotion: PieceType | null;
    
    constructor(from: Cell, to: Cell, capture: Piece = null, promotion: PieceType = null) {
        this.from = from;
        this.to = to;
        this.capture = capture; 
        this.promotion = promotion; 
    }

    public toString() {
        return this.from.toString() + (this.capture ? 'x' : '-') + this.to.toString();
    }
}