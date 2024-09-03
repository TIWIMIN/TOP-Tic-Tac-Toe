function GameBoard() {
    const rows = 3; 
    const columns = 3; 
    const board = []; 

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; i < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board; 
    const markCell = (row, column, player) => {
        const markedRow = row - 1; 
        const markedColumn = column - 1; 
        if (board[markedRow][markedColumn].getValue() !== 0) {
            return;
        }
        board[row][column].addToken(player);
    };
    const printBoard = () => {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                console.log(board[i][j].getValue());
            }
        }
    }

    return { getBoard, markCell, printBoard }; 
}

function Cell() {
    let value = 0; 

    const addToken = (player) => {
        value = player; 
    };

    const getValue = () => value; 

    return {
        addToken, 
        getValue
    };
}

const game = (function GameController(
    playerOneName = "Player One", 
    playerTwoName = "Player Two"
) {

})();