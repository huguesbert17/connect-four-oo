/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Game {
  constructor(p1, p2, height = 6, width = 7) {
    this.players = [p1, p2];
    this.height = height;
    this.width = width;
    this.currPlayer = p1;
    this.makeBoard();
    this.makeHtmlBoard();
    this.activateBoardCells()
    this.gameOver = false;
  }

  /** makeBoard: create in-JS board structure:
   *   board = array of rows, each row is array of cells  (board[y][x])
   */
  makeBoard() {
    this.board = [];
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }

  //Add event listener on each board cell not disabled

  activateBoardCells() {
    this.boardElem.addEventListener("click", (e) => {
      
      if(e.target.querySelector(".piece") || e.target.tagName !== "TD") return

      const nextTr = e.target.parentNode.nextSibling,
        index = Array.from(e.target.parentNode.children).indexOf(e.target)
      //Verify if the bottom item has a piece or is the last tr then add piece

      //If clicked is the most bottom tr, just add the piece
      if(!nextTr){
          e.target.classList.add("disabled")
         return this.handleClick(e, e.target)
        }

      const belowTD = nextTr.querySelectorAll('td')
      e.target.classList.add("disabled")
      this.handleClick(e, e.target)
    })
  }
  

  /** makeHtmlBoard: make HTML table and row of column tops.  */

  makeHtmlBoard() {
    this.boardElem = document.getElementById('board');
    this.boardElem.innerHTML = '';
    
    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');
    
      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }
    
      this.boardElem.append(row);
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */

  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML board */

  placeInTable(y, x, spot) {
    
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = this.currPlayer.color;
    piece.style.top = -50 * (y + 2);

    spot.append(piece);
  }

  /** endGame: announce game end */

  endGame(msg) {
    alert(msg);
    const top = document.querySelector("#column-top");
  }

  /** handleClick: handle click of column top to play piece */

  handleClick(evt, spot) {
    // get x from ID of clicked cell
    const x = +Array.from(evt.target.parentNode.children).indexOf(evt.target);

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x, spot);

    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }

    // check for win
    if (this.checkForWin()) {
      this.gameOver = true;
      const controlWrapper = document.getElementById("control-wrapper");
      controlWrapper.querySelector("h2").innerHTML = `The <div style="width: 15px;height: 15px;background-color: ${this.currPlayer.color};border-radius: 60px;display: inline-block;"></div> player won!`
      document.querySelector('.propmt').style.display = "flex"
      document.getElementById("content").innerHTML = `<a href=${location.href} style='text-align: center;font-size: 2em'>Play again</a>`
      return true//this.endGame(`The ${this.currPlayer.color} player won!`);
    }

    // switch players
    this.currPlayer =
      this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */

  checkForWin() {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer
    const _win = cells =>
      cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}

class Player {
  constructor(color) {
    this.color = color;
  }
}

document.getElementById('start-game').addEventListener('click', () => {
  let p1 = new Player(document.getElementById('player-1').value);
  let p2 = new Player(document.getElementById('player-2').value);
  document.querySelector('.propmt').style.display = "none"
  new Game(p1, p2);
});
