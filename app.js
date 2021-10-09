(function () {
  'use strict';

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

  const gridContainer = document.querySelector('#grid');
  const gridDensityRadios = document.querySelectorAll('#grid-density-ctrls .button');
  const getGridUnits = () => document.querySelectorAll('.grid-unit');

  let gridDensity = 16;
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

  function fillUnit(event) {
    if (mouseDown) event.target.style.backgroundColor = '#9e9d9e';
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
    removeGridUnitEventListeners();
    gridContainer.innerHTML = '';
  }

  function displayCleanGrid() {
    clearGrid();

    const numOfUnitsInSquare = gridDensity * gridDensity;
    const gridArray = Array(numOfUnitsInSquare).fill().map(() => createGridUnit());

    gridArray.forEach(unit => gridContainer.append(unit));
  }

  function updateGridDensity(event) {
    gridDensity = event.target.value;
    displayCleanGrid();
  }

  function applyControlsEventListeners() {
    gridDensityRadios.forEach(radio => radio.addEventListener('click', updateGridDensity));
  }

  /* Main program */

  displayCleanGrid();
  applyControlsEventListeners();

}())