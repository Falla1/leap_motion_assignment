'use strict';

function ViewController () {
  window.cursor = $('#cursor');


  var self = this;

  self.render = function (data) {
    updateCursorPosition(data['coordData']['x'], data['coordData']['y']);
  }

  self.loadImages = function() {
      $('#load-buttonWrap').hide(10);
      $('.image-div').show(300);
      $('.image-span').show(300);
  }

  self.rotate = function() {
    console.log("ROtating");
  }
  function updateCursorPosition (x, y) {
    cursor.css({
      left: x + 'px',
      top:  y + 'px'
    });
  };
}