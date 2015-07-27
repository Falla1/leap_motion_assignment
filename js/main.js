$(function(){

  var viewController = new ViewController();
  var logger = new LeapLogger();
  var imagesLoaded = false;

  var leapController = new Leap.Controller({enableGestures: true}).use('screenPosition', { scale: 1}).connect();

  leapController
  .on('frame', function(frame){

    updateCursor(frame);

    for(var g = 0; g < frame.gestures.length; g++){

      var gesture = frame.gestures[g];
      var handIds = gesture.handIds;

      //Only a single hand
      if(handIds.length == 1){
          var hand = frame.hand(handIds[0]);
          handleSingleHandGesture(hand,gesture);
      }
      else if(handIds.length == 2){
        //Get the left and right hand
        var lefthand = null;
        frame.hand(handIds[0]).type === 'left' ? frame.hand(handIds[0]) : frame.hand(handIds[1]);

        var righthand = null;
        frame.hand(handIds[1]).type === 'right' ? righthand = frame.hand(handIds[1]) : frame.hand(handIds[0]);

        handleDoubleHandGesture(lefthand,righthand,gesture);
      }
    
   } 
  })
  //TODO Do we still want this?
  .on('gesture', function(gesture) {   
  });

  function handleSingleHandGesture(hand,gesture){
    if(gesture.type == 'keyTap'){
      viewController.selectObject(findScreenPosition(hand, hand));
    }

    else if(gesture.type == 'swipe'){

      //Getting Horizontal Direction
      var isHorizontal = Math.abs(gesture.direction[0]) > Math.abs(gesture.direction[1]);
        if(isHorizontal){
            //Determine the direction of the movement
            if(gesture.direction[0] > 0){
                viewController.moveImagesOver();
            } else {
                viewController.deselectEverything();
            }
        }
    }
    else if(gesture.type == 'circle'){
      viewController.rotateSelected(hand.gesture);
    }

    else if(pinch(hand)){
      //Use dragula to pinch the selected object
      
    }
  }

  function handleDoubleHandGesture(lefthand, righthand, gesture){

    if(pinch(lefthand) && pinch(righthand)){
      //Use dragula to pinch the scale object
      
    }
  }

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

  function pinch (hand) {
    return hand.pinchStrength > 0.5;
  }

  function updateCursor(frame){

    if(frame.hands.length > 0){
      //Get the objects for the hands
      var lefthand = null;
      frame.hands[0].type === 'left' ? lefthand = frame.hands[0] : lefthand = frame.hands[1];

      var righthand = null;
      frame.hands[0].type === 'right' ? righthand = frame.hands[0] : righthand = frame.hands[1];

      //Get position of left or right hand
      var screenPosition = findScreenPosition(lefthand, righthand);
      //Get the coord data for the hand
      var coordData = { 'x' : screenPosition[0].toPrecision(4),
          'y' : screenPosition[1].toPrecision(4),
          'z' : screenPosition[2].toPrecision(4) };
      //get the element of the coord data
      if(screenPosition){
        cursor.hide();
        var el = document.elementFromPoint(
          screenPosition[0],
          screenPosition[1]
        );
        cursor.show();
      }

      //Open up the tab
      //Terrible place to have it, we will need to move ?
      if(!imagesLoaded && openGesture(lefthand, righthand)){
        viewController.loadImages(el);
        imagesLoaded = !imagesLoaded;
      }

      viewController.render({ 'coordData' : coordData,
                                'element'   : el });
      logger.updateLogOutput({ 'coordData'  : coordData,
                                 'element'    : el,
                                 'lefthand'   : lefthand,
                                 'righthand'  : righthand });

  }
}

});