//++++++++++++++++++++++++++++++++++++++++//
//======= DISPLAY LOADER SPINNER =========//
//++++++++++++++++++++++++++++++++++++++++//
window.onload = function () {
  // removing the loader
  document.getElementById("loader-div-parent").style.display = "none";
  // bringing the main div
  document.getElementById("main-div").style.display = "block";
};
// ==========================================

//++++++++++++++++++++++++++++++++++//
//========GLOBAL VARIABLES==========//
//++++++++++++++++++++++++++++++++++//
//xInputStringGlobal and yInputStringGlobal stores P(x,y) input in nerdamer string form, which is a converted form of the latex of P(x,y) input which is stored in xInputGlobal and yInputGlobal
let xInputStringGlobal;
let yInputStringGlobal;
let xAxisGlobal = 0;
let yAxisGlobal = 0;
//expression validity flag
let isValidExpressionGlobal = true;
//In order to adjust plots and clicks properly on the screen, we need to change the two following variables simultaneously in proper ratio
//increasing this value to 2 from 1 will change the ploting range from 15 to 7.5 or half of 15
//The same will also change 1 unit from 20px to 10px and print vector field till -7.5 to 7.5 instead of -15 to 15
//The same will also change the mouse click position value and range it from -7.5 to 7.5 while keeping the unit density to 10px
let divByijGlobal = 1;
//This defines how many pixels will be counted as 1 unit of our vector field
//By default 20px means 1 unit when the value of this variable is 1
//This 20px value has been initialized in different function
//if we increase it to 2 then 40px will be 1 unit
//This will affect the mouse click position value and plotted arrow positions as well
//if we change this value then pixel count per unit length will change but values will be plotted all the way from -15 to 15 and we cannot limit that
let mulByPxGlobal = 1;
//stores return value of calculateHighestMagnitudeOfVector() function
let highestMagnitudeVectorGlobal;
//custom coordinate enable/disable status check flag
let displayBoxFlagGlobal = false;
//record on/off flag
let recordFlagGlobal = false;
//storing user click data and save it to the loaclStorage
let userClickDataGlobal;
// scaling factor enable/disable flag
let scalingFlagGlobal = false;
// zooming enable/disable flag
let zoomFlagGlobal = false;
// applies the scaling slider input value to mainVectorfieldPlotter
let scalingSliderValueGlobal = 1;
//defining custom keyboard layer
const CUSTOM_KEYBOARD_LAYER = {
  "custom-keyboard-layer": {
    styles: "",
    rows: [
      [
        // { latex: "a" },
        { latex: "x" },
        { class: "separator w5" },
        { label: "7", key: "7" },
        // Will display the label using the system font. To display
        // with the TeX font, use:
        // { class: "tex", label: "7", key: "7" },
        // or
        // { latex: "7"},
        { label: "8", key: "8" },
        { label: "9", key: "9" },
        {
          class: "tex small",
          label: "/",
          insert: "\\frac{#@}{#0}",
        },
        { class: "separator w5" },
        {
          class: "tex small",
          label: "<span><i>n</i><sup>&thinsp;<i>2</i></sup></span>",
          insert: "$$#@^{2}$$",
        },
        {
          class: "tex small",
          label: "<span><i>n</i><sup>&thinsp;<i>3</i></sup></span>",
          insert: "$$#@^{3}$$",
        },
        {
          class: "small",
          latex: "\\sqrt{#0}",
          insert: "$$\\sqrt{#0}$$",
        },
      ],
      [
        // { class: "tex", latex: "b" },
        { class: "separator w5" },
        { class: "separator w5" },
        { class: "separator w5" },
        { class: "separator w5" },
        { class: "tex", latex: "y" },
        { class: "separator w5" },
        { label: "4", latex: "4" },
        { label: "5", key: "5" },
        { label: "6", key: "6" },
        { latex: "\\times" },
        { class: "separator w5" },
        {
          class: "tex small",
          label: "<span><i>x</i>&thinsp;²</span>",
          insert: "$$(x^{2})$$",
        },
        {
          class: "tex small",
          label: "<span><i>y</i>&thinsp;²</span>",
          insert: "$$(y^{2})$$",
        },
        { class: "small", latex: "\\frac{#0}{#0}" },
        { class: "separator" },
        { class: "separator" },
      ],
      [
        // { class: "tex", label: "<i>c</i>" },
        // { class: "tex", label: "<i>z</i>" },
        { class: "separator w5" },
        { class: "separator w5" },
        { class: "separator w5" },
        { label: "1", key: "1" },
        { label: "2", key: "2" },
        { label: "3", key: "3" },
        { latex: "-" },
        { class: "separator w5" },
        { class: "separator" },
        { latex: "(" },
        { latex: ")" },
      ],
      [
        { class: "separator w5" },
        { class: "separator w5" },
        { class: "separator w5" },
        { class: "separator w5" },
        { label: "0", key: "0" },
        { latex: "." },
        // { latex: "\\pi" },
        { latex: "+" },
        { class: "separator w5" },
        { class: "separator w5" },

        {
          class: "action",
          label: "<svg><use xlink:href='#svg-arrow-left' /></svg>",
          command: ["performWithFeedback", "moveToPreviousChar"],
        },
        {
          class: "action",
          label: "<svg><use xlink:href='#svg-arrow-right' /></svg>",
          command: ["performWithFeedback", "moveToNextChar"],
        },
        {
          class: "action font-glyph bottom right",
          label: "&#x232b;",
          command: ["performWithFeedback", "deleteBackward"],
        },
      ],
    ],
  },
};
//defining a keyboard
const HIGH_SCHOOL_KEYBOARD = {
  "custom-keyboard": {
    // Label displayed in the Virtual Keyboard Switcher
    label: "Keyboard",
    // Tooltip when hovering over the label
    tooltip: "Keyboard",
    layer: "custom-keyboard-layer",
  },
};
// ==================================================================================

//++++++++++++++++++++++++++++++++++//
//======= HANDLER FUNCTIONS ========//
//++++++++++++++++++++++++++++++++++//
//defining recordOffHandler function
const recordOffHandler = (event) => {
  recordFlagGlobal = false;

  //saving data to localStorage
  localStorage.setItem(
    new Date().toLocaleString(),
    JSON.stringify(userClickDataGlobal)
  );
  console.log(userClickDataGlobal);
};
// =====================================
//defining recordOnHandler function
const recordOnHandler = (event) => {
  recordFlagGlobal = true;
  //initializing the recording object
  userClickDataGlobal = {
    vectorFieldEquation: {
      Pxy: "",
      Qxy: "",
    },
    coordinates: [],
    vectorFieldValue: [],
    magnitude: [],
    curlExpression: "",
    curlValue: [],
    divergenceExpression: "",
    divergenceValue: [],
  };
};
// ======================================
//inserts the vector field information at user selected points into userClickDataGlobal object
const userClickDataInsertHandler = (
  xInputStringGlobal,
  yInputStringGlobal,
  xAxis,
  yAxis,
  xCoord,
  yCoord,
  pxy,
  qxy,
  magnitude,
  curlEq,
  curlVal,
  divergenceEq,
  divergenceVal
) => {
  //P(x,y) and Q(x,y) expression
  userClickDataGlobal.vectorFieldEquation.Pxy = xInputStringGlobal;
  userClickDataGlobal.vectorFieldEquation.Qxy = yInputStringGlobal;
  //Selected coordinate value (x, y) based on click and custom coordinate input
  let coordinatesTemp;
  if (displayBoxFlagGlobal === false) {
    coordinatesTemp = {
      x: xAxis,
      y: yAxis,
    };
  } else {
    coordinatesTemp = {
      x: xCoord.value,
      y: yCoord.value,
    };
  }
  userClickDataGlobal.coordinates.push(coordinatesTemp);
  //P(x,y) and Q(x,y) value at a specific selected point
  let vectorFieldValueTemp = {
    PxyValue: Number(pxy.toFixed(6)),
    QxyValue: Number(qxy.toFixed(6)),
  };
  userClickDataGlobal.vectorFieldValue.push(vectorFieldValueTemp);
  //magnitude
  userClickDataGlobal.magnitude.push(Number(magnitude.toFixed(6)));
  //curl equation
  userClickDataGlobal.curlExpression = curlEq.text();
  //curl value
  userClickDataGlobal.curlValue.push(curlVal);
  //divergence equation
  userClickDataGlobal.divergenceExpression = divergenceEq.text();
  //divergence value
  userClickDataGlobal.divergenceValue.push(divergenceVal);
};
// =====================================================================
//defining scaleOn handler
const scaleOnHandler = () => {
  document.getElementById("scale-slider-div").style.display = "block";
  scalingFlagGlobal = true;
};
// ==================================================================
//defining scaleOff handler
const scaleOffHandler = () => {
  document.getElementById("scale-slider-div").style.display = "none";
  scalingFlagGlobal = false;
  runTheCode();
};
// =====================================================================
//defining zoomOn handler
const zoomOnHandler = () => {
  document.getElementById("zoom-slider-div").style.display = "block";
  zoomFlagGlobal = true;
};
//defining zoomOff handler
const zoomOffHandler = () => {
  document.getElementById("zoom-slider-div").style.display = "none";
  divByijGlobal = 1;
  mulByPxGlobal = 1;
  document.getElementById("zoom-slider").value = 1;
  runTheCode();
  zoomFlagGlobal = false;
};
// =============================================================
//defining zoom slider value submit handler
const zoomSliderSubmitHandler = () => {
  const zoomSlider = document.getElementById("zoom-slider");
  divByijGlobal = zoomSlider.value;
  mulByPxGlobal = zoomSlider.value;
};
// ===============================================================
//defining scaling slider value submit handler
const scalingSliderSubmitHandler = () => {
  const scaleSlider = document.getElementById("scale-slider");
  scalingSliderValueGlobal = scaleSlider.value;
};
// =================================================================
//This handler is called on every click on the display enable/disable checkbox
const customCoordinateHandler = () => {
  //If the button is checked
  if (displayBoxFlagGlobal === false) {
    //first assigning the previously selected coordinate values of non editable elements to the editable elements so that we can show the same values to the editable elemets that of non editable elements
    xCoord.value = xAxisGlobal;
    yCoord.value = yAxisGlobal;
    //setting the flag variable to 1 or true
    displayBoxFlagGlobal = true;
    //showing the element when custom coordinate box is checked
    customCoordDiv.style.display = "block";
    //hiding the element when custom coordinate box is checked
    coordDisplayDiv.style.display = "none";
  } else {
    //setting the flag variable to 0 or false
    displayBoxFlagGlobal = false;

    //hiding the element agian when custom coordinate box is unchecked
    customCoordDiv.style.display = "none";

    //showing the element again when custom coordinate box is unchecked
    coordDisplayDiv.style.display = "block";
  }
};
// ==========================================================================
//handler to check the validity of the input expression
const chekcExpressionValidityHandler = () => {
  isValidExpressionGlobal = false;
  let iCap, jCap;
  let errorString = "";

  //converting xInputGlobal and yInputGlobal value from latex to nerdamer string
  try {
    xInputStringGlobal = nerdamer.convertFromLaTeX(xInputGlobal.value).text();
    yInputStringGlobal = nerdamer.convertFromLaTeX(yInputGlobal.value).text();
  } catch (err) {
    return;
  }

  //checking the possible error type based on series of tests
  //at 0,0
  try {
    iCap = Number(nerdamer(xInputStringGlobal, { x: 0, y: 0 }).evaluate());
    jCap = Number(nerdamer(yInputStringGlobal, { x: 0, y: 0 }).evaluate());
    if (Number.isNaN(iCap) || Number.isNaN(jCap)) {
      if (Number.isNaN(iCap) && Number.isNaN(jCap)) {
        throw "pq1;";
      } else if (Number.isNaN(iCap)) {
        throw "p1;";
      } else {
        throw "q1;";
      }
    }
  } catch (err) {
    errorString += err;
  }
  //at +,+
  try {
    iCap = Number(nerdamer(xInputStringGlobal, { x: 5, y: 5 }).evaluate());
    jCap = Number(nerdamer(yInputStringGlobal, { x: 5, y: 5 }).evaluate());
    if (Number.isNaN(iCap) || Number.isNaN(jCap)) {
      if (Number.isNaN(iCap) && Number.isNaN(jCap)) {
        throw "pq2;";
      } else if (Number.isNaN(iCap)) {
        throw "p2;";
      } else {
        throw "q2;";
      }
    }
  } catch (err) {
    errorString += err;
  }
  //at +,-
  try {
    iCap = Number(nerdamer(xInputStringGlobal, { x: 5, y: -5 }).evaluate());
    jCap = Number(nerdamer(yInputStringGlobal, { x: 5, y: -5 }).evaluate());
    if (Number.isNaN(iCap) || Number.isNaN(jCap)) {
      if (Number.isNaN(iCap) && Number.isNaN(jCap)) {
        throw "pq3;";
      } else if (Number.isNaN(iCap)) {
        throw "p3;";
      } else {
        throw "q3;";
      }
    }
  } catch (err) {
    errorString += err;
  }
  //at -,-
  try {
    iCap = Number(nerdamer(xInputStringGlobal, { x: -5, y: -5 }).evaluate());
    jCap = Number(nerdamer(yInputStringGlobal, { x: -5, y: -5 }).evaluate());
    if (Number.isNaN(iCap) || Number.isNaN(jCap)) {
      if (Number.isNaN(iCap) && Number.isNaN(jCap)) {
        throw "pq4;";
      } else if (Number.isNaN(iCap)) {
        throw "p4;";
      } else {
        throw "q4;";
      }
    }
  } catch (err) {
    errorString += err;
  }
  //at -,+
  try {
    iCap = Number(nerdamer(xInputStringGlobal, { x: -5, y: 5 }).evaluate());
    jCap = Number(nerdamer(yInputStringGlobal, { x: -5, y: 5 }).evaluate());
    if (Number.isNaN(iCap) || Number.isNaN(jCap)) {
      if (Number.isNaN(iCap) && Number.isNaN(jCap)) {
        throw "pq5;";
      } else if (Number.isNaN(iCap)) {
        throw "p5;";
      } else {
        throw "q5;";
      }
    }
  } catch (err) {
    errorString += err;
  }

  let checkOne =
    /p1;|p2;|p3;|p4;|p5|q1;|q2;|q3;|q4;|q5|pq1;|pq2;|pq3;|pq4;|pq5/g;
  let resultOne = errorString.match(checkOne);

  if (resultOne == null || resultOne.length < 4) {
    isValidExpressionGlobal = true;
    return;
  } else if (resultOne.length >= 4) {
    return;
  }
};

//++++++++++++++++++++++++++++++++++//
//==== DOM ELEMENT REFERENCES ======//
//++++++++++++++++++++++++++++++++++//
//getting main control menu bar
const controlMenuBarChild = document.getElementById("control-menu-bar-child");
// ================================================================
const recordOff = document.getElementById("record-off-icon");
//adding click event listener
recordOff.addEventListener("click", recordOnHandler);
//==============================================================
const recordOn = document.getElementById("record-on-icon");
//adding click event listener
recordOn.addEventListener("click", recordOffHandler);
// ===============================================================
const scaleOn = document.getElementById("scale-on-icon");
//adding click event listener
scaleOn.addEventListener("click", scaleOffHandler);
// =================================================================
const scaleOff = document.getElementById("scale-off-icon");
//adding click event listener
scaleOff.addEventListener("click", scaleOnHandler);
// ===================================================================
const zoomOn = document.getElementById("zoom-on-icon");
//adding click event listener
zoomOn.addEventListener("click", zoomOffHandler);
// =================================================================
const zoomOff = document.getElementById("zoom-off-icon");
//adding click event listener
zoomOff.addEventListener("click", zoomOnHandler);
// ===================================================================
//custom coordinate enable switch
const switchOnOff = document.getElementById("switch-on-off");
switchOnOff.addEventListener("click", customCoordinateHandler);
// ===================================================================
//display user selected coordinate value
const coordDisplay = document.getElementById("coordinate-disp");
//parent of the coordinate display math-field element
const coordDisplayDiv = document.getElementById("coordinate-disp-div");
// =======================================================================
//custom coordinate div
const customCoordDiv = document.getElementById("custom-coordinate-div");
//child of custom coordinate div
//display the x and y coordinate value
const xCoord = document.getElementById("x-coordinate");
const yCoord = document.getElementById("y-coordinate");
// =========================================================================
//display flow field properties (expression and values)
//P(x,y) and Q(x,y) value
const pOfXy = document.getElementById("p-of-xy");
const qOfXy = document.getElementById("q-of-xy");
//magnitude
const magnitudeVal = document.getElementById("magnitude");
//curl equation
const curlEqu = document.getElementById("curl-equation");
//curl value
const curlValue = document.getElementById("curl-value");
//divergence equation
const divEqu = document.getElementById("divergence-equation");
//divergence value
const divValue = document.getElementById("divergence-value");
// =======================================================================
//getting the modal parent div
const modal = document.getElementById("myModal");
//modal body message
const modalBody = document.getElementById("modal-text");
//modal header
const modalHeader = document.getElementById("modal-header");
//close button of the modal
const span = document.getElementsByClassName("close")[0];
span.onclick = function () {
  modal.style.display = "none";
};
// When the user clicks anywhere outside of the modal (on the backdrop), close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
// ==========================================================================
//P(x,y) and Q(x,y) equation submit button
const submitBtn = document.getElementById("submit-btn");
submitBtn.addEventListener("click", submitButtonPressed);
// ===========================================================================
// getting the P(x,y) and Q(x,y) expression input elements
const xInputGlobal = document.getElementById("x-input");
const yInputGlobal = document.getElementById("y-input");
// ===========================================================================

//++++++++++++++++++++++++++++++++++//
//======== SETUP FUNCTION ==========//
//++++++++++++++++++++++++++++++++++//
function setup() {
  //Creating the canvas
  const customCanvas = createCanvas(1300, 700);
  customCanvas.style("z-index: -100");
  customCanvas.position(0, 370);

  //translating the (0,0) to the centre of the canvas
  translate(width / 2, height / 2);

  //getting the element references and configuring them to have the virtual keyboard
  xInputGlobal.setOptions({
    customVirtualKeyboardLayers: CUSTOM_KEYBOARD_LAYER,
    customVirtualKeyboards: HIGH_SCHOOL_KEYBOARD,
    virtualKeyboards: "custom-keyboard",
    virtualKeyboardMode: "manual",
    // virtualKeyboards: "numeric",
  });
  yInputGlobal.setOptions({
    customVirtualKeyboardLayers: CUSTOM_KEYBOARD_LAYER,
    customVirtualKeyboards: HIGH_SCHOOL_KEYBOARD,
    virtualKeyboards: "custom-keyboard",
    virtualKeyboardMode: "manual",
    // virtualKeyboards: "numeric",
  });

  //converting xInputGlobal and yInputGlobal latex values to nerdamer string
  xInputStringGlobal = nerdamer.convertFromLaTeX(xInputGlobal.value).text();
  yInputStringGlobal = nerdamer.convertFromLaTeX(yInputGlobal.value).text();

  //renders the flow field square, it's axis lines and labelling
  outerRectangle();
  axisLines();
  axisLabeling();

  //calculating and highest magnitude
  highestMagnitudeVectorGlobal = calculateHighestMagnitudeOfVector();
  //plotting the individual vectors of the vector field
  mainVectorFieldPlotter();
  //rendering the coloured magnitude bar
  colourBarAndMagnitude(highestMagnitudeVectorGlobal);
}

//Function to define the outer rectangle of the plot
function outerRectangle() {
  //Setting colour mode to RGB (Hue, Saturation, Brightness)
  colorMode(RGB);

  //HSB(360,100,100) maximum values
  //hue = 0, saturation = 0, brightrness = 255,
  stroke(0, 0, 255);

  //line Stroke Weight = 4;
  strokeWeight(4);
  fill(0);

  //x1 = -320, y1 = -320, width = 640, height = 640;
  rect(-320, -320, 640, 640);
}

//Function to define the axis lines inside the rectangle of the plot
function axisLines() {
  //major axis lines
  //HSB(360,100,100) maximum values
  colorMode(RGB);
  //0.2 is alpha or transparency value
  stroke("rgba(255,255,255,0.2)");

  //stroke Weight = 3
  strokeWeight(3);

  //Major x-axis line
  //x1 = -320, y1 = 0, x2 = 320, y2 = 0
  line(-320, 0, 320, 0);

  //Major y-axis line
  //p1 = 0, q1 = -320, p2 = 0, q2 = 320;
  line(0, -320, 0, 320);

  //drawing the sub axis lines
  for (let i = 300; i >= -300; i -= 20) {
    //x-axis lines
    line(-320, 0 + i, 320, 0 + i);
    //y-axis lines
    line(0 + i, -320, 0 + i, 320);
  }
}

//Function to define the axis labelling outside the rectangle of the plot
//This also handles the change in axis labelling based on zoom enable and zoom factor
function axisLabeling() {
  //HSB(360,100,100) maximum values
  colorMode(HSB);

  //hue = 0, saturation = 0, brightrness = 0
  stroke(0, 0, 0);

  //stroke Weight = 1
  strokeWeight(1);

  //Drawing the labelling lines
  //315 = 315, 325 = 325
  for (let i = -15; i < 16; i++) {
    //right side of the outer box
    //gap = 20
    line(315, 20 * i + 0, 325, 20 * i + 0);

    //left side of the outer box
    //gap = 20
    line(-315, 20 * i + 0, -325, 20 * i + 0);

    //top part of the outer box
    //gap = 20
    line(20 * i + 0, -315, 20 * i + 0, -325);

    //bottom part of the outer box
    //gap = 20
    line(20 * i + 0, 315, 20 * i + 0, 325);
  }

  //Changing the axis labelling based on zoom enabling-disabling and zooming factor
  let unitJump;
  let upperJump;

  unitJump = 15 / divByijGlobal / 15;
  upperJump = 15 / divByijGlobal;

  //axis label text configuration
  textSize(12);
  noStroke();
  fill(0);

  let j = 0;
  let i = 0;

  //text alignment BOTTOM is important to keep the text at proper position
  textAlign(CENTER, BOTTOM);

  //This is for right and left side of the box
  //unitJump * 3 means the labelling will be like 0, 3, 6, 9, 12, 15 not 0, 1, 2, 3 ...
  for (i = -upperJump; i <= upperJump + 0.00001; i += unitJump * 3) {
    //on the negative number line => -3e-5 > .... i ..... < -3e-18 .... 0
    //on positive number line => 0 .... 3e-5 < .... i .... > -3e-18
    //So, if i value is in between these provided parameters then it will be considered as 0
    if ((i < -3e-18 && i > -3e-5) || (i > 3e-18 && i < 3e-5)) {
      i = 0;
    }

    //right side of the box
    //rounding off i value till 3 decimal places
    text(-round(i, 3), 345, -292 + j);

    //left side of the box
    //rounding off i value till 3 decimal places
    text(-round(i, 3), -345, -292 + j);

    //jump in j value in pixels for right and left side of the box
    j = j + 60;
  }

  //This is for top and bottom side of the box
  textAlign(CENTER);

  //initializing j back to 0
  j = 0;

  for (let i = -upperJump; i <= upperJump + 0.001; i += unitJump * 3) {
    if ((i < -3e-18 && i > -3e-5) || (i > 3e-18 && i < 3e-5)) {
      i = 0;
    }

    //top side of the box
    text(-round(i, 3), +300 - j, -330);

    //bottom side of the box
    text(-round(i, 3), +300 - j, 345);

    j = j + 60;
  }

  //We are chaning the fill(0) to noFill()
  noFill();
}

//Function to calculate the highest magnitude of the vector among all to colour code the magnitude
//return value of this function is fed to the function, responsible to display the colour bar
function calculateHighestMagnitudeOfVector() {
  let i = 0,
    j = 0,
    //count will be used as index number for setOfMagnitude array
    count = 0,
    highestMagnitude = 0;

  //These will hold the evaluated values of the vector components at each point
  let xVal, yVal;

  //This is an array variable to hold all the magnitude values of each and every point on the xy plane
  let setOfmagnitude = [];

  for (i = -15; i <= 15; i++) {
    for (j = -15; j <= 15; j++) {
      try {
        //xVal will hold the P(x,y) or the i-cap component of the vector
        xVal = Number(nerdamer(xInputStringGlobal, { x: i, y: j }).evaluate());
        //yVal will hold the Q(x,y) or the j-cap component of the vector
        yVal = Number(nerdamer(yInputStringGlobal, { x: i, y: j }).evaluate());
      } catch (err) {
        //Only handle error but don't use return to stop function execution
        //Type of errors we are catching here are as follows
        //1) expression like 1/y becasue at y=0 div by zero is not applicable or undefined
        // console.log("Division by 0 is not allowed - calculateHighestMagnitudeOfVector");
        continue;
      }

      //if xVal or yVal is NaN we don't want it to store inside the setOfmagnitude array and also skipping rest of the calculation for that specific iteration or i, j value
      if (Number.isNaN(xVal) || Number.isNaN(yVal)) {
        // console.log("Please Check the expression - calculateHighestMagnitudeOfVector");
        continue;
      }

      //calculating the square root of (x^2+y^2)
      magnitude = (xVal ** 2 + yVal ** 2) ** 0.5;

      //storing the magnitude inside the array for each and every selected points using i, j
      setOfmagnitude[count] = magnitude;

      //increasing the count value by 1 at the end of the loop
      count += 1;
    }
  }

  try {
    //getting the highest magnitude or value from the array of magnitudes
    //if we enter invalid equation (unknown variabe or missing operator or wrong syntax) then the whole calculation will be skipped and the array will be empty
    //In that case reduce will return an error and to handle that we have used try catch
    highestMagnitude = setOfmagnitude.reduce(function (a, b) {
      return max(a, b);
    });
  } catch (err) {
    //Type of errors we are catching here are as follows
    //1) unknown variables in the expression -> yn (n is unknown)
    //2) missing operator -> xy (shoud be like x*y or x(y)) or y9 (should be y*9 or y(9)) but 9y is valid
    // console.log("Failed to calculate highest magnitude");
    return "Failed to calculate highest magnitude";
  }

  //returning the highest magnitude which was the main purpose of this function
  return highestMagnitude;
}

//This function is responsible for the calculation and rendering of the actual vector field arrows with colour coding
function mainVectorFieldPlotter() {
  let x1, y1, x2, y2, xVal, yVal;
  let x1_20, y1_20, x2_10, y2_10;
  let magnitude = 0;
  let ijValLow, ijValHigh;
  let i, j;
  let xUnit, yUnit, xUnit_12, yUnit_12;
  let a, b, c, theta;

  ijValLow = 15 / divByijGlobal;
  ijValHigh = 15 / divByijGlobal;

  let sqrtOfXInP = xInputStringGlobal.match(/sqrt\(x\)/g) || xInputStringGlobal.match(/x\^0.5/g);
  let sqrtOfXInQ = yInputStringGlobal.match(/sqrt\(x\)/g) || yInputStringGlobal.match(/x\^0.5/g);
  let sqrtOfYInP = xInputStringGlobal.match(/sqrt\(y\)/g) || xInputStringGlobal.match(/y\^0.5/g);
  let sqrtOfYInQ = yInputStringGlobal.match(/sqrt\(y\)/g) || yInputStringGlobal.match(/y\^0.5/g);;

  let isValidPoint;

  for (i = -ijValLow; i <= ijValHigh + 0.001; i += 1 / divByijGlobal) {
    for (j = -ijValLow; j <= ijValHigh + 0.001; j += 1 / divByijGlobal) {
      isValidPoint = true;

      //Here, (x1,y1) = (x,y) of the coordinate point
      //x1=x, y1=y axis value of the selected coordinate point
      x1 = i;
      y1 = j;

      //Multiplying x1 and y1 with 20 or scaling up the (x1,y1) by 20x
      x1_20 = i * (20 * mulByPxGlobal);
      y1_20 = j * (20 * mulByPxGlobal);

      try {
        //Evaluating P(x,y) expression at the point i,j or at point (x1,y1)
        xVal = Number(nerdamer(xInputStringGlobal, { x: i, y: j }).evaluate());
        //Evaluating Q(x,y) expression at the point i,j or at point (x1,y1)
        yVal = Number(nerdamer(yInputStringGlobal, { x: i, y: j }).evaluate());
      } catch (err) {
        //Only handle error but don't use return to stop function execution
        //Type of errors we are catching here are as follows
        //1) expression like 1/y becasue at y=0 div by zero is not applicable or undefined
        // console.log("Division by 0 is not allowed - mainVectorFieldPlotter");
        continue;
      }

      if (sqrtOfXInP != null && x1 < 0) {
        isValidPoint = false;
      } else if (sqrtOfXInQ != null && x1 < 0) {
        isValidPoint = false;
      } else if (sqrtOfYInP != null && y1 < 0) {
        isValidPoint = false;
      } else if (sqrtOfYInQ != null && y1 < 0) {
        isValidPoint = false;
      }

      if (!isValidPoint) {
        continue;
      }

      //calculating the magnitude
      magnitude = (xVal ** 2 + yVal ** 2) ** 0.5;

      //if magnitude is 0 then we dont want to plot the vector
      if (magnitude === 0) {
        continue;
      } else {
        //Calculating the unit vector's i cap component
        xUnit = xVal / magnitude;
        //Calculating the unit vector's j cap component
        yUnit = yVal / magnitude;

        //Scaling unit vector's i cap and j cap components by 10x
        //This will decide the length of all the plotted vectors at any coordinate point
        xUnit_12 = xUnit * 13;
        yUnit_12 = yUnit * 13;

        //Calculating the end point (x2,y2) coordinates of the unit vector without any scaling
        x2 = x1 + xUnit;
        y2 = y1 + yUnit;

        if (scalingFlagGlobal === false) {
          //scaled to unit vector
          x2_10 = x1_20 + xUnit_12;
          y2_10 = y1_20 + yUnit_12;
        }

        if (scalingFlagGlobal === true) {
          x2_10 = x1_20 + xVal * scalingSliderValueGlobal;
          y2_10 = y1_20 + yVal * scalingSliderValueGlobal;
        }

        a = (y2 - y1) / (x2 - x1);

        theta = abs(degrees(atan(a)));

        if (
          (x2 > x1 && y2 > y1) ||
          (x2 > x1 && y2 == y1) ||
          (x2 == x1 && y2 > y1)
        ) {
          b = 90 - theta + 45;
          c = b + 90;
        } else if ((x2 < x1 && y2 > y1) || (x2 < x1 && y2 == y1)) {
          b = theta - 45;
          c = b + 90;
        } else if (x2 < x1 && y2 < y1) {
          b = -(theta - 45);
          c = b - 90;
        } else if ((x2 > x1 && y2 < y1) || (x2 == x1 && y2 < y1)) {
          b = theta - 135;
          c = b - 90;
        }

        y1_20 = -y1_20;
        y2_10 = -y2_10;

        colorMode(HSB, highestMagnitudeVectorGlobal);
        stroke(
          magnitude,
          highestMagnitudeVectorGlobal,
          highestMagnitudeVectorGlobal
        );
        line(x1_20, y1_20, x2_10, y2_10);
        push();
        translate(x2_10, y2_10);
        rotate(radians(b));
        line(0, 0, 5, 0);
        pop();

        push();
        translate(x2_10, y2_10);
        rotate(radians(c));
        line(0, 0, 5, 0);
        pop();
      }
    }
  }
}

//this function will plot the coulour bar with magnitude label
function colourBarAndMagnitude(maxValue) {
  const noOfDivision = 341;
  const unitSize = maxValue / noOfDivision;
  let i, j, l;
  colorMode(HSB, 340);
  for (l = 0; l <= 340; l++) {
    stroke(l, 340, 340);
    line(380, -320 + l, 400, -320 + l);
  }
  for (i = 0; i <= 340; i += 20) {
    textSize(13);
    textAlign(CENTER, BASELINE);
    fill(0);
    noStroke();
    textAlign(LEFT);
    text(round(unitSize * i, 4), 410, -315 + i);
    noFill();
    stroke(0);
    line(390, -320 + i, 400, -320 + i);
    noStroke();
  }
}

function runTheCode() {
  chekcExpressionValidityHandler();

  if (isValidExpressionGlobal) {
    colorMode(RGB);
    clear();
    colorMode(HSB);
    outerRectangle();
    axisLines();
    axisLabeling();
    highestMagnitudeVectorGlobal = calculateHighestMagnitudeOfVector();
    mainVectorFieldPlotter();
    colourBarAndMagnitude(highestMagnitudeVectorGlobal);
    controlMenuBarChild.classList.remove("disable-div");
  } else {
    modalBody.innerText = `Invalid Input Expression...\n\nOR\n\nUnknown Input Variable...`;
    modalHeader.innerHTML = "Error!";
    modal.style.display = "block";
    controlMenuBarChild.classList.add("disable-div");
  }
}

//This function will be called when we will press the submit buton
function submitButtonPressed() {
  chekcExpressionValidityHandler();
  if (isValidExpressionGlobal) {
    if (zoomFlagGlobal) {
      zoomSliderSubmitHandler();
    }
    if (scalingFlagGlobal) {
      scalingSliderSubmitHandler();
    }
    runTheCode();
    window.scrollTo(0, 360);
    controlMenuBarChild.classList.remove("disable-div");
    return;
  } else {
    controlMenuBarChild.classList.add("disable-div");
    modalBody.innerText = `Invalid Input Expression...\n\nOR\n\nUnknown Input Variable...`;
    modalHeader.innerHTML = "Error!";
    return (modal.style.display = "block");
  }
}

// Check and return whether we have clicked inside or outside of the plotting area
function isMouseClickedInside() {
  let isClickedInside = false;

  if (isValidExpressionGlobal) {
    let mouseXpos, mouseYpos, Xaxis, Yaxis, xAxis, yAxis;
    //indicated whether our mouse click in inside or outside the vector field plotting area
    if (mouseIsPressed) {
      mouseXpos = mouseX - 650;
      mouseYpos = -(mouseY - 350);
      Xaxis = mouseXpos / (20 * mulByPxGlobal);
      Yaxis = mouseYpos / (20 * mulByPxGlobal);
      //checking whether the clicked coordinate is inside our vector field plotting area
      if (
        Xaxis >= -15.99 / divByijGlobal &&
        Xaxis <= 15.99 / divByijGlobal &&
        Yaxis >= -15.99 / divByijGlobal &&
        Yaxis <= 15.99 / divByijGlobal
      ) {
        //recording the click coordinate according to our plotting area
        xAxis = Xaxis;
        yAxis = Yaxis;
        isClickedInside = true;
        return [xAxis, yAxis, isClickedInside];
      } else {
        return [0, 0, isClickedInside];
      }
    }
  } else {
    return [0, 0, isClickedInside];
  }
}

//triggers on mouse click
//calls isMouseClickedInside() and gets the coordinates
function mousePressed() {
  //returns an array [x, y, isClickedInside]
  let [xAxis, yAxis, isClickedInside] = isMouseClickedInside();

  //if we have clicked inside
  if (isClickedInside) {
    xAxisGlobal = xAxis;
    yAxisGlobal = yAxis;

    //calling and getting all the calculated values
    let returnCalculateAll = calculateAll(xAxis, yAxis);

    if (returnCalculateAll) {
      let [pxy, qxy, magnitude, curlE, curlV, divE, divV] = returnCalculateAll;
      //calling to render all the calculated values
      displayAllData(
        xAxis,
        yAxis,
        //dataStatus = true
        true,
        pxy,
        qxy,
        magnitude,
        curlE,
        curlV,
        divE,
        divV
      );

      if (magnitude) {
        //if custom coordinate is enabled
        if (displayBoxFlagGlobal === false) {
          //Drawing a pointer at a point where user has clicked on the vector field
          fill("red");
          circle(
            xAxis * (20 * mulByPxGlobal),
            -yAxis * (20 * mulByPxGlobal),
            8
          );
          fill("black");
          circle(
            xAxis * (20 * mulByPxGlobal),
            -yAxis * (20 * mulByPxGlobal),
            5
          );
        } else if (displayBoxFlagGlobal === true) {
          //Drawing a pointer at a point where user has clicked on the vector field
          fill("red");
          circle(
            xCoord.value * (20 * mulByPxGlobal),
            -yCoord.value * (20 * mulByPxGlobal),
            8
          );
          fill("black");
          circle(
            xCoord.value * (20 * mulByPxGlobal),
            -yCoord.value * (20 * mulByPxGlobal),
            5
          );
        }
        //we are recording the data if recording is enabled
        if (recordFlagGlobal === true) {
          userClickDataInsertHandler(
            xInputStringGlobal,
            yInputStringGlobal,
            xAxis,
            yAxis,
            xCoord,
            yCoord,
            pxy,
            qxy,
            magnitude,
            curlE,
            curlV,
            divE,
            divV
          );
        }
      }
    } else {
      displayAllData(
        xAxis,
        yAxis,
        //dataStatus = false
        false
      );
    }
  }
}

//calculates P(x,y);Q(x,y);Magnitude;
//calls divergence(); and curl(); and get their values
function calculateAll(xAxis, yAxis) {
  let x, y, pxy, qxy;
  let magnitude;

  if (displayBoxFlagGlobal === false) {
    x = xAxis;
    y = yAxis;
  } else if (displayBoxFlagGlobal === true) {
    x = Number(xCoord.value);
    y = Number(yCoord.value);
    if (Number.isNaN(x) || Number.isNaN(y)) {
      modalBody.innerText = "Invalid Coordinate Input...";
      modalHeader.innerHTML = "Error!";
      modal.style.display = "block";
      return false;
    }
  }

  //calculating P(x,y) and Q(x,y)
  try {
    pxy = Number(nerdamer(xInputStringGlobal, { x: x, y: y }).evaluate());
  } catch (err) {
    pxy = "UNDEF";
    magnitude = "UNDEF";
  }
  try {
    qxy = Number(nerdamer(yInputStringGlobal, { x: x, y: y }).evaluate());
  } catch (err) {
    qxy = "UNDEF";
    magnitude = "UNDEF";
  }

  //calculating magnitude
  if (magnitude != "UNDEF") {
    magnitude = Number(((pxy ** 2 + qxy ** 2) ** 0.5).toFixed(6));
  }

  let sqrtOfXInP = xInputStringGlobal.match(/sqrt\(x\)/g) || xInputStringGlobal.match(/x\^0.5/g);
  let sqrtOfXInQ = yInputStringGlobal.match(/sqrt\(x\)/g) || yInputStringGlobal.match(/x\^0.5/g);
  let sqrtOfYInP = xInputStringGlobal.match(/sqrt\(y\)/g) || xInputStringGlobal.match(/y\^0.5/g);
  let sqrtOfYInQ = yInputStringGlobal.match(/sqrt\(y\)/g) || yInputStringGlobal.match(/y\^0.5/g);

  let validityMessage = false;

  if (sqrtOfXInP != null && x < 0) {
    validityMessage = "P(x,y) is not valid at -x coordinate";
  } else if (sqrtOfXInQ != null && x < 0) {
    validityMessage = "Q(x,y) is not valid at -x coordinate";
  } else if (sqrtOfYInP != null && y < 0) {
    validityMessage = "P(x,y) is not valid at -y coordinate";
  } else if (sqrtOfYInQ != null && y < 0) {
    validityMessage = "Q(x,y) is not valid at -y coordinate";
  }

  if (validityMessage) {
    modalBody.innerText = `${validityMessage}`;
    modalHeader.innerHTML = "ATTENTION!";
    modal.style.display = "block";
    return false;
  }

  //for calculating curl and divergence, we are calling two different functions
  let [divE, divV] = divergence(xAxis, yAxis);
  let [curlE, curlV] = curl(xAxis, yAxis);

  return [pxy, qxy, magnitude, curlE, curlV, divE, divV];
}

//calculates and return divergence equation and value
function divergence(xAxis, yAxis) {
  let divergenceVal;
  let pDx, qDy;

  //replacing sqrt(y) in xInputStringGlobal with P before derivative
  //Because nerdamer cannot handle sqrt() of any constant (which is not a number) in partial differentiation
  let checkResultP = xInputStringGlobal.match(/sqrt\(y\)/g) || xInputStringGlobal.match(/y\^0.5/g);
  if (checkResultP != null) {
    let replacedXInputString = xInputStringGlobal.replace(/sqrt\(y\)/g, "P") || xInputStringGlobal.replace(/y\^0.5/g, "P");
    //doing derivative
    pDx = nerdamer.diff(replacedXInputString, "x");
    //replacing P in pDy with sqrt(x) after derivative
    pDx = pDx.text().replace(/P/g, "sqrt(y)");
  } else {
    pDx = nerdamer.diff(xInputStringGlobal, "x");
  }

  //replacing sqrt(x) in yInputStringGlobal with Q before derivative
  //Because nerdamer cannot handle sqrt() of any constant (which is not a number) in partial differentiation
  let checkResultQ = yInputStringGlobal.match(/sqrt\(x\)/g);
  if (checkResultQ != null) {
    let replacedYInputString = yInputStringGlobal.replace(/sqrt\(x\)/g, "Q") || yInputStringGlobal.replace(/x\^0.5/g, "Q");
    //doing derivative
    qDy = nerdamer.diff(replacedYInputString, "y");
    //replacing Q in qDy with sqrt(x) after derivative
    qDy = qDy.text().replace(/Q/g, "sqrt(x)");
  } else {
    qDy = nerdamer.diff(yInputStringGlobal, "y");
  }

  //divergence equation
  let divergenceEq = nerdamer(pDx).add(qDy);

  //divergence value
  try {
    if (displayBoxFlagGlobal === true) {
      divergenceVal = Number(
        Number(
          nerdamer(divergenceEq, {
            x: xCoord.value,
            y: yCoord.value,
          }).evaluate()
        ).toFixed(6)
      );
    } else if (displayBoxFlagGlobal === false) {
      divergenceVal = Number(
        Number(
          nerdamer(divergenceEq, { x: xAxis, y: yAxis }).evaluate()
        ).toFixed(6)
      );
    }
  } catch (err) {
    divergenceVal = "UNDEF";
  }

  return [divergenceEq, divergenceVal];
}

//calculates and return curl equation and value
function curl(xAxis, yAxis) {
  let pDy, qDx;
  let curlVal;

  //replacing sqrt(x) in xInputStringGlobal with P before derivative
  //Because nerdamer cannot handle sqrt() of any constant (which is not a number) in partial differentiation
  let checkResultP = xInputStringGlobal.match(/sqrt\(x\)/g) || xInputStringGlobal.match(/x\^0.5/g);
  if (checkResultP != null) {
    let replacedXInputString = xInputStringGlobal.replace(/sqrt\(x\)/g, "P") || xInputStringGlobal.replace(/x\^0.5/g, "P");
    //doing derivative
    pDy = nerdamer.diff(replacedXInputString, "y");
    //replacing P in pDy with sqrt(x) after derivative
    pDy = pDy.text().replace(/P/g, "sqrt(x)");
  } else {
    pDy = nerdamer.diff(xInputStringGlobal, "y");
  }

  //replacing sqrt(y) in yInputStringGlobal with Q before derivative
  //Because nerdamer cannot handle sqrt() of any constant (which is not a number) in partial differentiation
  let checkResultQ = yInputStringGlobal.match(/sqrt\(y\)/g) || yInputStringGlobal.match(/y\^0.5/g);
  if (checkResultQ != null) {
    let replacedYInputString = yInputStringGlobal.replace(/sqrt\(y\)/g, "Q") || yInputStringGlobal.replace(/y\^0.5/g, "Q");
    //doing derivative
    qDx = nerdamer.diff(replacedYInputString, "x");
    //replacing Q in qDx with sqrt(y) after derivative
    qDx = qDx.text().replace(/Q/g, "sqrt(y)");
  } else {
    qDx = nerdamer.diff(yInputStringGlobal, "x");
  }

  //curl equation
  let curlEq = nerdamer(qDx).subtract(pDy);

  // curl value
  try {
    if (displayBoxFlagGlobal === true) {
      curlVal = Number(
        Number(
          nerdamer(curlEq, {
            x: xCoord.value,
            y: yCoord.value,
          }).evaluate()
        ).toFixed(6)
      );
    } else if (displayBoxFlagGlobal === false) {
      curlVal = Number(
        Number(nerdamer(curlEq, { x: xAxis, y: yAxis }).evaluate()).toFixed(6)
      );
    }
  } catch (err) {
    curlVal = "UNDEF";
  }

  return [curlEq, curlVal];
}

//display the following data
//(x,y);P(x,y);Q(x,y);Magnitude;Curl Eq;Curl Val;Divergence Eq;Divergence Val
function displayAllData(
  xAxis,
  yAxis,
  dataStatus,
  pxy = null,
  qxy = null,
  magnitude = null,
  curlE = null,
  curlV = null,
  divE = null,
  divV = null
) {
  //if dataStatus true then only we have calculated values and we wanna show them otherwise don't
  if (dataStatus === true) {
    if (displayBoxFlagGlobal === false) {
      coordDisplay.value = `\\left(x,y\\right)=\\left(${xAxis.toFixed(
        3
      )},${yAxis.toFixed(3)}\\right)`;
    }
    //if the custom coordinate check box is checked or enabled
    //we have a flag variable to store the checkbox status
    if (displayBoxFlagGlobal === true) {
      coordDisplay.value = `\\left(x,y\\right)=\\left(${xCoord.value},${yCoord.value}\\right)`;
    }
    //displaying P(x,y) Q(x,y)
    if (pxy === "UNDEF" || qxy === "UNDEF") {
      pOfXy.value = `P\\left(x,y\\right)\\hat{i}=${pxy}`;
      qOfXy.value = `Q\\left(x,y\\right)\\hat{j}=${qxy}`;
    } else {
      pOfXy.value = `P\\left(x,y\\right)\\hat{i}=${pxy.toFixed(6)}`;
      qOfXy.value = `Q\\left(x,y\\right)\\hat{j}=${qxy.toFixed(6)}`;
    }
    //displaying magnitude
    magnitudeVal.value = `\\sqrt{P^2+Q^2}=${magnitude}`;
    //displaying the curl equation by assigning it to proper DOM element
    curlEqu.value = curlE.toTeX();
    //displaying the div value by assigning it to proper DOM element
    curlValue.value = `\\nabla\\times\\vec{F}=\\frac{\\partial Q}{\\partial x}-\\frac{\\partial P}{\\partial y}=
    ${curlV}`;
    //displaying the div equation by assigning it to proper DOM element
    divEqu.value = divE.toTeX();
    //displaying the divergence value by assigning it to proper DOM element
    divValue.value = `\\nabla\\cdot\\vec{F}=\\frac{\\partial P}{\\partial x}+\\frac{\\partial Q}{\\partial y}=
    {${divV}`;
  } else {
    if (displayBoxFlagGlobal === false) {
      coordDisplay.value = `\\left(x,y\\right)=\\left(${xAxis.toFixed(
        3
      )},${yAxis.toFixed(3)}\\right)`;
    }
    //if the custom coordinate check box is checked or enabled
    //we have a flag variable to store the checkbox status
    if (displayBoxFlagGlobal === true) {
      coordDisplay.value = `\\left(x,y\\right)=\\left(${xCoord.value},${yCoord.value}\\right)`;
    }
  }
}
