const DAY11 = 11;
parseData(DAY11, (input) => {
  const timeStringData1 = `Day ${DAY11}, Part 1 Data Setup Execution Time`;
  console.time(timeStringData1);
  const universe = getExpandedUniverse(input, 2);
  console.log(universe);
  const galaxies = getGalaxies(universe);
  console.timeEnd(timeStringData1);

  const timeString1 = `Day ${DAY11}, Part 1 Execution Time`;
  console.time(timeString1);
  const distances = getGalaxyDistances(galaxies);
  const part1 = getSumOfGalaxyDistances(distances);
  console.timeEnd(timeString1);

  const timeString2 = `Day ${DAY11}, Part 2 Execution Time`;
  console.time(timeString2);
  const part2 = '';
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

const getPathLength = (a, b) => {
  return Math.abs(b.row - a.row) + Math.abs(b.column - a.column);
};

const getGalaxyDistances = (galaxies, distances = []) => {
  if (galaxies.length === 1) {
    return distances;
  }
  for (let i=1; i<galaxies.length; i++) {
    distances.push(getPathLength(galaxies[0], galaxies[i]));
  }
  return (getGalaxyDistances(galaxies.slice(1), distances));
};

const getSumOfGalaxyDistances = distances => {
  return distances.reduce((acc, curr) => acc += curr, 0);
}
