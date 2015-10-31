
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

function getPlayerShipsPos(playerGrid) {
  nShip = 0;

  $('.box').bind('click', function(click){
    console.log($(this).attr('data-x'), $(this).attr('data-y'));
    modifyBoxColor($(this).attr('data-x'), $(this).attr('data-y'), playerGrid, '#F4FA58');

  })
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
    console.log('Les bateaux sont placer');
  }
}

$(document).ready(function(){
    $('.grid1>div').clone().appendTo('.grid2');
    mainGame();
});
