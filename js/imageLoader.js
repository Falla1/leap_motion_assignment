$(function() {
  var imagePath = '/images/img_';
  var imageWidth = imageHeight =  100;

  this.floatDirection = function (index) {
    var direction = null;
    index % 2 === 0 ? direction = 'right' : direction = 'left';
    return direction;
  }

  for (var i = 16; i > 0; i--) {
    var elemContainer = document.createElement('span');
    var floatDirection = this.floatDirection(i);
    elemContainer.setAttribute('class', 'image-span hidden');

    elemContainer.setAttribute('id', 'image-span'+i);

    var elem = document.createElement('img');
    elem.setAttribute('src', imagePath + i + '.jpg');
    elem.setAttribute('height', imageHeight);
    elem.setAttribute('width', imageWidth);
    elem.setAttribute('alt', 'image');
    elemContainer.appendChild(elem);
    document.getElementById('image-div').appendChild(elemContainer);
  };
});