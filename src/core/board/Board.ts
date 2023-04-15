import Cell from "./Cell";

export default class Board {
    readonly rows: number;
    readonly cols: number;

    readonly cells: Cell[];

    constructor(rows: number = 8, cols: number = 8) {
        this.rows = rows;
        this.cols = cols;

        this.cells = [];

        for (let r = 1; r <= rows; r++) {
            for (let c = 1; c <= cols; c++) {
                this.cells.push(new Cell(r, c))
            }
        }
    }

    public cellAt(row: number, col: number): Cell | null {
        if (row < 1 || col < 1) {
            return null;
        }

        if (row > this.rows || col > this.cols) {
            return null;
        }

        const index = (row - 1) * this.cols + (col - 1);

        return this.cells.length > index 
            ? this.cells[index] : null;
    }
}