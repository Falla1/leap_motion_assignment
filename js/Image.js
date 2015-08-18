function Image (imagePath, id) {
  var self = this;

  //Information to know about itself
  this.selected = false;
  this.onWorkspace = false;
  this.imagesOnWorkspace = 0;
  var elemContainer;
  var elem;

  self.init = function() {
    //Create the span to hold the image element
    elemContainer = document.createElement('span');
    elemContainer.setAttribute('class', 'image-span');
    elemContainer.setAttribute('id', 'image-span'+ id);
    elemContainer.style.zIndex=700;

    //Create the image element with the next photo
    elem = document.createElement('img');
    elem.setAttribute('src', imagePath + '.jpg');
    elem.setAttribute('class', 'image-thumbnail');
    elem.setAttribute('alt', 'image');
    elem.setAttribute('id', id);


    //Setting them so we can scale with it
    elem.style.height='100px';
    elem.style.width='100px';

    //Add the image to the image span, add the span to the preview div
    elemContainer.appendChild(elem);
    document.getElementById('image-div').appendChild(elemContainer);
  };

  self.selectItem = function() {
    this.selected = !this.selected;

    if(elem.style.border){
      elem.style.border = '';
    }
    else{
      elem.style.border='1px solid #E8272C';

      // console.log("Deselecting Selected Images");
      for(var i = 0 ; i < images.length ; i ++){
        if(!images[i].selected && images[i].onWorkspace && this.onWorkspace){
          images[i].lowerOpacity();
        }
      }
    }
  }

  self.lowerOpacity = function(){
    elem.style.opacity=0.5;
    elemContainer.style.opacity=0.5;
  }

  self.resetOpacity = function(){
    elem.style.opacity=1.0;
    elemContainer.style.opacity=1.0;
  }

  self.moveToWorkspace = function() {
    this.selectItem();
    this.onWorkspace = true;
    var workspace = document.getElementById('workspace-div');
    //Change the parent from image-div to workspace
    workspace.appendChild(elemContainer);

    var box = workspace.getBoundingClientRect();
    //Randomizing the position that we put each image.

    var minX = box.left;
    var minY = box.top;

    var maxX = box.right;

    var maxY = box.bottom;

    elemContainer.style.position = 'absolute';

    elem.style.position = 'absolute';
    elem.style.left = Math.floor(Math.random() * ((maxX / 2) - 100)) + 0 + 'px';
    elem.style.top = Math.floor(Math.random() * ((maxY / 2) - 100)) + 0 + 'px';
  }

  self.getZ = function(){
    return parseInt(elemContainer.style.zIndex);
  }

  self.alterZ = function(value){
    elemContainer.style.zIndex= parseInt(elemContainer.style.zIndex) + value;
  }

  self.moveItem = function(previousFrame, hand) {

    var movement = hand.translation(previousFrame);

    //Getting the bounding box of the image div
    var rect = document.getElementById("workspace-div").getBoundingClientRect();

    //every mm = 3px
    var newXCoord = (parseInt(elem.style.left) + movement[0] * 3);
    var newTopCoord = (parseInt(elem.style.top) - movement[1] * 3);

    if(newXCoordInBounds(newXCoord, rect)){
      //else, still within the x bound
      elem.style.left = newXCoord + 'px';
    }

    if(newTopCoordInBounds(newTopCoord, rect)){
      //else, still within the y bound
      elem.style.top = newTopCoord + 'px';
    }
  }

  self.scale = function(previousFrame, leftHand, rightHand){

    //unsure how to replace a single transform
    //ie, how to replace the scale without affecting the rotate transform

    //rotate by moving the right hand
    var rightHandMovement = rightHand.translation(previousFrame);

    //every mm = .01 scale
    var scaleX = rightHandMovement[0] * .01;
    var scaleY = rightHandMovement[1] * .01;

    var newY = parseInt(elem.style.height) + (parseInt(elem.style.height) * scaleY);
    var newX = parseInt(elem.style.width) + (parseInt(elem.style.width) * scaleX);

    if(scaleWithinBounds({ "newX" : newX, "newY" : newY })){
      elem.style.height = newY  + 'px';
      elem.style.width = newX  + 'px';
    }
  }

  self.rotate = function(hand) {
    var position = hand.screenPosition();
    var rotation = hand.roll();

    var currentRotation = 0.0;
    var newRotation = 1;

    if(elem.style.transform){
      //Getting the rotation amount
     currentRotation = parseFloat(elem.style.transform.split("(")[1].split("rad")[0]);
    }

    if(rotation < -0.1){
      newRotation = currentRotation + .03;
    }
    else if(rotation > 0.1){
      newRotation = currentRotation - .03;
    }
    else{
      //The hand is not tilted enough
      //Therefore do nothing.
      return;
    }

    elem.style.transform = this.getNewTransform('rotate','rotate(' + newRotation + 'rad)');

    elem.style.webkitTransform = elem.style.MozTransform = elem.style.msTransform =
    elem.style.OTransform = elem.style.transform;
  }

  //Was being used when we were applying rotate and scale as a transform
  self.getNewTransform = function(transformType, transformToApply) {

    var currentTransform = elem.style.transform.split(" ");
    var newTransform = "";

    for(var i = 0 ; currentTransform.length > i ; i++){

      if(transformType.indexOf(currentTransform[i]) != -1){
        newTransform = currentTransform[i] + " " + newTransform;
      }
    }
    newTransform = newTransform + transformToApply;

    return newTransform;
  }

  function newXCoordInBounds(newXCoord, rect){
    return !(newXCoord > rect.width -  parseInt(elem.style.width)|| 
      newXCoord <  1);
  }

  function newTopCoordInBounds(newTopCoord, rect){
    return !(newTopCoord > rect.height -  parseInt(elem.style.height)||
      newTopCoord <  1);
  }

  function scaleWithinBounds(scale){
    return !(scale.newY < 30 || scale.newX < 30
      || scale.newY > 250 || scale.newX > 250);
  }
}