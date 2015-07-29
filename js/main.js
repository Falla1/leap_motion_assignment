$(function(){

  var viewController = new ViewController();
  var logger = new LeapLogger();
  var imagesLoaded = false;

  var leapController = new Leap.Controller({enableGestures: true}).use('screenPosition', { scale: 1}).connect();

  leapController
  .on('frame', function(frame){

    updateCursor(frame);

    handleRotation(frame);

    handleGestures(frame);
  })

  function handleGestures(frame){

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

  }

  function handleRotation(frame){

    if(frame.hands.length > 0){
      //Get the objects for the hands
      var lefthand = null;
      frame.hands[0].type === 'left' ? lefthand = frame.hands[0] : lefthand = frame.hands[1];

      var righthand = null;
      frame.hands[0].type === 'right' ? righthand = frame.hands[0] : righthand = frame.hands[1];

      //Open up the tab
      if(!imagesLoaded && openGesture(lefthand, righthand)){
        viewController.loadImages();
        imagesLoaded = !imagesLoaded;
      }

      else if(lefthand && lefthand.roll() < 1){
        viewController.rotateSelected(lefthand);
      }
    }
  }

  function handleSingleHandGesture(hand,gesture,frame){
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

    else if(pinch(hand)){
      //Use dragula to pinch the selected object
      console.log("Single Pinch");
    }
  }

  function handleDoubleHandGesture(lefthand, righthand, gesture,frame){

    if(pinch(lefthand) && pinch(righthand)){
      //Use dragula to pinch the scale object
      console.log("Double Pinch");
    }
  }

  function openGesture(lefthand, righthand) {
    if(!lefthand || !righthand) return false;
    if(lefthand.roll()  > 1 && righthand.roll() < 1){
      return true;
    }
    return false;
  }

  function findScreenPosition(righthand) {
    if (righthand) {
      return righthand.screenPosition(righthand.palmPosition);
    }
  }

  function pinch (hand) {
    return hand.pinchStrength > 0.5;
  }

  function updateCursor(frame){

    if(frame.hands.length > 0){

      var lefthand = null;
      frame.hands[0].type === 'left' ? lefthand = frame.hands[0] : lefthand = frame.hands[1];

      //Use RightHand to move cursor
      var righthand = null;
      frame.hands[0].type === 'right' ? righthand = frame.hands[0] : righthand = frame.hands[1];
     
      if(righthand){
        //Get position of right hand
        var screenPosition = findScreenPosition(righthand);
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

        viewController.render({ 'coordData' : coordData,
                                'element'   : el });
      }
      
      logger.updateLogOutput({ 'coordData'  : coordData,
                                 'element'    : el,
                                 'lefthand'   : lefthand,
                                 'righthand'  : righthand });

  }
}

});