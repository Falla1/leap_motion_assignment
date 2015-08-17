'use strict';

function ViewController () {
  var self = this;
  window.cursor = $('#cursor');
  //Toggle and files for open gesture animation
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
    $('.image-div').show(300);
    $('.image-span').show(300);
  }

  self.selectObject = function(position) {
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
          var id = el.getAttribute('id') - 1;
          if(id != -1){
            this.deselectEverything();
            images[id].selectItem();
          }
        }
      }
    }
  }

  self.shuffleObjectForward = function(position, hand) { //used for occlusion
    this.shuffle(1,-1);
  }

  self.shuffleObjectBackward = function(position, hand) { //used for occlusion
    this.shuffle(-1,1);
  }

  self.shuffle = function(selectDirection,otherDirection){

    var zSelected = -1;
    var imageSelected = -1;
    var imageToChange = -1;

    //Loop over the images, add each Z value to array and store the selected images Z
    for(var i = 0 ; i < images.length ; i ++){
      if(images[i].selected && images[i].onWorkspace){ 
        zSelected = images[i].getZ();
        imageSelected = i;
      }
    }
    //If we didnt find the selected image.
    if(zSelected == -1){
      return;
    }

    for(var i = 0 ; i < images.length ; i ++){
      if(images[i].onWorkspace && images[i].getZ() == zSelected + selectDirection){
        imageToChange = i;
      }
    }
    //If we cant find the next element.
    //Ie..Maybe its the lowest Z 
    if(imageToChange == -1){
      return;
    }
    //Telling the image to move itself accordingly.
    images[imageToChange].alterZ(otherDirection);
    images[imageSelected].alterZ(selectDirection);
  }

  self.moveImagesToWorkspace = function(){
    for(var i = 0 ; i < images.length ; i ++){
      if(images[i].selected && !images[i].onWorkspace){
        //Making the Z, one less, then moving image over
        this.decrementZOfAll();
        images[i].moveToWorkspace();
      }
    }
  }

  //Decreasing the Z of every image
  self.decrementZOfAll = function(){
    for(var i = 0 ; i < images.length ; i ++){
      if(images[i].onWorkspace){
        images[i].alterZ(-1);
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
    images.forEach(function(image){
      if(image.onWorkspace){
        image.resetOpacity();
        if(image.selected){
          image.selectItem();
        }
      }
    });
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