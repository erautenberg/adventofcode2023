const DAY11 = 11;
parseData(DAY11, (input) => {
  const timeStringData1 = `Day ${DAY11}, Part 1 Data Setup Execution Time`;
  console.time(timeStringData1);
  const universe = getExpandedUniverse(input);
  const galaxies = getGalaxies(universe);
  const empties = getEmpties(universe);
  console.timeEnd(timeStringData1);

  const timeString1 = `Day ${DAY11}, Part 1 Execution Time`;
  console.time(timeString1);
  const distancesPart1 = getGalaxyDistances(galaxies, [], empties.rows, empties.columns, 2);
  const part1 = getSumOfGalaxyDistances(distancesPart1);
  console.timeEnd(timeString1);

  const timeString2 = `Day ${DAY11}, Part 2 Execution Time`;
  console.time(timeString2);
  const distancesPart2 = getGalaxyDistances(galaxies, [], empties.rows, empties.columns, 1000000);
  const part2 = getSumOfGalaxyDistances(distancesPart2);
  console.timeEnd(timeString2);

  showAnswers(DAY11, part1, part2);
});

const expandRows = (grid, expansionAmount = 0) => {
  let count = 0;
  return grid.reduce((acc, row) => {
    let parsed = row;
    if (typeof parsed === 'string') {
      parsed = parsed.split('').map(column => column === '#' ? ++count : column);
    }
    acc.push(parsed);
    if (parsed.every(c => c === '.')) {
      for (let i=0; i<expansionAmount - 1; i++) { // remove the +1 from above push
        acc.push(parsed);
      }
    }
    return acc;
  }, []);
};

const getEmptyRows = grid => {
  return grid.reduce((acc, row, rowIndex) => {
    if (row.every(c => c === '.')) {
      acc.push(rowIndex);
    }
    return acc;
  }, []);
};

const getEmpties = grid => {
  return {
    rows: getEmptyRows(grid),
    columns: getEmptyRows(invertRowsAndColumns(grid))
  };
};

const invertRowsAndColumns = grid => {
  return grid.reduce((acc, row) =>
    row.map((column, columnIndex) => (acc[columnIndex] || []).concat(row[columnIndex]))
  , []);
};

const getExpandedUniverse = (input, expansionAmount) => {
  return invertRowsAndColumns(
    expandRows(
      invertRowsAndColumns(
        expandRows(input, expansionAmount)
      ), expansionAmount
    )
  );
};

const getGalaxies = universe => {
  return universe.reduce((acc, row, rowIndex) => {
    row.forEach((column, columnIndex) => {
      if (typeof column === 'number') {
        acc.push({ number: column, row: rowIndex, column: columnIndex });
      }
    });
    return acc
  }, []);
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

const getGalaxyDistances = (galaxies, distances = [], emptyRows = [], emptyColumns = [], offset = 0) => {
  if (galaxies.length === 1) {
    return distances;
  }
  for (let i=1; i<galaxies.length; i++) {
    distances.push(getPathLength(galaxies[0], galaxies[i], emptyRows, emptyColumns, offset));
  }
  return (getGalaxyDistances(galaxies.slice(1), distances, emptyRows, emptyColumns, offset));
};

const getSumOfGalaxyDistances = distances => {
  return distances.reduce((acc, curr) => acc += curr, 0);
}
