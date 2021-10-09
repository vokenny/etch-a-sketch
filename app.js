(function () {
  'use strict';

  const gridContainer = document.querySelector('#grid');

  let gridSize = 16;

  function gridUnitStyle() {
    return {
      width: `calc(100% / ${gridSize})`,
      height: `calc(100% / ${gridSize})`,
    }
  }

  function fillUnit(event) {
    event.target.style.borderColor = '#9e9d9e';
    event.target.style.backgroundColor = '#9e9d9e';
  }

  function createGridUnit() {
    const gridUnit = document.createElement('div');
    const styling = gridUnitStyle();

    Object.entries(styling).forEach(([key, value]) => {
      gridUnit.style[key] = value;
    });

    gridUnit.classList.add('grid-unit');
    gridUnit.addEventListener('mouseover', fillUnit, { once: true });

    return gridUnit;
  }

  function displayCleanGrid() {
    const numOfUnitsInSquare = gridSize * gridSize;
    const gridArray = Array(numOfUnitsInSquare).fill().map(() => createGridUnit());

    gridArray.forEach(unit => gridContainer.append(unit));
  }

  displayCleanGrid();
}())