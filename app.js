(function () {
  'use strict';

  const gridContainer = document.querySelector('#grid');

  let gridSize = 16;
  let mouseDown = false;

  function toggleMouseDown(event) {
    mouseDown = event.type === 'mousedown';
  }

  function fillUnit(event) {
    if (mouseDown) {
      event.target.style.backgroundColor = '#9e9d9e';
      event.target.removeEventListener('mousedown', fillUnit);
      event.target.removeEventListener('mouseover', fillUnit);
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
    unit.addEventListener('dragend', toggleMouseDown);
    unit.addEventListener('mouseup', toggleMouseDown);
    unit.addEventListener('mousedown', toggleMouseDown);
    unit.addEventListener('mousedown', fillUnit);
    unit.addEventListener('mouseover', fillUnit);
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