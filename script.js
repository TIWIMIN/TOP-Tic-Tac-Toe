function GameBoard() {
    const rows = 3; 
    const columns = 3; 
    const board = []; 

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
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
        board[markedRow][markedColumn].addToken(player);
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
    const board = GameBoard(); 

    const players = [
        {
            name: playerOneName,
            token: 'X'
        }, 
        {
            name: playerTwoName,
            token: 'O'
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer; 

    const printNewRound = () => {
        board.printBoard(); 
        console.log(`${getActivePlayer().name}'s turn.`);

    }

    const playRound = (row, column) => {
        board.markCell(row, column, getActivePlayer().token);
        switchPlayerTurn(); 
        printNewRound();
    }

    printNewRound(); 

    return {
        playRound, 
        getActivePlayer, 
        getBoard: board.getBoard
    };
})();
