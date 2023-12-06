const DAY3 = 3;
parseData(DAY3, (input) => {
  const timeStringData = `Day ${DAY3}, Data Setup Execution Time`;
  console.time(timeStringData);
  const grid = input.map(line => line.split(''));
  console.timeEnd(timeStringData);

  const timeString1 = `Day ${DAY3}, Part 1 Execution Time`;
  console.time(timeString1);
  const part1 = getPartNumbers(grid).validPartNumbers.reduce((acc, curr) => acc += curr, 0);
  console.timeEnd(timeString1);

  const timeString2 = `Day ${DAY3}, Part 2 Execution Time`;
  console.time(timeString2);
  const part2 = sumGearRatios(getPartNumbers(grid).validPartsNearGears);
  console.timeEnd(timeString2);

  showAnswers(DAY3, part1, part2);
});

const getPartNumbers = grid => {
  const validPartNumbers = [];
  const invalidNumbers = [];
  const validPartsNearGears = [];

  for (let i = 0; i<grid.length; i++) {
    const line = grid[i];
    let currentNumber = '';
    let isValid = false;
    let nearGear = [];

    for (let j=0; j<line.length; j++) {
      const char = line[j];

      if (char.match(/\d/)) {
        currentNumber += char;
        // check if character is defined and not a digit or '.'
        const surroundingChars = getSurroundingChars(grid, i, j);
        if (surroundingChars.some(c => c && c[0] && /[^\d\.]/.test(c[0]))) {
          isValid = true;
        }

        nearGear = [...new Set([
          ...nearGear,
          ...surroundingChars.map(
            c => c && c[0] && /\*/.test(c[0]) && `${c[1]}, ${c[2]}`
          ).filter(Boolean)
        ])];
      }

      // if end of number ('.' or end of line)
      if (!char.match(/\d/) || j === line.length - 1) {
        if (currentNumber && isValid) {
          validPartNumbers.push(parseInt(currentNumber));
          if (nearGear && nearGear.length) {
            nearGear.forEach(gear => {
              let key = gear;
              if (validPartsNearGears[key]) {
                validPartsNearGears[key].push(currentNumber)
              } else {
                validPartsNearGears[key] = [currentNumber];
              }
            });
          }
        } else if (currentNumber) {
          invalidNumbers.push(parseInt(currentNumber));
        }
        currentNumber = '';
        isValid = false;
        nearGear = [];
      }
    }
  }

  return {
    validPartNumbers,
    validPartsNearGears
  };
};

const getSurroundingChars = (grid, i, j) => {
  return [
    getCharInfo(grid, i-1, j-1), // upper left
    getCharInfo(grid, i-1, j), // upper
    getCharInfo(grid, i-1, j+1), // upper right
    getCharInfo(grid, i, j+1), // right
    getCharInfo(grid, i+1, j+1), // lower right
    getCharInfo(grid, i+1, j), // lower
    getCharInfo(grid, i+1, j-1), // lower left
    getCharInfo(grid, i, j-1) // left
  ];
}

const getCharInfo = (grid, i, j) => {
  return [grid[i]?.[j], i, j];
}

const sumGearRatios = gears => {
  return Object.keys(gears).reduce((acc, curr) => {
    const gear = gears[curr];
    if (gear.length === 2) {
      acc += (gear[0] * gear[1]);
    }
    return acc;
  }, 0);
}
