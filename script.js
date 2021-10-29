var bright = document.getElementById('bright');
var sat = document.getElementById('saturation');
var bri_c = document.getElementById('bri_check');
var sat_c = document.getElementById('sat_check');
var scale = document.getElementById('greyscale');
var gre_c = document.getElementById('gre_check');
var cont = document.getElementById('contrast');
var cont_ch = document.getElementById('cont_check');
var invert = document.getElementById('invert');
var bw = document.getElementById('bwhite');
var ctx = document.getElementById('canvas').getContext('2d');
var canvas = document.getElementById('canvas');
var is_img = false;

var imageLoader = document.getElementById('imageLoader');
imageLoader.addEventListener('change', handleImage);
bright.addEventListener('change', brights);
bri_c.addEventListener('click', brights);
sat.addEventListener('change', brights);
sat_c.addEventListener('click', brights);
scale.addEventListener('change', brights);
gre_c.addEventListener('click', brights);
cont.addEventListener('change', brights);
cont_ch.addEventListener('click', brights);
invert.addEventListener('click', brights);
bw.addEventListener('click', brights);

//Listeners for drag and drop events
canvas.addEventListener('dragenter', dragEnter, false);
canvas.addEventListener('dragover', dragOver, false);
canvas.addEventListener('drop', drop, false);
canvas.addEventListener('dragleave', dragLeave, false);

for (element of document.querySelectorAll('input')) { // set every input's default value
  element.setAttribute('default', element.value);
};

function enable() {
}

function enable_or_disable() {
  if (is_img == true)
  {
    console.log("Image present enabling Toolbox and Download Button");
    document.getElementById("tools-container").classList.remove('disabled');
    document.getElementById("download-button").style.display = 'block';
  }
  else
  {
    console.log("No image selected hiding Toolbox and Download Button");
  }
}

var img, mydata;
function handleImage(e) {
  var reader = new FileReader();
  reader.onload = function (event) {
    img = new Image();
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      newImage = ctx.getImageData(0, 0, 800, 400);
      mydata = newImage.data;
      newImage.data = mydata;
      ctx.putImageData(newImage, 0, 0);
    };
    img.src = event.target.result;
    is_img = true;
    enable_or_disable();
  };
  if (e.target.id == 'imageLoader') {
    reader.readAsDataURL(e.target.files[0]);
  }
}

//Drag and Drop Functionality
function dragEnter(e) {
  e.stopPropagation();
  e.preventDefault();
}

function dragOver(e) {
  e.stopPropagation();
  e.preventDefault();
  e.currentTarget.style.background = "url('public/image-illustration2.svg') no-repeat center #595959";
}

function dragLeave(e) {
  e.stopPropagation();
  e.preventDefault();
  e.currentTarget.style.background = "url('public/image-illustration.svg') no-repeat center";
}


function drop (e){
  e.stopPropagation();
  e.preventDefault();
  var reader = new FileReader();

  var dt = e.dataTransfer;
  var file = dt.items[0].getAsFile();
  reader.readAsDataURL(file);

  reader.onload = function(e){
    img = new Image();
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      newImage = ctx.getImageData(0, 0, 800, 400);
      mydata = newImage.data;
      newImage.data = mydata;
      ctx.putImageData(newImage, 0, 0);
    };
    img.src = e.target.result;
    is_img = true;
    enable_or_disable();
  }
}

function brights() {
  ctx.drawImage(img, 0, 0);
  newImage = ctx.getImageData(0, 0, img.width, img.height);
  mydata = newImage.data;
  newImage.data = mydata;
  ctx.putImageData(newImage, 0, 0);

  //start brightness
  if (bri_c.checked == true) {
    for (var i = 0; i < mydata.length; i += 4) {
      mydata[i] = mydata[i] * bright.value;
      mydata[i + 1] = mydata[i + 1] * bright.value;
      mydata[i + 2] = mydata[i + 2] * bright.value;
    }
  }
  //End brightness

  //start greyscale
  if (gre_c.checked == true) {
    for (var i = 0; i < mydata.length; i += 4) {
      var grey = (mydata[i] + mydata[i + 1] + mydata[i + 2]) / scale.value;
      mydata[i] = grey;
      mydata[i + 1] = grey;
      mydata[i + 2] = grey;
    }
  }
  //end grey scale

  //start Contrast
  function Truncate(value) {
     if (value < 0.0) {
       value = 0.0;
     } else if (value > 255.0) {
       value = 255.0;
     }
     return value;
  }

  if (cont_ch.checked == true) {
    var contrast = parseInt(cont.value, 10);
    for (var i = 0; i < mydata.length; i += 4) {
      var factor = (259.0 * (contrast + 255.0)) / (255.0 * (259.0 - contrast));
      mydata[i] = Truncate(factor * (mydata[i] - 128.0) + 128.0);
      mydata[i + 1] = Truncate(factor * (mydata[i + 1] - 128.0) + 128.0);
      mydata[i + 2] = Truncate(factor * (mydata[i + 2] - 128.0) + 128.0);
    }
  }
  //end Contrast
  //start Saturation
  if (sat_c.checked == true) {
    let sv = Number(sat.value);
    var luR = 0.3086; // constant to determine luminance of red
    var luG = 0.6094; // constant to determine luminance of green
    var luB = 0.0820; // constant to determine luminance of blue
    var az = (1 - sv)*luR + sv;
    var bz = (1 - sv)*luG;
    var cz = (1 - sv)*luB;
    var dz = (1 - sv)*luR;
    var ez = (1 - sv)*luG + sv;
    var fz = (1 - sv)*luB;
    var gz = (1 - sv)*luR;
    var hz = (1 - sv)*luG;
    var iz = (1 - sv)*luB + sv;

    for (var i = 0; i < mydata.length; i += 4) {
       var red = mydata[i]; // Extract original red color [0 to 255]
       var green = mydata[i + 1]; // Extract original green color [0 to 255]
       var blue = mydata[i + 2]; // Extract original blue color [0 to 255]

       mydata[i] = (az*red + bz*green + cz*blue);
       mydata[i + 1] = (dz*red + ez*green + fz*blue);
       mydata[i + 2] = (gz*red + hz*green + iz*blue);
    }
    newImage.data = mydata;
    ctx.putImageData(newImage, 0, 0);
  }
  //end saturation

  //start invert picture
  if (invert.checked == true) {
    for (var i = 0; i < mydata.length; i += 4) {
      mydata[i] = 255 - mydata[i];
      mydata[i + 1] = 255 - mydata[i + 1];
      mydata[i + 2] = 255 - mydata[i + 2];
    }
    newImage.data = mydata;
    ctx.putImageData(newImage, 0, 0);
  }
  //End invert picture

  //start B/W picture
  if (bw.checked == true) {
    for (var i = 0; i < mydata.length; i += 4) {
      var grey = (mydata[i] + mydata[i + 1] + mydata[i + 2]) / 3;
      if (grey < 128) {
        mydata[i] = mydata[i + 1] = mydata[i + 2] = 0;
      } else {
        mydata[i] = mydata[i + 1] = mydata[i + 2] = 255;
      }
    }
    newImage.data = mydata;
    ctx.putImageData(newImage, 0, 0);
  }
  //End B/W picture
  newImage.data = mydata;
  ctx.putImageData(newImage, 0, 0);
}
/*End Editing Function*/

// Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById('myBtn');

// Get the <span> element that closes the modal
var span = document.getElementsByClassName('close')[0];

// When the user clicks on the button, open the modal
btn.onclick = function () {
  modal.style.display = 'block';
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = 'none';
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
};

var download = function () {
  console.log('download');
  var link = document.createElement('a');
  link.download = 'PicStar_Export.png';
  link.href = document.getElementById('canvas').toDataURL();
  link.click();
};

const downloadButton = document.getElementById('download-button');
downloadButton.addEventListener('click', download);

var reset = function () {
  console.log('reset');
  for (element of document.querySelectorAll('input')) {
	if (element.type != 'checkbox') {
		console.log(element.value)
		element.value = element.getAttribute('default')
		console.log(element.value)
	} else {
		element.checked = false
	}
  }
  brights()
};

const resetButton = document.getElementById('reset');
resetButton.addEventListener('click', reset);

reset() // reset all values upon refreshing (browsers cache the old values)
