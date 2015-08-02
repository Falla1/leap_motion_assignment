var images = [];

$(function() {
  var imagePath = 'images/img_';

  for (var i = 1; i < 17; i++) {
    //Create the span to hold the image element
    var obj = function(){

      var self = this;

      //Information to know about itself
      this.selected = false;
      this.onWebDiv = false;
      var elemContainer;
      var elem;

      self.init = function(){
        elemContainer = document.createElement('span');    
        elemContainer.setAttribute('class', 'image-span');
        elemContainer.setAttribute('id', 'image-span'+i);

        //Create the image element with the next photo
        elem = document.createElement('img');
        elem.setAttribute('src', imagePath + i + '.jpg');
        elem.setAttribute('class', 'image-thumbnail');
        elem.setAttribute('alt', 'image');
        elem.setAttribute('id', i);

        //Add the image to the image span, add the span to the preview div
        elemContainer.appendChild(elem);
        document.getElementById('image-div').appendChild(elemContainer);
      };

      self.selectItem = function(){
        this.selected = !this.selected;
        if(elem.style.border){
          elem.style.border = '';
        }
        else{
          elem.style.border='1px solid #E8272C';
          elem.style.opacity=1.0; //trying to make the opacity 100% when selected, need 0.5 for half/ 50%
          console.log("changing opacity");
          //TODO: get children and change their opacity to 0.5
          var d = document.getElementById('workspace-div').childNodes.length;
          console.log(d);
          if(d>2){
            var c = document.getElementById('workspace-div').childNodes;
            c[1].style.opacity = 0.5;
          }
          
        }      
      }

      self.moveOver = function(){
        console.log("Moving over");
        this.selectItem();
        this.onWebDiv = true;

        //Change the parent from image-div to workspace
        document.getElementById('workspace-div').appendChild(elemContainer);

        //Randomizing the position that we put each image.
        //Unsure if need, because I can't get translating to work without
        //setting to absolute position, but should try dragula

        var minX = document.getElementById('workspace-div').offsetLeft;
        var minY = document.getElementById('workspace-div').offsetTop;

        var maxX = document.getElementById('workspace-div').offsetWidth - elem.width;

        var maxY = document.getElementById('workspace-div').offsetHeight - elem.height;

        elemContainer.style.position = 'absolute';

        elem.style.position = 'absolute';
        //elem.style.left = Math.floor(Math.random() * (maxX-minX)) + minX + 'px';
        //elem.style.top = Math.floor(Math.random() * (maxY-minY)) + minY + 'px';
        
        //testing purposes
        elem.style.left = 1500;
        elem.style.top = 170;

      }

      self.moveItem = function(previousFrame,hand){
        
        var movement = hand.translation(previousFrame);

        //every mm = 3px
        elem.style.left = (parseInt(elem.style.left) + movement[0] * 3) + 'px';
        elem.style.top = (parseInt(elem.style.top) + movement[1] * 3) + 'px';

      }

      self.scale = function(previousFrame,leftHand, rightHand){

        //unsure how to replace a single transform
        //ie, how to replace the scale without affecting the rotate transform

        //rotate by moving the right hand
        var rightHandMovement = rightHand.translation(previousFrame);

        //every mm = .01 scale
        var scaleX = 1 + (rightHandMovement[0] * .01);
        var scaleY = 1 + (rightHandMovement[1] * .01);

        elem.style.transform = elem.style.transform +'scale(' + scaleX + ',' + scaleY + ')';

        elem.style.webkitTransform = elem.style.MozTransform = elem.style.msTransform =
        elem.style.OTransform = elem.style.transform;

      }

      self.rotate = function(hand){
        console.log("Rotating");
        var position = hand.screenPosition();
        var rotation = hand.roll();

        //No idea...This is copy pasta from example
        //elem.style.left = elem.style.left - (elem.width  / 2) + 'px';
        //elem.style.top  = elem.style.top - (elem.height / 2) + 'px';

        elem.style.transform = 'rotate(' + -rotation + 'rad)';

        elem.style.webkitTransform = elem.style.MozTransform = elem.style.msTransform =
        elem.style.OTransform = elem.style.transform;
      }

    };
    //Create a new object, initalize it and add to the array
    var ob = new obj();
    ob.init();
    images.push(ob);
  };
  //Hide the images until we receive and 'open' gesture
  $('#image-div').hide();
  $('#image-span').hide();

});