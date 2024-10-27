function Cell() {
    let value = null;

    const getValue = () => value;

    const addToken = (player) => {
        if (value === null) {
            value = player.token;
        } else { return; }
    };

    return { getValue, addToken };
}

function Gameboard() {
    const board = [];
    for (let r = 0; r < 3; r++) {
        board[r] = [];
        for (let c = 0; c < 3; c++) {
            board[r].push(Cell());
        }
    }

    const getBoard = () => board;

    const checkWin = () => {
        function compArray(arr1, arr2) {
            for (let i = 0; i < arr1.length; i++) {
                if (arr1[i] !== arr2[i]) {
                    return false;
                } 
            }
            return true;
        };
        
        const win1 = [1, 1, 1];
        const win2 = [2, 2, 2];

        for (let i = 0; i < 3; i++) { 
            const row = board[i].map((cell) => cell.getValue());
            const col = board.map((row) => row[i].getValue());

            if (compArray(row, win1) || compArray(col, win1) || 
                compArray(row, win2) || compArray(col, win2)) {
                return true;
            }
        }

        let diag1 = [board[0][0], board[1][1], board[2][2]].map((cell) => cell.getValue());
        let diag2 = [board[0][2], board[1][1], board[2][0]].map((cell) => cell.getValue());
        if (compArray(diag1, win1) || compArray(diag2, win1) || 
            compArray(diag1, win2) || compArray(diag2, win2)) {
            return true;
        }
        return false;
    };

    const placeToken = (row, col, player) => {
        board[row][col].addToken(player);
    };

    // const displayBoard = () => {
    //     const board_with_values = board.map((row) => row.map((cell) => cell.getValue()));
    //     console.log(board_with_values);
    // };

    const clearBoard = () => {
        for (let r = 0; r < 3; r++) {
            board[r] = [];
            for (let c = 0; c < 3; c++) {
                board[r].push(Cell());
            }
        }
    };

    return { getBoard, checkWin, placeToken, clearBoard };
}

function GameController(
    player_one_name = "Player One",
    player_two_name = "Player Two"
) {
    const board = Gameboard();
    let win_status = false;
    let in_progress = false;

    const getBoard = () => board.getBoard();
    const getWinStatus = () => win_status;
    const getProgress = () => in_progress;
    const toggleProgress = () => { in_progress = !in_progress; };

    const players = [
        { name: player_one_name, token: 1 },
        { name: player_two_name, token: 2 }
    ];
    let current_player = players[0];

    const setPlayers = (name1, name2) => {
        players[0].name = name1;
        players[1].name = name2;
    };
    const getCurrentPlayer = () => current_player;
    const switchPlayer = () => {
        current_player = current_player === players[0] ? players[1] : players[0];
    };
    
    const newGame = (name1, name2) => {
        board.clearBoard();
        setPlayers(name1, name2);
        current_player = players[0];
    };   

    const playRound = (row, col) => {
        board.placeToken(row, col, current_player);
        // board.displayBoard();

        if (board.checkWin()) {
            win_status = true;
            return;
        } else {
            switchPlayer();
        }
    };

    return { getBoard, getWinStatus, getProgress, toggleProgress, setPlayers, getCurrentPlayer, playRound, newGame };
}

function ScreenController() {
    const game = GameController();
    const screen = document.querySelector("body");
    const turn_para = document.querySelector(".turn");
    const board_div = document.querySelector(".board");

    const displayReset = () => {
        console.log('reset');
        const reset_div = document.createElement("div");
        reset_div.classList.add("reset-div");
        const reset_btn = document.createElement("button");
        reset_btn.classList.add("reset");
        reset_btn.textContent = "Reset Game";
        reset_div.appendChild(reset_btn);
        screen.appendChild(reset_div);
    };
    
    const updateScreen = () => {
        const current_player = game.getCurrentPlayer();
        const won = game.getWinStatus();

        if (!won) {
            turn_para.textContent = current_player.name + "'s turn!";
        } else {
            turn_para.textContent = current_player.name + " wins!";
            displayReset();
        }
        
        const board = game.getBoard();
        board_div.textContent = "";

        board.forEach((row, row_index) => {
            row.forEach((cell, col_index) => {
                const cell_btn = document.createElement("button");
                const cell_value = cell.getValue();
                cell_btn.classList.add("cell");
                cell_btn.dataset.row = row_index;
                cell_btn.dataset.col = col_index;

                if (cell_value !== null) {
                    console.log("branch 1");
                    cell_btn.textContent = cell_value === 1 ? "X" : "O";
                    cell_btn.classList.add(cell_value === 1 ? "playerOne" : "playerTwo");
                    cell_btn.disabled = true;
                } else if (!game.getProgress() || won) {
                    console.log("branch 2");
                    cell_btn.disabled = true;
                } else {
                    console.log("branch 3");
                    cell_btn.disabled = false;
                }

                board_div.appendChild(cell_btn);
            })
        });
    };

    const startScreen = () => {
        const input_div = document.createElement("div");
        input_div.classList.add("input-field");

        const player_one_input = document.createElement("input");
        player_one_input.type = "text";
        player_one_input.classList.add("player-input");
        player_one_input.id = "player-one";
        player_one_input.placeholder = "Player One's Name";
        
        const player_two_input = document.createElement("input");
        player_two_input.type = "text";
        player_two_input.classList.add("player-input");
        player_two_input.id = "player-two";
        player_two_input.placeholder = "Player Two's Name";

        input_div.appendChild(player_one_input);
        input_div.appendChild(player_two_input);
        screen.appendChild(input_div);

        const start_div = document.createElement("div");
        start_div.classList.add("start-div");
        const start_btn = document.createElement("button");
        start_btn.classList.add("start");
        start_btn.textContent = "Start Game";
        start_div.appendChild(start_btn);
        screen.appendChild(start_div);
    };

    function getStartClick() {
        game.toggleProgress();
        console.log(game.getProgress());

        const player_one_input = document.querySelector("input#player-one");
        const player_two_input = document.querySelector("input#player-two");
        const start_div = document.querySelector(".start-div");

        const player_one_name = player_one_input.value === "" ? "Player One" : player_one_input.value;
        const player_two_name = player_two_input.value === "" ? "Player Two" : player_two_input.value;

        player_one_input.remove();
        player_two_input.remove();
        start_div.remove();

        game.newGame(player_one_name, player_two_name);
        updateScreen();
    };

    function getUserClick(e) {
        const obj = e.target;

        if (obj.classList.contains("cell")) {
            game.playRound(obj.dataset.row, obj.dataset.col);
            updateScreen();
        } else if (obj.classList.contains("start")) {
            getStartClick();
        } else if (obj.classList.contains("reset")) {
            obj.remove();
            ScreenController();
        }  
    };

    screen.addEventListener("click", getUserClick);

    startScreen();
    updateScreen();
    turn_para.textContent = "Enter player details :)";
}

ScreenController();