$(function(){

  var viewController = new ViewController();
  var logger = new LeapLogger();
  var imagesLoaded = false;

  var leapController = new Leap.Controller({enableGestures: true}).use('screenPosition', { scale: 1}).connect();

  leapController
  .on('frame', function(frame){

    updateCursor(frame);

    //Seperated the 'gestures' from the predefined gestures
    //key tap and swipe vs pinch and roll
    handleKeyTapsSwipes(frame);

    handleRollPinch(frame);

  })

  function handleKeyTapsSwipes(frame){

    for(var g = 0; g < frame.gestures.length; g++){

      var gesture = frame.gestures[g];
      var handIds = gesture.handIds;

      //Only a single hand
      if(handIds.length == 1){
          var hand = frame.hand(handIds[0]);
          if(hand.valid){
            if(hand.type == "right" && gesture.type == 'keyTap'){
              viewController.selectObject(findScreenPosition(hand));
            }

            else if(hand.type == "right" && gesture.type == 'swipe'){

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

      else if(lefthand && (lefthand.roll() > 0.3 || lefthand.roll() < -0.3) && !righthand){
        viewController.rotateSelected(lefthand);
      }

      else if(pinch(lefthand) && pinch(righthand)){
        console.log("Double Pinch");
        viewController.scale(leapController.frame(1),lefthand,righthand);
      }

      else if(pinch(lefthand)){
        console.log("Single Pinch");
        viewController.moveSelected(leapController.frame(1), lefthand);
      }

      else if(pinch(righthand) && !lefthand){ //trying right pinch to end roll and scale
        console.log("Stopping");
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

  function findScreenPosition(righthand) {
    if (righthand) {
      return righthand.screenPosition(righthand.palmPosition);
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