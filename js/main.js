$(function(){

  var viewController = new ViewController();
  var logger = new LeapLogger();
  var imagesLoaded = false;

  // Leap.loop({enableGestures: true, hand: function(hand){
  //   var screenPosition = hand.screenPosition(hand.palmPosition);
  //   // hide and show the cursor in order to get second-topmost element.

  //   cursor.hide();
  //   var el = document.elementFromPoint(
  //       hand.screenPosition()[0],
  //       hand.screenPosition()[1]
  //   );
  //   cursor.show();

  //   if (el){
  //     if(!imagesLoaded){
  //       imagesLoaded = viewController.loadImages(el);
  //     }

  //     else {
  //       // el.className === 'image-span' ?
  //     }
  //   }
  //   var coordData = { 'x' : screenPosition[0].toPrecision(4),
  //                     'y' : screenPosition[1].toPrecision(4),
  //                     'z' : screenPosition[2].toPrecision(4) };
  //   var outputData  = { 'coordData' : coordData, 'element' : el, 'hand' : hand  };
  //   viewController.render(outputData);
  //   logger.updateLogOutput(outputData);
  // }})
  // .use('screenPosition', {
  //   scale: 1
  // });

  var leapController = new Leap.Controller().use('screenPosition', { scale: 1}).connect();

  leapController.on('frame', function(frame){
    if(frame.hands.length > 0){
      var hand;
      frame.hands[0].type === 'left' ? hand = frame.hands[0] : hand = frame.hands[1];

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
          imagesLoaded = viewController.loadImages(el);
        }

        else {
        // el.className === 'image-span' ?
        }
      }
      var coordData = { 'x' : screenPosition[0].toPrecision(4),
                        'y' : screenPosition[1].toPrecision(4),
                        'z' : screenPosition[2].toPrecision(4) };
      var outputData  = { 'coordData' : coordData, 'element' : el, 'hand' : hand  };
      viewController.render(outputData);
      logger.updateLogOutput(outputData);
    }
  });
});