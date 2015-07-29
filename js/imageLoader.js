$(function() {
  var imagePath = 'images/img_';

  for (var i = 16; i > 0; i--) {
    //Create the span to hold the image element
    var elemContainer = document.createElement('span');
    elemContainer.setAttribute('class', 'image-span');
    elemContainer.setAttribute('id', 'image-span'+i);

    //Create the image element with the next photo
    var elem = document.createElement('img');
    elem.setAttribute('src', imagePath + i + '.jpg');
    elem.setAttribute('class', 'image-thumbnail');
    elem.setAttribute('alt', 'image');

    //Add the image to the image span, add the span to the preview div
    elemContainer.appendChild(elem);
    document.getElementById('image-div').appendChild(elemContainer);
  };
  //Hide the images until we receive and 'open' gesture
  $('#image-div').hide();
  $('#image-span').hide();
});