$(function(){

  var viewController = new ViewController();
  var imagesLoaded = false;

  Leap.loop({hand: function(hand){
    var screenPosition = hand.screenPosition(hand.palmPosition);
    // hide and show the cursor in order to get second-topmost element.

    cursor.hide();
    var el = document.elementFromPoint(
        hand.screenPosition()[0],
        hand.screenPosition()[1]
    );
    cursor.show();

    if (el){
      if(!imagesLoaded){
        if( el.id === "load-buttonWrap" || el.id === "load-button" ){
          $('#load-buttonWrap').hide(10);
          $('.image-div').show(300);
          $('.image-span').show(300);
          imagesLoaded = true;
        }
      }

      if(imagesLoaded){
        // el.className === 'image-span' ? 
      }
    }
    var coordData = { 'x' : screenPosition[0].toPrecision(4),
                      'y' : screenPosition[1].toPrecision(4),
                      'z' : screenPosition[2].toPrecision(4) };
    var cursorPosition   = { 'left' : screenPosition[0], 'top' : screenPosition[1]  };
    var outputData  = { 'coordData' : coordData, 'cursorPosition' :  cursorPosition, 'element' : el, 'hand' : hand  };

    viewController.updateOutput(outputData);
  }})
  .use('screenPosition', {
    scale: 1
  });


});