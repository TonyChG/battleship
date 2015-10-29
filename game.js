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
    color: "#8000FF"
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

// Initialise la grille de box
function initGridBox(playerGrid, computerGrid)
{
  $('.box').each(function(index){
    if (index < 100) {
      $(this).attr('data-i', index);
      $(this).attr('grid-n', 1)
      $(this).css({opacity: 0.3});
    } else {
      $(this).attr('data-i', index-100);
      $(this).attr('grid-n', 2)
      $(this).css({opacity: 0.3});
    }
  })

  .bind('mouseenter', function() {
    $(this).css({opacity: 1});
  })

  .bind('mouseleave', function() {
    $(this).css('border-color', '#000000');
    $(this).css({opacity: 0.3});
  })

  .bind('click', function(click) {
    x = $(this).attr('data-i') % 10;
    y = parseInt($(this).attr('data-i')/10);
    n = $(this).attr('grid-n');
    console.log('y', y, 'x', x, 'n', n);
    if (n == 1) {
      $(this).css('background-color', '#0000FF');
    }
  });
}

function getBox(x,y) {
  $('.box').each(function(index, box) {
    if (x == (index % 10) && y == parseInt(index/10)) {
      return box;
    }});
}

function possibleShipPosition(css, grid, size) {
  x = css.attr('data-i')%10;
  y = parseInt(css.attr('data-i')/10);
  possibleDir = getDirections(grid, x, y, 5);
  $.each(possibleDir, function(index, key) {
    for (i = 0; i < size; i++) {
      if (key === "left") {
      // getBox(x+i, y).css('background-color', '#FF0040');
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

function clearGrid(grid) {
  $('.box').each(function(index) {
    $(this).css('background-color', '#8000FF');
  });
}

function getDirSelected(lastY, lastX, clickY, clickX) {

}

function getShipSelection(grid) {
  boatPlace = 0;  
  lastX = [];
  lastY = [];

  if (boatPlace == 0)
  {
    $('.display')
    .css('left', $(document).width()/3)
    .css('bottom', '0%')
    .animate({
      bottom: '30%'
    }, 'slow', 'linear');
    $('.box')
    .bind('mouseenter', function() {
      $(this).css({opacity: 1});
    })
    .bind('mouseleave', function() {
      $(this).css({opacity: 0.3});
    })
    .bind('click', function() {
      x = $(this).attr('data-i') % 10;
      y = parseInt($(this).attr('data-i')/10);
      lastX.push(x);
      lastY.push(y);
      if (lastY.length > 1 && lastX.length > 1) {
        getDirSelected(lastY[lastY.length-2], lastX[lastX.length-2], y, x);
      }
      clearGrid(grid);
      possibleShipPosition($(this), grid, 5);
    });
  }
  $('.box').each(function(index){
    if (index < 100) {
      $(this).attr('data-i', index);
      $(this).attr('grid-n', 1)
      $(this).css({opacity: 0.3});
    } else {
      $(this).attr('data-i', index-100);
      $(this).attr('grid-n', 2)
      $(this).css({opacity: 0.3});
    }
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

function mainGame()
{
  var boatIsPlace = false;

  if (boatIsPlace) {
    playerGrid = newGrid(GRID_SIZE);
    initGridBox(playerGrid, computerGrid);
    playerGrid = putShips(playerGrid);
    displayShips(playerGrid);
  } else {
    computerGrid = newGrid(GRID_SIZE);
    boatIsPlace = getShipSelection(computerGrid);
  }
}

mainGame();