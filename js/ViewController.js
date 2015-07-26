'use strict';

function ViewController () {
  window.cursor = $('#cursor');
  window.output = $('#output');

  var self = this;
  var outputContent = null;

  function outputDebugInfo (el, hand){
    if(el){
      outputContent += '<br>Topmost element: '+ el.tagName + ' #' + el.id +  ' .' + el.className;
      outputContent += '<br> Has the class we\'re looking for ' + (el.id === 'load-button');
    }

    outputContent += '<br> Are we grabbing shit?' + hand.grabStrength;
    outputContent += '<br> Are we pinching shit?' + hand.pinchStrength;
  };

  self.updateOutput = function(data) {
    var hand = data['hand'];
    var element = data['element'];
    var coordData = data['coordData'];
    var cursorPosition = data['cursorPosition'];

    outputContent = "x: " + (coordData['x']) + 'px' +
       "        <br/>y: " + (coordData['y']) + 'px' +
       "        <br/>z: " + (coordData['z']) + 'px';

    outputDebugInfo(element, hand);

    cursor.css({
      left: cursorPosition['left'] + 'px',
      top:  cursorPosition['top'] + 'px'
    });

    output.html(outputContent);
  };
}