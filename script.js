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

    let win =
      fullRow.every(equals) ||
      fullColumn.every(equals) ||
      diagonal1.every(equals) ||
      diagonal2.every(equals);

    return win;
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

    console.log(board.checkWin(row, column));
    if (!marked) switchPlayerTurn();

    printNewRound();
  };

  return {
    playRound,
    getActivePlayer,
  };
}

const game = GameController();
