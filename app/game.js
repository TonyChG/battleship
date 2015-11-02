
//------------------- BATTLESHIP -------------------//
// Antoine Chiny - 2015
//


//------------------- CONSTANTS -------------------//
const gridSize  = 10;
const caseSize  = 30;

const shipConst = [
  {"name":"Porte-Avion", "size":5, "color":"#6E6E6E"},
  {"name":"Croiseur", "size":4, "color":"#B18904"},
  {"name":"Contre-torpilleurs", "size":3, "color":"#298A08"},
  {"name":"Sous-marin", "size":3, "color":"#61210B"},
  {"name":"Torpilleur", "size":2, "color":"#8A0829"}
];

var Box = {
  play: false,
  ship: 0,
  box: {},

  color: function(cssClass){
    this.box.addClass(String(cssClass));
  },
  played: function(cssClass){
    this.play = true;
    this.box.addClass(String(cssClass));
  },
  addShip: function(size, cssClass){
    this.ship = size;
    this.box.addClass(String(cssClass));
  }
};

//------------------- USUALS FUNCTIONS -------------------//
// Retourne un nombre aléatoire entre min et max
function randomNumber(min, max) {
    return Math.floor(Math.random()*max+min);
}

function initAttributGrid() {
  $('.grid1, .grid2').each(function(n){
    $('.grid'+String(n+1)+' .box').each(function(index) {
      $(this).attr('data-x', index%gridSize);
      $(this).attr('data-y', parseInt(index/gridSize));
      $(this).attr('grid-n', n+1);
    });
  });
}

function newGrid(nGrid) {
  var grid = [];

  $('.grid'+String(nGrid)+' .box').each(function(index){
    grid[index] = Object.create(Box);
    grid[index].box = $(this);
  });
  return grid;
}

//
//--------------------- MAIN FUNCTION --------------------//
function mainGame()
{
  initAttributGrid()
  playerGrid = newGrid(1);

  playerGrid[4+5*gridSize].color('clicked');
  playerGrid[4+4*gridSize].color('clicked');
  playerGrid[4+3*gridSize].color('clicked');
}

$(document).ready(function(){
    $('.grid1>div').clone().appendTo('.grid2');
    mainGame();
});
