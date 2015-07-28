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