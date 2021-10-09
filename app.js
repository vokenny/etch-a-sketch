(function () {
  'use strict';

  const gridContainer = document.querySelector('#grid');

  function gridUnitStyle(size) {
    return {
      width: `calc(100% / ${size})`,
      height: `calc(100% / ${size})`,
    }
  }

  function createGridUnit() {
    const gridUnit = document.createElement('div');
    gridUnit.classList.add('grid-unit');

    return gridUnit;
  }

  function displayCleanGrid(size) {
    const numOfUnitsInSquare = size * size;
    const gridArray = Array(numOfUnitsInSquare).fill().map(() => createGridUnit());
    const styling = gridUnitStyle(size);

    gridArray.forEach(unit => {
      Object.entries(styling).forEach(([key, value]) => {
        unit.style[key] = value;
      });

      gridContainer.append(unit)
    });
  }

  displayCleanGrid(16);
}())