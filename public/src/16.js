const DAY16 = 16;
parseData(DAY16, (input) => {
  const timeStringDay16 = `Day ${DAY16}, Total Execution Time`;
  console.time(timeStringDay16);

  const timeStringData1 = `Day ${DAY16}, Data Setup Execution Time`;
  console.time(timeStringData1);
  const grid = splitStrings(input);
  const energizedGrid = energize(grid, { x: 0, y: 0 });
  console.timeEnd(timeStringData1);

  const timeString1 = `Day ${DAY16}, Part 1 Execution Time`;
  console.time(timeString1);
  const part1 = getEnergizedCount(energizedGrid);
  console.timeEnd(timeString1);

  const timeString2 = `Day ${DAY16}, Part 2 Execution Time`;
  console.time(timeString2);
  const part2 = '';
  console.timeEnd(timeString2);

  console.timeEnd(timeStringDay16);
  showAnswers(DAY16, part1, part2);
});

const splitStrings = input => {
  return input.map(line => line.split(''));
};

const getUpdatedCoords = (x, y, direction) => {
  switch (direction) {
    case 'up':
      y--;
      break;
    case 'down':
      y++;
      break;
    case 'left':
      x--;
      break;
    case 'right':
      x++;
      break;
  }
  return { x, y };
}

const refractBeamForwardSlash = (direction) => {
  switch (direction) {
    case 'up':
      return 'right';
    case 'down':
      return 'left';
    case 'left':
      return 'down';
    case 'right':
      return 'up';
  }
}

const refractBeamBackSlash = (direction) => {
  switch (direction) {
    case 'up':
      return 'left';
    case 'down':
      return 'right';
    case 'left':
      return 'up';
    case 'right':
      return 'down';
  }
}

const alreadyTraversed = (cache, { x, y }, direction) => {
  const key = `${x},${y},${direction}`;
  return cache.get(key) || (cache.set(key, true) && false);
};

const energize = (grid, { x, y }, direction = 'right', energizedGrid, cache = new Map()) => {
  if (!energizedGrid) {
    energizedGrid = new Array(grid.length).fill(null).map(() => Array(grid[0].length).fill('.'));
  }

  const nextChar = grid[y]?.[x];
  if (!nextChar || alreadyTraversed(cache, { x, y }, direction)) {
    return energizedGrid;
  } else {
    energizedGrid[y][x] = '#';
  }

  let newDirection = direction;

  if (nextChar === '-' && (direction === 'up' || direction === 'down')) {
    energizedGrid = energize(grid, getUpdatedCoords(x, y, 'left'), 'left', energizedGrid, cache);
    newDirection = 'right';
  } else if (nextChar === '|' && (direction === 'left' || direction === 'right')) {
    energizedGrid = energize(grid, getUpdatedCoords(x, y, 'up'), 'up', energizedGrid, cache);
    newDirection = 'down';
  }

  if (nextChar === '/') {
    newDirection = refractBeamForwardSlash(direction);
  } else if (nextChar === '\\') {
    newDirection = refractBeamBackSlash(direction);
  }

  return energize(grid, getUpdatedCoords(x, y, newDirection), newDirection, energizedGrid, cache);
};

const getEnergizedCount = energizedGrid => {
  return energizedGrid.reduce((gridTotal, row) => {
    gridTotal += row.reduce((rowTotal, column) => {
      column === '#' && ++rowTotal;
      return rowTotal;
    }, 0);
    return gridTotal;
  }, 0);
};
