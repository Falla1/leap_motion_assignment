'use strict';

function ViewController () {
  var self = this;
  window.cursor = $('#cursor');

  self.render = function (data) {
    if(data['coordData']){
     updateCursorPosition(data['coordData']['x'], data['coordData']['y']);
    }
  }

  self.loadImages = function() {
      $('#load-buttonWrap').hide(10);
      $('.image-div').show(300);
      $('.image-span').show(300);
  }

  self.selectObject = function(position) {
    console.log("Selecting at " + position);
    
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
          images[id].selectItem();
        }
      }

    }

  }

  self.moveImagesOver = function(){
    console.log("Moving Selected Images Over");

    for(var i = 0 ; i < images.length ; i ++){
      if(images[i].selected && !images[i].onWebDiv){
        images[i].moveOver();
      }
    }
  }

  self.moveSelected = function(previousFrame, hand){
    for(var i = 0 ; i < images.length ; i ++){
      if(images[i].selected && images[i].onWebDiv){
        images[i].moveItem(previousFrame,hand);
      }
    }
  }

  self.scale = function(previousFrame,leftHand, rightHand){
    for(var i = 0 ; i < images.length ; i ++){
      if(images[i].selected && images[i].onWebDiv){
        images[i].scale(previousFrame,leftHand, rightHand);
      }
    }
  }

  self.deselectEverything = function(){
    //Unsure if we are wanting to do this though
    console.log("Deselecting Selected Images");
    for(var i = 0 ; i < images.length ; i ++){
      if(images[i].selected){
        images[i].selectItem();
      }
    }
  }

  self.rotateSelected = function(hand){

    console.log("Rotating Selected");
    for(var i = 0 ; i < images.length ; i ++){
      if(images[i].selected && images[i].onWebDiv){
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
}