$(function(){

  var viewController = new ViewController();
  var logger = new LeapLogger();
  var imagesLoaded = false;

  var leapController = new Leap.Controller({enableGestures: true}).use('screenPosition', { scale: 1}).connect();

  leapController
  .on('frame', function(frame){

    updateCursor(frame);

    //Handle gestures based on whether one or two hands in frame
    if(frame.hands.length === 1){
      handleKeyTapsSwipes(frame);
    }
    else if(frame.hands.length === 2){
      handleRollPinch(frame)
    }
  });

  function handleKeyTapsSwipes(frame){

    for(var g = 0; g < frame.gestures.length; g++){

      var gesture = frame.gestures[g];
      var handIds = gesture.handIds;

      //Only a single hand
      if(handIds.length == 1){
        var hand = frame.hand(handIds[0]);

        if(hand.valid){
          if(hand.type = "left"){
            if(gesture.type == 'keyTap'){
              viewController.selectObject(findScreenPosition(hand));
            }
            else if(gesture.type == 'swipe'){
            //Getting Horizontal Direction
              if(Math.abs(gesture.direction[0]) > Math.abs(gesture.direction[1])){
                //Determine the direction of the movement
                if(gesture.direction[0] > 0){
                    viewController.moveImagesToWorkspace();
                } else {
                    viewController.deselectEverything();
                }
              }
            }
          }
        }
      }
    }
  }

  function handleRollPinch(frame){

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

      else if(pinch(lefthand) && pinch(righthand)){
        // console.log("Double Pinch");
        viewController.scale(leapController.frame(1),lefthand,righthand);
      }

      else if(pinch(lefthand)){
        // console.log("Single Pinch");
        viewController.moveSelected(leapController.frame(1), lefthand);
      }
      else if(lefthand && (lefthand.roll() > 0.01 || lefthand.roll() < -0.01) && !righthand){
        viewController.rotateSelected(lefthand);
      }
      else if(pinch(righthand) && !lefthand){ //trying right pinch to end roll and scale
        // console.log("Stopping");
        viewController.deselectEverything();
      }
    }
  }

  function openGesture(lefthand, righthand) {
    if(!lefthand || !righthand) return false;
    if(lefthand.roll()  > 1 && righthand.roll() < 1){
      return true;
    }
    return false;
  }

  function findScreenPosition(hand) {
    if (hand) {
      return hand.screenPosition(hand.palmPosition);
    }
  }

  function pinch (hand) {
    if(!hand) return false;
    return hand.pinchStrength > 0.8;
  }

  function updateCursor(frame){

    if(frame.hands.length > 0){

      var lefthand = null;
      frame.hands[0].type === 'left' ? lefthand = frame.hands[0] : lefthand = frame.hands[1];

      //Use RightHand to move cursor
      var righthand = null;
      frame.hands[0].type === 'right' ? righthand = frame.hands[0] : righthand = frame.hands[1];

      if(lefthand){
        //Get position of right hand
        var screenPosition = findScreenPosition(lefthand);
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