'use strict';

function ViewController () {
  window.cursor = $('#cursor');


  var self = this;

  self.render = function (data) {
    updateCursorPosition(data['coordData']['x'], data['coordData']['y']);
  }

  self.loadImages = function(element) {
    if( element.id === "load-buttonWrap" || element.id === "load-button" ){
      $('#load-buttonWrap').hide(10);
      $('.image-div').show(300);
      $('.image-span').show(300);
      return true;
    }
    return false;
  }

  function updateCursorPosition (x, y) {
    cursor.css({
      left: x + 'px',
      top:  y + 'px'
    });
  };
}