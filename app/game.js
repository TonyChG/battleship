///////////////////
// -BATTLESHIP-- //
// Antoine Chiny //
// Luc Terracher //
//   - 2015 -    //
///////////////////

'use strict';

// - Taille d'une grille
const gridSize  = 10;

// - Ships constants
const shipConst = [
  {'name':'aircraft-carrier', 'size':5, 'color':'#6E6E6E', 'id':0},
  {'name':'battlecruiser', 'size':4, 'color':'#B18904', 'id':1},
  {'name':'destroyer', 'size':3, 'color':'#298A08', 'id':2},
  {'name':'submarine', 'size':3, 'color':'#61210B', 'id':3},
  {'name':'torpedo', 'size':2, 'color':'#8A0829', 'id':4}
];

// - Tableau avec les coefficients des differentes directions
// - i=0 -> TOP
// - i=1 -> RIGHT
// - i=2 -> BOTTOM
// - i=3 -> LEFT
const coefTab = [{'x':0,'y':-1},{'x':1,'y':0},{'x':0,'y':1},{'x':-1,'y':0}];

// - Box object
function Box(jquerySelector) {
  this.box       = jquerySelector;
  this.isPlay    = false;
  this.ship      = 0;
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
  var
    size  = shipConst[shipID].size,
    coefX = 0,
    coefY = 0;

  for (var i = 0; i < size; i++) {
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

  coefTab.forEach(function(value, index) { // for all direction
    for (var i = 0; i < shipSize; i++) {
      if ((x+(i*value.x) < 0 || y+(i*value.y) < 0 || x+(i*value.x) > 9 || y+(i*value.y) > 9)) {
        possibleDir[index] = false;
      }
    }
  });
  possibleDir.forEach(function(value, index) { // for all possible directions
    if (value) {
      for (var i = 0; i < shipSize; i++) {
        if (grid[(x+(i*coefTab[index].x))+(y+(i*coefTab[index].y))*gridSize].ship !== 0) {
          possibleDir[index] = false;
        }
      }
    }
  });
  return possibleDir;
}

// - Clear une grille
function clearGrid(grid) {
  var gridID = grid[0].box.attr('grid-n');
  $('.grid'+gridID+' .box').each(function(index){
    if (!grid[index].ship) {
      grid[index].color('default');
    }
  });
}

function getDir(firstX, firstY, clickX, clickY, grid, shipID) {
  var
    shipSize = shipConst[shipID].size,
    dir      = -1,
    check    = true;

  if (firstY === clickY && clickX+(shipSize-1) === firstX) {
    dir = 3; // left
  }
  if (firstY === clickY && firstX+(shipSize-1) === clickX) {
    dir = 1; // right
  }
  if (firstX === clickX && firstY+(shipSize-1) === clickY) {
    dir = 2; // bottom
  }
  if (firstX === clickX && clickY+(shipSize-1) === firstY) {
    dir = 0; // top
  }
  if (dir != -1) {
    for (var i = 0; i < shipSize; i++) {
      if (grid[(coefTab[dir].x*i+firstX)+(coefTab[dir].y*i+firstY)*gridSize].ship) {
        check = false;
      }
    }
  }
  dir = check ? dir : -1;
  return dir;
}

function onClickPositionPhase(grid, shipID, clickX, clickY, saveX, saveY) {
  var
    firstX    = 0,
    firstY    = 0,
    dirTab    = getPossibleDir(clickX, clickY, grid, shipID),
    boatIsPut = false,
    dir       = -1,
    className = '';

  // console.log(clickX, clickY, saveX, saveY);
  if (saveX.length > 1 && saveY.length > 1) { // player click on <1 boxes
    firstX = saveX[saveX.length-2];
    firstY = saveY[saveY.length-2];
    // selected box is not a ship
    if (!grid[firstX+firstY*gridSize].ship && !grid[clickX+clickY*gridSize].ship) {
      // get direction of selected boxes
      dir = getDir(firstX, firstY, clickX, clickY, grid, shipID);
      if (dir != -1) {
        // put one ship in grid
        putOneShip(grid, firstX, firstY, dir, shipID);
        shipID++;
        boatIsPut = true;
      }
    }
  }
  clearGrid(grid);
  if (!boatIsPut) { // Display possible selection
    dirTab.forEach(function(value, index){
      if (value) {
        for (var i = 0; i < shipConst[shipID].size; i++) {
          className = (i === shipConst[shipID].size-1) ? 'possible' : 'clicked';
          grid[(clickX+(i*coefTab[index].x))+(clickY+(i*coefTab[index].y))*gridSize].color(className);
        }
      }
    });
  }
  return shipID;
}

function computerPlay(grid) {
  var
    randX = randomNumber(0, gridSize),
    randY = randomNumber(0, gridSize);

  while (grid[randX+randY*gridSize].isPlay) {
    randX = randomNumber(0, gridSize);
    randY = randomNumber(0, gridSize);
  }
  if (grid[randX+randY*gridSize].ship) {
    grid[randX+randY*gridSize].play('played_ship');
  } else {
    grid[randX+randY*gridSize].play('played_nothing');
  }
}

function onClickGamePhase(playerGrid, computGrid, clickX, clickY) {
  if (!computGrid[clickX+clickY*gridSize].isPlay) {
    if (computGrid[clickX+clickY*gridSize].ship) {
      computGrid[clickX+clickY*gridSize].play('played_ship');
    } else {
      computGrid[clickX+clickY*gridSize].play('played_nothing');
    }
    computerPlay(playerGrid);
  }
}

// - Gestion du click sur la grille du joueur
function clickOnPlayerGrid(playerGrid, computGrid) {
  var
    shipID = 0,
    saveX  = [],
    saveY  = [];

  // Si les bateaux ne sont pas placer les faire placer au joueur
  $('.grid2 .box').click(function() {
    var
      clickX = parseInt($(this).attr('data-x')),
      clickY = parseInt($(this).attr('data-y'));

    saveX.push(clickX); // Save click coordinates
    saveY.push(clickY);
    if (shipID < shipConst.length) {
      shipID = onClickPositionPhase(playerGrid, shipID, clickX, clickY, saveX, saveY);
    }
    else {
      $('.grid1 .box').click(function() {
        var
          clickX = parseInt($(this).attr('data-x')),
          clickY = parseInt($(this).attr('data-y'));
        onClickGamePhase(playerGrid, computGrid, clickX, clickY);
      });
    }
  });
}

function displayGrid(grid) {
  grid.forEach(function(value, index) {
    if (!value.play) {
      if (!value.ship) {
        value.color('played_nothing');
      } else {
        value.color('played_ship');
      }
    } else {
      value.color('default');
    }
  });
}

function possibleToPutShip(x, y, grid, shipID) {
  var
    check  = false,
    dirTab = getPossibleDir(x, y, grid, shipID);

  for (var i = 0; i < dirTab.length; i++) {
    if (!dirTab[i]) {
      check = true;
    }
  }
  return check;
}

function getSelectDir(dirTab) {
  var randDir = randomNumber(0, dirTab.length-1);

  while (!dirTab[randDir]) {
    randDir = randomNumber(0, dirTab.length-1);
  }
  return randDir;
}

// - Ajoute de facon aleatoire tout les bateaux dans la grille
function putRandShips(grid) {
  var
    maxLoop = 0,
    randX   = randomNumber(0, gridSize),
    randY   = randomNumber(0, gridSize),
    dirTab  = [];

  shipConst.forEach(function(value, index) {
    // Get possible coordinates
    while (grid[randX+randY*gridSize].ship &&
      possibleToPutShip(randX, randY, grid, index) &&
      maxLoop < 1000) {
      randX = randomNumber(0, gridSize);
      randY = randomNumber(0, gridSize);
      maxLoop++;
    }
    dirTab = getPossibleDir(randX, randY, grid, index); // get possible direction
    putOneShip(grid, randX, randY, getSelectDir(dirTab), index); // add ship in grid
  });
}

// - Main function
function mainGame()
{
  var
    playerGrid = newGrid(2),
    computGrid = newGrid(1);

  initAttributGrid();
  putRandShips(computGrid);
  clickOnPlayerGrid(playerGrid, computGrid);
  displayGrid(computGrid);
}

//  - Clone la premiere grille du DOM
$(function(){
    $('.grid1>div').clone().appendTo('.grid2');
    mainGame();
});
