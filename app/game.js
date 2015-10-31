
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



//------------------- USUALS FUNCTIONS -------------------//
// Retourne un nombre aléatoire entre min et max
function randomNumber(min, max) {
    return Math.floor(Math.random()*max+min);
}

// //------------------- MAIN FUNCTION -------------------//

function mainGame()
{
}

$(document).ready(function(){
    $('.grid1>div').clone().appendTo('.grid2');
    mainGame();
});
