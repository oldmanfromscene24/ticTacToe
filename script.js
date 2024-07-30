function Gameboard() {
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
    if (board[row][column].getValue()) return 1;
    else {
      board[row][column].addToken(player);
      return 0;
    }
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.table(boardWithCellValues);
  };

  const checkWin = (row, column) => {
    const dimension = 3;

    const value = board[row][column].getValue();

    const equals = (currenValue) => currenValue === value;

    const fullRow = [];
    for (let i = 0; i < dimension; i++) fullRow.push(board[row][i].getValue());

    const fullColumn = [];
    for (let i = 0; i < dimension; i++)
      fullColumn.push(board[i][column].getValue());

    const diagonal1 = [];
    for (let i = 0; i < dimension; i++) diagonal1.push(board[i][i].getValue());

    const diagonal2 = [];
    for (let i = 0; i < dimension; i++)
      diagonal2.push(board[2 - i][i].getValue());

    return (
      fullRow.every(equals) ||
      fullColumn.every(equals) ||
      diagonal1.every(equals) ||
      diagonal2.every(equals)
    );
  };

  const resetBoard = () => {
      for (let i = 0; i < 3; i++)
        for (let j = 0; j < 3; j++) {
      board[i][j].resetToken()
        }

  }

  return { getBoard, markCell, printBoard, checkWin, resetBoard };
}

function Cell() {
  let value = 0;
  const addToken = (player) => {
    value = player;
  };
  const getValue = () => value;
  const resetToken = () => {
    value = 0;
  }

  return {
    addToken,
    getValue,
    resetToken,
  };
}

function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  let board = Gameboard();

  const players = [
    {
      name: playerOneName,
      token: 1,
      win: 0,
    },
    {
      name: playerTwoName,
      token: 2,
      win: 0,
    },
  ];

  let activePlayer = players[0];
  let moveCount = 0;
  let tieCount = 0;

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const newMatch = () => {
    activePlayer = players[0];
    moveCount = 0;
    board.resetBoard();
  };

  const playRound = (row, column) => {
    console.log(
      `Marking ${
        getActivePlayer().name
      }'s token into column ${row} column ${column}...`
    );

    let marked;
    marked = board.markCell(row, column, getActivePlayer().token);

    if (!marked) {
      switchPlayerTurn();
      moveCount++;
    }

    if (board.checkWin(row, column)) {
      switchPlayerTurn();
      activePlayer.win++;
      console.log(`${activePlayer.name} won the match!`);
      if (activePlayer.win === 3) {
        console.log(`${activePlayer.name} is the winner!`.toUpperCase());
        console.log("Starting a new one...");
        players[0].win = 0;
        players[1].win = 0;
        tieCount = 0;
        moveCount = 0;
      }
      newMatch();
    }

    printNewRound();

    if (moveCount === 9) {
      console.log("It's a tie!");
      tieCount++;
      newMatch();
    }
    
    const player1 = document.querySelector(".player1");
    const player2 = document.querySelector(".player2");
    const ties = document.querySelector(".ties");
    const moves = document.querySelector(".moves");
    
    player1.textContent = `${players[0].name}: ${players[0].win}`;
    player2.textContent = `${players[1].name}: ${players[1].win}`;
    ties.textContent = `Ties: ${tieCount}`;
    moves.textContent = `Move: ${moveCount}`;
  };

  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard,
  };
}

function ScreenController() {
  const game = GameController();
  const playerTurnDiv = document.querySelector(".turn");
  const boardDiv = document.querySelector(".board");
  const dimension = 3;

  const updateScreen = () => {
    boardDiv.textContent = "";

    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

    for (let row = 0; row < dimension; row++) {
      for (let column = 0; column < dimension; column++) {
        const cellButton = document.createElement("button");
        cellButton.dataset.row = row;
        cellButton.dataset.column = column;
        cellButton.className = "cell";
        cellButton.textContent = board[row][column].getValue();
        boardDiv.appendChild(cellButton);
      }
    }

  };

  function clickHandlerBoard(e) {
    const selectedRow = e.target.dataset.row;
    const selectedColumn = e.target.dataset.column;
    if (!selectedRow || !selectedColumn) return;

    game.playRound(selectedRow, selectedColumn);
    updateScreen();
  }
  boardDiv.addEventListener("click", clickHandlerBoard);

  updateScreen();
}

ScreenController();
