(function () {
  'use strict';

  const gridContainer = document.querySelector('#grid');

  let gridSize = 16;
  let mouseDown = false;

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
    if (mouseDown) {
      event.target.style.backgroundColor = '#9e9d9e';

      event.target.removeEventListener('mousedown', fillUnit);
      event.target.removeEventListener('mouseover', fillUnit);
      event.target.removeEventListener('touchstart', fillUnit);
      event.target.removeEventListener('touchmove', fillUnit);
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
    unit.addEventListener('dragend', toggleMouseDownOrTouch);
    unit.addEventListener('mouseup', toggleMouseDownOrTouch);
    unit.addEventListener('mousedown', toggleMouseDownOrTouch);
    unit.addEventListener('mousedown', fillUnit);
    unit.addEventListener('mouseover', fillUnit);

    // touch events
    unit.addEventListener('touchstart', toggleMouseDownOrTouch);
    unit.addEventListener('touchmove', toggleMouseDownOrTouch);
    unit.addEventListener('touchend', toggleMouseDownOrTouch);
    unit.addEventListener('touchstart', fillUnit);
    unit.addEventListener('touchmove', fillUnit);
  }

  function gridUnitStyle() {
    return {
      width: `calc(100% / ${gridSize})`,
      height: `calc(100% / ${gridSize})`,
    }
  }

  function displayCleanGrid() {
    const numOfUnitsInSquare = gridSize * gridSize;
    const gridArray = Array(numOfUnitsInSquare).fill().map(() => createGridUnit());

    gridArray.forEach(unit => gridContainer.append(unit));
  }

  displayCleanGrid();
}())