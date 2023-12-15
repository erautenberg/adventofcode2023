const DAY14 = 14;
parseData(DAY14, (input) => {
  const timeStringDay14 = `Day ${DAY14}, Total Execution Time`;
  console.time(timeStringDay14);

  const timeStringData1 = `Day ${DAY14}, Data Setup Execution Time`;
  console.time(timeStringData1);
  const platform = buildPlatform(input);
  console.timeEnd(timeStringData1);

  const timeString1 = `Day ${DAY14}, Part 1 Execution Time`;
  console.time(timeString1);
  const platformNorth = movePlatform(platform, 'north');
  const part1 = getLoadSum(platformNorth);
  console.timeEnd(timeString1);

  const timeString2 = `Day ${DAY14}, Part 2 Execution Time`;
  console.time(timeString2);
  const part2 = '';
  console.timeEnd(timeString2);

  console.timeEnd(timeStringDay14);
  showAnswers(DAY14, part1, part2);
});

const buildPlatform = input => {
  return input.map(line => line.split(''));
};

const movePlatform = (platform, direction) => {
  const shouldTranspose = direction === 'north' || direction === 'south';
  const offset = direction === 'north' || direction === 'west' ? -1 : 1;
  let adjustedPlatform = shouldTranspose ? transpose(platform) : platform;

  adjustedPlatform = adjustedPlatform.reduce((acc, curr) => {
    let i = 0;
    while (i<curr.length) {
      if (curr[i] === 'O' && curr[i + offset] === '.') {
        curr[i] = '.';
        curr[i + offset] = 'O';
        i = i + offset;
      } else {
        i++;
      }
    }
    acc.push(curr);
    return acc;
  }, []);

  return shouldTranspose ? transpose(adjustedPlatform) : adjustedPlatform;
};

const getRowLoad = (row, score) => {
  return score * row.reduce((acc, curr) => curr === 'O' ? ++acc : acc, 0);
};

const getLoadSum = platform => {
  const length = platform.length;
  return platform.reduce((acc, curr, index) => acc += getRowLoad(curr, length - index), 0);
};
