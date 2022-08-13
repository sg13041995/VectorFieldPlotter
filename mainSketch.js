//++++++++++++++++++++++++++++++++++//
//========GLOBAL VARIABLES==========//
//++++++++++++++++++++++++++++++++++//
//It stores the main canvas instance
let customCanvas;

//It stores the highest magnitude of the vector
let highestMagnitudeVector;

//Flag to control the zoom enabling (1) and disabling (0)
//by default zoom is disabled
let zoomEnable = 0;

//In order to adjust plots and clicks properly on the screen, we need to change the two following variables simultaneously in proper ratio

//increasing this value to 2 from 1 will change the ploting range from 15 to 7.5 or half of 15
//The same will also change 1 unit from 20px to 10px and print vector field till -7.5 to 7.5 instead of -15 to 15
//The same will also change the mouse click position value and range it from -7.5 to 7.5 while keeping the unit density to 10px
let divByij = 1;

//This defines how many pixels will be counted as 1 unit of our vector field
//By default 20px means 1 unit when the value of this variable is 1
//This 20px value has been initialized in different function
//if we increase it to 2 then 40px will be 1 unit
//This will affect the mouse click position value and plotted arrow positions as well
//if we change this value then pixel count per unit length will change but values will be plotted all the way from -15 to 15 and we cannot limit that
let mulByPx = 1;

//Creating variables for smooth slider graphics and it's min-max-step value configuration
//This will be used in Scaling the vectors
let sliderGraphics,
  sliderValue = 1,
  sliderValueMin = 0.5,
  sliderValueMax = 2,
  step = 0.02;

//Creating variables for step slider graphics and it's min-max-step value configuration
//This will be used in zoom in and out of the vector field
let checkboxZoom,
  sliderGraphicsZoom,
  sliderValueZoomCurrent = 1,
  sliderValueZoom = 1,
  sliderValueMinZoom = 1,
  sliderValueMaxZoom = 8,
  stepZoom = 1;

//pDenoString and qDenoString will hold the inputX and inputY expression's denominators as strigs
//pDenoVal and qDenoVal will hold the evaluted values of pDenoString and qDenoString expressions at specific points (x, y) or (i, j)
let pDenoString, qDenoString, pDenoVal, qDenoval;

//This is a flag
let exprFlag = 1;

//xInput will get the P(x, y) or i-cap part of the vector function from user
//xInputString will get string form of the latex input of the mathfield element
let xInput, xInputString;

//yInput will get the Q(x, y) or j-cap part of the vector function from user
//yInputString will get string form of the latex input of the mathfield element
let yInput, yInputString;

//This will hold the instance of main submit button DOM element
let submitBtn;

//This will hold the instance of coordinate display DOM element
let coordDisplay, coordDisplayDiv;

//This will hold the instance of x-coordinate and y-coordinate display DOM element
let xCoord, yCoord;

//custom coordinate div holds the custom user input fields of x-coordinate and y-coordinate
let customCoordDiv;

//This is a flag variable to store the custom coordinate enable/ disable checkbox status
let displayBoxFlag = 0;

//This element will hold the instance of pxy DOM element which holds the value of P(x,y) at a specific point
let pOfXy;

//This element will hold the instance of qxy DOM element which holds the value of Q(x,y) at a specific point
let qOfXy;

//This will hold the curl equation and value
let curlEqu, curlValue;

//This will hold the divergence equation and value
let divEqu, divValue;

//This is a checkbox for enabling custom coordinate
let checkbox;

//If the custom coordinate checkbox is enabled then this variable will become 1 else 0
//So by default the value is zero1
let checkBoxFlag = 0;

//xAxis and yAxis is the x and y value of a point on the coordinate system selected with our mouse click or entered with custom coordinate math-field element
//It is the point at which we will calculate all the vector filed properties
let xAxis = 0,
  yAxis = 0;

//This variable will be responsible for providing additional density
let extraDensity = 1;

let pxy, qxy, pDenoString2, qDenoString2, pDenoVal2, qDenoval2;
let pDx, qDy, pDxVal, qDyVal, divergenceEq, divergenceVal;
let pDy, qDx, pDyVal, qDxVal, curlEq, curlVal;

let enableScalingFlag = 0,
  checkboxScale;
let xyMin, xyMax, currentXY;

//******Main setup function******
function setup() {
  //Creating the canvas
  customCanvas = createCanvas(1300, 700);
  customCanvas.style("z-index: -100");

  //Positioning the canvas at left top corner of the screen
  customCanvas.position(0, 305);

  //These variables will contain the centre of the canvas
  let x0, y0;

  //Calculating the centre of the canvas
  x0 = width / 2; // 650
  y0 = height / 2; // 350

  //It will be considered as the centre of the canvas and we are shifting the axis to the (x0,y0) and drawing other components with respect to that point
  //Translating the drawing axis to x0, y0
  translate(x0, y0);

  //Getting the instance of the coordinate display element from DOM
  coordDisplay = document.getElementById("coordinate-disp");

  //Getting the instance of the coordinate display div element from DOM
  coordDisplayDiv = document.getElementById("coordinate-disp-div");

  //Getting the instance of the x-coordinate display and editable element from DOM
  xCoord = document.getElementById("x-coordinate");

  //Getting the instance of the y-coordinate display and editable element from DOM
  yCoord = document.getElementById("y-coordinate");

  //Getting the instance of the custom coordinate div
  customCoordDiv = document.getElementById("custom-coordinate-div");

  //initially we are not showing the element
  customCoordDiv.style.display = "none";

  //Getting the instance of p-of-xy element from DOM
  pOfXy = document.getElementById("p-of-xy");

  //Getting the instance of p-of-xy element from DOM
  qOfXy = document.getElementById("q-of-xy");

  //Getting the DOM element of curl equation display
  curlEqu = document.getElementById("curl-equation");

  //Getting the DOM element of curl value display
  curlValue = document.getElementById("curl-value");

  //Getting the DOM element of curl equation display
  divEqu = document.getElementById("divergence-equation");

  //Getting the DOM element of curl value display
  divValue = document.getElementById("divergence-value");

  //Getting the xInput and yInput element from DOM and configuring it to have the virtual keyboard
  xInput = document.getElementById("x-input");
  xInput.setOptions({
    virtualKeyboardMode: "manual",
    virtualKeyboards: "numeric",
  });

  yInput = document.getElementById("y-input");
  yInput.setOptions({
    virtualKeyboardMode: "manual",
    virtualKeyboards: "numeric",
  });

  //Getting the instance of the submit button from DOM
  submitBtn = document.getElementById("submit-btn");

  //attaching event listener and a function to the main submit button instance
  submitBtn.addEventListener("click", submitButtonPressed);

  //converting xInput and yInput value, which is in a latex form, to a string form using nerdamer
  xInputString = nerdamer.convertFromLaTeX(xInput.value).text();
  yInputString = nerdamer.convertFromLaTeX(yInput.value).text();

  //This function renders the box and it's axis and labelling for the actual vector field
  outerRectangle();
  axisLines();
  axisLabeling();

  //Calling the function to calculate highest magnitude and assigning it to the proper variable
  // console.time("highestMagnitudeOfVector");
  highestMagnitudeVector = highestMagnitudeOfVector();
  // console.timeEnd("highestMagnitudeOfVector");

  //This function is rsponsible to calculate and render the vector field arrows
  // console.time("mainVectorFieldPlotter");
  mainVectorFieldPlotter();
  // console.timeEnd("mainVectorFieldPlotter");

  //This function is rsponsible to calculate and render the colour bar, indicating the magnitudes
  colourBarAndMagnitude(highestMagnitudeVector);

  //This function calculates the curl
  curl();

  //This function calculates the divergence
  divergence();

  //This function renders interactive UI elements
  UIEquation();
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

  unitJump = 15 / divByij / 15;
  upperJump = 15 / divByij;

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
function highestMagnitudeOfVector() {
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
        xVal = Number(nerdamer(xInputString, { x: i, y: j }).evaluate());
        //yVal will hold the Q(x,y) or the j-cap component of the vector
        yVal = Number(nerdamer(yInputString, { x: i, y: j }).evaluate());
      } catch (err) {
        //Only handle error but don't use return to stop function execution
        //Type of errors we are catching here are as follows
        //1) expression like 1/y becasue at y=0 div by zero is not applicable or undefined
        console.log("Division by 0 is not allowed - highestMagnitudeOfVector");
        continue;
      }

      //if xVal or yVal is NaN we don't want it to store inside the setOfmagnitude array and also skipping rest of the calculation for that specific iteration or i, j value
      if (Number.isNaN(xVal) || Number.isNaN(yVal)) {
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
    console.log("Failed to calculate highest magnitude");
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

  ijValLow = 15 / divByij;
  ijValHigh = 15 / divByij;

  for (i = -ijValLow; i <= ijValHigh + 0.001; i += 1 / divByij / extraDensity) {
    for (
      j = -ijValLow;
      j <= ijValHigh + 0.001;
      j += 1 / divByij / extraDensity
    ) {
      //Here, (x1,y1) = (x,y) of the coordinate point
      //x1=x, y1=y axis value of the selected coordinate point
      x1 = i;
      y1 = j;

      //Multiplying x1 and y1 with 20 or scaling up the (x1,y1) by 20x
      x1_20 = i * (20 * mulByPx);
      y1_20 = j * (20 * mulByPx);

      try {
        //Evaluating P(x,y) expression at the point i,j or at point (x1,y1)
        xVal = Number(nerdamer(xInputString, { x: i, y: j }).evaluate());
        //Evaluating Q(x,y) expression at the point i,j or at point (x1,y1)
        yVal = Number(nerdamer(yInputString, { x: i, y: j }).evaluate());
      } catch (err) {
        //Only handle error but don't use return to stop function execution
        //Type of errors we are catching here are as follows
        //1) expression like 1/y becasue at y=0 div by zero is not applicable or undefined
        console.log("Division by 0 is not allowed - mainVectorFieldPlotter");
        continue;
      }

      if (Number.isNaN(xVal) || Number.isNaN(yVal)) {
        // console.log("Please Check the expression - mainVectorFieldPlotter");
        continue;
      }

      //calculating the magnitude
      magnitude = round((xVal ** 2 + yVal ** 2) ** 0.5, 4);

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

        if (enableScalingFlag == 0) {
          //scaled to unit vector
          x2_10 = x1_20 + xUnit_12;
          y2_10 = y1_20 + yUnit_12;
        }

        if (enableScalingFlag == 1) {
          x2_10 = x1_20 + xVal * sliderValue;
          y2_10 = y1_20 + yVal * sliderValue;
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

        colorMode(HSB, highestMagnitudeVector);
        stroke(magnitude, highestMagnitudeVector, highestMagnitudeVector);
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

function UIEquation() {
  let extraDensityEnable;

  if (checkBoxFlag == 0) {
    checkbox = createCheckbox("Enable Custom Coordinate", false);
    checkbox.position(customCanvas.x + 1130, customCanvas.y + 20);
    checkbox.changed(enableButton);

    sliderGraphics = createSlider(
      sliderValueMin,
      sliderValueMax,
      sliderValue,
      step
    );

    sliderGraphics.position(customCanvas.x + 1025, customCanvas.y + 420);
    sliderGraphics.style("width", "220px");
    sliderGraphics.attribute("disabled", "");
    sliderGraphics.input(getSliderValue);

    checkboxScale = createCheckbox("Scaling Factor", false);
    checkboxScale.position(customCanvas.x + 1130, sliderGraphics.y - 220);
    checkboxScale.changed(sliderScale);

    xyMin = createInput(sliderValueMin);
    xyMin.position(customCanvas.x + 1030, sliderGraphics.y + 30);
    xyMin.size(50, 20);
    xyMin.attribute("disabled", "");
    xyMin.input(xyMinVal);

    xyMax = createInput(sliderValueMax);
    xyMax.position(customCanvas.x + 1240, sliderGraphics.y + 30);
    xyMax.size(50, 20);
    xyMax.attribute("disabled", "");
    xyMax.input(xyMaxVal);

    currentXY = createInput(sliderValue);
    currentXY.position(customCanvas.x + 1140, sliderGraphics.y + 30);
    currentXY.size(50, 20);
    currentXY.attribute("disabled", "");

    checkboxZoom = createCheckbox("Zooming Factor", false);
    checkboxZoom.position(customCanvas.x + 1130, sliderGraphics.y - 115);
    checkboxZoom.changed(sliderScaleZoom);

    sliderGraphicsZoom = createSlider(
      sliderValueMinZoom,
      sliderValueMaxZoom,
      sliderValueZoom,
      stepZoom
    );
    sliderGraphicsZoom.position(customCanvas.x + 1025, sliderGraphics.y + 110);
    sliderGraphicsZoom.style("width", "220px");
    sliderGraphicsZoom.attribute("disabled", "");
    sliderGraphicsZoom.input(sliderValueZoomRead);

    extraDensityEnable = createCheckbox("Density++", false);
    extraDensityEnable.position(customCanvas.x + 1130, customCanvas.y + 110);
    extraDensityEnable.changed(extraDensityEnableFunc);

    checkBoxFlag = 1;
  }
  displayData();
}

function extraDensityEnableFunc() {
  if (this.checked()) {
    // Re-enable the button
    extraDensity = 1.2;
  } else {
    // Disable the button
    extraDensity = 1;
  }
}

function sliderScaleZoom() {
  if (this.checked()) {
    // Re-enable the button
    sliderGraphicsZoom.removeAttribute("disabled");
    zoomEnable = 1;
  } else {
    // Disable the button
    sliderGraphicsZoom.attribute("disabled", "");
    divByij = 1;
    mulByPx = 1;
    sliderValueZoom = 1;
    sliderGraphicsZoom.remove();
    sliderGraphicsZoom = createSlider(
      sliderValueMinZoom,
      sliderValueMaxZoom,
      sliderValueZoom,
      stepZoom
    );
    sliderGraphicsZoom.position(customCanvas.x + 1025, sliderGraphics.y + 110);
    sliderGraphicsZoom.style("width", "220px");
    sliderGraphicsZoom.attribute("disabled", "");
    sliderGraphicsZoom.input(sliderValueZoomRead);
    zoomEnable = 0;
  }
}

function sliderValueZoomRead() {
  sliderValueZoomCurrent = sliderGraphicsZoom.value();
  divByij = sliderValueZoomCurrent;
  mulByPx = sliderValueZoomCurrent;
}

function runTheCode() {
  colorMode(RGB);
  clear();
  colorMode(HSB);
  outerRectangle();
  axisLines();
  axisLabeling();
  UIEquation();
  highestMagnitudeVector = highestMagnitudeOfVector();
  mainVectorFieldPlotter();
  colourBarAndMagnitude(highestMagnitudeVector);
}

//This function will be called when we will press the submit buton
function submitButtonPressed() {
  sliderValue = sliderGraphics.value();

  //converting xInput and yInput value, which is in a latex form, to a string form using nerdamer
  try {
    xInputString = nerdamer.convertFromLaTeX(xInput.value).text();
    yInputString = nerdamer.convertFromLaTeX(yInput.value).text();
  } catch (err) {
    //Type of errors we are catching here are as follows
    //1) incomplete expression -> y-, y(sqrt())
    return console.log("Incomplete expression - submitButtonPressed");
  }

  runTheCode();

  window.scrollTo(0, 300);
}

function mousePressed() {
  mousePosition();
  calculatePQ();
  displayData();
}

function mousePosition() {
  let mouseXpos, mouseYpos, Xaxis, Yaxis;
  if (mouseIsPressed) {
    mouseXpos = mouseX - 650;
    mouseYpos = -(mouseY - 350);
    Xaxis = mouseXpos / (20 * mulByPx);
    Yaxis = mouseYpos / (20 * mulByPx);
    if (
      Xaxis >= -15.99 / divByij &&
      Xaxis <= 15.99 / divByij &&
      Yaxis >= -15.99 / divByij &&
      Yaxis <= 15.99 / divByij
    ) {
      xAxis = round(Xaxis, 2);
      yAxis = round(Yaxis, 2);

      if (displayBoxFlag == 0) {
        //Drawing a pointer at a point where user has clicked on the vector field
        fill("red");
        circle(Xaxis * (20 * mulByPx), -Yaxis * (20 * mulByPx), 8);
        fill("black");
        circle(Xaxis * (20 * mulByPx), -Yaxis * (20 * mulByPx), 5);
      }
    }
  }
}

//This function will calculate P(x,y) and Q(x,y) value from the equations
function calculatePQ() {
  //if custom coordinate user entry checkbox is disabled
  if (displayBoxFlag == 0) {
    try {
      pxy = round(nerdamer(xInputString, { x: xAxis, y: yAxis }).evaluate(), 3);
      qxy = round(nerdamer(yInputString, { x: xAxis, y: yAxis }).evaluate(), 3);
    } catch (err) {
      pxy = "UNDEFINED";
      qxy = "UNDEFINED";
      divergenceVal = "UNDEFINED";
      curlVal = "UNDEFINED";
      return 500;
    }
  }

  //if custom coordinate user entry checkbox is enabled or 1 then we will do the same things as we did above sequentially
  else if (displayBoxFlag == 1) {
    try {
      pxy = round(
        nerdamer(xInputString, {
          x: xCoord.value,
          y: yCoord.value,
        }).evaluate(),
        3
      );
      qxy = round(
        nerdamer(yInputString, {
          x: xCoord.value,
          y: yCoord.value,
        }).evaluate(),
        3
      );
    } catch (err) {
      pxy = "UNDEFINED";
      qxy = "UNDEFINED";
      divergenceVal = "UNDEFINED";
      curlVal = "UNDEFINED";
      return 1000;
    }
  }

  //for calculating curl and divergence, we are calling two different functions
  divergence();
  curl();

  //then display them on the proper DOM element
  pOfXy.value = `P\\left(x,y\\right)\\hat{i}=${pxy}`;
  qOfXy.value = `Q\\left(x,y\\right)\\hat{j}=${qxy}`;
}

//This function will calculate the divergence
function divergence() {
  pDx = nerdamer.diff(xInputString, "x");
  qDy = nerdamer.diff(yInputString, "y");

  //This will provide us the divergence equation in nerdamer text version
  divergenceEq = nerdamer(pDx + "+" + qDy).toTeX();

  //displaying the div equation by assigning it to proper DOM element
  divEqu.value = divergenceEq;

  if (displayBoxFlag == 1) {
    pDxVal = nerdamer(pDx, {
      x: xCoord.value,
      y: yCoord.value,
    }).evaluate();
    qDyVal = nerdamer(qDy, {
      x: xCoord.value,
      y: yCoord.value,
    }).evaluate();
  } else if (displayBoxFlag == 0) {
    pDxVal = round(nerdamer(pDx, { x: xAxis, y: yAxis }).evaluate(), 3);
    qDyVal = round(nerdamer(qDy, { x: xAxis, y: yAxis }).evaluate(), 3);
  }

  divergenceVal = round(pDxVal + qDyVal, 3);

  //displaying the divergence value by assigning it to proper DOM element
  divValue.value = `\\nabla\\cdot\\vec{F}=\\frac{\\partial P}{\\partial x}+\\frac{\\partial Q}{\\partial y}=${divergenceVal}`;

  divergenceVal = round(pDxVal + qDyVal, 3);

  //displaying the div value by assigning it to proper DOM element
  divValue.value = `\\nabla\\cdot\\vec{F}=\\frac{\\partial P}{\\partial x}+\\frac{\\partial Q}{\\partial y}=${divergenceVal}`;
}

//This function will calculate the curl
function curl() {
  //Performing the partial differentiation to get the equations
  pDy = nerdamer.diff(xInputString, "y");
  qDx = nerdamer.diff(yInputString, "x");

  //Forming the curl equation and converting to latex for display purpose
  curlEq = nerdamer(qDx + "-" + pDy).toTeX();
  //if custom coordinate checkbox is disabled
  if (displayBoxFlag == 0) {
    //evaluating the differentiation equations at specific points
    pDyVal = round(nerdamer(pDy, { x: xAxis, y: yAxis }).evaluate(), 3);
    qDxVal = round(nerdamer(qDx, { x: xAxis, y: yAxis }).evaluate(), 3);
  }

  //if custom coordinate checkbox is enabled
  else if (displayBoxFlag == 1) {
    //evaluating the differentiation equations at specific points
    pDyVal = round(
      nerdamer(pDy, {
        x: xCoord.value,
        y: yCoord.value,
      }).evaluate(),
      3
    );
    qDxVal = round(
      nerdamer(qDx, {
        x: xCoord.value,
        y: yCoord.value,
      }).evaluate(),
      3
    );
  }
  //calculating the curl
  curlVal = round(qDxVal - pDyVal, 3);

  //displaying the curl equation by assigning it to proper DOM element
  curlEqu.value = curlEq;

  //displaying the curl value by assigning it to proper DOM element
  curlValue.value = `\\nabla\\times\\vec{F}=\\frac{\\partial Q}{\\partial x}-\\frac{\\partial P}{\\partial y}=${curlVal}`;
}

//This function is responsible to inject and display the coordinate values on the respective DOM elements based on the state of custom coordinate enable/ disable check box
function displayData() {
  //if the custom coordinate check box is not checked or disabled
  //we have a flag variable to store the checkbox status
  if (displayBoxFlag == 0) {
    coordDisplay.value = `\\left(x,y\\right)=\\left(${xAxis},${yAxis}\\right)`;
  }

  //if the custom coordinate check box is checked or enabled
  //we have a flag variable to store the checkbox status
  if (displayBoxFlag == 1) {
    coordDisplay.value = `\\left(x,y\\right)=\\left(${xCoord.value},${yCoord.value}\\right)`;
  }
}

//This function is called and ran on every click on the display enable/disable checkbox
function enableButton() {
  //If the button is checked
  if (this.checked()) {
    //first assigning the previously selected coordinate values of non editable elements to the editable elements so that we can show the same values to the editable elemets that of non editable elements
    xCoord.value = xAxis;
    yCoord.value = yAxis;

    //setting the flag variable to 1 or true
    displayBoxFlag = 1;

    //showing the element when custom coordinate box is checked
    customCoordDiv.style.display = "block";

    //hiding the element when custom coordinate box is checked
    coordDisplayDiv.style.display = "none";
  } else {
    //first assigning the previously selected coordinate values of editable elements to the non editable elements so that we can show the same values to the non editable elemets that of editable elements
    xAxis = xCoord.value;
    yAxis = yCoord.value;

    //setting the flag variable to 0 or false
    displayBoxFlag = 0;

    //hiding the element agian when custom coordinate box is unchecked
    customCoordDiv.style.display = "none";

    //showing the element again when custom coordinate box is unchecked
    coordDisplayDiv.style.display = "block";
  }
}

function sliderScale() {
  if (this.checked()) {
    // Re-enable the button
    sliderGraphics.removeAttribute("disabled");
    xyMax.removeAttribute("disabled");
    xyMin.removeAttribute("disabled");
    enableScalingFlag = 1;
  } else {
    // Disable the button
    sliderGraphics.attribute("disabled", "");
    xyMax.attribute("disabled", "");
    xyMin.attribute("disabled", "");
    enableScalingFlag = 0;
  }
}

function sliderScaleDisplay() {
  sliderGraphics.remove();

  sliderGraphics = createSlider(
    sliderValueMin,
    sliderValueMax,
    sliderValue,
    step
  );
  sliderGraphics.position(customCanvas.x + 1025, customCanvas.y + 420);
  sliderGraphics.style("width", "200px");
}

function getSliderValue() {
  currentXY.remove();
  sliderValue = sliderGraphics.value();

  currentXY = createInput(sliderValue);
  currentXY.position(customCanvas.x + 1140, sliderGraphics.y + 30);
  currentXY.size(50, 20);
  currentXY.attribute("disabled", "");
}

function xyMinVal() {
  sliderValueMin = xyMin.value();

  sliderGraphics.remove();

  sliderGraphics = createSlider(
    sliderValueMin,
    sliderValueMax,
    sliderValue,
    step
  );
  sliderGraphics.position(customCanvas.x + 1025, customCanvas.y + 420);
  sliderGraphics.style("width", "220px");

  sliderGraphics.input(getSliderValue);

  currentXY.remove();
  sliderValue = sliderGraphics.value();

  currentXY = createInput(sliderValue);
  currentXY.position(customCanvas.x + 1140, sliderGraphics.y + 30);
  currentXY.size(50, 20);
  currentXY.attribute("disabled", "");
}

function xyMaxVal() {
  sliderValueMax = xyMax.value();

  sliderGraphics.remove();

  sliderGraphics = createSlider(
    sliderValueMin,
    sliderValueMax,
    sliderValue,
    step
  );
  sliderGraphics.position(customCanvas.x + 1025, customCanvas.y + 420);
  sliderGraphics.style("width", "220px");

  sliderGraphics.input(getSliderValue);

  currentXY.remove();
  sliderValue = sliderGraphics.value();

  currentXY = createInput(sliderValue);
  currentXY.position(customCanvas.x + 1140, sliderGraphics.y + 30);
  currentXY.size(50, 20);
  currentXY.attribute("disabled", "");
}
