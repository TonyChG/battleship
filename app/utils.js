(function($){
    $.fn.isolatedScroll = function( options ){
        "use script";
        defaults = {
            // only blocks scroll if area is scrollable, set to false to always disable other element scroll
            autoscroll: true
        }
        options = $.extend( defaults, options );

        return this.bind( 'touchmove mousewheel DOMMouseScroll', function ( e ) {
            if( !options.autoscroll || ($(this).outerHeight() < $(this)[0].scrollHeight) ) {
                var e0 = e.originalEvent,
                    delta = e0.wheelDelta || -e0.detail;

                this.scrollTop += ( delta < 0 ? 1 : -1 ) * 30;
                e.preventDefault();
            }
        });
    };
}(jQuery));

$(window).load(function() {
    var timer = null;
    var wheeling = false;
    $('.flexslider').isolatedScroll();
    $('.flexslider').flexslider({
        animation: "slide",
        selector: ".boats > .boat",
        animationLoop: false,
        mousewheel: false,
        slideshow: false,
        slideshowSpeed: 2000,
        reverse: true,
        itemWidth: 210,
        minItems: 1,
        maxItems: 1,
        move: 0,
        itemMargin: 5,
        start: function(slider) {
            var timer = null;
            var wheeling = false;
            $('.flexslider').on('mousewheel', function(event, delta, deltaX, deltaY){
                  if(timer){
                    clearTimeout(timer);
                  }
                  if(!wheeling){
                    var target = delta < 0 ? slider.getTarget('next') : slider.getTarget('prev');
                    slider.flexAnimate(target, true);
                  }
                  wheeling = true;
                  timer = setTimeout(function(){
                    wheeling = false;
                }, 300);
            });
        }
    });
    var i = 0;
    $("#add").click(function(){
        div = "<li class='boat'><span>"+i+". Number what?</span></li>";
        $('.flexslider').data('flexslider').addSlide($(div));
        i++;
    });
});
