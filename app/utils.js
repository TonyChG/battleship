function getNextBoat() {
    $('#boatSelector').slick('slickNext');
}

function getPrevBoat() {
    $('#boatSelector').slick('slickPrev');
}

$(document).ready(function(){
    $('#boatSelector').slick({
        centerMode: true,
        draggable: true
    });


    var mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel" //FF doesn't recognize mousewheel as of FF3.x
    $('#boatSelector').bind(mousewheelevt, function(e){

        var evt = window.event || e //equalize event object
        evt = evt.originalEvent ? evt.originalEvent : evt; //convert to originalEvent if possible
        var delta = evt.detail ? evt.detail*(-40) : evt.wheelDelta //check for detail first, because it is used by Opera and FF

        if(delta > 30) {
            getPrevBoat();
        }
        else{
            getNextBoat();
        }
    });
});
