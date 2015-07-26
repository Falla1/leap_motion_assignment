function LeapLogger () {
  var self = this;
  window.output = $('#output');

  var outputContent = null;

  function outputDebugInfo (el, hand){
    if(el){
      outputContent += '<br>Topmost element: '+ el.tagName + ' #' + el.id +  ' .' + el.className;
      outputContent += '<br> Has the class we\'re looking for ' + (el.id === 'load-button');
    }

    outputContent += '<br> Are we grabbing shit?' + hand.grabStrength;
    outputContent += '<br> Are we pinching shit?' + hand.pinchStrength;
  };

  self.updateLogOutput = function(data) {
    var hand = data['hand'];
    var element = data['element'];
    var coordData = data['coordData'];

    outputContent = "x: " + (coordData['x']) + 'px' +
       "        <br/>y: " + (coordData['y']) + 'px' +
       "        <br/>z: " + (coordData['z']) + 'px';

    outputDebugInfo(element, hand);
    output.html(outputContent);
  };
}