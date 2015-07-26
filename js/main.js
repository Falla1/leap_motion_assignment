$(function(){

  var viewController = new ViewController();
  var logger = new LeapLogger();
  var imagesLoaded = false;

  var leapController = new Leap.Controller({enableGestures: true}).use('screenPosition', { scale: 1}).connect();



  leapController
  .on('frame', function(frame){
    if(frame.hands.length > 0){
      var lefthand = null;
      frame.hands[0].type === 'left' ? lefthand = frame.hands[0] : lefthand = frame.hands[1];

      var righthand = null;
      if(frame.hands.length === 2){
        frame.hands[0].type === 'right' ? righthand = frame.hands[0] : righthand = frame.hands[1];
      }

      var screenPosition = findScreenPosition(lefthand, righthand);
      // hide and show the cursor in order to get second-topmost element.
      if(screenPosition){
        cursor.hide();
        var el = document.elementFromPoint(
          screenPosition[0],
          screenPosition[1]
        );
        cursor.show();
        var coordData = { 'x' : screenPosition[0].toPrecision(4),
                  'y' : screenPosition[1].toPrecision(4),
                  'z' : screenPosition[2].toPrecision(4) };
      }
        if(!imagesLoaded && openGesture(lefthand, righthand)){
          viewController.loadImages(el);
          imagesLoaded = !imagesLoaded;
        }

        else if (imagesLoaded) {
          if(el){
            if(pinch(lefthand)){
              console.log("Selecting")
            }
          }
        }


      viewController.render({ 'coordData' : coordData,
                              'element'   : el });
      logger.updateLogOutput({ 'coordData'  : coordData,
                               'element'    : el,
                               'lefthand'   : lefthand,
                               'righthand'  : righthand });
    }
  })
  .on('gesture', function(gesture) {
    switch(gesture.type){
      case "circle":
        viewController.rotate();
      default :
        break;
    }
  });

  function openGesture(lefthand, righthand) {
    if(!lefthand || !righthand) return false;
    if(lefthand.roll()  > 1 && righthand.roll() < 1){
      return true;
    }
    return false;
  }

  function findScreenPosition(lefthand, righthand) {
    if (lefthand) {
      return lefthand.screenPosition(lefthand.palmPosition);
    }
    else if (righthand) {
      return righthand.screenPosition(righthand.palmPosition);
    }
  }

  function pinch (lefthand) {
    return lefthand.pinchStrength > 0.5;
  }
});