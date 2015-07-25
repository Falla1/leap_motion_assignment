$(function(){
  window.cursor = $('#cursor');
  window.output = $('#output');

  var imagesLoaded = false;

  function outputInfo (outputContent, el, hand){
    outputContent += '<br>Topmost element: '+ el.tagName + ' #' + el.id +  ' .' + el.className;
    outputContent += '<br> Are we grabbing shit?' + hand.grabStrength;
    outputContent += '<br> Are we pinching shit?' + hand.pinchStrength;
    outputContent += '<br> Has the class we\'re looking for ' + (el.id === 'load-button');
    return outputContent;
  };

  Leap.loop({hand: function(hand){

    var screenPosition = hand.screenPosition(hand.palmPosition);

    var outputContent = "x: " + (screenPosition[0].toPrecision(4)) + 'px' +
           "        <br/>y: " + (screenPosition[1].toPrecision(4)) + 'px' +
           "        <br/>z: " + (screenPosition[2].toPrecision(4)) + 'px';


    // hide and show the cursor in order to get second-topmost element.
    cursor.hide();
    var el = document.elementFromPoint(
        hand.screenPosition()[0],
        hand.screenPosition()[1]
    );
    cursor.show();

    if (el){
      outputContent = outputInfo(outputContent, el, hand);

      if(!imagesLoaded){
        if( el.id === "load-buttonWrap" || el.id === "load-button" ){
          $('#load-buttonWrap').addClass('hidden');
          $('.image-div').removeClass('hidden');
          $('.image-span').removeClass('hidden');
          imagesLoaded = true;
        }
      }

      if(imagesLoaded){
        // el.className === 'image-span' ? 
      }





    }
    output.html(outputContent);

    cursor.css({
      left: screenPosition[0] + 'px',
      top:  screenPosition[1] + 'px'
    });

  }})
  .use('screenPosition', {
    scale: 1
  });


});