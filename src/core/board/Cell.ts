export default class Cell {
    readonly row: number;
    readonly col: number;

    constructor(row: number, col: number) {
        this.row = row;
        this.col = col;
    }

    public isSame(cell: Cell) {
        return this.row === cell.row
            && this.col === cell.col; 
    }

    public toString() {
        return this.colAsString() + this.rowAsString();
    }

    public rowAsString(): string {
        return `${this.row}`;
    }

    public colAsString(): string {
        return String.fromCharCode('a'.charCodeAt(0) + (this.col - 1))
    }
}