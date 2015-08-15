'use strict';

function ViewController () {
  var self = this;
  window.cursor = $('#cursor');
  var iconToggle = 1;
  var iconFile = { 0 : "icons/open_hands.png",
                   1 : "icons/open_hands_end.png"}

  self.render = function (data) {
    if(data['coordData']){
     updateCursorPosition(data['coordData']['x'], data['coordData']['y']);
    }
  }

  self.loadImages = function() {
    $('#open-icons').hide();
      // $('#load-buttonWrap').hide(10);
      $('.image-div').show(300);
      $('.image-span').show(300);
  }

  self.selectObject = function(position) {
    // console.log("Selecting at " + position);

    //Get the element at the position
    var el = document.elementFromPoint(
      position[0],
      position[1]
    );

    if(el){
      //element of type html-object/tagName
      if(el.nodeType == 1){
        //It is an image that we tried to select
        if(el.tagName=="IMG"){
          this.deselectEverything();
          var id = el.getAttribute('id') - 1;
          images[id].selectItem();
        }
      }

    }

  }

  self.shuffleObjectForward = function(position, hand) { //used for occlusion
    for(var i = 0 ; i < images.length ; i ++){
      if(images[i].selected && images[i].onWorkspace){ //get selected image
        console.log("testing selected forward");
        images[i].shuffleForward(hand);
      }
    }
  }

  self.shuffleObjectBackward = function(position, hand) { //used for occlusion
    for(var i = 0 ; i < images.length ; i ++){
      if(images[i].selected && images[i].onWorkspace){ //get selected image
        console.log("testing selected back");
        images[i].shuffleBackward(hand);
      }
    }
  }

  self.moveImagesToWorkspace = function(){
    // console.log("Moving Selected Images Over");

    for(var i = 0 ; i < images.length ; i ++){
      if(images[i].selected && !images[i].onWorkspace){
        images[i].moveToWorkspace();
      }
    }
  }

  self.moveSelected = function(previousFrame, hand){
    for(var i = 0 ; i < images.length ; i ++){
      if(images[i].selected && images[i].onWorkspace){
        images[i].moveItem(previousFrame,hand);
      }
    }
  }

  self.scale = function(previousFrame,leftHand, rightHand){
    for(var i = 0 ; i < images.length ; i ++){
      if(images[i].selected && images[i].onWorkspace){
        images[i].scale(previousFrame,leftHand, rightHand);
      }
    }
  }

  self.deselectEverything = function(){
    //Firstly, reset everything's opacity
    for(var i = 0 ; i < images.length ; i ++){
      if(images[i].onWorkspace){
        images[i].resetOpacity();
      }
    }

    // console.log("Deselecting Selected Images");
    for(var i = 0 ; i < images.length ; i ++){
      if(images[i].selected){
        images[i].selectItem();
      }
    }
  }

  self.rotateSelected = function(hand){

    // console.log("Rotating Selected");
    for(var i = 0 ; i < images.length ; i ++){
      if(images[i].selected && images[i].onWorkspace){
        images[i].rotate(hand);
      }
    }
  }

  function updateCursorPosition (x, y) {
    cursor.css({
      left: x + 'px',
      top:  y + 'px'
    });
  };
  $('#hidebutton').on('click', function() {
    $('#gestureGuide').hide();
  });
  window.setInterval(function(){
    $('#openGestureIcon').attr('src', iconFile[iconToggle]);
    iconToggle = Math.abs(1 - iconToggle);
    console.log("sauce");
  }, 1000);
}