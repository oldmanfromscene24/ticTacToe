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
    console.log(boardWithCellValues);
  };

  const checkWin = (row, column) => {
    if (
      (board[row][0].getValue() === board[row][1].getValue() &&
        board[row][1].getValue() === board[row][2].getValue()) ||
      (board[0][column].getValue() === board[1][column].getValue() &&
        board[1][column].getValue() === board[2][column].getValue())
    )
      console.log("WIN")

    //TODO: check TIE and diagonal
  };

  return { getBoard, markCell, printBoard, checkWin };
}

function Cell() {
  let value = 0;
  const addToken = (player) => {
    value = player;
  };
  const getValue = () => value;

  return {
    addToken,
    getValue,
  };
}

function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  const board = Gameboard();

  const players = [
    {
      name: playerOneName,
      token: 1,
    },
    {
      name: playerTwoName,
      token: 2,
    },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const playRound = (row, column) => {
    console.log(
      `Marking ${
        getActivePlayer().name
      }'s token into column ${row} column ${column}...`
    );

    let marked;
    marked = board.markCell(row, column, getActivePlayer().token);

    board.checkWin(row, column);
    if (!marked) switchPlayerTurn();

    printNewRound();
  };

  return {
    playRound,
    getActivePlayer,
  };
}

const game = GameController();
