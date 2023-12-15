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
  const rotatedCycles = rotateByCycles(platform, 1000000000);
  const part2 = getLoadSum(rotatedCycles);
  console.timeEnd(timeString2);

  console.timeEnd(timeStringDay14);
  showAnswers(DAY14, part1, part2);
});

const buildPlatform = input => {
  return input.map(line => line.split(''));
};

const movePlatform = (platform, direction) => {
  const shouldTranspose = direction === 'north' || direction === 'south';
  let adjustedPlatform = shouldTranspose ? transpose(platform) : deepCopy2DArray(platform);
  if (direction === 'south' || direction === 'east') {
    adjustedPlatform = adjustedPlatform.map(row => row.reverse());
  }

  adjustedPlatform = adjustedPlatform.reduce((acc, curr) => {
    let i = 0;
    while (i<curr.length) {
      if (curr[i] === 'O' && curr[i - 1] === '.') {
        curr[i] = '.';
        curr[i - 1] = 'O';
        i = i - 1;
      } else {
        i++;
      }
    }
    acc.push(curr);
    return acc;
  }, []);

  if (direction === 'south' || direction === 'east') {
    adjustedPlatform = adjustedPlatform.map(row => row.reverse());
  }
  return shouldTranspose ? transpose(adjustedPlatform) : adjustedPlatform;
};

const getRowLoad = (row, score) => {
  return score * row.reduce((acc, curr) => curr === 'O' ? ++acc : acc, 0);
};

const getLoadSum = platform => {
  const length = platform.length;
  return platform.reduce((acc, curr, index) => acc += getRowLoad(curr, length - index), 0);
};

const getByValue = (map, searchValue) => {
  for (let [key, value] of map.entries()) {
    if (JSON.stringify(value) === JSON.stringify(searchValue)) {
      return key;
    }
  }
};

const rotateByCycles = (platform, cycles = 1) => {
  const directions = ['north', 'west', 'south', 'east'];
  let rotatedPlatform = platform;
  let cache = new Map();
  let loopCycle, repeatOffset;

  for (let i=1; i<=cycles; i++) {
    const cycledPlatform = directions.reduce((acc, curr) => {
      rotatedPlatform = movePlatform(rotatedPlatform, curr);
      acc.push(rotatedPlatform);
      return acc;
    }, []);

    const cacheKey = getByValue(cache, cycledPlatform);
    if (cacheKey !== undefined) {
      loopCycle = cacheKey;
      repeatOffset = i - loopCycle;
      break;
    } else {
      cache.set(i, cycledPlatform);
    }
  }

  const cacheCycle = ((cycles - loopCycle) % repeatOffset) + loopCycle;
  let platformsAtCycle = cache.get(cacheCycle);
  if (platformsAtCycle?.length === 4) {
    return platformsAtCycle[3];
  }

  return rotatedPlatform;
};
