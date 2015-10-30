
//------------------- BATTLESHIP -------------------//
// Antoine Chiny - 2015
//


//------------------- CONSTANTS -------------------//
const GRID_SIZE = 10;
const BOX_SIZE  = 30;
const Ships = {
  "Porte-avion": 5,
  "Croiseur": 4,
  "Contre-torpilleurs": 3,
  "Sous-marin": 3,
  "Torpilleur": 2
}
const shipColors = ["#6E6E6E", "#B18904", "#298A08", "#61210B", "#8A0829"];



//------------------- USUALS FUNCTIONS -------------------//
// Retourne un nombre aléatoire entre min et max
function randomNumber(min, max) {
    return Math.floor(Math.random()*max+min);
}

// Crée une nouvelle grille
function newGrid(size)
{
  var grid = [];
  var Box = {
    play: 0,
    ship: 0,
    color: "#2E64FE"
  };

  for (j = 0; j < size; j++) {
    grid[j] = [];
    for (i = 0; i < size; i++) {
      grid[j][i] = Object.create(Box);
    }
  }
  return grid;
}

// Affiche la grille dans la console
function displayGridConsole(grid)
{
  for (y = 0; y < GRID_SIZE; y++) {
    for (x = 0; x < GRID_SIZE; x++) {
      console.log(grid[y][x].color);
    }
    console.log('\n');
  }
}


//------------------- RANDOM SHIPS POSITION -------------------//
// Retourne un tableau avec les directions possible pour un bateau
function getDirections(grid, x, y, shipsize) {
  check_r = 0;
  check_l = 0;
  check_u = 0;
  check_d = 0;
  possibleDir = [];

  for (i = 0; i < shipsize; i++) {
    if ((x+i) < 10) {
      if (grid[y][x+i].ship == 0) {
        check_r++;
        if (check_r == shipsize) {
          possibleDir.push('right');
        }
      }
    } if ((y+i) < 10) {
      if (grid[y+i][x].ship == 0) {
        check_d++;
        if (check_d == shipsize) {
          possibleDir.push('down');
        }
      }
    } if ((x-i) >= 0) {
      if (grid[y][x-i].ship == 0) {
        check_l++;
        if (check_l == shipsize) {
          possibleDir.push('left');
        }
      }
    } if ((y-i) >= 0) {
      if (grid[y-i][x].ship == 0) {
        check_u++;
        if (check_u == shipsize) {
          possibleDir.push('up');
        }
      }
    }
  }
  return possibleDir;
}

// Place les bateaux
function putShips (grid) {
  var x = randomNumber(0, GRID_SIZE-1);
  var y = randomNumber(0, GRID_SIZE-1);
  var index = 0;

  $.each(Ships, function(key, size){
    while (grid[y][x].ship !== 0) {
      x = randomNumber(0, GRID_SIZE-1);
      y = randomNumber(0, GRID_SIZE-1);
    }
    possibleDir = getDirections(grid, x, y, size);
    chooseDir = possibleDir[randomNumber(0, possibleDir.length)];
    for (i = 0; i < size; i++) {
      if (chooseDir == 'right') {
        grid[y][x+i].ship = size;
        grid[y][x+i].color = shipColors[index];
      } else if (chooseDir === 'left') {
        grid[y][x-i].ship = size;
        grid[y][x-i].color = shipColors[index];
      } else if (chooseDir === 'up') {
        grid[y-i][x].ship = size;
        grid[y-i][x].color = shipColors[index];
      } else if (chooseDir === 'down') {
        grid[y+i][x].ship = size;
        grid[y+i][x].color = shipColors[index];
      }
    }
    index = index + 1;
  });
  return grid;
}


//------------------- EVENTS FUNCTIONS -------------------//
// Place les attributs sur les box en fonction de l'index
function initAttrBox() {
  $('.box').each(function(index){
    if (index < 100) {
      $(this).attr('data-i', index);
      $(this).attr('grid-n', 1)
    } else {
      $(this).attr('data-i', index-100);
      $(this).attr('grid-n', 2)
    }
  })
}

//Print in console + inDom
function debug_click() {
    console.log('y', y, 'x', x, 'n', n);
    $('#info>.data-x').html('<strong>x: '+ x +'</strong>');
    $('#info>.data-y').html('<strong>y:'+ y +'</strong>');
    $('#info>.data-n').html('<strong>n:'+ n +'</strong>');
}

// Initialise la grille de box
function clickGrid(playerGrid, computerGrid)
{
  initAttrBox();
  $('.box')
  .bind('click', function(click) {
    x = $(this).attr('data-i') % 10;
    y = parseInt($(this).attr('data-i')/10);
    n = $(this).attr('grid-n');
    debug_click();
    if (n == 1) {
      $(this).css('background-color', '#0000FF');
    }
  });
}

//------------------- PLAYER SHIP POSITION -------------------//
// Fonction qui dessine la croix des possibilités de placement pour un bateau de taille 'size'
function possibleShipPosition(css, grid, size) {
  x = css.attr('data-i')%10;
  y = parseInt(css.attr('data-i')/10);
  possibleDir = getDirections(grid, x, y, 5);
  $.each(possibleDir, function(index, key) {
    for (i = 0; i < size; i++) {
      if (key === "left") {
        $('.box').each(function(index, box) {
          if (x == (index % 10)+i && y == parseInt(index/10)) {
            $(this).css('background-color', '#FF0040');
          }
        });
      } else if (key == "right") {
        $('.box').each(function(index, box) {
          if (x == (index % 10)-i && y == parseInt(index/10)) {
            $(this).css('background-color', '#FF0040');
          }
        });
      } else if (key == "down") {
        $('.box').each(function(index, box) {
          if (x == (index % 10) && y == parseInt(index/10)-i) {
            $(this).css('background-color', '#FF0040');
          }
        });
      } else if (key == "up") {
        $('.box').each(function(index, box) {
          if (x == (index % 10) && y == parseInt(index/10)+i) {
            $(this).css('background-color', '#FF0040');
          }
        });
      }
    }
  });
}
// Verifie et renvoie la direction si la deuxieme case selectionner est correct
function getDirSelected(lastY, lastX, clickY, clickX, size) {

  console.log(clickY, clickX);
  if (lastX == clickX && lastY-size+1 == clickY) {
    return 'up';
  } else if (lastX == clickX && lastY+size-1==clickY) {
    return 'down';
  } else if (lastX+size-1==clickX && lastY == clickY) {
    return 'right';
  } else if (lastX-size+1==clickX && lastY == clickY) {
    return 'left';
  } else {
    return false
  }
}
// Gestion de l'évenement de positionement d'un bateau
function getShipSelection(grid) {
  boatPlace = 0;
  lastX = [];
  lastY = [];

  initAttrBox();
 if (boatPlace == 0)
  {
    $('.box')
    .bind('click', function() {
      x = $(this).attr('data-i') % 10;
      y = parseInt($(this).attr('data-i')/10);
      lastX.push(x);
      lastY.push(y);
      if (lastY.length > 1 && lastX.length > 1) {
        console.log(getDirSelected(lastY[lastY.length-2], lastX[lastX.length-2], y, x, 5));
      }
      clearGrid(grid);
      possibleShipPosition($(this), grid, 5);
    });
  }
 }


//------------------- DISPLAY FUNCTIONS -------------------//
// Reaffiche une grille clean
function clearGrid(grid) {
  $('.box').each(function(index) {
    $(this).css('background-color', '#2E64FE');
  });
}

// Change le css des box
function displayShips(grid) {
  $('.box').each(function(index){
    if (index >= 100) {
      $(this).css('background-color', grid[parseInt((index-100)/10)][(index-100)%10].color);
    }
  });
}


//------------------- MAIN FUNCTION -------------------//

function mainGame()
{
  var boatIsPlace = false;
  var computerGrid = newGrid(GRID_SIZE);

  if (!boatIsPlace) {
    playerGrid = newGrid(GRID_SIZE);
    clickGrid(playerGrid, computerGrid);
    computerGrid = putShips(computerGrid);
    displayShips(computerGrid);
  } else {
    boatIsPlace = getShipSelection(computerGrid);
  }
}

$(document).ready(function(){
    $('.grid1>div').clone().appendTo('.grid2');
    mainGame();
});
