(function () {
  'use strict';

  /* TODOs
    - Toggle grid lines
    - Grid density slider
    - Colour grabber
    - Color fill
    - Colour picker
  */

  /* CONSTANTS */
  const CLASSIC_GREY = '#c4c4c4';
  const DARKEST_GREY = 'rgb(50, 50, 50)';
  const MIN_OPACITY = 0.1;
  const MAX_OPACITY = 1.0;
  const OPACITY_INC = 0.1;
  const MIN_RGB_VAL = 100;
  const MAX_RGB_VAL = 255;

  const EVENTS = [
    { name: 'click', handler: togglePaint },
    { name: 'mouseover', handler: fillUnit },
    { name: 'touchstart', handler: togglePaint },
    { name: 'touchend', handler: togglePaint },
    { name: 'touchmove', handler: fillUnit }
  ]

  /* DOCUMENT SELECTORS */
  const gridContainer = document.querySelector('#grid');
  const gridDensityButtons = document.querySelectorAll('.grid-density-ctrl');
  const colorModeButtons = document.querySelectorAll('.color-mode-ctrl');
  const toolButtons = document.querySelectorAll('.tool-ctrl');
  const clearButton = document.querySelector('#clear');
  const getGridUnits = () => document.querySelectorAll('.grid-unit');

  /* DEFAULT START CONFIG */
  let gridDensity = 16;
  let colorMode = 'classic';
  let tool = 'paint';
  let paintToggle = false;
  let hasGridEventListeners = false;

  function togglePaint(event) {
    switch (event.type) {
      case 'click':
      case 'touchstart':
      case 'touchmove':
        paintToggle = !paintToggle;
        break;
      default:
        paintToggle = false;
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
    if (paintToggle && tool === 'eraser') {
      event.target.style.backgroundColor = '';
      event.target.style.opacity = 1.0;
    }

    if (paintToggle && tool === 'paint') {
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

    return gridUnit;
  }

  function manageGridUnitEventListeners() {
    const gridUnits = getGridUnits();

    gridUnits.forEach(unit =>
      EVENTS.forEach(event => {
        hasGridEventListeners
          ? unit.removeEventListener(event.name, event.handler)
          : unit.addEventListener(event.name, event.handler);
      })
    );

    hasGridEventListeners = !hasGridEventListeners;
  }

  function gridUnitStyle() {
    return {
      width: `calc(100% / ${gridDensity})`,
      height: `calc(100% / ${gridDensity})`,
    }
  }

  function clearGrid() {
    manageGridUnitEventListeners();
    gridContainer.innerHTML = '';
  }

  function displayCleanGrid() {
    const numOfUnitsInSquare = gridDensity * gridDensity;
    const gridArray = Array(numOfUnitsInSquare).fill().map(() => createGridUnit());

    gridArray.forEach(unit => gridContainer.append(unit));
    manageGridUnitEventListeners();
  }

  function updateSelectedButton(event) {
    const classes = Array.from(event.target.classList);
    let buttons = [];

    switch (true) {
      case classes.includes('grid-density-ctrl'):
        buttons = gridDensityButtons;
        break;
      case classes.includes('color-mode-ctrl'):
        buttons = colorModeButtons;
        break;
      case classes.includes('tool-ctrl'):
        buttons = toolButtons;
        break;
    }

    buttons.forEach(button => button.classList.remove('selected'));
    event.target.classList.add('selected');
  }

  function updateGridDensity(event) {
    updateSelectedButton(event);
    gridDensity = event.target.value;

    clearGrid();
    displayCleanGrid();
  }

  function updateColorMode(event) {
    updateSelectedButton(event);
    colorMode = event.target.value;
  }

  function updateTool(event) {
    updateSelectedButton(event);
    tool = event.target.value;
  }

  function applyControlsEventListeners() {
    gridDensityButtons.forEach(button => button.addEventListener('click', updateGridDensity));
    colorModeButtons.forEach(button => button.addEventListener('click', updateColorMode));
    toolButtons.forEach(button => button.addEventListener('click', updateTool));
    clearButton.addEventListener('click', () => {
      clearGrid();
      displayCleanGrid();
    });
  }

  /* Main program */
  displayCleanGrid();
  applyControlsEventListeners();
}())