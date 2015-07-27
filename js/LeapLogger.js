function LeapLogger () {
  var self = this;
  window.output = $('#output');

  var outputContent = null;

  function outputDebugInfo (el, hands){
    if(el){
      outputContent += '<br>Topmost element: '+ el.tagName + ' #' + el.id +  ' .' + el.className;
      outputContent += '<br> Has the class we\'re looking for ' + (el.id === 'load-button');
    }

    if(hands['l']) outputContent += '<br> Are we grabbing shit with our lefthand?' + hands['l'].grabStrength;
    if(hands['r']) outputContent += '<br> Are we grabbing shit with our righthand?' + hands['r'].grabStrength;
    if(hands['l']) outputContent += '<br> Are we pinching shit?' + hands['l'].pinchStrength;
    if(hands['r']) outputContent += '<br> Are we pinching shit?' + hands['r'].pinchStrength;
    if(hands['l']) outputContent += '<br> They see me rolling left'   + hands['l'].roll();
    if(hands['r']) outputContent += '<br> They see me rolling right'   + hands['r'].roll();
  };

  self.updateLogOutput = function(data) {
    var leftHand  = data['lefthand'];
    var rightHand = data['righthand'];
    var element   = data['element'];
    var coordData = data['coordData'];

    if(coordData){
      outputContent = "x: " + (coordData['x']) + 'px' +
         "        <br/>y: " + (coordData['y']) + 'px' +
         "        <br/>z: " + (coordData['z']) + 'px';
    }
    else{
      outputContent = "Can not pick up hands"
    }

    outputDebugInfo(element, { 'l' : leftHand, 'r' :  rightHand });
    output.html(outputContent);
  };
}