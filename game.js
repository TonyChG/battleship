const GRID_SIZE = 10;
const BOX_SIZE  = 30;

function initGrid() {
    $('.box').each(function(index){
        if (index < 100) {
          $(this).attr('data-x', index);
          $(this).attr('daya-y', parseInt(index / 10));
          $(this).css({opacity: 0.3});
        }
        else {
          $(this).attr('data-x', index-100);
          $(this).attr('daya-y', parseInt(index-100 / 10));
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
        $(this).css('background-color', '#0000FF');
        x = $(this).attr('data-x');
        y = parseInt(x / 10);
        x = x % 10;
        console.log("y: " + y + "x: " + x);
    });
}

function initGame() {
    initGrid();

}

initGame();