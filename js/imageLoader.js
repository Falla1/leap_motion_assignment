var images = [];

$(function() {
  var imagePath = 'images/img_';

  for (var i = 1; i < 17; i++) {
    //Create a new object, initalize it and add to the array
    var image = new Image(imagePath + i , i);
    image.init();
    images.push(image);
  };
  //Hide the images until we receive and 'open' gesture
  $('#image-div').hide();
  $('#image-span').hide();
});