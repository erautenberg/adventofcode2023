const DAY11 = 11;
parseData(DAY11, (input) => {
  const timeStringDay11 = `Day ${DAY11}, Total Execution Time`;
  console.time(timeStringDay11);

  const timeStringData1 = `Day ${DAY11}, Part 1 Data Setup Execution Time`;
  console.time(timeStringData1);
  const { galaxies, emptyRows, emptyColumns } = parseUniverse(input);
  console.timeEnd(timeStringData1);

  const timeString1 = `Day ${DAY11}, Part 1 Execution Time`;
  console.time(timeString1);
  const part1 = getSumOfGalaxyDistances(0, galaxies, emptyRows, emptyColumns, 2);
  console.timeEnd(timeString1);

  const timeString2 = `Day ${DAY11}, Part 2 Execution Time`;
  console.time(timeString2);
  const part2 = getSumOfGalaxyDistances(0, galaxies, emptyRows, emptyColumns, 1000000);
  console.timeEnd(timeString2);

  console.timeEnd(timeStringDay11);
  showAnswers(DAY11, part1, part2);
});

const parseUniverse = (grid) => {
  let count = 0;

  const formattedGrid = grid.reduce((acc, curr, rowIndex) => {
    const row = curr.split('').map((column, columnIndex) => {
      if (column === '#') {
        const galaxyNumber = ++count;
        acc.galaxies.push({ number: galaxyNumber, row: rowIndex, column: columnIndex });
        return galaxyNumber;
      }
      return column;
    });
    if (row.every(c => c === '.')) {
      acc.emptyRows.push(rowIndex);
    }
    acc.universe.push(row);
    return acc;
  }, { universe: [], galaxies: [], emptyRows: [] });

  const emptyColumns = invertRowsAndColumns(formattedGrid.universe).reduce(
    (acc, curr, columnIndex) => {
      if (curr.every(c => c === '.')) {
        acc.push(columnIndex);
      }
      return acc;
    }, []);
  return { ...formattedGrid, emptyColumns };
};

const invertRowsAndColumns = grid => {
  return grid.reduce((acc, row) =>
    row.map((column, columnIndex) => (acc[columnIndex] || []).concat(row[columnIndex]))
  , []);
};

const getPathLength = (a, b, emptyRows = [], emptyColumns = [], offset = 1) => {
  const emptyRowsCrossed = emptyRows.reduce((acc, curr) =>
    (a.row < curr && b.row > curr) || (a.row > curr && b.row < curr) ? ++acc : acc
  , 0);
  const emptyColumnsCrossed = emptyColumns.reduce((acc, curr) =>
    (a.column < curr && b.column > curr) || (a.column > curr && b.column < curr) ? ++acc : acc
  , 0);

  const rowOffset = emptyRowsCrossed * (offset - 1);
  const columnOffset = emptyColumnsCrossed * (offset - 1);

  return Math.abs(b.row - a.row) + rowOffset + Math.abs(b.column - a.column) + columnOffset;
};

const getSumOfGalaxyDistances = (sum = 0, galaxies, emptyRows = [], emptyColumns = [], offset = 0) => {
  let tempGalaxies = galaxies;
  for (let i=1; i<tempGalaxies.length; i++) {
    sum += getPathLength(tempGalaxies[0], tempGalaxies[i], emptyRows, emptyColumns, offset);
    if (i === tempGalaxies.length - 1) {
      tempGalaxies = tempGalaxies.slice(1);
      i = 0;
    }
  }

  return sum;
};
