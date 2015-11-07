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
  {"name":"aircraft-carrier", "size":5, "color":"#6E6E6E", "id":0},
  {"name":"battlecruiser", "size":4, "color":"#B18904", "id":1},
  {"name":"destroyer", "size":3, "color":"#298A08", "id":2},
  {"name":"submarine", "size":3, "color":"#61210B", "id":3},
  {"name":"torpedo", "size":2, "color":"#8A0829", "id":4}
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
    // Put ship on box(x,y)
    grid[(x+coefX)+(y+coefY)*gridSize].addShip(shipConst[shipID].size, shipConst[shipID].name);
  }
}

// - Retourne un tableau avec les directions possibles
function getPossibleDir(x, y, grid, shipID) {
  var 
    possibleDir = [true, true, true, true],
    shipSize    = shipConst[shipID].size;

  coefTab.forEach(function(value, index){
    for (i = 0; i < shipSize; i++) {
      if ((x+(i*value.x) < 0 || y+(i*value.y) < 0 || x+(i*value.x) > 9 || y+(i*value.y) > 9))
        possibleDir[index] = false;
    }
  });
  possibleDir.forEach(function(value, index) {
    if (value) for (i = 0; i < shipSize; i++)
      if (grid[(x+(i*coefTab[index].x))+(y+(i*coefTab[index].y))*gridSize].ship != 0)
        possibleDir[index] = false;
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

function getDir(x1, y1, x2, y2, grid, shipID) {
  shipSize = shipConst[shipID].size;
  dir = -1;
  check = true;

  if (y1 === y2 && x2+(shipSize-1) === x1)
    dir = 3;
  if (y1 === y2 && x1+(shipSize-1) === x2)
    dir = 1;
  if (x1 === x2 && y1+(shipSize-1) === y2)
    dir = 2;
  if (x1 === x2 && y2+(shipSize-1) === y1)
    dir = 0;
  if (dir != -1) for (i = 0; i < shipSize; i++)
    if (grid[(coefTab[dir].x*i+x1)+(coefTab[dir].y*i+y1)*gridSize].ship)
      check = false;
  check ? dir = dir : dir = -1
  return dir;
}

// - Gestion du click sur la grille du joueur
function clickOnPlayerGrid(grid) {
  var 
    shipID = 0,
    saveX = [],
    saveY = [];

  // Si les bateaux ne sont pas placer les faire placer au joueur
  if (shipID < shipConst.length) {
    $('.grid2 .box').click(function() {
      x = parseInt($(this).attr('data-x'));
      y = parseInt($(this).attr('data-y'));
      var 
        possibleDir = getPossibleDir(x, y, grid, shipID),
        boatIsPut = false;
      saveX.push(x);
      saveY.push(y);
      if (saveX.length > 1 && saveY.length > 1) { // player click on <1 boxes
        var firstX = saveX[saveX.length-2];
        var firstY = saveY[saveY.length-2];
        // selected box is not a ship
        if (!grid[firstX+firstY*gridSize].ship && !grid[x+y*gridSize].ship) {
          // get direction of selected boxes
          dir = getDir(firstX, firstY, x, y, grid, shipID);
          if (dir != -1) {
            // put one ship in grid
            putOneShip(grid, firstX, firstY, dir, shipID);
            shipID++;
            boatIsPut = true;
          }
        }
      }
      clearGrid(grid);
      if (!boatIsPut) // Display possible selection
        possibleDir.forEach(function(value, index){
          if (value) for (i = 0; i < shipConst[shipID].size; i++) {
            (i === shipConst[shipID].size-1) ? className = 'possible' : className = 'clicked'
            grid[(x+(i*coefTab[index].x))+(y+(i*coefTab[index].y))*gridSize].color(className);
          }
        });
    });
  }
}

function possibleToPutShip(x, y, grid, shipID) {
  var
    check = false,
    dirTab = getPossibleDir(x, y, grid, shipID);

  for (i = 0; i < dirTab.length; i++)
    if (!dirTab[i])
      check = true;
  return check;
}

function getSelectDir(dirTab) {
  var randDir = randomNumber(0, dirTab.length-1);

  while (!dirTab[randDir])
    randDir = randomNumber(0, dirTab.length-1);
  return randDir;
}

// Ajoute de facon aleatoire tout les bateaux dans la grille
function putRandShips(grid) {
  var
    maxRandomize = 0;
    randX = randomNumber(0, gridSize),
    randY = randomNumber(0, gridSize);

  shipConst.forEach(function(value, index) {
    while (grid[randX+randY*gridSize].ship 
      && possibleToPutShip(randX, randY, grid, index)
      && maxRandomize < 1000) {
      randX = randomNumber(0, gridSize);
      randY = randomNumber(0, gridSize);
    }
    dirTab = getPossibleDir(randX, randY, grid, index);
    putOneShip(grid, randX, randY, getSelectDir(dirTab), index);
  });
}

// - Main function
function mainGame()
{
  var
    shipID = 0,
    playerGrid  = newGrid(2),
    computGrid  = newGrid(1);

  initAttributGrid();
  putRandShips(computGrid);
  clickOnPlayerGrid(playerGrid);
}

// - Clone la premiere grille du DOM
$(document).ready(function(){
    $('.grid1>div').clone().appendTo('.grid2');
    mainGame();
});
