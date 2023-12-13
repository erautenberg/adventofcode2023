const DAY12 = 12;
parseData(DAY12, (input) => {
  const timeStringDay12 = `Day ${DAY12}, Total Execution Time`;
  console.time(timeStringDay12);
  const springs = formatSprings(input);
  const timeStringData1 = `Day ${DAY12}, Data Setup Execution Time`;
  console.time(timeStringData1);

  console.timeEnd(timeStringData1);

  const timeString1 = `Day ${DAY12}, Part 1 Execution Time`;
  console.time(timeString1);
  const part1 = getTotalValidCombos(springs);
  console.timeEnd(timeString1);

  const timeString2 = `Day ${DAY12}, Part 2 Execution Time`;
  console.time(timeString2);
  const part2 = getTotalValidCombos(springs, 5, '?');
  console.timeEnd(timeString2);

  console.timeEnd(timeStringDay12);
  showAnswers(DAY12, part1, part2);
});

const formatSprings = input => {
  return input.reduce((acc, curr) => {
    const separated = curr.split(' ');
    const springs = separated[0];
    const damaged = separated[1].split(',').map(n => parseInt(n));
    acc.push([springs, damaged]);
    return acc;
  }, []);
};

const getValidCombosCount = (springs = [], groups = [], cache = new Map()) => {
  // if there are no more springs or groups to check,
  // this has been a valid combination and we can count it
  if (springs.length === 0) {
    return Number(groups.length === 0);
  }

  // if there are still springs left to check, but all groups have been resolved,
  // this is only a valid combination if the remaining springs are not damaged
  if (groups.length === 0) {
    return Number(!springs.includes('#'));
  }

  // create a cache of already found values to prevent repeating the same calculations
  const cacheKey = `${springs}-${groups.join(',')}`;
  const cachedValue = cache.get(cacheKey);
  if (cachedValue !== undefined) {
    return cachedValue;
  }

  let sum = 0;
  const currSpring = springs[0];
  const currGroup = groups[0];

  // if the first spring is not known to be damaged,
  // treat it as an operational spring and check the rest
  if (currSpring !== '#') {
    // check the next set of springs after this first one
    sum += getValidCombosCount(springs.slice(1), groups, cache);
  }

  // if the first spring is not known to be operational
  // (this can be the beginning of a set of damaged springs)
  if (currSpring !== '.' &&
      // and the next spring after this set is operational
      springs[currGroup] !== '#' &&
      // and the remaining springs aren't less than this damage group's expected number of springs
      springs.length >= currGroup &&
      // and no operational springs exist in the next set of springs equal to the damage grouping
      !springs.slice(0, currGroup).includes('.')
    ) {
      // check the next segment of springs starting after this damage group
      sum += getValidCombosCount(springs.slice(groups[0] + 1), groups.slice(1), cache);
  }

  cache.set(cacheKey, sum);
  return sum;
};

const getTotalValidCombos = (springs, repeat = 1, delimiter = '?') => {
  let repeatedSprings = springs;
  if (repeat > 1) {
    repeatedSprings = springs.map(springInfo => {
      let springList = (springInfo[0] + delimiter).repeat(repeat).slice(0, -1);
      let damageList = Array(repeat).fill(springInfo[1]).flat();
      return [springList, damageList];
    });
  }
  return repeatedSprings.reduce((acc, curr) => acc += getValidCombosCount(curr[0], curr[1]), 0);
};
