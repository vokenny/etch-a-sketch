(function () {
  'use strict';

  /* CONSTANTS */
  const CLASSIC_GREY = '#c4c4c4'
  const DARKEST_GREY = 'rgb(50, 50, 50)';
  const MIN_OPACITY = 0.1;
  const MAX_OPACITY = 1.0;
  const OPACITY_INC = 0.1;
  const MIN_RGB_VAL = 100;
  const MAX_RGB_VAL = 255;

  const EVENTS = [
    { name: 'dragend', handler: toggleMouseDownOrTouch },
    { name: 'mouseup', handler: toggleMouseDownOrTouch },
    { name: 'mousedown', handler: toggleMouseDownOrTouch },
    { name: 'mousedown', handler: fillUnit },
    { name: 'mouseover', handler: fillUnit },
    { name: 'touchstart', handler: toggleMouseDownOrTouch },
    { name: 'touchmove', handler: toggleMouseDownOrTouch },
    { name: 'touchend', handler: toggleMouseDownOrTouch },
    { name: 'touchstart', handler: fillUnit },
    { name: 'touchmove', handler: fillUnit }
  ]

  /* DOCUMENT SELECTORS */
  const gridContainer = document.querySelector('#grid');
  const gridDensityButtons = document.querySelectorAll('#grid-density-ctrls .button');
  const colorModeButtons = document.querySelectorAll('#color-mode-ctrls .button');
  const getGridUnits = () => document.querySelectorAll('.grid-unit');

  /* DEFAULT START CONFIG */
  let gridDensity = 16;
  let colorMode = 'classic';
  let mouseDown = false;
  let hasGridEventListeners = false;

  function toggleMouseDownOrTouch(event) {
    switch (event.type) {
      case 'mousedown':
      case 'touchstart':
      case 'touchmove':
        mouseDown = true;
        break;
      default:
        mouseDown = false;
        break;
    }
  }

  function randRgbVal() {
    return MIN_RGB_VAL + Math.floor(Math.random() * (MAX_RGB_VAL - MIN_RGB_VAL));
  }

  function applyRainbowColor(event) {
    const style = event.target.style;
    const red = randRgbVal();
    const green = randRgbVal();
    const blue = randRgbVal();

    style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
  }

  function applyGreyscaleColor(event) {
    const style = event.target.style;
    const bgColor = style.backgroundColor;
    const opacity = style.opacity;

    if (bgColor === DARKEST_GREY) {
      if (opacity != MAX_OPACITY) style.opacity = parseFloat(style.opacity) + OPACITY_INC;
    } else {
      style.backgroundColor = DARKEST_GREY;
      style.opacity = MIN_OPACITY;
    }
  }

  function fillUnit(event) {
    if (mouseDown) {
      switch (colorMode) {
        case 'rainbow':
          applyRainbowColor(event);
          break;
        case 'greyscale':
          applyGreyscaleColor(event);
          break;
        default:
          event.target.style.backgroundColor = CLASSIC_GREY;
          break;
      }
    }
  }

  function createGridUnit() {
    const gridUnit = document.createElement('div');
    gridUnit.classList.add('grid-unit');

    const styling = gridUnitStyle();
    Object.entries(styling).forEach(([key, value]) => {
      gridUnit.style[key] = value;
    });

    applyGridUnitEventListeners(gridUnit);

    return gridUnit;
  }

  function applyGridUnitEventListeners(unit) {
    EVENTS.forEach(event => {
      unit.addEventListener(event.name, event.handler)
    });

    hasGridEventListeners = true;
  }

  function removeGridUnitEventListeners() {
    const gridUnits = getGridUnits();

    gridUnits.forEach(unit =>
      EVENTS.forEach(event => {
        unit.removeEventListener(event.name, event.handler)
      })
    );

    hasGridEventListeners = false;
  }

  function gridUnitStyle() {
    return {
      width: `calc(100% / ${gridDensity})`,
      height: `calc(100% / ${gridDensity})`,
    }
  }

  function clearGrid() {
    if (hasGridEventListeners) removeGridUnitEventListeners();
    gridContainer.innerHTML = '';
  }

  function displayCleanGrid() {
    clearGrid();

    const numOfUnitsInSquare = gridDensity * gridDensity;
    const gridArray = Array(numOfUnitsInSquare).fill().map(() => createGridUnit());

    gridArray.forEach(unit => gridContainer.append(unit));
  }

  function updateGridDensity(event) {
    gridDensityButtons.forEach(button => button.classList.remove('selected'));
    event.target.classList.add('selected');

    gridDensity = event.target.value;
    displayCleanGrid();
  }

  function updateColorMode(event) {
    colorModeButtons.forEach(button => button.classList.remove('selected'));
    event.target.classList.add('selected');

    colorMode = event.target.value;
  }

  function applyControlsEventListeners() {
    gridDensityButtons.forEach(button => button.addEventListener('click', updateGridDensity));
    colorModeButtons.forEach(button => button.addEventListener('click', updateColorMode));
  }

  /* Main program */
  displayCleanGrid();
  applyControlsEventListeners();
}())