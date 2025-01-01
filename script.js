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
        const markedRow = row; 
        const markedColumn = column; 
        if (board[markedRow][markedColumn].getValue() !== 0) {
            console.log("Cell is already marked, try again");
            return false;
        }
        board[markedRow][markedColumn].addToken(player);
        return true; 
    };
    const printBoard = () => {
        for (let i = 0; i < rows; i++) {
            const row = board[i].map(cell => cell.getValue() || ' ').join(' | ');
            console.log(row);
            if (i < rows - 1) {
                console.log('---------');
            }
        }
    };

    // this function could use a set to instantly check, but I'd rather have constant time operation over the extra memory
    const isBoardFull = () => {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                if (!board[i][j].getValue()) return false;
            }
        }
        return true; 
    };

    const isGameWon = () => {

        for (let i = 0; i < 3; i++) {

            let rowCheck = true;
            let colCheck = true;

            for (let j = 0; j < 3; j++) {
                if (j > 0) {
                    if (board[i][j].getValue() !== board[i][j - 1].getValue() || board[i][j].getValue() === 0) {
                        rowCheck = false; 
                    }
                    if (board[j][i].getValue() !== board[j - 1][i].getValue() || board[j][i].getValue() === 0) {
                        colCheck = false; 
                    }
                }
            }
            if (rowCheck) return board[i][0].getValue();
            if (colCheck) return board[0][i].getValue();
        }
        
        const diagDown = [board[0][0], board[1][1], board[2][2]];
        const diagUp = [board[0][2],  board[1][1], board[2][0]];
        let diagDownCheck = true; 
        let diagUpCheck = true; 

        for (let i = 0; i < 3; i++) {
            if (i > 0) {
                if (diagDown[i].getValue() !== diagDown[i - 1].getValue() || diagDown[i].getValue() == 0) diagDownCheck = false; 
                if (diagUp[i].getValue() !== diagUp[i - 1].getValue() || diagUp[i].getValue() == 0) diagUpCheck = false; 
            }
        }

        if (diagDownCheck) return board[1][1].getValue(); 
        if (diagUpCheck) return board[1][1].getValue();

        return null; 
    };
    

    return { getBoard, markCell, printBoard, isBoardFull, isGameWon }; 
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


function GameController(
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
        const winner = board.isGameWon()
        if (winner) {
            if (winner == 'X') {
                console.log("Player One has won the game!");
            } else if (winner == 'O') {
                console.log("Player Two has won the game!");
            }
        } else if (board.isBoardFull()) {
            console.log("Tie Game");
        }
        else {
            // prevents player from marking already marked cell
            if (board.markCell(row, column, getActivePlayer().token)) {
                if (!board.isGameWon()) switchPlayerTurn(); 
            }
            printNewRound();
        }
    }

    printNewRound(); 

    return {
        playRound, 
        getActivePlayer, 
        getBoard: board.getBoard, 
        isGameWon: board.isGameWon
    };
}

screenController = (function ScreenController() {
    let game = GameController(); 
    const boardDiv = document.querySelector('.board'); 
    const playerDiv = document.querySelector('.playerTurn'); 
    const resetDiv = document.querySelector('.reset'); 

    const updateScreen = () => {
        boardDiv.textContent = ''; 

        const board = game.getBoard(); 
        const activePlayer = game.getActivePlayer(); 

        if (game.isGameWon()) {
            playerDiv.textContent = `${activePlayer.name} has won the game!`; 
        }
        else {
            playerDiv.textContent = `${activePlayer.name}'s turn`; 
        }

        board.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                const cellButton = document.createElement("button"); 
                cellButton.classList.add("cell");
                if (cell.getValue() !== 0) {
                    cellButton.classList.add("clicked"); 
                }
                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = columnIndex; 
                cellButton.dataset.value = cell.getValue()
                cellButton.textContent = cell.getValue(); 
                boardDiv.appendChild(cellButton);
            })
        })
        
    };

    function clickHandlerBoard(e) {
        const selectedRow = e.target.dataset.row; 
        const selectedColumn = e.target.dataset.column; 
        if (selectedRow === undefined || selectedColumn === undefined) {
            return 
        }
        game.playRound(selectedRow, selectedColumn); 

        updateScreen();
    }
    boardDiv.addEventListener("click", clickHandlerBoard); 
    
    resetDiv.addEventListener("click", (e) => {
        game = GameController()
        updateScreen(); 
    }); 

    updateScreen();

    return {updateScreen}; 
})();           