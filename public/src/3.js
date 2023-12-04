const DAY3 = 3;
parseData(DAY3, (input) => {
  const grid = input.map(line => line.split(''));
  const part1 = getPartNumbers(grid).reduce((acc, curr) => acc += curr, 0);;
  const part2 = '';

  showAnswers(DAY3, part1, part2);
});

const getPartNumbers = grid => {
  const validPartNumbers = [];
  const invalidNumbers = [];

  for (let i = 0; i<grid.length; i++) {
    const line = grid[i];
    let currentNumber = '';
    let isValid = false;

    for (let j=0; j<line.length; j++) {
      const char = line[j];

      if (char.match(/\d/)) {
        currentNumber += char;
        if (!isValid) {
          // check if character is defined and not a digit or '.'
          if (getSurroundingChars(grid, i, j).some(c => c && /[^\d\.]/.test(c))) {
            isValid = true;
          }
        }
      }
      // if end of number ('.' or end of line)
      if (!char.match(/\d/) || j === line.length - 1) {
        if (currentNumber && isValid) {
          validPartNumbers.push(parseInt(currentNumber));
        } else if (currentNumber) {
          invalidNumbers.push(parseInt(currentNumber));
        }
        currentNumber = '';
        isValid = false;
      }
    }
  }

  return validPartNumbers;
};

const getSurroundingChars = (grid, i, j) => {
  return [
    grid[i-1]?.[j-1], // upper left
    grid[i-1]?.[j], // upper
    grid[i-1]?.[j+1], // upper right
    grid[i]?.[j+1], // right
    grid[i+1]?.[j+1], // lower right
    grid[i+1]?.[j], // lower
    grid[i+1]?.[j-1], // lower left
    grid[i]?.[j-1] // left
  ];
}
