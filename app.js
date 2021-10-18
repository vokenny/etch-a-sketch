(function () {
  'use strict';

  /* CONSTANTS */
  const CLASSIC_GREY = '#c4c4c4';
  const DARKEST_GREY = 'rgb(50, 50, 50)';
  const MIN_OPACITY = 0.1;
  const MAX_OPACITY = 1.0;
  const OPACITY_INC = 0.1;
  const MIN_RGB_VAL = 100;
  const MAX_RGB_VAL = 255;
  const GRID_BORDER_STYLE = '0.5px solid var(--gridBorder)';

  const GRID_EVENTS = [
    { name: 'click', handler: togglePaint },
    { name: 'click', handler: fillUnit },
    { name: 'mouseover', handler: fillUnit },
    { name: 'touchstart', handler: togglePaint },
    { name: 'touchstart', handler: fillUnit },
    { name: 'touchend', handler: togglePaint },
    { name: 'touchmove', handler: fillUnit }
  ]

  /* DOCUMENT SELECTORS */
  const gridContainer = document.querySelector('#grid');
  const gridDensitySlider = document.querySelector('#grid-density-slider');
  const gridDensityOutput = document.querySelector('#grid-density');
  const colorModeButtons = document.querySelectorAll('.color-mode-ctrl');
  const toolButtons = document.querySelectorAll('.tool-ctrl');
  const paintButton = document.querySelector('#paint');
  const clearButton = document.querySelector('#clear');
  const gridButton = document.querySelector('#grid-lines');
  const getGridUnits = () => document.querySelectorAll('.grid-unit');

  /* DEFAULT START CONFIG */
  let gridDensity = 16;
  let colorMode = 'classic';
  let tool = 'paint';
  let paintToggle = false;
  let gridToggle = true;
  let hasGridEventListeners = false;

  function togglePaint(event) {
    switch (event.type) {
      case 'click':
      case 'touchstart':
      case 'touchend':
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
    for (let prop in styling) {
      gridUnit.style[prop] = styling[prop];
    }

    return gridUnit;
  }

  function manageGridUnitEventListeners() {
    const gridUnits = getGridUnits();

    gridUnits.forEach(unit =>
      GRID_EVENTS.forEach(event => {
        hasGridEventListeners
          ? unit.removeEventListener(event.name, event.handler)
          : unit.addEventListener(event.name, event.handler);
      })
    );

    hasGridEventListeners = !hasGridEventListeners;
  }

  function gridUnitStyle() {
    return {
      border: gridToggle ? GRID_BORDER_STYLE : '',
      width: `calc(100% / ${gridDensity})`,
      height: `calc(100% / ${gridDensity})`,
    }
  }

  function setPaintTool() {
    tool = 'paint';

    toolButtons.forEach(button => button.classList.remove('selected'));
    paintButton.classList.add('selected');
  }

  function clearGrid() {
    manageGridUnitEventListeners();
    gridContainer.innerHTML = '';
    setPaintTool();
  }

  function updateGridLines() {
    const units = getGridUnits();

    units.forEach(unit => {
      unit.style.border = gridToggle ? GRID_BORDER_STYLE : '';
    })
  }

  function displayCleanGrid() {
    const numOfUnitsInSquare = gridDensity * gridDensity;
    const gridArray = [...Array(numOfUnitsInSquare)].map(() => createGridUnit());

    gridArray.forEach(unit => gridContainer.append(unit));
    manageGridUnitEventListeners();
  }

  function updateSelectedButton(event) {
    const classes = Array.from(event.target.classList);
    let buttons = [];

    switch (true) {
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
    gridDensity = event.target.value;
    gridDensityOutput.textContent = `${gridDensity} x ${gridDensity}`;

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

  function toggleGrid(event) {
    const classes = Array.from(event.target.classList);

    classes.includes('selected')
      ? event.target.classList.remove('selected')
      : event.target.classList.add('selected');

    gridToggle = !gridToggle;
    updateGridLines();
  }

  function applyControlsEventListeners() {
    toolButtons.forEach(button => button.addEventListener('click', updateTool));
    colorModeButtons.forEach(button => button.addEventListener('click', updateColorMode));
    gridDensitySlider.addEventListener('input', updateGridDensity);
    gridButton.addEventListener('click', toggleGrid);

    clearButton.addEventListener('click', () => {
      clearGrid();
      displayCleanGrid();
    });
  }

  /* Main program */
  displayCleanGrid();
  applyControlsEventListeners();
}())
