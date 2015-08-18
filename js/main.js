$(function(){

  var viewController = new ViewController();
  var logger = new LeapLogger();
  var imagesLoaded = false;
  var imagesMovedWorkSpace = false;
  var pitchedPrevious = false;

  var leapController = new Leap.Controller({enableGestures: true}).use('screenPosition', { scale: 1}).connect();

  leapController.on('frame', function(frame){
    updateCursor(frame);
    //Seperated the 'gestures' from the predefined gestures
    //key tap and swipe vs pinch and roll
    handleKeyTapsSwipes(frame);
    handleRollPinch(frame);
  });

  function handleKeyTapsSwipes(frame){

    for(var g = 0; g < frame.gestures.length; g++){

      var gesture = frame.gestures[g];
      var handIds = gesture.handIds;

      //Only a single hand
      if(handIds.length == 1){
        var hand = frame.hand(handIds[0]);
        if(hand.valid){
          if(hand.type == "right" && gesture.type == 'keyTap' ){
            viewController.selectObject(findScreenPosition(hand));
          }
          else if(hand.type == "left" && gesture.type == 'swipe'){

          //Getting Horizontal Direction
          var isHorizontal = Math.abs(gesture.direction[0]) > Math.abs(gesture.direction[1]);
            if(isHorizontal){
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

  function handleRollPinch(frame){

    if(frame.hands.length > 0){

      //Get the objects for the hands
      var lefthand = null;
      frame.hands[0].type === 'left' ? lefthand = frame.hands[0] : lefthand = frame.hands[1];

      var righthand = null;
      frame.hands[0].type === 'right' ? righthand = frame.hands[0] : righthand = frame.hands[1];

      //Open the preview images into the preview pane
      if(!imagesLoaded && openGesture(lefthand, righthand)){
        viewController.loadImages();
        imagesLoaded = !imagesLoaded;
      }
      //Double pinch indicates scale effect
      else if(pinch(lefthand) && pinch(righthand)){
        viewController.scale(leapController.frame(1),lefthand,righthand);
      }
      //Pinch with left hand indicates move effect
      else if(pinch(lefthand) && !isFist(lefthand)){
        viewController.moveSelected(leapController.frame(1), lefthand);
      }
      else if(pitch(righthand) > 1){
        //Checking the pitch, so each pitch is equal to only one movement
        if(!pitchedPrevious){
          viewController.shuffleObjectForward(findScreenPosition(righthand), righthand);
          pitchedPrevious = true;
        }
      }
      //Negative pitch value means the hand is hard for the leap to pick up
      //Therefore, using -0.8 instead of 1 to make it less pitch.
      else if(pitch(righthand) < -0.8){
        if(!pitchedPrevious){
          viewController.shuffleObjectBackward(findScreenPosition(righthand), righthand);
          pitchedPrevious = true;
        }
      }
      //Roll with left indicates rotate
      else if(lefthand && (lefthand.roll() > 0.01 || lefthand.roll() < -0.01) && 
                !righthand && handInRotatePosition(lefthand)){
        viewController.rotateSelected(lefthand);
      }
      else{
        //Setting it to false, therefore the leap is picking up we have left the 'pitch' position
        pitchedPrevious = false;
      }
    }
  }

  function isFist(hand){
    if(!hand) return false;
    return hand.grabStrength > 0.70;
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

  function pitch (hand) {
    if(!hand) return false;
    console.log(hand.pitch());
    return hand.pitch();
  }

  function handInRotatePosition(hand){
    //Using a 'hang ten' position to differentiate between moving and rotating
    var thumb       = hand.thumb.extended;
    var pinky       = hand.pinky.extended;
    var middle      = hand.middleFinger.extended;
    var index       = hand.indexFinger.extended;
    var ringFinger  = hand.ringFinger.extended;

    return (thumb && pinky) && !(middle && index && ringFinger);
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