
//------------------- BATTLESHIP -------------------//
// Antoine Chiny - 2015
//


//------------------- CONSTANTS -------------------//
const gridSize = 10;
const caseSize  = 30;
const Ships = {
  "Porte-avion": 5,
  "Croiseur": 4,
  "Contre-torpilleurs": 3,
  "Sous-marin": 3,
  "Torpilleur": 2
}
const ShipColor = ["#6E6E6E", "#B18904", "#298A08", "#61210B", "#8A0829"];
const ShipSize = [5,4,3,3,2];

var Square = {
  play: false,
  ship: 0,
  box: {}
}

//------------------- USUALS FUNCTIONS -------------------//
// Retourne un nombre aléatoire entre min et max
function randomNumber(min, max) {
    return Math.floor(Math.random()*max+min);
}

function createGrid(size, n) {
  var grid = [];

  for (i = 0; i < size; i++)
    grid[i] = [];
  $('.box').each(function(index) {
    if (n == 1 && index < 100) {
      grid[parseInt(index/gridSize)][index%gridSize] = Object.create(Square);
      grid[parseInt(index/gridSize)][index%gridSize].box = $(this);
    }
    if (n == 2 && index > 99) {
      grid[parseInt((index-100)/gridSize)][(index-100)%gridSize] = Object.create(Square);
      grid[parseInt((index-100)/gridSize)][(index-100)%gridSize].box = $(this);
    }
  });
  return grid;
}

function displaySelection(x, y, grid, size) {
  if (!grid[y][x].ship) {
    if ((x + size)-1 < gridSize) {
      for (i = 0; i < size; i++)
        modifyBoxColor(x+i, y, grid, '#F4FA58');
    }
    if ((x - size)+1 >= 0) {
      for (i= 0; i < size; i++)
        modifyBoxColor(x-i, y, grid, '#F4FA58');
    }
    if ((y + size)-1 < gridSize) {
      for (i= 0; i < size; i++)
        modifyBoxColor(x, y+i, grid, '#F4FA58');
    }
    if ((y - size)+1 >= 0) {
      for (i= 0; i < size; i++)
        modifyBoxColor(x, y-i, grid, '#F4FA58');
    }
  }
}

function putOneShip(lastX, lastY, x, y, grid, size) {
  console.log(lastX, parseInt(x));
  if (x == lastX) {
    if (lastX < x && Math.abs(lastX-x)==size) {
      console.log('Ship');
    }
  }
  else if (y == lastY) {

  }
}

function getPlayerShipsPos(grid) {
  nShip = 0;
  lastX = [];
  lastY = [];

  $('.box').bind('click', function(click){
    x = parseInt($(this).attr('data-x'));
    y = parseInt($(this).attr('data-y'));
    lastX.push(x);
    lastY.push(y);
    clearGrid(grid)
    displaySelection(parseInt($(this).attr('data-x')), parseInt($(this).attr('data-y')), grid, ShipSize[nShip]);
    if (lastX.length > 1 && lastY.length > 1) {
      console.log('Test');
      putOneShip(lastX[lastX.length-2], lastY[lastY.length-2], x, y, grid, ShipSize[nShip]);
    }
  });
}

function initAttrBox() {
  $('.box').each(function(index) {
    if (index < 100) {
      $(this).attr('data-x', index%gridSize);
      $(this).attr('data-y', parseInt(index/gridSize));
      $(this).attr('grid-n', 1);
    }
    else {
      $(this).attr('data-x', (index-100)%gridSize);
      $(this).attr('data-y', parseInt((index-100)/gridSize));
      $(this).attr('grid-n', 2);
  }
  });
}

function modifyBoxColor(x, y, grid, color) {
  grid[y][x].box.css('background-color', color);
  grid[y][x].box.addClass('clicked');
}

function clearGrid(grid) {
  for (y = 0; y < gridSize; y++) {
    for (x = 0; x < gridSize; x++) {
      if (!grid[y][x].ship) {
        grid[y][x].box.css('background-color', '#64C7CC');
      }
    }
  }
}

//
//--------------------- MAIN FUNCTION --------------------//
function mainGame()
{
  initAttrBox()
  IAgrid = createGrid(gridSize, 1);
  playerGrid = createGrid(gridSize, 2);
  shipPosition = false;

  if (!shipPosition) {
    shipPosition = getPlayerShipsPos(IAgrid);
  }
  else {
    console.log('Les bateaux sont placer, la partie commence !');
  }
}

$(document).ready(function(){
    $('.grid1>div').clone().appendTo('.grid2');
    mainGame();
});
