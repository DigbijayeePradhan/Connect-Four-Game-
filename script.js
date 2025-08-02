const ROWS = 6;
const COLS = 7;
let board = [];
let currentPlayer = 'red';
const boardElement = document.getElementById('board');
const statusText = document.getElementById('status');
let previewDisc;

function initBoard() {
  board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  boardElement.innerHTML = '';

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = row;
      cell.dataset.col = col;
      boardElement.appendChild(cell);
    }
  }

  createPreviewDisc();
  boardElement.addEventListener('mousemove', handleMouseMove);
  boardElement.addEventListener('mouseleave', () => previewDisc.style.display = 'none');
  boardElement.addEventListener('click', handleClick);
  updateStatus();
}

function createPreviewDisc() {
  previewDisc = document.createElement('div');
  previewDisc.classList.add('preview-disc', `preview-${currentPlayer}`);
  boardElement.appendChild(previewDisc);
}

function handleMouseMove(e) {
  const cell = e.target.closest('.cell');
  if (!cell) return;
  const col = cell.dataset.col;
  previewDisc.style.left = `${col * 85 + 5}px`;
  previewDisc.className = `preview-disc preview-${currentPlayer}`;
  previewDisc.style.display = 'block';
}

function handleClick(e) {
  const col = e.target.dataset.col;
  if (col === undefined) return;

  for (let row = ROWS - 1; row >= 0; row--) {
    if (!board[row][col]) {
      board[row][col] = currentPlayer;
      animateDiscDrop(row, col);

      if (checkWin(row, col)) {
        statusText.textContent = `Player ${currentPlayer === 'red' ? '1 (Red)' : '2 (Yellow)'} wins! 🎉`;
        boardElement.removeEventListener('click', handleClick);
        boardElement.removeEventListener('mousemove', handleMouseMove);
        return;
      }

      if (isDraw()) {
        statusText.textContent = "It's a draw!";
        return;
      }

      currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
      previewDisc.className = `preview-disc preview-${currentPlayer}`;
      updateStatus();
      return;
    }
  }
}

function animateDiscDrop(row, col) {
  const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
  cell.classList.add(currentPlayer);
}

function updateStatus() {
  statusText.textContent = `Player ${currentPlayer === 'red' ? '1' : '2'}'s Turn (${currentPlayer === 'red' ? 'Red' : 'Yellow'})`;
}

function checkWin(row, col) {
  const directions = [
    [[0, 1], [0, -1]],    // horizontal
    [[1, 0], [-1, 0]],    // vertical
    [[1, 1], [-1, -1]],   // diagonal \
    [[1, -1], [-1, 1]]    // diagonal /
  ];

  for (let dir of directions) {
    const cells = [[+row, +col]];
    for (let [dr, dc] of dir) {
      let r = +row + dr;
      let c = +col + dc;
      while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === currentPlayer) {
        cells.push([r, c]);
        r += dr;
        c += dc;
      }
    }
    if (cells.length >= 4) {
      highlightWin(cells);
      return true;
    }
  }
  return false;
}

function highlightWin(cells) {
  cells.forEach(([r, c]) => {
    const cell = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
    cell.classList.add('winning');
  });
}

function isDraw() {
  return board[0].every(cell => cell !== null);
}

function restartGame() {
  currentPlayer = 'red';
  initBoard();
}

window.onload = initBoard;
