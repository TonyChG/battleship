///////////////////
// -BATTLESHIP-- //
// Antoine Chiny //
// Luc Terracher //
//   - 2015 -    //
///////////////////

// - Taille d'une grille
const gridSize  = 10;

// - Ships constants
const shipConst = [
  {"name":"aircraft-carrier", "size":5, "color":"#6E6E6E"},
  {"name":"battlecruiser", "size":4, "color":"#B18904"},
  {"name":"destroyer", "size":3, "color":"#298A08"},
  {"name":"submarine", "size":3, "color":"#61210B"},
  {"name":"torpedo", "size":2, "color":"#8A0829"}
];

// - Tableau avec les coefficients des differentes directions 
// - i=0 -> TOP
// - i=1 -> RIGHT
// - i=2 -> BOTTOM
// - i=3 -> LEFT
const coefTab = [{"x":0,"y":-1},{"x":1,"y":0},{"x":0,"y":1},{"x":-1,"y":0}];

// - Box object
function Box(jquerySelector) {
  this.box    = jquerySelector;
  this.isPlay = false;
  this.ship   = 0;
  this.className = 'default';
}

// - Modifie la couleur d'une case
Box.prototype.color = function(className) {
  this.box.removeClass(String(this.className)).addClass(String(className));
  this.className = className;
};

// - Lorsque une case est joue
Box.prototype.play = function(className) {
  this.isPlay = true;
  this.box.removeClass(String(this.className)).addClass(String(className));
  this.className = className;
};

// - Ajoute un bateau de taille 'size'
Box.prototype.addShip = function(size, className){
  this.ship = size;
  this.box.removeClass(String(this.className)).addClass(String(className));
  this.className = className;
};

// - Retourne un nombre aléatoire entre min et max
function randomNumber(min, max) {
  return Math.floor(Math.random()*max+min);
}

// - Initialize grid attributs
function initAttributGrid() {
  $('.grid1, .grid2').each(function(n){
    $('.grid'+String(n+1)+' .box').each(function(index) {
      $(this).attr('data-x', index%gridSize);
      $(this).attr('data-y', parseInt(index/gridSize));
      $(this).attr('grid-n', n+1);
    });
  });
}

// - Create a new grid
function newGrid(nGrid) {
  var grid = [];

  $('.grid'+String(nGrid)+' .box').each(function(index){
    grid[index] = new Box($(this));
  });
  return grid;
}

// - Put one ship in grid
function putOneShip(grid, x, y, dir, shipID) {
  var size = shipConst[shipID].size;

  for (i = 0; i < size; i++) {
    coefX = i*coefTab[dir].x;
    coefY = i*coefTab[dir].y;
    grid[(x+coefX)+(y+coefY)*gridSize].addShip(shipConst[shipID].ship, shipConst[shipID].name);
  }
}

// - Retourne un tableau avec les directions possibles
function getPossibleDir(x, y, grid, shipID) {
  var possibleDir = [true, true, true, true];
  var shipSize    = shipConst[shipID].size;

  coefTab.forEach(function(value, index){
    for (i = 0; i < shipSize; i++) {
      coefX = i*value.x;
      coefY = i*value.y;
      if (x+coefX < 0 || y+coefY < 0 || x+coefX > 9 || y+coefY > 9)
        possibleDir[index] = false;
    }
  });
  return possibleDir;
}

// - Clear une grille
function clearGrid(grid) {
  gridID = grid[0].box.attr('grid-n');
  $('.grid'+gridID+' .box').each(function(index){
    if (!grid[index].ship) {
      grid[index].color('default');
    }
  });
}

// - Gestion du click sur la grille du joueur
function clickOnPlayerGrid(grid) {
  var shipID      = 0;

  $('.grid2 .box').click(function() {
    x = parseInt($(this).attr('data-x'));
    y = parseInt($(this).attr('data-y'));
    var possibleDir = getPossibleDir(x, y, grid, shipID);
    clearGrid(grid);
    possibleDir.forEach(function(value, index){
      if (value) {
        for (i = 0; i < shipConst[shipID].size; i++) {
          coefX = i*coefTab[index].x;
          coefY = i*coefTab[index].y;
          grid[(x+coefX)+(y+coefY)*gridSize].color('clicked');
        }
      }
    });
  });
}

// - Main function
function mainGame()
{
  playerGrid  = newGrid(2);
  computGrid  = newGrid(1);

  initAttributGrid();
  clickOnPlayerGrid(playerGrid);
  putOneShip(computGrid, 0, 0, 1, 0);
  putOneShip(computGrid, 3, 3, 2, 1);
  putOneShip(computGrid, 8, 0, 2, 2);
  putOneShip(computGrid, 0, 9, 1, 3);
  putOneShip(computGrid, 9, 9, 0, 4);
}

// - Clone la premiere grille du DOM
$(document).ready(function(){
    $('.grid1>div').clone().appendTo('.grid2');
    mainGame();
});
