'use strict';

function ViewController () {
  var self = this;
  window.cursor = $('#cursor');

  var selectedItems = [];

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
          //We should use objects
          //This will need to be changed to call the object method
          el.style.border='2px solid #E8272C';
        }
      }

    }

  }

  self.moveImagesOver = function(){
    console.log("Moving Selected Images Over");
  }

  self.deselectEverything = function(){
    console.log("Deleting Selected Images");
  }

  self.rotateSelected = function(hand,gesture){
    console.log("Rotating Selected");
  }

  function updateCursorPosition (x, y) {
    cursor.css({
      left: x + 'px',
      top:  y + 'px'
    });
  };
}