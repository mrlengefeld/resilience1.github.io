
// doubleclick anywhere on the canvas to unhide the html description

var showSpline = false;
var showSplineEditor = true;
var showSplineScale = false;
var pointOnSplineSpeed = 3;
var ADD = 1;
var MOV = 2;
var DEL = 3;
var splineEditorState = ADD; // initial state
var splineEditorHUDx = 440;
var splineEditorHUDy = 16;

// main texture loop dimensions
var sizeX = 512; // must be powers of 2
var sizeY = 256;
var viewX = sizeX; // viewport size (ideally exactly the texture size)
var viewY = sizeY;

// particle positions will be stored in a texture of that size
var particlesWidth = 256;
var particlesHeight = 256; // issue: can't be higher than sizeX/Y
var particleCount = particlesWidth * particlesHeight; // can also be set to lower than particlesWidth * particlesHeight

var useParticles = false;
var useProjectionFeedback = true; // rendering half a million points can slow things down significantly, don't render to texture if not needed
var useFluidSimulation = true; // the textures will be initialized anyway
var simScale = 4; // for better performance, the fluid simulation will be calculated for cells this times bigger than the main texture's pixels (powers of 2)
var renderParticlesOnly = false;

console.log("copy and paste: showSpline = true;");
// some collected curves
var points = {};
points["codepen"] =[390,115,315,140,315,255,390,265,415,215,445,215,415,215,410,265,445,265,445,215,420,215,450,220,490,215,460,215,460,265,490,265,490,255,500,115,490,140,495,265,495,255,525,235,545,215,520,215,510,255,540,265,560,245,557,215,560,295,557,265,565,215,595,215,590,245,565,235,590,245,635,215,610,215,605,255,630,265,650,235,650,215,650,265,650,220,680,220,680,265];
points["cake"] = [382,126,255,168,207,323,305,424,408,344,485,349,413,349,387,410,468,408,491,343,473,415,498,415,546,302,552,159,529,162,530,341,530,427,548,341,612,331,540,368,517,351,600,413,711,335,641,350,696,416,796,366];
points["shark"] = [337, 306, 195, 348, 276, 289, 205, 188, 335, 229, 481, 219, 519, 181, 611, 206, 775, 235, 779, 273, 660, 286, 741, 287, 728, 303, 571, 322, 413, 299, 347, 303, 467, 260, 403, 308, 404, 345, 579, 271];
points["soup"] = [149, 277, 203, 293, 308, 206, 298, 206, 386, 232, 358, 301, 294, 306, 364, 304, 414, 228, 454, 203, 434, 203, 464, 215, 458, 208, 408, 257, 463, 309, 515, 254, 478, 206, 477, 213, 498, 203, 485, 201, 509, 217, 539, 220, 545, 209, 537, 220, 527, 296, 594, 297, 599, 214, 591, 218, 622, 222, 618, 218, 623, 373, 623, 228, 710, 230, 680, 287, 623, 260];
points["spice"] = [195, 271, 297, 183, 271, 182, 370, 209, 348, 287, 266, 288, 379, 280, 406, 188, 394, 374, 417, 196, 493, 202, 479, 263, 412, 258, 493, 267, 566, 197, 558, 203, 554, 288, 549, 294, 615, 211, 666, 203, 614, 214, 625, 294, 759, 228, 707, 213, 703, 295, 781, 270];
points["hack"] = [115, 307, 252, 53, 175, 97, 144, 462, 169, 305, 278, 298, 309, 465, 320, 422, 385, 313, 527, 308, 389, 318, 391, 423, 509, 429, 501, 332, 545, 443, 612, 308, 715, 280, 617, 310, 656, 416, 775, 356, 799, 61, 753, 104, 810, 439, 852, 299, 912, 259, 837, 322, 824, 329, 913, 402, 963, 358];
points["yinyang"] = [490, 430, 653, 365, 629, 158, 432, 122, 333, 307, 491, 428, 577, 305, 449, 227, 476, 116, 569, 115];
points["diode"] = [308, 278, 407, 277, 416, 271, 414, 356, 412, 363, 542, 293, 533, 255, 421, 197, 415, 264, 414, 200, 413, 191, 558, 269, 563, 173, 574, 363, 572, 378, 565, 277, 595, 275, 700, 273];
points["cypher"] = [274, 212, 197, 224, 199, 319, 285, 329, 307, 258, 310, 341, 367, 336, 365, 264, 375, 383, 299, 443, 251, 418, 390, 347, 412, 259, 407, 418, 420, 278, 479, 263, 474, 314, 424, 300, 500, 315, 560, 187, 561, 103, 521, 330, 527, 290, 590, 261, 591, 335, 659, 297, 670, 258, 622, 274, 648, 334, 731, 275, 724, 340, 741, 281, 777, 280];
points["edgelord"] = [156, 310, 233, 267, 213, 238, 183, 263, 218, 310, 284, 247, 351, 246, 282, 256, 283, 305, 345, 314, 342, 305, 375, 156, 357, 175, 357, 307, 355, 302, 387, 252, 443, 248, 388, 259, 383, 307, 435, 304, 448, 257, 447, 354, 371, 355, 503, 285, 508, 248, 476, 258, 499, 314, 563, 258, 580, 163, 561, 184, 561, 309, 615, 255, 670, 256, 675, 304, 619, 311, 610, 267, 688, 245, 710, 260, 710, 311, 715, 247, 717, 255, 752, 245, 801, 244, 749, 258, 751, 307, 796, 310, 798, 302, 816, 155, 805, 201, 807, 306, 810, 303, 833, 295];
points["frame"] = [434, 454, 866, 450, 847, 433, 845, 109, 820, 94, 150, 91, 127, 102, 131, 442, 105, 445, 549, 456];
points["3DwebFest"] = [136,60,210,64,155,110,161,116,205,133,196,186,141,194,203,185,265,99,265,102,266,191,267,69,275,71,358,85,368,170,272,194,269,188,334,185,332,186,367,289,413,219,416,211,441,277,493,253,495,162,492,171,518,232,585,197,530,173,531,263,603,228,629,61,616,246,706,242,696,188,633,195,706,191,684,264,484,303,475,298,486,437,482,372,470,366,540,357,547,357,575,375,623,364,595,335,571,386,628,416,678,335,669,336,743,347,734,402,697,419,805,376,799,271,823,416,803,328,760,327,856,316];
points["cloudsculpt"] = [26,205,53,230,122,224,82,234,70,299,142,304,190,152,169,124,180,318,229,240,286,250,282,310,226,310,226,251,308,235,310,241,313,309,358,304,363,229,372,312,371,303,404,231,454,222,403,231,402,305,459,286,476,114,459,137,477,313,513,243,509,233,556,254,562,302,523,314,554,309,578,285,600,238,639,234,591,245,599,303,643,304,669,249,667,240,671,302,713,301,713,235,720,297,739,295,758,182,743,124,762,303,792,275,793,236,800,368,796,245,842,242,845,283,817,289,881,264,897,166,892,178,900,339,895,221,860,210,946,203];
points["duststorm"] = [132,224,173,215,223,206,172,215,171,289,228,270,245,98,228,121,246,297,286,230,284,221,288,283,330,282,330,216,337,278,347,280,368,225,357,226,405,242,403,275,371,286,417,265,441,158,436,170,449,281,439,213,404,202,489,208,481,202,481,221,520,235,520,263,493,266,548,250,562,153,556,159,572,283,561,210,525,209,602,199,611,226,612,216,632,202,661,210,664,253,627,258,621,219,653,210,696,203,708,258,703,198,704,205,742,196,739,188,746,258,749,198,780,202,792,254,792,199,828,198,842,254,902,223];

if (window.location.hash.length > 10) {
  try {
    var hash = JSON.parse("[" + window.location.hash.substring(1) + "]");
    if (Array.isArray(hash) && hash.length > 3) {
      controls = hash;
    }
  } catch (e) {
    console.log(e);
  }
}

// lambda for iteration over the splines for a set of controls
function forBezier(controls, i, func) {
  var currentx = controls[i * 2 + 0];
  var currenty = controls[i * 2 + 1];
  var nextx = controls[i * 2 + 2];
  var nexty = controls[i * 2 + 3];
  var helper1x = currentx;
  var helper1y = currenty;
  if (i > 0) {
    helper1x = currentx;
    var previousx = controls[i * 2 - 2];
    var previousy = controls[i * 2 - 1];
    helper1x = currentx + (nextx - previousx) * 0.25;
    helper1y = currenty + (nexty - previousy) * 0.25;
  }
  var helper2x = nextx;
  var helper2y = nexty;
  if (i < controls.length / 2 - 2) {
    var nextnextx = controls[i * 2 + 4];
    var nextnexty = controls[i * 2 + 5];
    helper2x = nextx - (nextnextx - currentx) * 0.25;
    helper2y = nexty - (nextnexty - currenty) * 0.25;
  }
  return func(currentx, currenty, helper1x, helper1y, helper2x, helper2y, nextx, nexty, i, controls);
}

function forEachBezier(controls, func) {
  if (controls.length > 1) {
    for (var i = 0; i < controls.length / 2 - 1; i++) {
      forBezier(controls, i, func);
    }
  }
}

// see http://stackoverflow.com/a/17096947/6036193
function getCubic(normalizedDistance, a, b, c, d) {
  var t2 = normalizedDistance * normalizedDistance;
  var t3 = t2 * normalizedDistance;
  return a + (-a * 3 + normalizedDistance * (3 * a - a * normalizedDistance)) * normalizedDistance + (3 * b + normalizedDistance * (-6 * b + b * 3 * normalizedDistance)) * normalizedDistance + (c * 3 - c * 3 * normalizedDistance) * t2 + d * t3;
}

// returns the point on the spline for a normalized range value
function getPointOnSpline(controls, index) {
  index *= controls.bezierLength;
  var start = 0;
  for (var i = 0; i < controls.bezierLengths.length; i++) {
    var l = controls.bezierLengths[i];
    if (index >= start && index <= start + l) {
      return forBezier(controls, i, function (currentx, currenty, helper1x, helper1y, helper2x, helper2y, nextx, nexty) {
        return getPointOnBezier(currentx, currenty, helper1x, helper1y, helper2x, helper2y, nextx, nexty, (index - start) / l);
      });
    }
    start += l;
  }
}

function getPointOnBezier(currentx, currenty, helper1x, helper1y, helper2x, helper2y, nextx, nexty, index) {
  return [getCubic(index, currentx, helper1x, helper2x, nextx), getCubic(index, currenty, helper1y, helper2y, nexty)];
}

function getBezierLength(currentx, currenty, helper1x, helper1y, helper2x, helper2y, nextx, nexty) {
  // solve differentially with N segments
  var N = 32;
  var L = 0;
  var start = getPointOnBezier(currentx, currenty, helper1x, helper1y, helper2x, helper2y, nextx, nexty, 0);
  for (var i = 1; i <= N; i++) {
    var end = getPointOnBezier(currentx, currenty, helper1x, helper1y, helper2x, helper2y, nextx, nexty, i / N);
    L += Math.sqrt((start[0] - end[0]) * (start[0] - end[0]) + (start[1] - end[1]) * (start[1] - end[1]));
    start = end;
  }
  return L;
}

function attachBezierLengths(controls) {
  controls.bezierLengths = [];
  forEachBezier(controls, function (currentx, currenty, helper1x, helper1y, helper2x, helper2y, nextx, nexty, i, controls) {
    controls.bezierLengths[i] = getBezierLength(currentx, currenty, helper1x, helper1y, helper2x, helper2y, nextx, nexty);
  });
  controls.bezierLength = controls.bezierLengths.reduce(function (a, b) { return a + b }, 0);
}

function updateUrlHash() {
  animationFrameCount = Math.floor(controls.bezierLength / Math.sqrt(2) / pointOnSplineSpeed);
  var roundedControls = controls.map(function (x) { return Math.round(x); });
  window.location.hash = JSON.stringify(roundedControls).replace("[", "").replace("]", "");
	//pointsInput.value = window.location.hash;
}

function setControls(points) {
  controls = points;
  attachBezierLengths(controls);
	updateUrlHash();
}

function setPoints(){
	//setControlsFromCSV(pointsInput.value);
}

console.log("points = ");
console.log(points);
console.dir(Object.keys(points));
console.log(JSON.stringify(Object.keys(points)));
console.log('setControls(points["diode"]);'); // to conveniently copy and paste it in the debugger console

function setControlsFromLocationHash() {
	setControlsFromCSV(window.location.hash.substring(1));
}

function setControlsFromCSV(csv) {
  if (csv.length > 10) {
    try {
			var hash = JSON.parse("[" + csv + "]");
      pointsInput.value = csv;
      if (Array.isArray(hash) && hash.length > 3) {
        setControls(hash);
      }
    } catch (e) {
      console.log(e);
    }
  } else {
    // #controls
    setControls(points["codepen"]); // open the console to see the list of all available keys
  }
}

setControlsFromLocationHash(); // init
window.addEventListener("popstate", setControlsFromLocationHash); // listen to history events
document.addEventListener("dblclick", () => {hide(); if(splineEditorState==ADD&&showSplineEditor&&showSpline&&!hidden)window.history.back(); }); // eagerly remove the newly added point

// if it's only to delete and add pairs of xy coordinates, why not consequently use splice? maybe change it later
function array2LinkedList(controls) {
  var listHead = null;
  if (controls.length > 1) {
    for (var i = 0; i < controls.length / 2; i++) {
      var reverseIndex = (controls.length / 2 - i - 1) * 2; // iterate through the array backwards
      listHead = { x: controls[reverseIndex], y: controls[reverseIndex + 1], next: listHead }; // append a new standard object to the head of the list
    }
  }
  return listHead;
}

function linkedList2Array(listElement) {
  var array = [];
  while (listElement != null) {
    array.push(listElement.x, listElement.y);
    listElement = listElement.next;
  }
  return array;
}

function addPointAtIndex(controls, i, x, y) {
  var listHead = array2LinkedList(controls);
  if (i == -1) {
    return { x: x, y: y, next: listHead };
  } else {
    var newIndex = 0;
    var beforeElement = listHead;
    while (newIndex < i && beforeElement.next !== null) {
      beforeElement = beforeElement.next;
      newIndex++;
    }
    beforeElement.next = { x: x, y: y, next: beforeElement.next };
  }
  return listHead;
}

function deletePointAtIndex(controls, i) {
  return deletePointsAtIndices(controls, [i]);
}

function deletePointsAtIndices(controls, indices) {
  var listHead = array2LinkedList(controls);
  var length = getLength(listHead);
  sortArray(indices);
  // first remove all from the beginning
  var j = 0;
  for (; length > 2 && indices.indexOf(j) == j; j++) {
    listHead = listHead.next;
    length--;
  }
  // then remove all remaining
  var control = listHead;
  for (var i = j + 1; control != null && length > 2; i++) {
    if (indices.indexOf(i) != -1) {
      if (control.next != null) {
        control.next = control.next.next;
        length--;
      }
    } else {
      control = control.next;
    }
  }
  return listHead;
}

function getLength(listElem) {
  var l = (listElem == null) ? 0 : 1;
  while (listElem.next != null) {
    l++;
    listElem = listElem.next;
  }
  return l;
}

// todo: try typed array sort
// stoopid default JS Array.sort() ordered the integers lexicographical.
// stubborn as i was, i didn't change the array of selected indices to a typed array but hacked this
// there's room for performance improvement here but then it's not really critical (yet)
function sortArray(array) {
  for (var i = 0; i < array.length; i++) {
    var _i = array[i];
    var minRest = _i;
    var minIndex = i;
    for (var j = i; j < array.length; j++) {
      var _j = array[j];
      if (_j < minRest) {
        minRest = _j;
        minIndex = j;
      }
    }
    array[i] = minRest;
    array[minIndex] = _i;
  }
}

var oldPenX, oldPenY, newPenX, newPenY;
var animationFrameCount = Math.floor(controls.bezierLength / Math.sqrt(2) / pointOnSplineSpeed);
var animationFrame = 0;
var selectedControls = [];
var handleSize = 3.;
var hoveredControlIndex = -1;

function updateSpline(pointerX, pointerY) {
  var minD = 100;
  var nearestControlIndex = hoveredControlIndex = -1;
  for (var i = 0; i < controls.length / 2; i++) {
    var x = controls[i * 2];
    var y = controls[i * 2 + 1];
    var d = Math.sqrt((pointerX - x) * (pointerX - x) + (pointerY - y) * (pointerY - y));
    if (d < minD) {
      minD = d;
      nearestControlIndex = i;
    }
  }
  if (minD < handleSize * 2) {
    if (!previousMouseDown && (selectionWidth == 0 && selectionHeight == 0)) {
      selectedControls = [nearestControlIndex];
      hoveredControlIndex = nearestControlIndex;
    }
  } else {
    hoveredControlIndex = -1;
    if (!mouseDown && (splineEditorState != MOV || (selectionWidth == 0 && selectionHeight == 0)) && (splineEditorState != DEL || (selectionWidth == 0 && selectionHeight == 0))) {
      selectedControls = [];
    }
  }
}

var isSplineEditorHovered = false;
var isAddHovered = false;
var isMovHovered = false;
var isDelHovered = false;

var selectionLeft = -1;
var selectionTop = -1;
var selectionWidth = 0;
var selectionHeight = 0;
var selectionResized = false;
var previousMouseDown = false;
var previousIndicatedControls = controls;
var enableEditor = false;

function animatePointOnSpline(context) {
  if (animationFrame > animationFrameCount) {
    animationFrame = 0;
  }
  var index = animationFrame / animationFrameCount;

  var oldGlobalCompositeOperation = context.globalCompositeOperation;
  context.globalCompositeOperation = "source-over";

  context.fillStyle = "#000";
  context.fillRect(0, 0, sizeX, sizeY);

  if (showSplineEditor) {

    context.strokeStyle = "#FF0";
    context.font = "35px Lucida Console";

    function isInside(x, y, left, top, width, height, callback) {
      if (width < 0) {
        left += width;
        width = -width;
      } else {
        left = left;
        width = width;
      }
      if (height < 0) {
        top += height;
        height = -height;
      } else {
        top = top;
        height = height;
      }
      var _isInside = x >= left && x <= left + width && y >= top && y <= top + height;
      if (_isInside && typeof (callback) === "function") {
        callback();
      }
      return _isInside;
    }

    function isMouseInside(left, top, width, height, callback) {
      var _mouseX = mouseX * sizeX;
      var _mouseY = (1 - mouseY) * sizeY;
      return isInside(_mouseX, _mouseY, left, top, width, height, callback);
    }

    if (mouseDown && isSplineEditorHovered) {
      splineEditorHUDx += mouseDx * sizeX / viewX;
      splineEditorHUDy -= mouseDy * sizeY / viewY;
    }

    context.strokeStyle = "#00F";
    isSplineEditorHovered = isMouseInside(splineEditorHUDx, splineEditorHUDy, 48 * 3, 48, function () {
      context.strokeStyle = "#0FF";
    });
    context.save();
    context.beginPath();
    context.translate(splineEditorHUDx + 0.5, splineEditorHUDy + 0.5); // yours truly, hair lines
    context.rect(0, 0, 48 * 3, 48);
    context.stroke();

    if (splineEditorState == ADD) {
      context.strokeStyle = "#FF0";
      context.fillStyle = "#0F0";
    } else {
      context.strokeStyle = "#F00";
      context.fillStyle = "#F00";
    }
    isAddHovered = isMouseInside(splineEditorHUDx + 8, splineEditorHUDy + 8, 32, 32, function () {
      context.strokeStyle = "#FFF";
      if (mouseDown && !previousMouseDown) {
        splineEditorState = ADD;
        selectionWidth = 0;
        selectionHeight = 0;
      }
    });

    context.beginPath();
    context.rect(8, 8, 32, 32);
    context.stroke();
    context.fillText("A", 14, 35);

    if (splineEditorState == MOV) {
      context.strokeStyle = "#FF0";
      context.fillStyle = "#0F0";
    } else if (splineEditorState == ADD) {
      context.strokeStyle = "#F00";
      context.fillStyle = "#F00";
    } else {
      context.strokeStyle = "#F00";
      context.fillStyle = "#F00";
    }
    isMovHovered = isMouseInside(splineEditorHUDx + 56, splineEditorHUDy + 8, 32, 32, function () {
      context.strokeStyle = "#FFF";
      if (mouseDown && !previousMouseDown) {
        splineEditorState = MOV;
        selectionResized = false;
      }
    });

    context.beginPath();
    context.rect(56, 8, 32, 32);
    //context.rect(64, 16, 16, 16);
    context.stroke();
    context.fillText("M", 62, 35);

    if (splineEditorState == DEL) {
      context.strokeStyle = "#FF0";
      context.fillStyle = "#0F0";
    } else {
      context.strokeStyle = "#F00";
      context.fillStyle = "#F00";
    }
    isDelHovered = isMouseInside(splineEditorHUDx + 104, splineEditorHUDy + 8, 32, 32, function () {
      context.strokeStyle = "#FFF";
      if (mouseDown && !previousMouseDown) {
        splineEditorState = DEL;
        selectionWidth = 0;
        selectionHeight = 0;
        selectionResized = false;
      }
    });

    context.beginPath();
    context.rect(104, 8, 32, 32);
    context.stroke();
    context.fillText("D", 110, 35);

    context.restore();

    if ((splineEditorState == MOV || splineEditorState == DEL) && !isSplineEditorHovered) {
      var _mouseX = mouseX * sizeX;
      var _mouseY = (1 - mouseY) * sizeY;

      if (mouseDown || (!mouseDown && previousMouseDown)) {
        var selectionBoxIsHovered = isMouseInside(selectionLeft, selectionTop, selectionWidth, selectionHeight);

        if (!previousMouseDown && !selectionBoxIsHovered && hoveredControlIndex == -1) {
          selectionLeft = _mouseX;
          selectionTop = _mouseY;
          selectionWidth = 0;
          selectionHeight = 0;
          selectionResized = false;
          //console.log("selection started:", selectionLeft, selectionTop);
        } else if (!selectionResized) {
          selectionWidth += mouseDx * sizeX / viewX;
          selectionHeight -= mouseDy * sizeY / viewY;
          //console.log("selection size changed");
          // collect selectedControls
          for (var i = 0; i < controls.length / 2; i++) {
            var x = controls[i * 2 + 0];
            var y = controls[i * 2 + 1];
            // split in-group
            if (isInside(x, y, selectionLeft, selectionTop, selectionWidth, selectionHeight)) {
              if (selectedControls.indexOf(i) == -1) {
                selectedControls.push(i);
              }
            } else {
              var selectionIndex = selectedControls.indexOf(i);
              if (selectionIndex != -1) {
                selectedControls.splice(selectionIndex, 1);
              }
            }
          }

        } else {
          selectionLeft += mouseDx * sizeX / viewX;
          selectionTop -= mouseDy * sizeY / viewY;
          //console.log("selection box moved");
        }
      } else {
        selectionResized = true;
      }
    }

    // draw selection box
    if (selectionWidth != 0 || selectionHeight != 0) {
      var left, top, width, height;
      if (selectionWidth < 0) {
        left = selectionLeft + selectionWidth;
        width = -selectionWidth;
      } else {
        left = selectionLeft;
        width = selectionWidth;
      }
      if (selectionHeight < 0) {
        top = selectionTop + selectionHeight;
        height = -selectionHeight;
      } else {
        top = selectionTop;
        height = selectionHeight;
      }
      if (splineEditorState == MOV) {
        context.strokeStyle = "#666";
      } else if (splineEditorState == DEL) {
        context.strokeStyle = "#088";
      }
      context.beginPath();
      context.rect(left + 0.5, top + 0.5, width, height);
      context.stroke();
    }
  }

  context.globalCompositeOperation = "lighter";
  context.strokeStyle = "#F00";
  drawSpline(context, controls);

  var point = getPointOnSpline(controls, index);

  context.fillStyle = "#0F0";
  context.fillRect(point[0] - 1.25, point[1] - 1.25, 2.5, 2.5);

  if (showSplineEditor) {

    var nearestSegmentIndex = 0;
    var nearestControlIndex = -1;
    var distanceToNearestSegment = 1024;
    var distanceToNearestControl = 1024;
    var pushToEnd = false;
    if (controls.length > 1) {
      var nextX, nextY, d1, d2, d3;
      for (var i = 0; i < controls.length / 2; i++) {
        var x = controls[i * 2];
        var y = controls[i * 2 + 1];
        d1 = Math.sqrt((mouseX * sizeX - x) * (mouseX * sizeX - x) + ((1 - mouseY) * sizeY - y) * ((1 - mouseY) * sizeY - y));
        if (d1 < distanceToNearestControl) {
          distanceToNearestControl = d1;
          nearestControlIndex = i;
        }
        if (i < controls.length / 2 - 1) {
          nextX = controls[i * 2 + 2];
          nextY = controls[i * 2 + 3];
          d2 = Math.sqrt((mouseX * sizeX - nextX) * (mouseX * sizeX - nextX) + ((1 - mouseY) * sizeY - nextY) * ((1 - mouseY) * sizeY - nextY));
          d3 = Math.sqrt((x - nextX) * (x - nextX) + (y - nextY) * (y - nextY));
          if (d1 + d2 - d3 < distanceToNearestSegment) {
            distanceToNearestSegment = d1 + d2 - d3;
            nearestSegmentIndex = i;
          }
        }
      }
      pushToEnd = d2 < distanceToNearestSegment;
      var x = controls[0];
      var y = controls[1];
      d1 = Math.sqrt((mouseX * sizeX - x) * (mouseX * sizeX - x) + ((1 - mouseY) * sizeY - y) * ((1 - mouseY) * sizeY - y));
      pushToBegin = d1 < distanceToNearestSegment;
    }
    context.lineWidth = 1.;
    context.strokeStyle = "#0F0";

    if (selectedControls.length == 0 && (splineEditorState == ADD || splineEditorState == MOV)) {
      var newControlIndex = pushToEnd ? controls.length / 2 : pushToBegin ? -1 : nearestSegmentIndex;
      var indicatedList;
      var indicatedControls = controls;
      if (!isSplineEditorHovered && splineEditorState == ADD) {
        var indicatedControls = previousIndicatedControls;
        if (mouseDx != 0 || mouseDy != 0) {
          indicatedList = addPointAtIndex(controls, newControlIndex, mouseX * sizeX, (1 - mouseY) * sizeY);
          indicatedControls = linkedList2Array(indicatedList);
          attachBezierLengths(indicatedControls);
        }
      } else {
        indicatedControls = controls;
      }
      drawSpline(context, indicatedControls);
      previousIndicatedControls = indicatedControls;
      if (mouseDown && selectedControls.length < 1 && !previousMouseDown) {
        selectedControls = [newControlIndex + (pushToEnd ? 0 : 1)];
        controls = indicatedControls;
        updateUrlHash();
      }
    } else if (splineEditorState == DEL || (splineEditorState == MOV && isDelHovered)) {
      var indicatedList;
      var indicatedControls = previousIndicatedControls;
      if (mouseDx != 0 || mouseDy != 0) {
        if (isDelHovered || (mouseDown && previousMouseDown && !selectionResized) || (!mouseDown && previousMouseDown)) {
          indicatedList = deletePointsAtIndices(controls, selectedControls);
          indicatedControls = linkedList2Array(indicatedList);
          attachBezierLengths(indicatedControls);
        } else if (distanceToNearestControl < handleSize * 2 && !previousMouseDown) {
          indicatedList = deletePointAtIndex(controls, nearestControlIndex);
          indicatedControls = linkedList2Array(indicatedList);
          attachBezierLengths(indicatedControls);
        } else {
          indicatedControls = controls;
        }
      }
      drawSpline(context, indicatedControls);
      previousIndicatedControls = indicatedControls;
      if (mouseDown && isDelHovered || !mouseDown && previousMouseDown && splineEditorState == DEL) {
        selectedControls = [];
        controls = indicatedControls;
        updateUrlHash();
        selectionWidth = 0;
        selectionHeight = 0;
        selectionResized = false;
      }
    } else {
      drawSpline(context, controls);
    }

    context.lineWidth = 1.;

    // move selectedControls
    if (controls.length > 1) {
      for (var i = 0; i < controls.length / 2; i++) {
        if (selectedControls.indexOf(i) == -1) {
          context.strokeStyle = "#00F";
        } else {
          if (mouseDown && !isSplineEditorHovered && (splineEditorState != MOV || selectionResized) && (splineEditorState != DEL || selectionResized)) {
            controls[i * 2] += mouseDx * sizeX / viewX;
            controls[i * 2 + 1] -= mouseDy * sizeY / viewY;
          }
          if (splineEditorState == ADD || splineEditorState == MOV) {
            context.strokeStyle = "#0FF";
          } else if (splineEditorState == DEL) {
            context.strokeStyle = "#F00";
          }
        }
        var x = controls[i * 2];
        var y = controls[i * 2 + 1];
        context.beginPath();
        context.arc(x, y, handleSize, 0, 2 * Math.PI, false);
        context.stroke();
      }
      attachBezierLengths(controls);
      if (selectedControls.length == 0 && splineEditorState == ADD) {
        context.beginPath();
        context.arc(_mouseX, _mouseY, handleSize, 0, 2 * Math.PI, false);
        context.stroke();
      }
    }
  }

  if (selectedControls.length > 0 && !mouseDown && previousMouseDown) {
    updateUrlHash();
  }

  var point = getPointOnSpline(controls, index);
  oldPenX = newPenX;
  oldPenY = newPenY;
  newPenX = point[0] / sizeX;
  newPenY = 1. - point[1] / sizeY;

  animationFrame++;

  context.globalCompositeOperation = oldGlobalCompositeOperation;
  previousMouseDown = mouseDown;
}

function drawSpline(context, controls) {
  context.beginPath();
  forEachBezier(controls, function (currentx, currenty, helper1x, helper1y, helper2x, helper2y, nextx, nexty) {
    context.moveTo(currentx, currenty);
    context.bezierCurveTo(helper1x, helper1y, helper2x, helper2y, nextx, nexty);
  });
  context.stroke();
  if (showSplineScale) {
    drawSplineScale(16, 0.133, context, controls);
  }
}

function drawSplineScale(d, l, context, controls) {
  var n = controls.bezierLength / d;
  context.beginPath();
  for (var i = 0; i < n; i++) {
    var s1 = i / (n + 0.5);
    var s2 = s1 + 0.001 / n;
    var p1 = getPointOnSpline(controls, s1);
    var p2 = getPointOnSpline(controls, s2);
    var dx = (p2[0] - p1[0]) * 1000 * l;
    var dy = (p2[1] - p1[1]) * 1000 * l;
    context.moveTo(p1[0] - dy, p1[1] + dx);
    context.lineTo(p1[0] + dy, p1[1] - dx);

  }
  context.stroke();

  drawParallelPattern(d, l, context, controls);
}

function drawParallelPattern(d, l, context, controls) {
  var n = controls.bezierLength / d * 4;
  context.beginPath();
  for (var i = 0; i < n; i++) {
    var s1 = i / (n + 0.5);
    var p1 = getPointOnSpline(controls, s1);
    var p2 = getPointOnSpline(controls, s1 + 0.00001);
    var dx = (p2[0] - p1[0]);
    var dy = (p2[1] - p1[1]);
    var dd = Math.sqrt(dx * dx + dy * dy);
    dx *= d / dd;
    dy *= d / dd;
    // normal parade
    if (getMidi(59) != 0) { // 8th column Akai Midimix knobs: begin, length
      context.moveTo(p1[0] + dy * getMidi(58), p1[1] - dx * getMidi(58));
      context.lineTo(p1[0] + dy * (getMidi(58) + getMidi(59)), p1[1] - dx * (getMidi(58) + getMidi(59)));
    }
    // light wheel
    if (getMidi(54) != 0 && getMidi(55) != 0 && i > 0) {
      var numSpokes = Math.floor(getMidi(54) * 24);
      var radius = getMidi(55) * 2;
      var twist = (getMidi(56) - 0.5) * controls.bezierLength;
      var cx1 = p1[0] + dy * radius;
      var cy1 = p1[1] - dx * radius;
      s2 = (i - 1) / (n + 0.5);
      p2 = getPointOnSpline(controls, s2);
      var p3 = getPointOnSpline(controls, s2 + 0.00001);
      var dx2 = (p3[0] - p2[0]);
      var dy2 = (p3[1] - p2[1]);
      var dd = Math.sqrt(dx2 * dx2 + dy2 * dy2);
      dx2 *= d / dd;
      dy2 *= d / dd;
      var cx2 = p2[0] + dy2 * radius;
      var cy2 = p2[1] - dx2 * radius;
      for (var j = 0; j < numSpokes; j++) {
        var ang = Math.PI * 2 * j / numSpokes;
        var lightX = cx1 + Math.sin(ang + twist * s1) * radius * d;
        var lightY = cy1 + Math.cos(ang + twist * s1) * radius * d;
        var lightX2 = cx2 + Math.sin(ang + twist * s2) * radius * d;
        var lightY2 = cy2 + Math.cos(ang + twist * s2) * radius * d;
        context.moveTo(lightX, lightY);
        context.lineTo(lightX2, lightY2);
      }
    }
  }
  context.stroke();
}

// Poi Toy
var allPoiToys = [];

// in an ideal world, the poi physics simulation would run in its own thread.
// if execution time exceeds 10 ms, a message will be written to the console
function advancePoiToys() {
  var before = Date.now();
  allPoiToys.forEach(function (poiToy) {
    poiToy.advance();
  });
  var dur = Date.now() - before;
  if (dur > 10) {
    console.warn('poi sim time: ' + dur);
  }
  setTimeout(advancePoiToys, 10 - dur);
}

advancePoiToys();

// fair enough, the poi toys could really need an upgrade to float32array
var PoiToy = function () {
  allPoiToys.push(this);
  this.pop = function () {
    delete allPoiToys[allPoiToys.indexOf(this)];
  }

  this.numLights = 80;
  this.postureIdx = 0;
  this.postureHistory = [];
  this.historyLength = 32;
  this.pushPosture = function (posture) {
    this.postureHistory = [posture].concat(this.postureHistory.slice(0, this.historyLength - 1)); // new posture goes in first, truncate history
  }

  this.force = 0.0025;
  this.grav = 0.000;
  this.speedFactor = 1.2;
  this.friction = 128.; // 50
  this.x = 0.5;
  this.y = 0.2;
  this.z = 0.;
  this.points = []; // support points
  for (i = 0; i < 4; i++) {
    this.points[i] = { x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0 }; // passive-aggressively lazy to use an index in a buffer still ?
  }

  this.applySpringForce = function (i1, i2) {
    fx = (this.points[i2].x - this.points[i1].x) * this.force;
    fy = (this.points[i2].y - this.points[i1].y) * this.force;
    fz = (this.points[i2].z - this.points[i1].z) * this.force;
    this.points[i1].vx += fx;
    this.points[i2].vx -= fx;
    this.points[i1].vy += fy;
    this.points[i2].vy -= fy;
    this.points[i1].vz += fz;
    this.points[i2].vz -= fz;
  };

  this.frame = 0;
  this.advance = function () {
    for (var n = 0; n < 6; n++) {

      // apply spring forces
      for (i = 1; i < 4; i++) {
        this.applySpringForce(i - 1, i);
        var vx = this.points[i].vx;
        var vy = this.points[i].vy;
        var vz = this.points[i].vz;
        var friction = Math.max(0, 1 - (vx * vx + vy * vy + vz * vz) * this.friction); // nonlinear quadratic
        this.points[i].vx *= friction;
        this.points[i].vy *= friction;
        this.points[i].vz *= friction;
        this.points[i].vy -= this.grav;
        this.points[i].x += vx * this.speedFactor; // Verlet integration
        this.points[i].y += vy * this.speedFactor;
        this.points[i].z += vz * this.speedFactor;
      }

      // pin the first point back to the control position
      this.points[0].x = this.x;
      this.points[0].y = this.y;
      this.points[0].z = this.z;

      // add a new posture to the front of the history
      // todo: check how much faster a typed array is.
      var newPosture = [];
      x0 = this.points[0].x; // 4 control points
      y0 = this.points[0].y;
      z0 = this.points[0].z;
      x1 = this.points[1].x;
      y1 = this.points[1].y;
      z1 = this.points[1].z;
      x2 = this.points[2].x;
      y2 = this.points[2].y;
      z2 = this.points[2].z;
      x3 = this.points[3].x;
      y3 = this.points[3].y;
      z3 = this.points[3].z;
      for (i = 0; i < this.numLights; i++) {
        t = i / this.numLights;
        u = 1 - t;
        // 6th degree Bernstein polynomial
        var x = (P(t, 5) + 5 * P(t, 4) * u) * x0 + 10 * t * t * t * u * u * x1 + 10 * t * t * u * u * u * x2 + (5 * P(u, 4) * t + P(u, 5)) * x3;
        var y = (P(t, 5) + 5 * P(t, 4) * u) * y0 + 10 * t * t * t * u * u * y1 + 10 * t * t * u * u * u * y2 + (5 * P(u, 4) * t + P(u, 5)) * y3;
        var z = (P(t, 5) + 5 * P(t, 4) * u) * z0 + 10 * t * t * t * u * u * z1 + 10 * t * t * u * u * u * z2 + (5 * P(u, 4) * t + P(u, 5)) * z3;
        newPosture[i] = { x: x, y: y, z: z, frame: this.frame, col: { r: 1, g: 1, b: 1, a: 1 } }; // init white
      }
      this.pushPosture(newPosture);
      this.postureIdx++;

      // advance frame counter
      this.frame++;
    }
  };

  this.patterns = [];
  this.patterns["transparent"] = function (frame, pos, age, col) {
    col.r = 1;
    col.g = 1;
    col.b = 1;
    col.a = 0;
  };
  this.patterns["white"] = function (frame, pos, age, col) {
    col.r = 1;
    col.g = 1;
    col.b = 1;
    col.a = 1;
  };
  this.patterns["white fadeout"] = function (frame, pos, age, col) {
    col.r = 1;
    col.g = 1;
    col.b = 1;
    col.a = (1 - age / this.historyLength);
  };
  this.patterns["white stripes"] = function (frame, pos, age, col) {
    var pattern1 = (pos) % 4 == 0;
    var pattern2 = (pos + 1) % 4 == 0;
    var pattern = Math.max(pattern1, pattern2);
    col.r = pattern;
    col.g = pattern;
    col.b = pattern;
    col.a = (pattern - age / this.historyLength);
  };
  this.patterns["domain map"] = function (frame, pos, age, col) {
    var x = (frame % 64) / 64;
    var y = 2 * pos / this.numLights;
    col.r = x;
    col.g = y;
    col.b = 0;
    col.a = (1 - 0.5 * age / this.historyLength);
  };
  this.patterns["rgb sines"] = function (frame, pos, age, col) {
    var x = (frame % 64) / 64;
    var y = 2 * pos / this.numLights;
    var thickness = 0.05;
    var frequency = 0.25;
    var amplitude = 0.33;
    var sine1 = Math.sin(frame * frequency) * amplitude + 0.5;
    var sine1Mask = (y - sine1 - thickness < 0) * (y - sine1 + thickness > 0);
    var sine2 = Math.sin(frame * frequency + Math.PI * 2 / 3) * amplitude + 0.5;
    var sine2Mask = (y - sine2 - thickness < 0) * (y - sine2 + thickness > 0);
    var sine3 = Math.sin(frame * frequency - Math.PI * 2 / 3) * amplitude + 0.5;
    var sine3Mask = (y - sine3 - thickness < 0) * (y - sine3 + thickness > 0);
    col.r = sine1Mask;
    col.g = sine2Mask;
    col.b = sine3Mask;
    var alphaMask = Math.max(sine1Mask, Math.max(sine2Mask, sine3Mask));
    col.a = alphaMask;
  };
  this.patterns["cmy sines"] = function (frame, pos, age, col) {
    var x = (frame % 64) / 64;
    var y = 2 * pos / this.numLights;
    var thickness = 0.05;
    var frequency = 0.25;
    var amplitude = 0.33;
    var sine1 = Math.sin(frame * frequency) * amplitude + 0.5;
    var sine1Mask = (y - sine1 - thickness < 0) * (y - sine1 + thickness > 0);
    var sine2 = Math.sin(frame * frequency + Math.PI * 2 / 3) * amplitude + 0.5;
    var sine2Mask = (y - sine2 - thickness < 0) * (y - sine2 + thickness > 0);
    var sine3 = Math.sin(frame * frequency - Math.PI * 2 / 3) * amplitude + 0.5;
    var sine3Mask = (y - sine3 - thickness < 0) * (y - sine3 + thickness > 0);
    col.r = sine1Mask + sine2Mask;
    col.g = sine2Mask + sine3Mask;
    col.b = sine3Mask + sine1Mask;
    var alphaMask = Math.max(sine1Mask, Math.max(sine2Mask, sine3Mask));
    col.a = alphaMask;
  };
  this.patterns["compartments"] = function (frame, pos, age, col) {
    var y = pos / this.numLights;
    var bandThickness = 0.05;
    // baseline
    var band1Pos = 0.5;
    var thickness = 0.015;
    var band1Mask = (y - band1Pos - thickness < 0) * (y - band1Pos + thickness > 0);
    // divide
    var width = 24;
    var index = frame % width;
    var divide = (index == 0) ? 1 : 0;
    col.r = band1Mask + divide;
    col.g = band1Mask + divide;
    col.b = band1Mask + divide;
    var alphaMask = Math.max(band1Mask, Math.max(divide, 0));
    col.a = alphaMask;
  };
  this.patterns["heart"] = function (frame, pos, age, col) {
    var y = pos / this.numLights;
    var bandThickness = 0.05;
    var dotMask = (frame % 2 == 0 && pos % 2 == 0) ? 1 : 0;
    // baseline
    var band1Pos = 0.6;
    var thickness = 0.015;
    var band1Mask = (y - band1Pos - thickness < 0) * (y - band1Pos + thickness > 0);
    // divide compartments
    var num = 8;
    var width = 24;
    var index = frame % width;
    var divide = (index == 0) ? 1 : 0;
    var heartFrame = ((frame - index) / width % num == 0) ? 1 : 0;
    var cx = index / width - 0.5;
    var cy = (y - band1Pos) * 3 + Math.abs(index / width - 0.5) * 0.7;
    var d = Math.sqrt(cx * cx + cy * cy);
    var ang = Math.atan2(cy, cx);
    var heartMask = (d < 0.5) ? heartFrame : 0;
    heartFrame = heartMask;
    col.r = band1Mask + divide + heartFrame;
    col.g = band1Mask + divide + heartFrame;
    col.b = band1Mask + divide + heartFrame;
    var alphaMask = Math.max(band1Mask, Math.max(divide, heartFrame * (1 + 0 * dotMask)));
    col.a = alphaMask;
  };

  this.patterns["smiley"] = function (frame, pos, age, col) {
    var width = 16;
    var height = 16;

    var array = [
      [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0],
      [1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0],
      [1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0],
      [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
      [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
      [1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    ];

    var x = (frame % width);
    var offsety = 64;

    var y = pos - offsety;

    var mask = 0;
    if (y >= 0 && y < height) {
      mask = array[y][x];
    }

    col.r = mask;
    col.g = mask;
    col.b = mask;
    col.a = mask;
  };

  this.createTextPatternFn = function (text, bgBlackness) {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    var font = "bold italic 18px arial";
    ctx.font = font;
    var l = Math.ceil(ctx.measureText(text).width);
    canvas.width = l;
    canvas.height = 16;

    ctx.fillStyle = "rgba(0,0,0," + bgBlackness + ")";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#FFF";
    ctx.font = font;
    ctx.fillText(text, 0, 15);
    var data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    var patternFn = function (frame, pos, age, col) {
      var x = (frame % canvas.width);
      var offsety = 32;
      var y = pos - offsety;
      if (y >= 0 && y < canvas.height) {
        var i = (y * canvas.width + x) * 4;
        col.r = data[i + 0] / 256;
        col.g = data[i + 1] / 256;
        col.b = data[i + 2] / 256;
        col.a = data[i + 3] / 256;
      } else {
        col.r = 0;
        col.g = 0;
        col.b = 0;
        col.a = 0;
      }
    };

    return patternFn;
  }

  this.applyColor = this.patterns["rgb sines"]; // replace this anytime at runtime
  this.applyColor = this.patterns["white stripes"]; // replace this anytime at runtime
  this.applyColor = this.patterns["heart"]; // replace this anytime at runtime
  this.applyColor = this.createTextPatternFn("LASER ", 0.5);

  function P(m, e) {
    return Math.pow(m, e);
  }
  this.lastRenderFrame = 0;
  this.drawLightStreaks = function (context) {
    var framesSinceLastRender = this.frame - this.lastRenderFrame;
    this.lastRenderFrame = this.frame;
    var lightStreakLength = Math.min(this.postureHistory.length, framesSinceLastRender + 1);
    //lightStreakLength = this.postureHistory.length; // draw all history
    var p2d = {};
    for (lightID = 0; lightID < this.numLights; lightID++) {
      for (i = 1; i < lightStreakLength; i++) {
        var preposture = this.postureHistory[i - 1];
        var posture = this.postureHistory[i];
        if (posture[lightID] != undefined && preposture[lightID] != undefined) {
          this.applyColor(posture[lightID].frame, lightID, i, posture[lightID].col);
          var c = posture[lightID].col;
          if (c.a != 0) {
            context.beginPath();
            context.strokeStyle = "rgba(" + Math.floor(256 * c.r) + "," + Math.floor(256 * c.g) + "," + Math.floor(256 * c.b) + "," + c.a + ")";
            project(preposture[lightID], p2d); // what if i told you the projection was saved in an object property or an index in an array buffer
            context.moveTo(p2d.x, p2d.y);
            project(posture[lightID], p2d); // where is the object garbage even saved?
            context.lineTo(p2d.x, p2d.y);
            context.stroke();
          }
        }
      }
    }
  }
}

// Cake23 Kinect v2 body tracking 
var cake23; // github.com/Flexi23/Cake23 | WebSocket Hub for Kinect v2 and MIDI controllers
var cake23hostName = "23fle@P502";
/*
$(function () {
	$.connection.hub.url = "http://P502:9000/signalr"; var kinect = $.connection.kinect2Hub;

	kinect.client.onBody = function (bodyJson, projectionMappedPointsJson) {
		var body = JSON.parse(bodyJson);
		var trackingObject = getTrackingObject(body.TrackingId);
		joints.forEach(j => {
			var joint = body.Joints[j];
			if (trackingObject.body) {
				joint.old = trackingObject.body.Joints[j];
				joint.old.old = null; // idea: keep a limited history
			}
			joint.x = joint.Position.X;
			joint.y = joint.Position.Y;
			joint.z = joint.Position.Z;
			joint.state = joint.TrackingState;
			joint.p2d = {};
			project(joint, joint.p2d);
		});
		// bodysampler = JSON.parse(projectionMappedPointsJson); // this would be the inbuilt mapping of the 3d coordinates to the 1080p video camera
		body.head = body.Joints["Head"];
		body.handRight = { grab: false, point: false, object: null, old: trackingObject.body ? trackingObject.body.handRight : null };
		switch (body.handRight.state = body.HandRightState) {
			case 3:
				body.handRight.grab = true;
				break;
			case 4:
				body.handRight.point = true;
				break;
		}
		body.handRight.id = "hr" + body.TrackingId;
		if (body.handRight.point) {
			body.handRight = body.Joints["HandTipRight"];
		} else {
			body.handRight.x = (body.Joints["HandTipRight"].Position.X * 2 + body.Joints["HandRight"].Position.X + body.Joints["ThumbRight"].Position.X * 2) / 5;
			body.handRight.y = (body.Joints["HandTipRight"].Position.Y * 2 + body.Joints["HandRight"].Position.Y + body.Joints["ThumbRight"].Position.Y * 2) / 5;
			body.handRight.z = (body.Joints["HandTipRight"].Position.Z * 2 + body.Joints["HandRight"].Position.Z + body.Joints["ThumbRight"].Position.Z * 2) / 5;
			body.handRight.p2d = {};
			project(body.handRight, body.handRight.p2d);
		}
		body.handLeft = { grab: false, point: false, object: null, old: trackingObject.body ? trackingObject.body.handLeft : null };
		switch (body.handLeft.state = body.HandLeftState) {
			case 3:
				body.handLeft.grab = true;
				break;
			case 4:
				body.handLeft.point = true;
				break;
		}
		body.handLeft.id = "hl" + body.TrackingId;
		if (body.handLeft.point) {
			body.handLeft = body.Joints["HandTipLeft"];
		} else {
			body.handLeft.x = (body.Joints["HandTipLeft"].Position.X * 2 + body.Joints["HandLeft"].Position.X + body.Joints["ThumbLeft"].Position.X * 2) / 5;
			body.handLeft.y = (body.Joints["HandTipLeft"].Position.Y * 2 + body.Joints["HandLeft"].Position.Y + body.Joints["ThumbLeft"].Position.Y * 2) / 5;
			body.handLeft.z = (body.Joints["HandTipLeft"].Position.Z * 2 + body.Joints["HandLeft"].Position.Z + body.Joints["ThumbLeft"].Position.Z * 2) / 5;
			body.handLeft.p2d = {};
			project(body.handLeft, body.handLeft.p2d);
		}
		var trackingObject = getTrackingObject(body.TrackingId);
		if (trackingObject.body == null) {
			trackingObject.body = body;
		} else {
			var oldBody = trackingObject.body;
			if (oldBody.handRight.grab) {
				body.handRight.object = oldBody.handRight.object;
			}
			if (oldBody.handLeft.grab) {
				body.handLeft.object = oldBody.handLeft.object;
			}
		}
		trackingObject.body = body; // update
	};
	kinect.client.onBodies = function (trackingIdsJson, frame, userName) {
		var trackingIds = null;
		if (trackingIdsJson != null) {
			trackingIds = JSON.parse(trackingIdsJson);
		}
		onBodies(trackingObjects, trackingIds, frame, userName);
	};
	kinect.client.onFace = onFace;

	var midi = $.connection.midiHub;
	midi.client.onMidi = onMidi;

	cake23 = $.connection.cake23Hub;
	cake23.client.register = userClient => console.log(["onRegister", userClient]);
	cake23.client.updateVirtualBox = updateVirtualBox;

	$.connection.hub.start().done(function () {
		cake23.server.register({ "UserName": "VB idiot", "ClientName": "virtualbox" });
	});
});
*/

var trackingObjects = [];
function getTrackingObject(id) {
	var hit = null;
	trackingObjects.forEach(trackingObject => { // perhaps not the most efficient way, but don't expect too many tracked bodies anyway
		if (trackingObject.id == id) {
			hit = trackingObject;
		}
	});
	if (hit) {
		return hit;
	}
	// create new trackingObject
	console.log("create tracking object " + id);
	var trackingObject = { id: id, body: null }; // init as object that can be easily extended with additional properties
	trackingObjects.push(trackingObject);
	return trackingObject;
}

// Kinect body frame arrived
var activeTrackingObjects = [], activeObjectsByUser = [], allUserNames = [];
function onBodies(trackingObjects, activeBodyIds, frame, userName) {
	if (allUserNames.indexOf(userName) == -1) {
		allUserNames.push(userName);
	}
	if (activeObjectsByUser.indexOf(userName) == -1) {
		activeObjectsByUser[userName] = [];
	}
	var oldActiveTrackingObjects = activeObjectsByUser[userName];
	oldActiveTrackingObjects.forEach(function (trackingObject) {
		if (activeBodyIds.indexOf(trackingObject.id) == -1) {
			if (trackingObject.stickman)
				trackingObject.stickman.pop(); // cascading delete? what's a stickman anyway ¯\_[ツ]_/¯
		}
	});
	activeObjectsByUser[userName] = [];
	activeBodyIds.forEach(function (id) {
		var trackingObject = getTrackingObject(id);
		trackingObject.lastActivation = frame; // todo: release to garbage collector after a certain duration of inactivity
		activeObjectsByUser[userName].push(trackingObject);
	});
	activeTrackingObjects = [];
	allUserNames.forEach(userName => activeTrackingObjects = activeTrackingObjects.concat(activeObjectsByUser[userName]));
}

var midi = [];

// presets copied from the Chrome console after doodling with the knobs and sliders of my Korg nanoKontrol2

// light theme
midi = [0.8582677165354331, 0.8031496062992126, 0.889763779527559, 0, 0.6614173228346457, 0.5196850393700787, 0.6771653543307087, 0, null, null, null, null, null, null, null, null, 0.29133858267716534, 0.25196850393700787, 0.6299212598425197, 0.9212598425196851, 0.031496062992125984, 0.25984251968503935, 0.2125984251968504, 1];
// dark theme
//midi = [0.015748031496062992, 0, 0.09448818897637795, 0, 0.3858267716535433, 0.2047244094488189, 0.047244094488188976, 0, null, null, null, null, null, null, null, null, 0.6614173228346457, 0.7795275590551181, 0.8267716535433071, 1, 0.6456692913385826, 0.7165354330708661, 1, 1];


// #lightwheel particle color mapping from the Akai Midimix controller

// cool one
midi = [0.8582677165354331, 0.8031496062992126, 0.889763779527559, 0, 0.6614173228346457, 0.5196850393700787, 0.6771653543307087, 0, null, null, null, null, null, null, null, null, 0.7952755905511811, 0.6850393700787402, 0.7086614173228346, 1, 0.2047244094488189, 0.007874015748031496, 0, 0.5669291338582677, 0, 0, 0, 0.015748031496062992, 0.5511811023622047, 0.968503937007874, 0.1889763779527559, 0.007874015748031496, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.6771653543307087, 1, 0.015748031496062992, 0.4094488188976378, 0.9606299212598425, 0.7086614173228346, 0.031496062992125984, 0.12598425196850394, 0.5354330708661418, 0.47244094488188976, 0.14173228346456693, 0.5118110236220472, 0.8582677165354331, 0.2992125984251969, 0, 0];

// pink one
midi = [0.8582677165354331, 0.8031496062992126, 0.889763779527559, 0, 0.6614173228346457, 0.5196850393700787, 0.6771653543307087, 0, null, null, null, null, null, null, null, null, 0.889763779527559, 0.14173228346456693, 0.1732283464566929, 1, 0.2047244094488189, 0.1968503937007874, 0, 0, 0, 0, 0, 0, 0.5511811023622047, 0.968503937007874, 0.1889763779527559, 0.047244094488188976, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.6771653543307087, 1, 0, 0.7086614173228346, 0.9606299212598425, 0.7086614173228346, 0, 0.1889763779527559, 0, 0.5905511811023622, 0, 1, 0, 0.5354330708661418, 0, 0];

// red(ish)
//midi = [0.8582677165354331,0.8031496062992126,0.889763779527559,0,0.6614173228346457,0.5196850393700787,0.6771653543307087,0,null,null,null,null,null,null,null,null,0.952755905511811,0.1732283464566929,0.09448818897637795,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.14960629921259844,0,0,0,0,0,0.1968503937007874,0.4330708661417323,0.5748031496062992,0,1,0,0.5354330708661418,0,0];

// just another doodle
midi = [0.8582677165354331,0.8031496062992126,0.889763779527559,0,0.6614173228346457,0.5196850393700787,0.6771653543307087,0,null,null,null,null,null,null,null,null,0.9921259842519685,0.7637795275590551,0,0.1732283464566929,0,0.4015748031496063,1,0.4094488188976378,0.9291338582677166,0.08661417322834646,1,0.10236220472440945,0.16535433070866143,0.1889763779527559,0.05511811023622047,0.3228346456692913,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.8818897637795275,0.6377952755905512,0.7637795275590551,0.1968503937007874,1,1,1,0,0,0,0,0,1,1,1,0,1];

function onMidi(channel, data1, data2) {
	//for now, just ignore the channel information
	midi[data1] = data2 / 127.;
	console.log("midi msg: channel " + channel + " , data: " + data1 + " => " + data2);
}

var faces = [];

function onFace(verticesJSON, status, TrackingId) {
	var trackingObject = getTrackingObject(TrackingId);
	var before = Date.now();
	var vertices = JSON.parse(verticesJSON);
	var dur = Date.now() - before;
	var face = faces[TrackingId];
	if (face == undefined) {
		face = {
			points2d: []
		};
		for (var i = 0; i < 1347; i++) {
			face.points2d[i] = {};
		}
		faces[TrackingId] = face;
	}

	if (trackingObject.body) {
		var head = trackingObject.body.head;
		if (head) {
			var p2d = {};
			var p3d = {};
			var scale = 1.25;
			for (var i = 0; i < 1347; i++) {

				p3d.x = head.x + (vertices[i * 3 + 0] - head.x) * scale;
				p3d.y = head.y + (vertices[i * 3 + 1] - head.y) * scale;
				p3d.z = head.z + (vertices[i * 3 + 2] - head.z) * scale;

				project(p3d, p2d);

				var shape = face.points2d[i];

				shape.x = p2d.x;
				shape.y = p2d.y;

				if (shape.update) {
					shape.update();
				}
			}
		}
	}
}

function getMidi(id) {

	if (midi[id] == undefined)
		midi[id] = 0;

	return midi[id];
}

var joints = ["SpineBase", "SpineMid", "Neck", "Head", "ShoulderLeft",
							"ElbowLeft", "WristLeft", "HandLeft", "ShoulderRight", "ElbowRight",
							"WristRight", "HandRight", "HipLeft", "KneeLeft", "AnkleLeft",
							"FootLeft", "HipRight", "KneeRight", "AnkleRight", "FootRight",
							"SpineShoulder", "HandTipLeft", "ThumbLeft", "HandTipRight", "ThumbRight"];

var members = [
	//		["SpineBase", "SpineMid"],
	//		["SpineMid", "SpineShoulder"],
	["SpineShoulder", "Neck"],
	//		["Neck", "Head"],
	["SpineShoulder", "ShoulderLeft"],
	["ShoulderLeft", "ElbowLeft"],
	["ElbowLeft", "WristLeft"],
	["WristLeft", "HandLeft"],
	["HandLeft", "HandTipLeft"],
	["HandLeft", "ThumbLeft"],
	//		["SpineBase", "HipLeft"],
	["SpineBase", "KneeLeft"],
	["SpineBase", "KneeRight"],
	//		["HipLeft", "ShoulderLeft"],
	["HipLeft", "KneeLeft"],
	["KneeLeft", "AnkleLeft"],
	["AnkleLeft", "FootLeft"],
	["SpineShoulder", "ShoulderRight"],
	["ShoulderRight", "ElbowRight"],
	["ElbowRight", "WristRight"],
	["WristRight", "HandRight"],
	["HandRight", "HandTipRight"],
	["HandRight", "ThumbRight"],
	//		["SpineBase", "HipRight"],
	//		["HipRight", "ShoulderRight"],
	["HipRight", "KneeRight"],
	["KneeRight", "AnkleRight"],
	["AnkleRight", "FootRight"],
	["SpineMid", "ShoulderRight"],
	["SpineMid", "ShoulderLeft"],
	["SpineMid", "HipRight"],
	["SpineMid", "HipLeft"]
];

// perspective projection (virtual camera)
function project(p3d, p2d) {
	p2d.x = p3d.x;
	p2d.y = p3d.y;
	var w = Math.atan2(-p3d.x, -p3d.y);
	var l = Math.sqrt(p3d.x * p3d.x + p3d.y * p3d.y);
	var d = 0.5;
	var zoom = 1.;
	var p = Math.tan(Math.PI / 2 + Math.atan2(d + p3d.z, l));
	d = Math.sqrt(p3d.x * p3d.x + p3d.y * p3d.y + (p3d.z + d) * (p3d.z + d));
	p2d.x = zoom * Math.sin(w) * p / aspectx + 0.5;
	p2d.y = zoom * Math.cos(w) * p / aspecty + 0.5;
	p2d.y = 1 - p2d.y;
	p2d.x *= sizeX;
	p2d.y *= sizeY;
}

var Bone = function (joint1, joint2) {
	this.joint1 = joint1;
	this.joint2 = joint2;
}

var Stickman = function (body) {
	this.bones = [];
	var self = this;
	members.forEach(function (member) {
		self.bones[member] = new Bone(body.Joints[member[0]], body.Joints[member[1]]);
	});
	this.leftHandPoiToy = new PoiToy();
	this.rightHandPoiToy = new PoiToy();
	this.pop = function () {
		this.leftHandPoiToy.pop();
		this.rightHandPoiToy.pop();
	}
};

function updateStickMen() {
	activeTrackingObjects.forEach(function (trackingObject) {

		var body = trackingObject.body;
		var stickman = trackingObject.stickman;
		if (body != null && stickman == null) {
			stickman = new Stickman(body);
			trackingObject.stickman = stickman;
		}

		stickman.leftHandPoiToy.x = body.handLeft.x;
		stickman.leftHandPoiToy.y = body.handLeft.y;
		stickman.leftHandPoiToy.z = body.handLeft.z;

		stickman.rightHandPoiToy.x = body.handRight.x;
		stickman.rightHandPoiToy.y = body.handRight.y;
		stickman.rightHandPoiToy.z = body.handRight.z;
	});
}


function drawPoiToys(context) {
	activeTrackingObjects.forEach(function (trackingObject) {

		var stickman = trackingObject.stickman;
		if (stickman == null) {
			stickman = new Stickman();
			trackingObject.stickman = stickman;
		}

		stickman.leftHandPoiToy.drawLightStreaks(context);
		stickman.rightHandPoiToy.drawLightStreaks(context);
	});

	poiToy.drawLightStreaks(context);
}


var numDragonDropControls = 16;
var dragonDropControls = [];

function randomizeDragonDropControlPoints() {
	for (var i = 0; i < numDragonDropControls; i++) {
		var x = Math.random() * 512 + 256;
		var y = Math.random() * 256 + 128;
		var size = 0;
		dragonDropControls.push({ x: x, y: y, size: size, grabbedBy: null });
	}
}

randomizeDragonDropControlPoints();

// corner points
var virtualBox = [
	{ x: -0.25, y: 0.25, z: 0.5 }, { x: 0.25, y: 0.25, z: 0.5 }, { x: 0.25, y: -0.25, z: 0.5 }, { x: -0.25, y: -0.25, z: 0.5 },
	{ x: -0.25, y: 0.25, z: 1.0 }, { x: 0.25, y: 0.25, z: 1.0 }, { x: 0.25, y: -0.25, z: 1.0 }, { x: -0.25, y: -0.25, z: 1.0 }
];

// Flexi's man cave extent (copied from the developer console after manually dragging the points and calling serializeVirtualBox()
virtualBox = manCave = [{ "x": -0.6, "y": 0.56, "z": 1.46 }, { "x": 0.6, "y": 0.41, "z": 0.99 }, { "x": 0.77, "y": -0.32, "z": 1.23 }, { "x": -0.53, "y": -0.35, "z": 1.47 }, { "x": -0.73, "y": 0.44, "z": 1.16 }, { "x": 0.49, "y": 0.32, "z": 0.91 }, { "x": 0.68, "y": -0.46, "z": 1.47 }, { "x": -1, "y": -0.5, "z": 1.77 }];

// Wohnzimmer überm Fernseher
virtualBox = [{ "x": -0.95, "y": 0.71, "z": 1.4 }, { "x": 0.82, "y": 0.71, "z": 1.34 }, { "x": 0.91, "y": -0.24, "z": 1.45 }, { "x": -0.85, "y": -0.13, "z": 1.28 }, { "x": -1.32, "y": 0.9, "z": 3.05 }, { "x": 1.71, "y": 0.91, "z": 2.7 }, { "x": 1.56, "y": -0.21, "z": 2.44 }, { "x": -1.19, "y": -0.2, "z": 2.79 }];

var virtualBoxBy = [];

function updateVirtualBox(virtualBoxByJSON) {
	var content = JSON.parse(virtualBoxByJSON);
	console.log(content);
};

function getRoundedVirtualBox() {
	var virtualBox = [];
	for (var i = 0; i < 8; i++) {
		var c = dragonDropControls[i].p3d;
		if (c) {
			virtualBox[i] = { x: Math.round(c.x * 100) / 100, y: Math.round(c.y * 100) / 100, z: Math.round(c.z * 100) / 100 };
		}
	}
	return virtualBox;
}

function initVirtualBox() {
	for (var i = 0; i < 8; i++) {
		var p3d = virtualBox[i];
		var control = dragonDropControls[i];
		control.size = 6;
		project(p3d, control);
	}
}

function drawDragonDropControls(context) {
	//return;
	var p2d = {};
	var handleSize = 6;
	for (var i = 0; i < numDragonDropControls; i++) {
		var p = dragonDropControls[i];
		context.beginPath();
		context.arc(p.x, p.y, p.size, 0, 2 * Math.PI, false);
		context.stroke();
	}
	context.beginPath();
	[[0, 1], [1, 2], [2, 3], [3, 0], [0, 4], [1, 5], [2, 6], [3, 7], [4, 5], [5, 6], [6, 7], [7, 4]].forEach(edge => {
		var start = dragonDropControls[edge[0]];
		var end = dragonDropControls[edge[1]];
		context.moveTo(start.x, start.y);
		context.lineTo(end.x, end.y);
	});
	context.stroke();
}

// idea: use a pool of drag and drop control points and spawn where needed
// todo: implement a regular touchmove listener first and then fire events on the Kinect drag and drop control point object life cycle state changes #helluvacomment

function updateDragonDropControls() {
	//return;
	var updated = false;
	activeTrackingObjects.forEach(trackingObject => {
		var nearest = null;
		var nearestControlL = null;
		var nearestControlR = null;
		var nearestL = 1234;
		var nearestR = 1234;
		dragonDropControls
			.filter(p =>
							p.grabbedBy == null
							|| p.grabbedBy == trackingObject.body.handLeft.id
							|| p.grabbedBy == trackingObject.body.handRight.id)
			.forEach(p => {
			if (p.grabbedBy == trackingObject.body.handLeft.id) {
				nearestControlL = p;
				nearestL = 0;
			} else if (p.grabbedBy == trackingObject.body.handRight.id) {
				nearestControlR = p;
				nearestR = 0;
			} else {
				var dL = Math.sqrt(	// distance to left hand
					Math.pow(p.x - trackingObject.body.handLeft.p2d.x, 2) +
					Math.pow(p.y - trackingObject.body.handLeft.p2d.y, 2)
				);
				if (dL < nearestL && trackingObject.body.handLeft.object == null) {
					nearestControlL = p;
					nearestL = dL;
				}
				var dR = Math.sqrt( // right hand distance
					Math.pow(p.x - trackingObject.body.handRight.p2d.x, 2) +
					Math.pow(p.y - trackingObject.body.handRight.p2d.y, 2)
				);
				if (dR < nearestR && trackingObject.body.handRight.object == null) {
					nearestControlR = p;
					nearestR = dR;
				}
			}
		});
		// move or release
		// left hand
		if (nearestControlL != null) {
			if (trackingObject.body.handLeft.grab && nearestL < nearestControlL.size) {
				// move control point to hand position
				nearestControlL.x = trackingObject.body.handLeft.p2d.x;
				nearestControlL.y = trackingObject.body.handLeft.p2d.y;
				nearestControlL.p3d = trackingObject.body.handLeft;
				// lock grabbed state on both sides
				nearestControlL.grabbedBy = trackingObject.body.handLeft.id;
				trackingObject.body.handLeft.object = nearestControlL;
				updated = true;
			} else {
				// release lock
				nearestControlL.grabbedBy = null;
				trackingObject.body.handLeft.object = null;
			}
		}
		// right hand
		if (nearestControlR != null) {
			if (trackingObject.body.handRight.grab && nearestR < nearestControlR.size) {
				// move control point to hand position
				nearestControlR.x = trackingObject.body.handRight.p2d.x;
				nearestControlR.y = trackingObject.body.handRight.p2d.y;
				nearestControlR.p3d = trackingObject.body.handRight;
				// lock grabbed state on both sides
				nearestControlR.grabbedBy = trackingObject.body.handRight.id;
				trackingObject.body.handRight.object = nearestControlR;
				updated = true;
			} else {
				// release lock
				nearestControlR.grabbedBy = null;
				trackingObject.body.handRight.object = null;
			}
		}
	});
	// todo: if something was updated, phone home to cake23Server

	if (cake23 && updated) {

		cake23.server.updateVirtualBox(JSON.stringify(["me", getRoundedVirtualBox()]));
	}
}


function drawStickMen(context) {

	activeTrackingObjects.forEach(function (trackingObject) {

		var body = trackingObject.body;
		var stickman = trackingObject.stickman;
		if (stickman == null) {
			stickman = new Stickman(body);
			trackingObject.stickman = stickman;
		}

		// draw the bones
		/*
					context.strokeStyle = "#FFF";
					context.beginPath();

					members.forEach(function (member) {
						var joint1 = body.Joints[member[0]];
						var joint2 = body.Joints[member[1]];
						if (joint1.state == 2 && joint2.state == 2) {
							context.moveTo(joint1.p2d.x, joint1.p2d.y);
							context.lineTo(joint2.p2d.x, joint2.p2d.y);
						}
					});

					context.lineWidth = 1.25;//64 / 256;
					context.stroke();
					*/

		// draw the outline

		// calculate support vectors

		// clockwise winding around the bones
		var outlineControls = [];
		var p = {};
		function addMember(memberName) { // todo: is obsolete?
			var joint = body.Joints[memberName];
			if (joint.state == 2) {
				p = joint.p2d;
				outlineControls.push(p.x, p.y);
			}
		}
		function getNormal(p1, p2) {
			return { x: p2.y - p1.y, y: p1.x - p2.x };
		}
		function addSupport(m1, m2, m3, w) {
			if (w == 0) {
				addMember(m2);
				return;
			}
			var j = body.Joints[m2];
			if (j.state == 2) {
				var n1 = getNormal(body.Joints[m1].p2d, j.p2d);
				var n2 = getNormal(j.p2d, body.Joints[m3].p2d);
				var n = { x: (n1.x + n2.x) / 2, y: (n1.y + n2.y) / 2, z: (n1.z + n2.z) / 2 }; // average
				var p = { x: j.p2d.x + n.x * w, y: j.p2d.y + n.y * w }; // displace middle joint projection by weighted normal
				outlineControls.push(p.x, p.y);
			}
		}
		addSupport("Head", "Neck", "SpineShoulder", 0.5);
		addSupport("Head", "SpineShoulder", "ShoulderRight", 0.25);
		addSupport("SpineShoulder", "ShoulderRight", "ElbowRight", 0.0);
		addSupport("ShoulderRight", "ElbowRight", "WristRight", 0.0);
		addSupport("ElbowRight", "WristRight", "HandRight", 0.1);
		addSupport("WristRight", "HandRight", "HandTipRight", 0.1);
		addSupport("HandRight", "HandTipRight", "HandRight", 0.1);
		addSupport("HandTipRight", "HandRight", "ThumbRight", 0.1);
		addSupport("HandRight", "ThumbRight", "HandRight", 0.1);
		addSupport("ThumbRight", "HandRight", "WristRight", 0.1);
		addSupport("HandRight", "WristRight", "ElbowRight", 0.1);
		addSupport("WristRight", "ElbowRight", "ShoulderRight", 0.2);
		addSupport("ElbowRight", "ShoulderRight", "SpineMid", 0.33);
		addSupport("ShoulderRight", "SpineMid", "HipRight", 0.55);
		addSupport("SpineMid", "HipRight", "KneeRight", 0.2);
		addSupport("HipRight", "KneeRight", "AnkleRight", 0.1);
		addSupport("KneeRight", "AnkleRight", "FootRight", 0.2);
		addSupport("AnkleRight", "FootRight", "AnkleRight", 0.1);
		addSupport("FootRight", "AnkleRight", "KneeRight", 0.1);
		addSupport("AnkleRight", "KneeRight", "SpineBase", 0.1);
		addSupport("KneeRight", "SpineBase", "KneeLeft", 0.1);
		addSupport("SpineBase", "KneeLeft", "AnkleLeft", 0.1);
		addSupport("KneeLeft", "AnkleLeft", "FootLeft", 0.1);
		addSupport("AnkleLeft", "FootLeft", "AnkleLeft", 0.1);
		addSupport("FootLeft", "AnkleLeft", "KneeLeft", 0.2);
		addSupport("AnkleLeft", "KneeLeft", "HipLeft", 0.1);
		addSupport("KneeLeft", "HipLeft", "SpineMid", 0.25);
		addSupport("HipLeft", "SpineMid", "ShoulderLeft", 0.55);
		addSupport("SpineMid", "ShoulderLeft", "ElbowLeft", 0.33);
		addSupport("ShoulderLeft", "ElbowLeft", "WristLeft", 0.2);
		addSupport("ElbowLeft", "WristLeft", "HandLeft", 0.1);
		addSupport("WristLeft", "HandLeft", "ThumbLeft", 0.1);
		addSupport("HandLeft", "ThumbLeft", "HandLeft", 0.1);
		addSupport("ThumbLeft", "HandLeft", "HandTipLeft", 0.1);
		addSupport("HandLeft", "HandTipLeft", "HandLeft", 0.1);
		addSupport("HandTipLeft", "HandLeft", "WristLeft", 0.1);
		addSupport("HandLeft", "WristLeft", "ElbowLeft", 0.1);
		addSupport("WristLeft", "ElbowLeft", "ShoulderLeft", 0.0);
		addSupport("ElbowLeft", "ShoulderLeft", "SpineShoulder", 0.0);
		addSupport("ShoulderLeft", "SpineShoulder", "Head", 0.2);
		addSupport("SpineShoulder", "Neck", "Head", 0.5);

		context.beginPath();
		context.strokeStyle = "#F00";
		context.lineWidth = 1;
		attachBezierLengths(outlineControls);
		drawSpline(context, outlineControls);
		context.stroke();

		// draw the hands

		/*
					var handLeft = {};
					var handRight = {};
					project(trackingObject.body.handLeft, handLeft);
					project(trackingObject.body.handRight, handRight);

					context.beginPath();
					context.strokeStyle = "#FFF";
					if (trackingObject.body.handLeft.grab) {
						context.strokeStyle = "#0F0";
					}
					context.rect(handLeft.x - 10, handLeft.y - 10, 20, 20);
					context.stroke();

					context.beginPath();
					context.strokeStyle = "#FFF";
					if (trackingObject.body.handRight.grab) {
						context.strokeStyle = "#0F0";
					}
					context.rect(handRight.x - 10, handRight.y - 10, 20, 20);
					context.stroke();
					*/

		/*
					joints.forEach(function (id) {
						var joint = body.Joints[id];
					});
					*/

		// draw the face
		context.fillStyle = "#FFF";
		var face = faces[trackingObject.id];
		if (face) {
			face.points2d.forEach(function (p) {
				context.fillRect(p.x, p.y, 1.25, 1.25);
			});
		}

	});
}

// shaders galore

var shaders = [];

shaders['vertex'] = (function () {/*  
			attribute vec3 aPos;
			attribute vec2 aTexCoord;
			varying vec2 uv;
			varying vec2 uv_orig;
			void main(void) {
				gl_Position = vec4(aPos, 1.);
				uv = aTexCoord;
				uv_orig = uv;
			}
			*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1]; // no comment

shaders['init'] = (function () {/*  
			void main(void) {
				gl_FragColor = vec4(0);
			}
		*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];

shaders['copy'] = (function () {/*  
			uniform sampler2D src_tex;
			void main(void) {
				gl_FragColor = texture2D(src_tex, uv);
			}
		*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];

shaders['include'] = (function () {/*  
      #ifdef GL_ES
      precision mediump float;
      #endif

      // #included shader functions

      uniform sampler2D sampler_prev;
      uniform sampler2D sampler_prev_n;
      uniform sampler2D sampler_blur;
      uniform sampler2D sampler_blur2;
      uniform sampler2D sampler_blur3;
      uniform sampler2D sampler_blur4;
      uniform sampler2D sampler_blur5;
      uniform sampler2D sampler_blur6;
      uniform sampler2D sampler_noise;
      uniform sampler2D sampler_noise_n;
      uniform sampler2D sampler_fluid;
      uniform sampler2D sampler_fluid_p;
      uniform sampler2D sampler_particles;
      uniform sampler2D sampler_particle_projection;
      uniform sampler2D sampler_sticky_scene;
      uniform sampler2D sampler_poitoy_scene;
      uniform sampler2D sampler_spline_scene;

      varying vec2 uv;
      uniform vec2 texSize;
      uniform vec2 pixelSize;
      uniform vec2 aspect;
      uniform vec2 scale;

      uniform vec2 mouse;
      uniform vec2 mouseV;
      uniform float mouseDown;

      uniform float fps;
      uniform float time;
      uniform float frame;

      uniform vec2 particleTexSize;
      uniform vec2 activeRange;
      uniform vec2 pen;
      uniform vec2 oldPen;

      uniform vec4 rnd;
      uniform vec4 rainbow;

      uniform vec4 mover0;
      uniform int moverState0;
      uniform vec4 mover1;
      uniform int moverState1;
      uniform vec4 mover2;
      uniform int moverState2;
      uniform vec4 mover3;
      uniform int moverState3;
      uniform vec4 mover4;
      uniform int moverState4;
      uniform vec4 mover5;
      uniform int moverState5;
      uniform vec4 mover6;
      uniform int moverState6;
      uniform vec4 mover7;
      uniform int moverState7;
      uniform vec4 mover8;
      uniform int moverState8;
      uniform vec4 mover9;
      uniform int moverState9;
      uniform vec4 head0;
      uniform vec4 col0;
      uniform vec4 head1;
      uniform vec4 col1;
      uniform vec4 head2;
      uniform vec4 col2;
      uniform vec4 head3;
      uniform vec4 col3;
      uniform vec4 head4;
      uniform vec4 col4;
      uniform vec4 head5;
      uniform vec4 col5;
      uniform vec4 head6;
      uniform vec4 col6;
      uniform vec4 head7;
      uniform vec4 col7;
      uniform vec4 head8;
      uniform vec4 col8;
      uniform vec4 head9;
      uniform vec4 col9;

      // Korg NanoKontrol2
      uniform vec4 midifader1;
      uniform vec4 midifader2;
      uniform vec4 midiknob1;
      uniform vec4 midiknob2;

      // Akai MidiMix
      uniform vec4 midi1, midi2, midi3, midi4, midi5, midi6, midi7, midi8;

      // <x, y, size, isGrabbed> control points
      uniform vec4 dnd1, dnd2, dnd3, dnd4, dnd5, dnd6, dnd7, dnd8, dnd9, dnd10, dnd11, dnd12, dnd13, dnd14, dnd15, dnd16, dnd17, dnd18, dnd19, dnd20;

      vec4 BlurA(vec2 uv, int level)
      {
        if(level == 0)
        {
          return texture2D(sampler_prev, fract(uv));
        }
        if(level == 1)
        {
          return texture2D(sampler_blur, fract(uv));
        }
        if(level == 2)
        {
          return texture2D(sampler_blur2, fract(uv));
        }
        if(level == 3)
        {
          return texture2D(sampler_blur3, fract(uv));
        }
        if(level == 4)
        {
          return texture2D(sampler_blur4, fract(uv));
        }
        if(level == 5)
        {
          return texture2D(sampler_blur5, fract(uv));
        }
        return texture2D(sampler_blur6, uv);
      }

      vec2 GradientA(vec2 uv, vec2 d, vec4 selector, int level){
        vec4 dX = 0.5*BlurA(uv + vec2(1.,0.)*d, level) - 0.5*BlurA(uv - vec2(1.,0.)*d, level);
        vec4 dY = 0.5*BlurA(uv + vec2(0.,1.)*d, level) - 0.5*BlurA(uv - vec2(0.,1.)*d, level);
        return vec2( dot(dX, selector), dot(dY, selector) );
      }

      vec2 uv_zoom_exp(vec2 uv, vec2 center, vec2 aspect, float zoom, float zoom_exp, float zoom_factor){
        vec2 uv_correct = 0.5 + (uv -0.5)* aspect;
        vec2 center_correct = 0.5 + ( center - 0.5) * aspect;
        vec2 zoom_distorted = center_correct + (uv_correct - center_correct)*(1. - zoom * pow(zoom_exp, zoom_factor*length(uv_correct-center_correct)));
        return 0.5 + (zoom_distorted - 0.5) / aspect;
      }

      bool is_onscreen(vec2 uv){
        return (uv.x < 1.) && (uv.x > 0.) && (uv.y < 1.) && (uv.y > 0.);
      }

      float filter(vec2 uv, vec2 pos){
        return clamp( 1.-length((uv-pos)*texSize)/2., 0. , 1.);
      }

      float border(vec2 uv, float border, vec2 texSize){
        uv *= texSize;
        return (uv.x < border || uv.x > texSize.x-border || uv.y < border || uv.y > texSize.y-border) ? 1.:.0;
      }

      #define pi 3.141592653589793238462643383279
      #define pi_inv 0.318309886183790671537767526745
      #define pi2_inv 0.159154943091895335768883763372

      float border(vec2 domain, float thickness){
        vec2 uv = fract(domain-vec2(0.5));
        uv = min(uv,1.-uv)*2.;
        return clamp(max(uv.x,uv.y)-1.+thickness,0.,1.)/(thickness);
      }

      float square_mask(vec2 domain){
        return (domain.x <= 1. && domain.x >= 0. && domain.y <= 1. && domain.y >= 0.) ? 1. : 0.;
      }

      vec2 complex_mul(vec2 factorA, vec2 factorB){
        return vec2( factorA.x*factorB.x - factorA.y*factorB.y, factorA.x*factorB.y + factorA.y*factorB.x);
      }

      vec2 spiralzoom(vec2 domain, vec2 center, float n, float spiral_factor, float zoom_factor, vec2 pos){
        vec2 uv = domain - center;
        float d = length(uv);
        return vec2( atan(uv.y, uv.x)*n*pi2_inv + d*spiral_factor, -log(d)*zoom_factor) + pos;
      }

      vec2 complex_div(vec2 numerator, vec2 denominator){
        return vec2( numerator.x*denominator.x + numerator.y*denominator.y,
          numerator.y*denominator.x - numerator.x*denominator.y)/
          vec2(denominator.x*denominator.x + denominator.y*denominator.y);
      }

      // HSL to RGB converter code from http://www.gamedev.net/topic/465948-hsl-shader-glsl-code/
      float Hue_2_RGB(float v1, float v2, float vH )
      {
        float ret;
        if ( vH < 0.0 )
          vH += 1.0;
        if ( vH > 1.0 )
          vH -= 1.0;
        if ( ( 6.0 * vH ) < 1.0 )
          ret = ( v1 + ( v2 - v1 ) * 6.0 * vH );
        else if ( ( 2.0 * vH ) < 1.0 )
          ret = ( v2 );
        else if ( ( 3.0 * vH ) < 2.0 )
          ret = ( v1 + ( v2 - v1 ) * ( ( 2.0 / 3.0 ) - vH ) * 6.0 );
        else
          ret = v1;
        return ret;
      }

      vec3 hsl2rgb(float H, float S, float L){
        float var_2, var_1, R, G, B;
        if (S == 0.0)
        {
          R = L;
          G = L;
          B = L;
        }
        else
        {
          if ( L < 0.5 )
          {
            var_2 = L * ( 1.0 + S );
          }
          else
          {
            var_2 = ( L + S ) - ( S * L );
          }

          var_1 = 2.0 * L - var_2;

          R = Hue_2_RGB( var_1, var_2, H + ( 1.0 / 3.0 ) );
          G = Hue_2_RGB( var_1, var_2, H );
          B = Hue_2_RGB( var_1, var_2, H - ( 1.0 / 3.0 ) );
        }
        return vec3(R,G,B);
      }

      float lum(vec4 col){
        return dot(col, vec4(0.3, 0.59, 0.11, 0.));
      }

      vec2 gradient(sampler2D sampler, vec2 uv, vec2 d, vec4 selector){
        vec4 dX = texture2D(sampler, uv + vec2(1.,0.)*d) - texture2D(sampler, uv - vec2(1.,0.)*d);
        vec4 dY = texture2D(sampler, uv + vec2(0.,1.)*d) - texture2D(sampler, uv - vec2(0.,1.)*d);
        return vec2( dot(dX, selector), dot(dY, selector) );
      }

      vec2 rot90(vec2 vector){
        return vector.yx*vec2(1,-1);
      }

      float circle(vec2 uv, vec2 aspect, float scale){
        return clamp( 1. - length((uv-0.5)*aspect*scale), 0., 1.);
      }

      float sigmoid(float x) {
        return 2./(1. + exp2(-x)) - 1.;
      }

      float smoothcircle(vec2 uv, vec2 aspect, float radius, float ramp){
        return 0.5 - sigmoid( ( length( (uv - 0.5) * aspect) - radius) * ramp) * 0.5;
      }

      float tip(vec2 uv, vec2 pos, float size, float min)
      {
        return max( min, 1. - length((uv - pos) * aspect / size) );
      }

      float warpFilter(vec2 uv, vec2 pos, float size, float ramp)
      {
        return 0.5 + sigmoid( tip(uv, pos, size, -16.) * ramp) * 0.5;
      }

      vec2 vortex_warp(vec2 uv, vec2 pos, float size, float ramp, vec2 rot)
      {
        vec2 pos_correct = 0.5 + (pos - 0.5);
        vec2 rot_uv = pos_correct + complex_mul((uv - pos_correct)*aspect, rot)/aspect;
        float filter = warpFilter(uv, pos_correct, size, ramp);
        return mix(uv, rot_uv, filter);
      }

      vec2 vortex_pair_warp(vec2 uv, vec2 pos, vec2 vel)
      {
        float ramp = 4.;

        float d = 0.138 / 1024. / pixelSize.y;

        float l = length(vel);
        vec2 p1 = pos;
        vec2 p2 = pos;

        if(l > 0.){
          vec2 normal = normalize(vel.yx * vec2(-1., 1.))/aspect;
          p1 = pos - normal * d / 2.;
          p2 = pos + normal * d / 2.;
        }

        float w = l / d * 2.;

        // two overlapping rotations that would annihilate when they were not displaced.
        vec2 circle1 = vortex_warp(uv, p1, d, ramp, vec2(cos(w),sin(w)));
        vec2 circle2 = vortex_warp(uv, p2, d, ramp, vec2(cos(-w),sin(-w)));
        return (circle1 + circle2) / 2.;
      }

      // sampling functions from https://www.codeproject.com/Articles/236394/Bi-Cubic-and-Bi-Linear-Interpolation-with-GLSL#GLSLLinear
      float Triangular( float f )
      {
        f = f / 2.0;
        if( f < 0.0 )
        {
          return ( f + 1.0 );
        }
        else
        {
          return ( 1.0 - f );
        }
        return 0.0;
      }
      vec4 BiCubic( sampler2D sampler, vec2 uv, vec2 pixelSize )
      {
        vec4 nSum = vec4( 0.0, 0.0, 0.0, 0.0 );
        vec4 nDenom = vec4( 0.0, 0.0, 0.0, 0.0 );
        float a = fract( uv.x / pixelSize.x ); // get the decimal part
        float b = fract( uv.y / pixelSize.y ); // get the decimal part
        for( int m = -1; m <=2; m++ )
        {
          for( int n =-1; n<= 2; n++)
          {
            vec4 vecData = texture2D(sampler, uv + vec2(pixelSize.x * float( m ), pixelSize.y * float( n )));
            float f  = Triangular( float( m ) - a );
            vec4 vecCooef1 = vec4( f,f,f,f );
            float f1 = Triangular ( -( float( n ) - b ) );
            vec4 vecCoeef2 = vec4( f1, f1, f1, f1 );
            nSum = nSum + ( vecData * vecCoeef2 * vecCooef1  );
            nDenom = nDenom + (( vecCoeef2 * vecCooef1 ));
          }
        }
        return nSum / nDenom;
      }
      vec2 gradientBiCubic(sampler2D sampler, vec2 uv, vec2 d, vec4 selector, vec2 pixelSize){
        vec4 dX = BiCubic(sampler, uv + vec2(1.,0.)*d, pixelSize) - BiCubic(sampler, uv - vec2(1.,0.)*d, pixelSize);
        vec4 dY = BiCubic(sampler, uv + vec2(0.,1.)*d, pixelSize) - BiCubic(sampler, uv - vec2(0.,1.)*d, pixelSize);
        return vec2( dot(dX, selector), dot(dY, selector) );
      }
		*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];

shaders['move particles'] = (function () {/*  
vec4 applyMoverForce(vec4 p, vec2 f00, int moverState, vec4 mover, float active){
			if(active == 1. && (moverState == 4 || moverState == 3)){
				vec2 pos = (p.xy - mover.xy);
				float d = length(pos*aspect);
	
				float area = smoothcircle(p.xy-mover.xy+0.5, aspect, 0.66, 64.);
				float dir = 0.002;
				if( moverState == 3){
					dir = -0.004;
				}
				p.zw += pos * area * dir;
				
				//p.xy += mover.zw * float(d < 0.04); // simple window cleaner
			}
			return p;
		}
	
		vec4 applyMoverForces(vec4 p, vec2 foo){
			p = applyMoverForce(p, foo, moverState0, mover0, col0.a); // first person, left hand
			p = applyMoverForce(p, foo, moverState1, mover1, col0.a); // right hand
			p = applyMoverForce(p, foo, moverState2, mover2, col1.a); // second person
			p = applyMoverForce(p, foo, moverState3, mover3, col1.a);
			p = applyMoverForce(p, foo, moverState4, mover4, col2.a); // third
			p = applyMoverForce(p, foo, moverState5, mover5, col2.a);
			p = applyMoverForce(p, foo, moverState6, mover6, col3.a);
			p = applyMoverForce(p, foo, moverState7, mover7, col3.a);
			p = applyMoverForce(p, foo, moverState8, mover8, col4.a);
			p = applyMoverForce(p, foo, moverState9, mover9, col4.a);
	
			p = applyMoverForce(p, foo, 3, vec4(mouse, mouseV), mouseDown);
			vec4 noise = texture2D(sampler_noise, uv)*2. - vec4(1.);
			vec2 domain = uv;
			float index = ((domain.y-0.5/particleTexSize.y) + (domain.x-0.5/particleTexSize.x) * particleTexSize.y) * particleTexSize.x;
			float particleCount = particleTexSize.x * particleTexSize.y;
			index /= particleCount;
			if(activeRange.x < index && index <activeRange.y && noise.x > 0.666){
				p.xy = mix(oldPen, pen, (index - activeRange.x)/(activeRange.y - activeRange.x));
				p.zw = vec2(0);
			}
			p.xy += foo;
			return p;
		}
	
		void main(void){
			// #move
			vec4 p = texture2D(sampler_particles, uv); // residual location and velocity of the particle in the previous frame
			vec2 f = texture2D(sampler_fluid, p.xy).xz*pixelSize; // fluid simulation flow vector
			vec4 noise = texture2D(sampler_noise, p.xy)*2. - vec4(1.);

			// apply forces
			//p.zw += gradient(sampler_blur3, p.xy, pixelSize*4., vec4(-0.,0.,1.,0.))*pixelSize; // gradients from red and green

			//p.zw += gradient(sampler_blur, p.xy, pixelSize, vec4(0.,0.,0.,-1./16.))*pixelSize;
			p.zw += gradient(sampler_blur5, p.xy, pixelSize*212., vec4(0.,0.,0.,-1./16.))*pixelSize;

			vec2 oo = vec2(0);
			//oo += gradient(sampler_prev, p.xy, pixelSize*1., vec4(0,0,-32.,0.))*pixelSize; // move away from red, accurate
			//oo += gradient(sampler_blur, p.xy, pixelSize*4., vec4(0.,0,4.,0.))*pixelSize; // move toward red, smooth
			//oo += rot90(gradient(sampler_blur2, p.xy, pixelSize*8., vec4(-0.,0,-8.,0.)))*pixelSize; // move orthogonal to the gradient

			p = applyMoverForces(p, f+oo); // fluid + other offset
			
			p.zw = p.zw * max(0., 1. - (p.z*p.z + p.w*p.w)*32.); // (non-linear) friction
			p.xy += p.zw / aspect.xy; // verlet integration

			gl_FragColor.xy = fract(p.xy); // wrap

			gl_FragColor.zw = p.zw; 
		}
    */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];

shaders['advance'] = (function () {/*  
      vec2 advanceMover(vec2 uv, int moverstate, vec4 mover, vec2 aspect, float zoom, float zoom_exp, float zoom_factor){
				vec2 warp = uv;
				if(moverstate == 2) // when open
					warp = uv_zoom_exp(uv, mover.xy, aspect, zoom, zoom_exp, zoom_factor); // blow away
				return warp;
			}
			// #warp and #react. the results of this program will be diffused
			void main(void) {
        float noise = texture2D(sampler_noise, uv + rnd.zw).x;
        vec2 f = texture2D(sampler_fluid, uv).xz*pixelSize;
        vec2 uv = uv - f;
        // expansion
        vec2 gradientLookupDistance = pixelSize*3.;
        float expansionFactor = 1.;

        // reaction-diffusion
        float differentialFactor = 64./256.;
        float increment = - 13.5/256.;
        float noiseFactor = 3.5/256.;

        // rock-paper-scissor        
        float feedBack = 8./256.;
        float feedForward = 8./256.;

        gl_FragColor.r = BlurA(uv + GradientA(uv, gradientLookupDistance, vec4(4.,0.,-2.,0.), 1)*pixelSize*expansionFactor, 0).r;
        gl_FragColor.g = BlurA(uv + GradientA(uv, gradientLookupDistance, vec4(0.,4.,0.,-2.), 1)*pixelSize*expansionFactor, 0).g;
        gl_FragColor.b = BlurA(uv + GradientA(uv, gradientLookupDistance, vec4(-2.,0.,4.,0.), 1)*pixelSize*expansionFactor, 0).b;
        gl_FragColor.a = BlurA(uv + GradientA(uv, gradientLookupDistance, vec4(0.,-2.,0.,4.), 1)*pixelSize*expansionFactor, 0).a;

        gl_FragColor += (BlurA(uv, 1) - BlurA(uv, 2))*differentialFactor;

        gl_FragColor += increment + noise * noiseFactor;

        gl_FragColor -= BlurA(uv, 0).argb * feedBack;
        gl_FragColor += BlurA(uv, 0).gbar * feedForward;

        gl_FragColor = clamp(gl_FragColor, 0., 1.);
		}
		*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];

shaders['composite'] = (function () {/*  
			vec4 moverCol(int moverState){
				vec4 red = vec4(1,0,0,0);
				vec4 green = vec4(0,1,0,0);
				vec4 blue = vec4(0,0,1,0);
	
				vec4 cyan = vec4(0,1,1,0);
				vec4 yellow = vec4(1,1,0,0);
	
				vec4 purple = vec4(0.5,0,.50,0);
	
				vec4 col = purple; // unknown
	
				if(moverState == 1){ // lasso
					col = cyan;
				}
				if(moverState == 2){ // open
					col = red;
				}
				if(moverState == 3){ // closed
					col = green;
				}
				if(moverState == 4){ // pointy
					col = yellow;
				}
				return col;
			}
			void mixInMover(int moverState, vec4 mover, vec4 col){
				if(col.a == 1.){
					gl_FragColor = mix(gl_FragColor, moverCol(moverState), smoothcircle(uv-mover.xy+0.5, aspect, 0.025, 96.));
				}
			}
			void mixInMovers(){
				mixInMover(moverState0, mover0, col0); // first person, left hand
				mixInMover(moverState1, mover1, col0); // right hand
	
				mixInMover(moverState2, mover2, col1); // second person
				mixInMover(moverState3, mover3, col1);
	
				mixInMover(moverState4, mover4, col2); // third
				mixInMover(moverState5, mover5, col2);
	
				mixInMover(moverState6, mover6, col3);
				mixInMover(moverState7, mover7, col3);
	
				mixInMover(moverState8, mover8, col4);
				mixInMover(moverState9, mover9, col4);
			}
	
			void mixInDndControl(vec4 dnd){
				if(dnd.z > 0.){ // size
					// #applecolor
					vec4 color = vec4(1,0,0,0);
					gl_FragColor = mix(gl_FragColor, color, smoothcircle(uv-dnd.xy+0.5, aspect, 0.0025 * dnd.z, 192.));
				}
			}
	
			void mixInDndControls(){
				mixInDndControl(dnd1); mixInDndControl(dnd2); mixInDndControl(dnd3); mixInDndControl(dnd4); mixInDndControl(dnd5); mixInDndControl(dnd6); mixInDndControl(dnd7); mixInDndControl(dnd8); mixInDndControl(dnd9); mixInDndControl(dnd10);
				mixInDndControl(dnd11); mixInDndControl(dnd12); mixInDndControl(dnd13); mixInDndControl(dnd14); mixInDndControl(dnd15); mixInDndControl(dnd16); mixInDndControl(dnd17); mixInDndControl(dnd18); mixInDndControl(dnd19); mixInDndControl(dnd20);
			}
	
			float mouseFilter(vec2 uv){
				return clamp( 1.-length((uv-mouse)*texSize)/16., 0. , 1.);
			}

			void main(void) {
        vec2 lightSize=vec2(0.5);

        vec2 d = pixelSize*2.;
        vec4 dx = (BlurA(uv + vec2(1,0)*d, 1) - BlurA(uv - vec2(1,0)*d, 1))*0.5;
        vec4 dy = (BlurA(uv + vec2(0,1)*d, 1) - BlurA(uv - vec2(0,1)*d, 1))*0.5;

        d = pixelSize*1.;
        dx += BlurA(uv + vec2(1,0)*d, 0) - BlurA(uv - vec2(1,0)*d, 0);
        dy += BlurA(uv + vec2(0,1)*d, 0) - BlurA(uv - vec2(0,1)*d, 0);

        gl_FragColor = BlurA(uv+vec2(dx.x,dy.x)*pixelSize*8., 0).x * vec4(0.7,1.66,2.0,1.0) - vec4(0.3,1.0,1.0,1.0);
        gl_FragColor = mix(gl_FragColor,vec4(4.,2.,0.66,0), BlurA(uv + vec2(dx.x,dy.x)*lightSize, 3).y*0.4*0.75*vec4(1.-BlurA(uv+vec2(dx.x,dy.x)*pixelSize*8., 0).x)*2. );
        gl_FragColor = mix(gl_FragColor, vec4(0.,0.,0.4,0.), BlurA(uv, 1).a*length(GradientA(uv, pixelSize*2., vec4(0.,0.,0.,1.), 0))*5.);
        gl_FragColor = mix(gl_FragColor, vec4(1.25,1.35,1.4,0.), BlurA(uv, 0).x*BlurA(uv + GradientA(uv, pixelSize*2.5, vec4(-256.,32.,-128.,32.), 1)*pixelSize, 2).y*0.2);
        gl_FragColor = mix(gl_FragColor, vec4(0.2,0.7,0.9,0.), BlurA(uv, 1).x*length(GradientA(uv+GradientA(uv, pixelSize*2., vec4(0.,0.,128.,0.), 1)*pixelSize, pixelSize*2., vec4(0.,0.,0.,1.), 0))*5.);
        gl_FragColor = mix(gl_FragColor, vec4(1.,1.25,1.5,0.), 0.5*(1.-BlurA(uv, 0)*1.).a*length(GradientA(uv+GradientA(uv, pixelSize*2., vec4(0.,128.,0.,0.), 1)*pixelSize, pixelSize*1.5, vec4(0.,0.,16.,0.), 0))* 0.25);
        gl_FragColor = mix(gl_FragColor, vec4(0.,0.,0.,1.), texture2D(sampler_sticky_scene, uv+vec2(2,2)*pixelSize).y);
        gl_FragColor = mix(gl_FragColor, vec4(1.,1.,1.,1.), texture2D(sampler_sticky_scene, uv).y);

        gl_FragColor = mix(gl_FragColor, vec4(1), texture2D(sampler_spline_scene, uv));
        //gl_FragColor = texture2D(sampler_prev, uv); // bypass
        //mixInMovers();
        gl_FragColor.a = 1.;
			}
			// #composite end
		*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];

shaders['blur horizontal'] = (function () {/*  
		// Gaussian factors from https://github.com/mattdesl/lwjgl-basics/wiki/ShaderLesson5
		// horizontal blur fragment shader
		uniform sampler2D src_tex;
		void main(void) // fragment
		{
			float h = pixelSize.x;
			vec4 sum = vec4(0.0);
			sum += texture2D(src_tex, vec2(-4,0) * pixelSize + uv ) * 0.0162162162;
			sum += texture2D(src_tex, vec2(-3,0) * pixelSize + uv ) * 0.0540540541;
			sum += texture2D(src_tex, vec2(-2,0) * pixelSize + uv ) * 0.1216216216;
			sum += texture2D(src_tex, vec2(-1,0) * pixelSize + uv ) * 0.1945945946;
			sum += texture2D(src_tex, vec2( 0,0) * pixelSize + uv ) * 0.2270270270;
			sum += texture2D(src_tex, vec2( 1,0) * pixelSize + uv ) * 0.1945945946;
			sum += texture2D(src_tex, vec2( 2,0) * pixelSize + uv ) * 0.1216216216;
			sum += texture2D(src_tex, vec2( 3,0) * pixelSize + uv ) * 0.0540540541;
			sum += texture2D(src_tex, vec2( 4,0) * pixelSize + uv ) * 0.0162162162;
			gl_FragColor = sum;
		}
		*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];

shaders['blur vertical'] = (function () {/*  
		uniform sampler2D src_tex;
		void main(void) // fragment
		{
			float v = pixelSize.y;
			vec4 sum = vec4(0.0);
			sum += texture2D(src_tex, vec2(0,-4) * pixelSize + uv ) * 0.0162162162;
			sum += texture2D(src_tex, vec2(0,-3) * pixelSize + uv ) * 0.0540540541;
			sum += texture2D(src_tex, vec2(0,-2) * pixelSize + uv ) * 0.1216216216;
			sum += texture2D(src_tex, vec2(0,-1) * pixelSize + uv ) * 0.1945945946;
			sum += texture2D(src_tex, vec2(0, 0) * pixelSize + uv ) * 0.2270270270;
			sum += texture2D(src_tex, vec2(0, 1) * pixelSize + uv ) * 0.1945945946;
			sum += texture2D(src_tex, vec2(0, 2) * pixelSize + uv ) * 0.1216216216;
			sum += texture2D(src_tex, vec2(0, 3) * pixelSize + uv ) * 0.0540540541;
			sum += texture2D(src_tex, vec2(0, 4) * pixelSize + uv ) * 0.0162162162;
			gl_FragColor = sum;
		}
		*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];

shaders['add mouse motion'] = (function () {/*  
void main(void){
			vec2 v = texture2D(sampler_fluid, uv).xz;
			if(length(mouseV) > 0.){
				v = mix(v, mouseV, filter(uv, mouse)*0.85);
			}
			float scale = 8.;
			// first person head
			if(length(mover0.zw) > 0.){
				v = mix(v, head0.zw*scale*texSize, filter(uv, head0.xy)*0.85);
			}
			// first person left hand
			if(length(mover0.zw) > 0.){
				v = mix(v, mover0.zw*scale*texSize, filter(uv, mover0.xy)*0.85);
			}
			// first person right hand
			if(length(mover1.zw) > 0.){
				v = mix(v, mover1.zw*scale*texSize, filter(uv, mover1.xy)*0.85);
			}
	
			// second person head
			if(length(mover0.zw) > 0.){
				v = mix(v, head1.zw*scale*texSize, filter(uv, head1.xy)*0.85);
			}
			// second person left hand
			if(length(mover2.zw) > 0.){
				v = mix(v, mover2.zw*scale*texSize, filter(uv, mover2.xy)*0.85);
			}
			// second person right hand
			if(length(mover3.zw) > 0.){
				v = mix(v, mover3.zw*scale*texSize, filter(uv, mover3.xy)*0.85);
			}
			// third person head
			if(length(mover0.zw) > 0.){
				v = mix(v, head2.zw*scale*texSize, filter(uv, head2.xy)*0.85);
			}
			// third person left hand
			if(length(mover4.zw) > 0.){
				v = mix(v, mover4.zw*scale*texSize, filter(uv, mover4.xy)*0.85);
			}
			// third person right hand
			if(length(mover5.zw) > 0.){
				v = mix(v, mover5.zw*scale*texSize, filter(uv, mover5.xy)*0.85);
			}
			// 4th person head
			if(length(mover0.zw) > 0.){
				v = mix(v, head3.zw*scale*texSize, filter(uv, head3.xy)*0.85);
			}
			// 4th person left hand
			if(length(mover6.zw) > 0.){
				v = mix(v, mover6.zw*scale*texSize, filter(uv, mover6.xy)*0.85);
			}
			// 4th person right hand
			if(length(mover7.zw) > 0.){
				v = mix(v, mover7.zw*scale*texSize, filter(uv, mover7.xy)*0.85);
			}
	
			gl_FragColor.xz = v*0.999;
		}
		*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];

shaders['advect'] = (function () {/*  
const float dt = .0005;
	
			void main(void){
			vec2 v = texture2D(sampler_fluid, uv).xz;
	
			vec2 D = -texSize*vec2(v.x, v.y)*dt;
	
			vec2 Df = floor(D),   Dd = D - Df;
			vec2 uv = uv + Df*pixelSize;
	
			vec2 uv0, uv1, uv2, uv3;
	
			uv0 = uv + pixelSize*vec2(0.,0.);
			uv1 = uv + pixelSize*vec2(1.,0.);
			uv2 = uv + pixelSize*vec2(0.,1.);
			uv3 = uv + pixelSize*vec2(1.,1.);
	
			vec2 v0 = texture2D(sampler_fluid, uv0).xz;
			vec2 v1 = texture2D(sampler_fluid, uv1).xz;
			vec2 v2 = texture2D(sampler_fluid, uv2).xz;
			vec2 v3 = texture2D(sampler_fluid, uv3).xz;
	
			v = mix( mix( v0, v1, Dd.x), mix( v2, v3, Dd.x), Dd.y);
	
			gl_FragColor.xz = v*(1.-border(uv, 1., texSize))*0.99975;
			}
		*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];

shaders['p'] = (function () {/*  
			uniform sampler2D sampler_v;
			uniform sampler2D sampler_p;
			const float h = 1./1024.;
	
			void main(void){
	
			vec2 v = texture2D(sampler_v, uv).xz;
			float v_x = texture2D(sampler_v, uv - vec2(1.,0.)*pixelSize).r;
			float v_y = texture2D(sampler_v, uv - vec2(0.,1.)*pixelSize).b;
	
			float n = texture2D(sampler_p, uv- pixelSize*vec2(0.,1.)).r;
			float w = texture2D(sampler_p, uv + pixelSize*vec2(1.,0.)).r;
			float s = texture2D(sampler_p, uv + pixelSize*vec2(0.,1.)).r;
			float e = texture2D(sampler_p, uv - pixelSize*vec2(1.,0.)).r;
	
			float p = ( n + w + s + e - (v.x - v_x + v.y - v_y)*h ) * .25;
	
			gl_FragColor.r = p;
			gl_FragColor.ba = vec2(0.); // unused
			}
		*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];

shaders['div'] = (function () {/*  
			uniform sampler2D sampler_v;
			uniform sampler2D sampler_p;
	
			void main(void){
			float p = texture2D(sampler_p, uv).r;
			vec2 v = texture2D(sampler_v, uv).xz;
			float p_x = texture2D(sampler_p, uv + vec2(1.,0.)*pixelSize).r;
			float p_y = texture2D(sampler_p, uv + vec2(0.,1.)*pixelSize).r;
	
			v -= (vec2(p_x, p_y)-p)*512.;
	
			gl_FragColor.xz = v;
			}
		*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];

shaders['particle vertex'] = (function () {/*  
		#ifdef GL_ES
		precision mediump float;
		#endif
	
		attribute vec2 uv; // particle position lookup vector
		uniform sampler2D sampler_prev;
		uniform sampler2D sampler_blur;
		uniform sampler2D sampler_particles; // particle positions in a float texture
		uniform vec2 mouse;
		uniform vec2 pixelSize;
		varying vec2 domain;
	
		vec2 gradient(sampler2D sampler, vec2 uv, vec2 d, vec4 selector){
			vec4 dX = 0.5*texture2D(sampler, uv + vec2(1.,0.)*d) - 0.5*texture2D(sampler, uv - vec2(1.,0.)*d);
			vec4 dY = 0.5*texture2D(sampler, uv + vec2(0.,1.)*d) - 0.5*texture2D(sampler, uv - vec2(0.,1.)*d);
			return vec2( dot(dX, selector), dot(dY, selector) );
		}
	
		void main() {
			gl_Position = (texture2D(sampler_particles, uv) - 0.5)*2.; // pass em flat
			//gl_Position.xy += gradient(sampler_blur, gl_Position.xy*0.5+0.5, pixelSize*3., vec4(1,-0.,0,0))*pixelSize*32.;
	
			gl_Position.zw = vec2(0,1);
			gl_PointSize = 1.;	
		}
		*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];

shaders['particle fragment'] = (function () {/*  
		void main() {
			gl_FragColor = vec4(1.0, 0.5, 0.166, 0.33);
		}
		*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];

console.log("available shader programs: " + JSON.stringify(Object.keys(shaders)));

// webgl setup

var gl;
var ext;

var prog_copy;
var prog_advance;
var prog_composite;
var prog_blur_horizontal;
var prog_blur_vertical;
var prog_fluid_init;
var prog_fluid_add_mouse_motion;
var prog_fluid_advect;
var prog_fluid_p;
var prog_fluid_div;
var prog_move_particles;
var prog_render_particles;

var FBO_main;
var FBO_main2;
var FBO_noise;
var FBO_blur;
var FBO_blur2;
var FBO_blur3;
var FBO_blur4;
var FBO_blur5;
var FBO_blur6;
var FBO_helper;
var FBO_helper2;
var FBO_helper3;
var FBO_helper4;
var FBO_helper5;
var FBO_helper6;
var FBO_fluid_v;
var FBO_fluid_p;
var FBO_fluid_store;
var FBO_fluid_backbuffer;
var FBO_particles; // particle positions in a texture
var FBO_particles2; // double buffer
var FBO_particle_projection; // particle render target for projection feedback effects
var FBO_sticky_scene; // we will copy a 2d drawn scene to a webgl texture using this
var FBO_poitoy_scene; // 2d drawn scene to webgl texture too
var FBO_spline_scene; // hooray for the canvas 2d spline editor in WebGL

var texture_main_n; // main, nearest pixel
var texture_main_l; // main, linear interpolated access on the same buffer
var texture_main2_n; // main double buffer, nearest
var texture_main2_l; // main double buffer, linear
var texture_blur; // full resolution blur result
var texture_blur2; // double blur
var texture_blur3; // quad blur
var texture_blur4; // use low resolutions wisely ;)
var texture_blur5;
var texture_blur6;
var texture_helper; // needed for multi-pass shader programs (2-pass Gaussian blur)
var texture_helper2; // (1/4 resolution )
var texture_helper3; // (1/16 resolution )
var texture_helper4; // (1/256 resolution )
var texture_helper5;
var texture_helper6;
var texture_noise_n; // nearest pixel access
var texture_noise_l; // linear interpolated
var texture_fluid_v; // velocities
var texture_fluid_p; // pressure
var texture_fluid_store;
var texture_fluid_backbuffer;
var texture_particles;
var texture_particles2;
var texture_particle_projection;
var texture_sticky_scene;
var texture_poitoy_scene;
var texture_spline_scene;


var limitFramerate = 10; // got a too fast display, don't worry
var lastFramesPerSecond = 10; // pessimistic but greater than zero
var startFullpage = true;

// don't change vars below
var canvas2d;
var canvas2dContext;

var frame = 0; // frame counter to be resetted every 1000ms
var framecount = 0; // not resetted
var mainBufferToggle = 1;
var halted = false;
var fps, fpsDisplayUpdateTimer;
var time, starttime = new Date().getTime();

var mouseX = 0.5;
var mouseY = 0.5;
var mouseDown = false;
var oldMouseX = 0;
var oldMouseY = 0;
var mouseDx = 0;
var mouseDy = 0;

var aspectx = 2;
var aspecty = 1;

// geometry
var particleBuffer, squareBuffer;

function updateAspectRatio() {
	aspectx = Math.max(1, viewX / viewY);
	aspecty = Math.max(1, viewY / viewX);
}

var poiToy = new PoiToy();
poiToy.z = 0.5;
poiToy.applyColor = poiToy.createTextPatternFn("Poi Toy Redux ", 0.5);

function load() {
	hide(); // unhide with doubleclick
	clearInterval(fpsDisplayUpdateTimer);
	canvas2d = document.createElement("canvas");
	canvas2d.width = sizeX;
	canvas2d.height = sizeY;
	canvas2dContext = canvas2d.getContext("2d");
	var c = document.getElementById("c");
	try {
		gl = c.getContext("experimental-webgl", {
			depth: false
		});
	} catch (e) {
	}
	if (!gl) {
		alert("Meh! Y u no support WebGL !?!");
		return;
	}

	["OES_texture_float", 
	 //"OES_standard_derivatives", 
	 "OES_texture_float_linear"].forEach(function (name) {
		console.log("get extension " + name);
		try {
			ext = gl.getExtension(name);
		} catch (e) {
			alert(e);
		}
		if (!ext) {
			alert("Meh! Y u no support " + name + " !?!)");
			return;
		}
		ext = false;
	});

	var vertexTextures = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);

	if (gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS) == 0) {
		alert("Meh! Y u no support vertex shader textures !?!");
		return;
	} else {
		console.log("MAX_VERTEX_TEXTURE_IMAGE_UNITS = " + vertexTextures);
	}

	c.onmousemove = function (evt) {
		mouseX = evt.pageX / viewX;
		mouseY = 1 - evt.pageY / viewY;

		poiToy.x = (mouseX - 0.5) * aspectx;
		poiToy.y = (mouseY - 0.5) * aspecty;

		if(showSpline) {
			updateSpline(mouseX * sizeX, (1 - mouseY) * sizeY);
		}
	};

	c.onmousedown = function (evt) {
		mouseDown = true;
	}

	c.onmouseup =
		document.onmouseout = function (evt) {
		mouseDown = false;
	}

	document.addEventListener("orientationchange", window.onresize = function () {
		viewX = window.innerWidth;
		viewY = window.innerHeight;
		c.width = viewX;
		c.height = viewY;
		updateAspectRatio();
	});

	if (startFullpage) {
		viewX = window.innerWidth;
		viewY = window.innerHeight;
	}

	c.width = viewX;
	c.height = viewY;
	updateAspectRatio();

	prog_copy = createAndLinkProgram("copy");
	prog_advance = createAndLinkProgram("advance");
	prog_composite = createAndLinkProgram("composite");
	prog_blur_horizontal = createAndLinkProgram("blur horizontal");
	prog_blur_vertical = createAndLinkProgram("blur vertical");
	prog_fluid_init = createAndLinkProgram("init");
	prog_fluid_add_mouse_motion = createAndLinkProgram("add mouse motion");
	prog_fluid_advect = createAndLinkProgram("advect");
	prog_fluid_p = createAndLinkProgram("p");
	prog_fluid_div = createAndLinkProgram("div");
	prog_move_particles = createAndLinkProgram("move particles");

	triangleStripGeometry = {
		vertices: new Float32Array([-1, -1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0]),
		texCoords: new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]),
		vertexSize: 3,
		vertexCount: 4,
		type: gl.TRIANGLE_STRIP
	};

	createTexturedGeometryBuffer(triangleStripGeometry);

	squareBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, squareBuffer);

	var aPosLoc = gl.getAttribLocation(prog_advance, "aPos");
	var aTexLoc = gl.getAttribLocation(prog_advance, "aTexCoord");

	gl.enableVertexAttribArray(aPosLoc);
	gl.enableVertexAttribArray(aTexLoc);

	var verticesAndTexCoords = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1, // one square of a quad!
																							 0, 0, 1, 0, 0, 1, 1, 1] // hello texture, you be full
																						 );

	gl.bufferData(gl.ARRAY_BUFFER, verticesAndTexCoords, gl.STATIC_DRAW);
	gl.vertexAttribPointer(aPosLoc, 2, gl.FLOAT, gl.FALSE, 8, 0);
	gl.vertexAttribPointer(aTexLoc, 2, gl.FLOAT, gl.FALSE, 8, 32);

	var noisePixels = [], pixels = [], simpixels = [], pixels2 = [], pixels3 = [], pixels4 = [], pixels5 = [], pixels6 = [], pixels7 = [], particles = [], particlesIdx = [];
	var dX = 1 / particlesWidth;
	var dY = 1 / particlesHeight;
	for (var j = 0; j < sizeY; j++) {
		for (var i = 0; i < sizeX; i++) {
			noisePixels.push(Math.random(), Math.random(), Math.random(), Math.random());
			pixels.push(0, 0, 0, 1);
			if (i < sizeX / simScale && j < sizeY / simScale)
				simpixels.push(0, 0, 0, 1);
			if (i < sizeX / 2 && j < sizeY / 2)
				pixels2.push(0, 0, 0, 1);
			if (i < sizeX / 4 && j < sizeY / 4)
				pixels3.push(0, 0, 0, 1);
			if (i < sizeX / 8 && j < sizeY / 8)
				pixels4.push(0, 0, 0, 1);
			if (i < sizeX / 16 && j < sizeY / 16)
				pixels5.push(0, 0, 0, 1);
			if (i < sizeX / 32 && j < sizeY / 32)
				pixels6.push(0, 0, 0, 1);
			if (i < sizeX / 64 && j < sizeY / 64)
				pixels6.push(0, 0, 0, 1);
			if (i < particlesWidth && j < particlesHeight) {
				particles.push(dX / 2 + i * dX, dY / 2 + j * dY, 0, 0); // initial particle positions, here: uniform distribution
			}
		}
	}

	for (var i = 0; i < particlesHeight; i++) {
		for (var j = 0; j < particlesWidth; j++) {
			particlesIdx.push(dX / 2 + j * dX, dY / 2 + i * dY); // coordinate lookup vectors (center of pixels)
		}
	}

	FBO_main = gl.createFramebuffer();
	FBO_main2 = gl.createFramebuffer();
	var glPixels;
	glPixels = new Float32Array(noisePixels);
	texture_main_n = createAndBindTexture(glPixels, 1, FBO_main, gl.NEAREST);
	texture_main2_n = createAndBindTexture(glPixels, 1, FBO_main2, gl.NEAREST);
	glPixels = new Float32Array(noisePixels);
	texture_main_l = createAndBindTexture(glPixels, 1, FBO_main, gl.LINEAR);
	texture_main2_l = createAndBindTexture(glPixels, 1, FBO_main2, gl.LINEAR);

	FBO_fluid_p = gl.createFramebuffer();
	FBO_fluid_v = gl.createFramebuffer();
	FBO_fluid_store = gl.createFramebuffer();
	FBO_fluid_backbuffer = gl.createFramebuffer();
	texture_fluid_v = createAndBindSimulationTexture(new Float32Array(simpixels), FBO_fluid_v);
	texture_fluid_p = createAndBindSimulationTexture(new Float32Array(simpixels), FBO_fluid_p);
	texture_fluid_store = createAndBindSimulationTexture(new Float32Array(simpixels), FBO_fluid_store);
	texture_fluid_backbuffer = createAndBindSimulationTexture(new Float32Array(simpixels), FBO_fluid_backbuffer);

	FBO_particle_projection = gl.createFramebuffer();
	texture_particle_projection = createAndBindTexture(new Float32Array(pixels), 1, FBO_particle_projection, gl.LINEAR);

	FBO_helper = gl.createFramebuffer();
	FBO_helper2 = gl.createFramebuffer();
	FBO_helper3 = gl.createFramebuffer();
	FBO_helper4 = gl.createFramebuffer();
	FBO_helper5 = gl.createFramebuffer();
	FBO_helper6 = gl.createFramebuffer();
	texture_helper = createAndBindTexture(new Float32Array(pixels2), 2, FBO_helper, gl.NEAREST); // helper buffers for the two-pass Gaussian blur calculation basically
	texture_helper2 = createAndBindTexture(new Float32Array(pixels3), 4, FBO_helper2, gl.NEAREST);
	texture_helper3 = createAndBindTexture(new Float32Array(pixels4), 8, FBO_helper3, gl.NEAREST);
	texture_helper4 = createAndBindTexture(new Float32Array(pixels5), 16, FBO_helper4, gl.NEAREST);
	texture_helper5 = createAndBindTexture(new Float32Array(pixels6), 32, FBO_helper5, gl.NEAREST);
	texture_helper6 = createAndBindTexture(new Float32Array(pixels7), 64, FBO_helper6, gl.NEAREST);

	FBO_blur = gl.createFramebuffer();
	FBO_blur2 = gl.createFramebuffer();
	FBO_blur3 = gl.createFramebuffer();
	FBO_blur4 = gl.createFramebuffer();
	FBO_blur5 = gl.createFramebuffer();
	FBO_blur6 = gl.createFramebuffer();
	texture_blur = createAndBindTexture(new Float32Array(pixels2), 2, FBO_blur, gl.LINEAR);
	texture_blur2 = createAndBindTexture(new Float32Array(pixels3), 4, FBO_blur2, gl.LINEAR);
	texture_blur3 = createAndBindTexture(new Float32Array(pixels4), 8, FBO_blur3, gl.LINEAR);
	texture_blur4 = createAndBindTexture(new Float32Array(pixels5), 16, FBO_blur4, gl.LINEAR);
	texture_blur5 = createAndBindTexture(new Float32Array(pixels6), 32, FBO_blur5, gl.LINEAR);
	texture_blur6 = createAndBindTexture(new Float32Array(pixels7), 64, FBO_blur6, gl.LINEAR);

	FBO_sticky_scene = gl.createFramebuffer();
	texture_sticky_scene = createAndBindTexture(new Uint8Array(pixels), 1, FBO_sticky_scene, gl.LINEAR, gl.UNSIGNED_BYTE);

	FBO_poitoy_scene = gl.createFramebuffer();
	texture_poitoy_scene = createAndBindTexture(new Uint8Array(pixels), 1, FBO_poitoy_scene, gl.LINEAR, gl.UNSIGNED_BYTE);

	FBO_spline_scene = gl.createFramebuffer();
	texture_spline_scene = createAndBindTexture(new Uint8Array(pixels), 1, FBO_spline_scene, gl.LINEAR, gl.UNSIGNED_BYTE);

	FBO_noise = gl.createFramebuffer();
	glPixels = new Float32Array(noisePixels);
	texture_noise_n = createAndBindTexture(glPixels, 1, FBO_noise, gl.NEAREST);
	texture_noise_l = createAndBindTexture(glPixels, 1, FBO_noise, gl.LINEAR);

	FBO_particles = gl.createFramebuffer();
	texture_particles = createAndBindParticleTexture(new Float32Array(particles), FBO_particles);

	FBO_particles2 = gl.createFramebuffer();
	texture_particles2 = createAndBindParticleTexture(new Float32Array(particles), FBO_particles2);

	var aParticleLoc = 2;
	prog_render_particles = createAndLinkParticleRenderer(aParticleLoc);

	gl.useProgram(prog_render_particles);
	gl.uniform1i(gl.getUniformLocation(prog_render_particles, "sampler_particles"), 0);
	gl.uniform2f(gl.getUniformLocation(prog_render_particles, "particleTexSize"), particlesWidth, particlesHeight);

	gl.enableVertexAttribArray(aParticleLoc);
	particleBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, particleBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(particlesIdx), gl.STATIC_DRAW);
	gl.vertexAttribPointer(aParticleLoc, 2, gl.FLOAT, false, 0, 0);

	gl.activeTexture(gl.TEXTURE2);
	gl.bindTexture(gl.TEXTURE_2D, texture_blur);
	gl.activeTexture(gl.TEXTURE3);
	gl.bindTexture(gl.TEXTURE_2D, texture_blur2);
	gl.activeTexture(gl.TEXTURE4);
	gl.bindTexture(gl.TEXTURE_2D, texture_blur3);
	gl.activeTexture(gl.TEXTURE5);
	gl.bindTexture(gl.TEXTURE_2D, texture_blur4);
	gl.activeTexture(gl.TEXTURE6);
	gl.bindTexture(gl.TEXTURE_2D, texture_blur5);
	gl.activeTexture(gl.TEXTURE7);
	gl.bindTexture(gl.TEXTURE_2D, texture_blur6);
	gl.activeTexture(gl.TEXTURE8);
	gl.bindTexture(gl.TEXTURE_2D, texture_noise_l);
	gl.activeTexture(gl.TEXTURE9);
	gl.bindTexture(gl.TEXTURE_2D, texture_noise_n);
	gl.activeTexture(gl.TEXTURE10);
	gl.bindTexture(gl.TEXTURE_2D, texture_fluid_v);
	gl.activeTexture(gl.TEXTURE11);
	gl.bindTexture(gl.TEXTURE_2D, texture_fluid_p);
	gl.activeTexture(gl.TEXTURE12);
	gl.bindTexture(gl.TEXTURE_2D, texture_particles); // to be swapped anyways
	gl.activeTexture(gl.TEXTURE13);
	gl.bindTexture(gl.TEXTURE_2D, texture_particle_projection);
	gl.activeTexture(gl.TEXTURE14);
	gl.bindTexture(gl.TEXTURE_2D, texture_sticky_scene);
	gl.activeTexture(gl.TEXTURE15);
	gl.bindTexture(gl.TEXTURE_2D, texture_poitoy_scene);
	gl.activeTexture(gl.TEXTURE16);
	gl.bindTexture(gl.TEXTURE_2D, texture_spline_scene);

	fluidInit(FBO_fluid_v);
	fluidInit(FBO_fluid_p);
	fluidInit(FBO_fluid_store);
	fluidInit(FBO_fluid_backbuffer);

	fpsDisplayUpdateTimer = setInterval(fr, 1000);
	time = new Date().getTime() - starttime;

	gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
	gl.clearColor(0, 0, 0, 1);

	console.log("load complete. begin animation loop");
	anim();
}

window.onload = load;

function createTexturedGeometryBuffer(geometry) {
	geometry.buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, geometry.buffer);
	geometry.aPosLoc = gl.getAttribLocation(prog_advance, "aPos"); // we could take any program here, they all use the same vertex shader
	gl.enableVertexAttribArray(geometry.aPosLoc);
	geometry.aTexLoc = gl.getAttribLocation(prog_advance, "aTexCoord");
	gl.enableVertexAttribArray(geometry.aTexLoc);
	geometry.texCoordOffset = geometry.vertices.byteLength;
	gl.bufferData(gl.ARRAY_BUFFER, geometry.texCoordOffset + geometry.texCoords.byteLength, gl.STATIC_DRAW);
	gl.bufferSubData(gl.ARRAY_BUFFER, 0, geometry.vertices);
	gl.bufferSubData(gl.ARRAY_BUFFER, geometry.texCoordOffset, geometry.texCoords);
	setGeometryVertexAttribPointers(geometry);
}

function setGeometryVertexAttribPointers(geometry) {
	gl.vertexAttribPointer(geometry.aPosLoc, geometry.vertexSize, gl.FLOAT, gl.FALSE, 0, 0);
	gl.vertexAttribPointer(geometry.aTexLoc, 2, gl.FLOAT, gl.FALSE, 0, geometry.texCoordOffset);
}

// compile programs

function compileShader(id, include) {
	if(include == undefined)
		include = true;
	
	var glsl = shaders[id];

	var shader;
	if (id.indexOf('vertex') > -1) {
		shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
		if(include)
			glsl = shaders['include'] + glsl;
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	}
	gl.shaderSource(shader, glsl);
	gl.compileShader(shader);
	if (gl.getShaderParameter(shader, gl.COMPILE_STATUS) == 0) {
		console.error("error compiling shader '" + id + "'");
    console.error(gl.getShaderInfoLog(shader));
	}
	return shader;
}

function createAndLinkProgram(fsId) {
	var program = gl.createProgram();
	gl.attachShader(program, compileShader('vertex'));
	gl.attachShader(program, compileShader(fsId));
	gl.linkProgram(program);
	var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
	if (!linked) {
		console.error("error linking program " + fsId + ": ");
    console.error(gl.getProgramInfoLog(program));
	} else {
		console.log("shader program '" + fsId + "' linked");
	}
	return program;
}

function createAndLinkParticleRenderer(aParticleLoc) {
	var program = gl.createProgram();
	gl.attachShader(program, compileShader('particle vertex', false));
	gl.attachShader(program, compileShader('particle fragment'));
	gl.bindAttribLocation(program, aParticleLoc, "uv"); // can't use getAttribLocation later so we must bind before linking.
	gl.linkProgram(program);
	return program;
}

function createAndBindTexture(glPixels, scale, fbo, filter, type) {
	if (type == undefined) {
		type = gl.FLOAT;
	}
	var texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, sizeX / scale, sizeY / scale, 0, gl.RGBA, type, glPixels);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
	gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
	return texture;
}

function createAndBindParticleTexture(glPixels, fbo) {
	var texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, particlesWidth, particlesHeight, 0, gl.RGBA, gl.FLOAT, glPixels);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
	return texture;
}

function createAndBindSimulationTexture(glPixels, fbo) {
	var texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, sizeX / simScale, sizeY / simScale, 0, gl.RGBA, gl.FLOAT, glPixels);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
	return texture;
}

function fluidInit(fbo) {
	gl.viewport(0, 0, sizeX / simScale, sizeY / simScale);
	gl.useProgram(prog_fluid_init);
	renderAsTriangleStrip(fbo);
}

function setUniforms(program) {
	gl.uniform4f(gl.getUniformLocation(program, "rnd"), Math.random(), Math.random(), Math.random(), Math.random());
	gl.uniform4f(gl.getUniformLocation(program, "rainbow"), rainbowR, rainbowG, rainbowB, 1);
	gl.uniform2f(gl.getUniformLocation(program, "texSize"), sizeX, sizeY);
	gl.uniform2f(gl.getUniformLocation(program, "pixelSize"), 1. / sizeX, 1. / sizeY);
	gl.uniform2f(gl.getUniformLocation(program, "aspect"), Math.max(1, viewX / viewY), Math.max(1, viewY / viewX));
	gl.uniform2f(gl.getUniformLocation(program, "mouse"), mouseX, mouseY);
	gl.uniform2f(gl.getUniformLocation(program, "mouseV"), mouseDx, mouseDy);
	gl.uniform1f(gl.getUniformLocation(program, "mouseDown"), mouseDown);
	gl.uniform1f(gl.getUniformLocation(program, "fps"), fps);
	gl.uniform1f(gl.getUniformLocation(program, "time"), time);
	gl.uniform1f(gl.getUniformLocation(program, "frame"), framecount);

	gl.uniform2f(gl.getUniformLocation(program, "particleTexSize"), particlesWidth, particlesHeight);
	var index = animationFrame / (animationFrameCount + 1);
	var range = 1. / (animationFrameCount + 1);
	gl.uniform2f(gl.getUniformLocation(program, "activeRange"), index, index + range);

	gl.uniform2f(gl.getUniformLocation(program, "pen"), newPenX, newPenY);
	gl.uniform2f(gl.getUniformLocation(program, "oldPen"), oldPenX || newPenX, oldPenY || newPenY);

	gl.uniform1i(gl.getUniformLocation(program, "sampler_prev"), 0);
	gl.uniform1i(gl.getUniformLocation(program, "sampler_prev_n"), 1);
	gl.uniform1i(gl.getUniformLocation(program, "sampler_blur"), 2);
	gl.uniform1i(gl.getUniformLocation(program, "sampler_blur2"), 3);
	gl.uniform1i(gl.getUniformLocation(program, "sampler_blur3"), 4);
	gl.uniform1i(gl.getUniformLocation(program, "sampler_blur4"), 5);
	gl.uniform1i(gl.getUniformLocation(program, "sampler_blur5"), 6);
	gl.uniform1i(gl.getUniformLocation(program, "sampler_blur6"), 7);
	gl.uniform1i(gl.getUniformLocation(program, "sampler_noise"), 8);
	gl.uniform1i(gl.getUniformLocation(program, "sampler_noise_n"), 9);
	gl.uniform1i(gl.getUniformLocation(program, "sampler_fluid"), 10);
	gl.uniform1i(gl.getUniformLocation(program, "sampler_fluid_p"), 11);
	gl.uniform1i(gl.getUniformLocation(program, "sampler_particles"), 12);
	gl.uniform1i(gl.getUniformLocation(program, "sampler_particle_projection"), 13);
	gl.uniform1i(gl.getUniformLocation(program, "sampler_sticky_scene"), 14);
	gl.uniform1i(gl.getUniformLocation(program, "sampler_poitoy_scene"), 15);
	gl.uniform1i(gl.getUniformLocation(program, "sampler_spline_scene"), 16);

	// use this mapping for the Korg NanoKontrol2, from left to right
	gl.uniform4f(gl.getUniformLocation(program, "midifader1"), getMidi(0), getMidi(1), getMidi(2), getMidi(3));
	gl.uniform4f(gl.getUniformLocation(program, "midifader2"), getMidi(4), getMidi(5), getMidi(6), getMidi(7));
	gl.uniform4f(gl.getUniformLocation(program, "midiknob1"), getMidi(16), getMidi(17), getMidi(18), getMidi(19));
	gl.uniform4f(gl.getUniformLocation(program, "midiknob2"), getMidi(20), getMidi(21), getMidi(22), getMidi(23));

	// mapping for the colums of the Akai MidiMix, 8 x 3 knobs + 1 fader
	gl.uniform4f(gl.getUniformLocation(program, "midi1"), getMidi(16), getMidi(17), getMidi(18), getMidi(19));
	gl.uniform4f(gl.getUniformLocation(program, "midi2"), getMidi(20), getMidi(21), getMidi(22), getMidi(23));
	gl.uniform4f(gl.getUniformLocation(program, "midi3"), getMidi(24), getMidi(25), getMidi(26), getMidi(27));
	gl.uniform4f(gl.getUniformLocation(program, "midi4"), getMidi(28), getMidi(29), getMidi(30), getMidi(31));

	/*
				gl.uniform4f(gl.getUniformLocation(program, "midi5"), getMidi(32), getMidi(33), getMidi(34), getMidi(35));
				gl.uniform4f(gl.getUniformLocation(program, "midi6"), getMidi(36), getMidi(37), getMidi(38), getMidi(39));
				gl.uniform4f(gl.getUniformLocation(program, "midi7"), getMidi(40), getMidi(41), getMidi(42), getMidi(43));
				gl.uniform4f(gl.getUniformLocation(program, "midi8"), getMidi(44), getMidi(45), getMidi(46), getMidi(47));
				*/
	gl.uniform4f(gl.getUniformLocation(program, "midi5"), getMidi(46), getMidi(47), getMidi(48), getMidi(49));
	gl.uniform4f(gl.getUniformLocation(program, "midi6"), getMidi(50), getMidi(51), getMidi(52), getMidi(53));
	gl.uniform4f(gl.getUniformLocation(program, "midi7"), getMidi(54), getMidi(55), getMidi(56), getMidi(57));
	gl.uniform4f(gl.getUniformLocation(program, "midi8"), getMidi(58), getMidi(59), getMidi(60), getMidi(61));

	for(var i = 0; i < numDragonDropControls; i++){
		var dnd = dragonDropControls[i];
		var x = dnd.x / sizeX;
		var y = 1 - dnd.y / sizeY;				
		gl.uniform4f(gl.getUniformLocation(program, "dnd" + (i+1)), x, y, dnd.size, (dnd.grabbedBy != null) ? 1 : 0);
	}

	setMoverUniforms(program);
}

var colors = [[1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 1, 0], [1, 0, 1], [0, 1, 1]]; // red green blue yellow magenta cyan

function setMoverUniforms(program) {
	function setMoverUniform(name, p3d){
		if(p3d.old && p3d.old.p2d){
			var x = p3d.p2d.x / sizeX;
			var y = 1 - p3d.p2d.y / sizeY;
			var dx = (x - p3d.old.p2d.x / sizeX);
			var dy = (y - 1 + p3d.old.p2d.y / sizeY);
			gl.uniform4f(gl.getUniformLocation(program, name), x, y, dx, dy);				
		}else{
			gl.uniform4f(gl.getUniformLocation(program, name), 0.5, 0.5, 0, 0);
		}
	}
	// push it
	var moverIndex = 0;
	var bodyIndex = 0;
	activeTrackingObjects.forEach(function (trackingObject) {
		var stickman = trackingObject.stickman;
		var body = trackingObject.body;
		var col = colors[bodyIndex];
		gl.uniform4f(gl.getUniformLocation(program, "col" + bodyIndex), col[0], col[1], col[2], 1);
		setMoverUniform("head" + bodyIndex, body.head);
		bodyIndex++;
		// left hand
		setMoverUniform("mover" + moverIndex, body.handLeft);
		var state = body.handLeft.state;
		// 0 unknown
		// 1 lasso
		// 2 open
		// 3 closed
		// 4 pointy
		state = (body.handLeft.object != null) ? 5 : state;
		// 5 closed with object grabbed
		// idea: push the object's state
		gl.uniform1i(gl.getUniformLocation(program, "moverState" + moverIndex), state);
		moverIndex++;
		// right hand
		setMoverUniform("mover" + moverIndex, body.handRight);
		state = (body.handRight.object != null) ? 5 : body.handRight.state;
		gl.uniform1i(gl.getUniformLocation(program, "moverState" + moverIndex), state);
		moverIndex++;
	});
	// init untracked players
	for (var index = moverIndex; index < 12; index++) {
		gl.uniform4f(gl.getUniformLocation(program, "col" + bodyIndex), 0, 0, 0, 0);
		bodyIndex++;
		gl.uniform4f(gl.getUniformLocation(program, "mover" + moverIndex), 0, 0, 0, 0);
		gl.uniform1i(gl.getUniformLocation(program, "moverState" + moverIndex), 0);
		moverIndex++;
		gl.uniform4f(gl.getUniformLocation(program, "mover" + moverIndex), 0, 0, 0, 0);
		gl.uniform1i(gl.getUniformLocation(program, "moverState" + moverIndex), 0);
		moverIndex++
	}
}

function useGeometry(geometry) {
	gl.bindBuffer(gl.ARRAY_BUFFER, geometry.buffer);
	setGeometryVertexAttribPointers(geometry);
}

function renderGeometry(geometry, targetFBO) {
	useGeometry(geometry);
	gl.bindFramebuffer(gl.FRAMEBUFFER, targetFBO);
	gl.drawArrays(geometry.type, 0, geometry.vertexCount);
	gl.flush();
}

function renderAsTriangleStrip(targetFBO) {
	renderGeometry(triangleStripGeometry, targetFBO);
}

function renderParticles(targetFBO, clear) {
	gl.bindBuffer(gl.ARRAY_BUFFER, particleBuffer);

	if (targetFBO == null)
		gl.viewport(0, 0, viewX, viewY);
	else
		gl.viewport(0, 0, sizeX, sizeY);

	gl.bindFramebuffer(gl.FRAMEBUFFER, targetFBO);
	gl.useProgram(prog_render_particles);

	gl.activeTexture(gl.TEXTURE12);
	if (mainBufferToggle < 0) {
		gl.bindTexture(gl.TEXTURE_2D, texture_particles2);
	} else {
		gl.bindTexture(gl.TEXTURE_2D, texture_particles);
	}

	gl.uniform1i(gl.getUniformLocation(prog_render_particles, "sampler_particles"), 12); // input for the vertex shader
	gl.uniform2f(gl.getUniformLocation(prog_render_particles, "pixelSize"), 1. / sizeX, 1. / sizeY);
	gl.uniform2f(gl.getUniformLocation(prog_render_particles, "aspect"), Math.max(1, viewX / viewY), Math.max(1, viewY / viewX));
	gl.uniform2f(gl.getUniformLocation(prog_render_particles, "particleTexSize"), particlesWidth, particlesHeight);
	gl.uniform1i(gl.getUniformLocation(prog_render_particles, "sampler_prev"), 0);
	gl.uniform1i(gl.getUniformLocation(prog_render_particles, "sampler_prev_n"), 1);
	gl.uniform1i(gl.getUniformLocation(prog_render_particles, "sampler_blur"), 2);

	var index = animationFrame / (animationFrameCount + 1);
	var range = 1. / (animationFrameCount + 1);
	gl.uniform2f(gl.getUniformLocation(prog_render_particles, "activeRange"), index, index + range);

	if (clear == undefined || clear) {
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	}

	gl.enable(gl.BLEND);
	gl.drawArrays(gl.POINTS, 0, particleCount);
	gl.disable(gl.BLEND);

	gl.flush();
}

function updateSplineSceneTexture() {
	gl.activeTexture(gl.TEXTURE16);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas2d);
	gl.bindFramebuffer(gl.FRAMEBUFFER, FBO_spline_scene);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture_spline_scene, 0);
}

function updateStickySceneTexture() {
	gl.activeTexture(gl.TEXTURE14);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas2d);
	gl.bindFramebuffer(gl.FRAMEBUFFER, FBO_sticky_scene);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture_sticky_scene, 0);
}

function updatePoiToySceneTexture() {
	gl.activeTexture(gl.TEXTURE15);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas2d);
	gl.bindFramebuffer(gl.FRAMEBUFFER, FBO_poitoy_scene);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture_poitoy_scene, 0);
}

function calculateBlurTextures(texture_source) {
	calculateBlurTexture(texture_source, texture_blur, FBO_blur, texture_helper, FBO_helper, 2);
	calculateBlurTexture(texture_blur, texture_blur2, FBO_blur2, texture_helper2, FBO_helper2, 4);
	calculateBlurTexture(texture_blur2, texture_blur3, FBO_blur3, texture_helper3, FBO_helper3, 8);
	calculateBlurTexture(texture_blur3, texture_blur4, FBO_blur4, texture_helper4, FBO_helper4, 16);
	calculateBlurTexture(texture_blur4, texture_blur5, FBO_blur5, texture_helper5, FBO_helper5, 32);
	calculateBlurTexture(texture_blur5, texture_blur6, FBO_blur6, texture_helper6, FBO_helper6, 64);
}

function calculateBlurTexture(sourceTex, targetTex, targetFBO, helperTex, helperFBO, scale) {
	// copy source
	gl.viewport(0, 0, sizeX / scale, sizeY / scale);
	gl.useProgram(prog_copy);
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, sourceTex);
	renderAsTriangleStrip(targetFBO);

	// blur vertically
	gl.viewport(0, 0, sizeX / scale, sizeY / scale);
	gl.useProgram(prog_blur_vertical);
	gl.uniform2f(gl.getUniformLocation(prog_blur_vertical, "pixelSize"), scale / sizeX, scale / sizeY);
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, targetTex);
	renderAsTriangleStrip(helperFBO);

	// blur horizontally
	gl.viewport(0, 0, sizeX / scale, sizeY / scale);
	gl.useProgram(prog_blur_horizontal);
	gl.uniform2f(gl.getUniformLocation(prog_blur_horizontal, "pixelSize"), scale / sizeX, scale / sizeY);
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, helperTex);
	renderAsTriangleStrip(targetFBO);

}

function stepParticles() {
	gl.viewport(0, 0, particlesWidth, particlesHeight);
	gl.useProgram(prog_move_particles);
	setUniforms(prog_move_particles);

	if (mainBufferToggle > 0) {
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, texture_fluid_v);
		gl.activeTexture(gl.TEXTURE12);
		gl.bindTexture(gl.TEXTURE_2D, texture_particles);
		renderAsTriangleStrip(FBO_particles2)
	} else {
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, texture_fluid_v);
		gl.activeTexture(gl.TEXTURE12);
		gl.bindTexture(gl.TEXTURE_2D, texture_particles2);
		renderAsTriangleStrip(FBO_particles);
	}
}

function fluidSimulationStep() {
	addMouseMotion();
	advect();
	diffuse();
}

function addMouseMotion() {
	gl.viewport(0, 0, (sizeX / simScale), (sizeY / simScale));
	gl.useProgram(prog_fluid_add_mouse_motion);
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture_fluid_v);
	setUniforms(prog_fluid_add_mouse_motion);
	gl.uniform2f(gl.getUniformLocation(prog_fluid_add_mouse_motion, "pixelSize"), 1. / (sizeX / simScale), 1. / (sizeY / simScale));
	gl.uniform2f(gl.getUniformLocation(prog_fluid_add_mouse_motion, "texSize"), (sizeX / simScale), (sizeY / simScale));
	renderAsTriangleStrip(FBO_fluid_backbuffer);
}

function advect() {
	gl.viewport(0, 0, (sizeX / simScale), (sizeY / simScale));
	gl.useProgram(prog_fluid_advect);
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture_fluid_backbuffer);
	gl.uniform2f(gl.getUniformLocation(prog_fluid_advect, "pixelSize"), 1. / (sizeX / simScale), 1. / (sizeY / simScale));
	gl.uniform2f(gl.getUniformLocation(prog_fluid_advect, "texSize"), (sizeX / simScale), (sizeY / simScale));
	renderAsTriangleStrip(FBO_fluid_v);
}

function diffuse() {
	for (var i = 0; i < 8; i++) {
		gl.viewport(0, 0, (sizeX / simScale), (sizeY / simScale));
		gl.useProgram(prog_fluid_p);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, texture_fluid_v);
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, texture_fluid_p);
		gl.uniform2f(gl.getUniformLocation(prog_fluid_p, "texSize"), (sizeX / simScale), (sizeY / simScale));
		gl.uniform2f(gl.getUniformLocation(prog_fluid_p, "pixelSize"), 1. / (sizeX / simScale), 1. / (sizeY / simScale));
		gl.uniform1i(gl.getUniformLocation(prog_fluid_p, "sampler_v"), 0);
		gl.uniform1i(gl.getUniformLocation(prog_fluid_p, "sampler_p"), 1);
		renderAsTriangleStrip(FBO_fluid_backbuffer);

		gl.viewport(0, 0, (sizeX / simScale), (sizeY / simScale));
		gl.useProgram(prog_fluid_p);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, texture_fluid_v);
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, texture_fluid_backbuffer);
		gl.uniform2f(gl.getUniformLocation(prog_fluid_p, "texSize"), (sizeX / simScale), (sizeY / simScale));
		gl.uniform2f(gl.getUniformLocation(prog_fluid_p, "pixelSize"), 1. / (sizeX / simScale), 1. / (sizeY / simScale));
		gl.uniform1i(gl.getUniformLocation(prog_fluid_p, "sampler_v"), 0);
		gl.uniform1i(gl.getUniformLocation(prog_fluid_p, "sampler_p"), 1);
		renderAsTriangleStrip(FBO_fluid_p);
	}


	gl.viewport(0, 0, (sizeX / simScale), (sizeY / simScale));
	gl.useProgram(prog_fluid_div);
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture_fluid_v);
	gl.activeTexture(gl.TEXTURE1);
	gl.bindTexture(gl.TEXTURE_2D, texture_fluid_p);
	gl.uniform2f(gl.getUniformLocation(prog_fluid_div, "texSize"), (sizeX / simScale), (sizeY / simScale));
	gl.uniform2f(gl.getUniformLocation(prog_fluid_div, "pixelSize"), 1. / (sizeX / simScale), 1. / (sizeY / simScale));
	gl.uniform1i(gl.getUniformLocation(prog_fluid_div, "sampler_v"), 0);
	gl.uniform1i(gl.getUniformLocation(prog_fluid_div, "sampler_p"), 1);
	renderAsTriangleStrip(FBO_fluid_backbuffer);

	gl.viewport(0, 0, (sizeX / simScale), (sizeY / simScale));
	gl.useProgram(prog_copy);
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture_fluid_backbuffer);
	renderAsTriangleStrip(FBO_fluid_v);
}

// main texture feedback warp
function advance() {
	gl.viewport(0, 0, sizeX, sizeY);
	gl.useProgram(prog_advance);
	setUniforms(prog_advance);
	if (mainBufferToggle > 0) {
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, texture_main_l); // interpolated input
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, texture_main_n); // "nearest" input
		renderAsTriangleStrip(FBO_main2);
	} else {
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, texture_main2_l); // interpolated
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, texture_main2_n); // "nearest"
		renderAsTriangleStrip(FBO_main);
	}
	mainBufferToggle = -mainBufferToggle;
}

function composite() {
	gl.viewport(0, 0, viewX, viewY);
	gl.useProgram(prog_composite);
	setUniforms(prog_composite);
	if (mainBufferToggle < 0) {
		gl.activeTexture(gl.TEXTURE12);
		gl.bindTexture(gl.TEXTURE_2D, texture_particles);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, texture_main_l);
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, texture_main_n);
	} else {
		gl.activeTexture(gl.TEXTURE12);
		gl.bindTexture(gl.TEXTURE_2D, texture_particles2);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, texture_main2_l);
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, texture_main2_n);
	}
	renderAsTriangleStrip(null);
}

var rainbowR, rainbowG, rainbowB, w = Math.PI * 2 / 3;

function anim() {
	//window.setTimeout("requestAnimationFrame(anim)", 1000 / limitFramerate);
	requestAnimationFrame(anim);

	// updateStickMen();

	// todo: copy source and try with Kinect v2 sensor hand gesture recognition https://github.com/Flexi23/Cake23/blob/master/Cake23/WebTemplates/edgelord.cshtml#L396
	// updateDragonDropControls();

	canvas2dContext.fillStyle = "#000";

	canvas2dContext.fillRect(0, 0, sizeX, sizeY);
	canvas2dContext.strokeStyle = "#FFF";

	//drawSpline(canvas2dContext, controls);
	//drawDragonDropControls(canvas2dContext); // #drop it like it's hot
	//drawStickMen(canvas2dContext);
	updateStickySceneTexture();

	canvas2dContext.fillStyle = "#000";
	canvas2dContext.fillRect(0, 0, sizeX, sizeY);

	canvas2dContext.lineWidth = 1.5;
	drawPoiToys(canvas2dContext);
	updatePoiToySceneTexture();

	if(showSpline){
		canvas2dContext.fillStyle = "#FFF";
		canvas2dContext.fillRect(0, 0, sizeX, sizeY);
		animatePointOnSpline(canvas2dContext);
		updateSplineSceneTexture();
	}

	time = new Date().getTime() - starttime;

	var t = time / 150;

	rainbowR = 0.5 + 0.5 * Math.sin(t);
	rainbowG = 0.5 + 0.5 * Math.sin(t + w);
	rainbowB = 0.5 + 0.5 * Math.sin(t - w);

	if (oldMouseX != 0 && oldMouseY != 0) {
		mouseDx = (mouseX - oldMouseX) * viewX;
		mouseDy = (mouseY - oldMouseY) * viewY;
	}

	if (!halted) {

		if (useProjectionFeedback)
			renderParticles(FBO_particle_projection);

		if (useFluidSimulation)
			fluidSimulationStep();

		if (useParticles)
			stepParticles();

		advance();

		var srcTex = (mainBufferToggle < 0) ? texture_main2_l : texture_main_l;

		calculateBlurTextures(srcTex);

		frame++;
		framecount++;
	}

	if (renderParticlesOnly) {
		gl.viewport(0, 0, viewX, viewY);
		gl.useProgram(prog_copy);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, texture_sticky_scene);
		renderAsTriangleStrip(null);
		renderParticles(null, false);
	}
	else {
		composite();
	}
	frames++;

	oldMouseX = mouseX;
	oldMouseY = mouseY;

}

function fr() { // updates every second
	document.getElementById("fps").textContent = frame;
	lastFramesPerSecond = frame;
	frame = 0; // reset the frame counter
}

var hidden = false;
function hide() {
	hidden = !hidden;
	//desc.style.setProperty('visibility', hidden ? 'hidden' : 'visible');
	desc.style.setProperty('z-index', hidden ? 1 : 2);
}

function goFull(cb) {
	if (cb.checked) {
		viewX = window.innerWidth;
		viewY = window.innerHeight;
	} else {
		viewX = sizeX;
		viewY = sizeY;
	}
	c.width = viewX;
	c.height = viewY;
	updateAspectRatio();
}

function toggleSplineRenderer(){
	showSpline=!showSpline;
}

function switchRenderer(particlesOnly) {
	renderParticlesOnly = particlesOnly;
}

function setLimitFps(tb) {
	limitFramerate = tb.value;
	if (limitFramerate < 1)
		limitFPS = 1;
}
