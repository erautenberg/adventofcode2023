const DAY5 = 5;
parseData(DAY5, (input) => {
  const timeStringDay5 = `Day ${DAY5}, Total Execution Time`;
  console.time(timeStringDay5);

  const timeStringData = `Day ${DAY5}, Data Setup Execution Time`;
  console.time(timeStringData);
  const almanac = mapAlmanac(input);
  console.timeEnd(timeStringData);

  const timeString1 = `Day ${DAY5}, Part 1 Execution Time`;
  console.time(timeString1);
  const part1 = getLowestLocation(almanac);
  console.timeEnd(timeString1);

  const timeString2 = `Day ${DAY5}, Part 2 Execution Time`;
  console.time(timeString2);
  const part2 = getLowestLocationByRange(almanac);
  console.timeEnd(timeString2);

  console.timeEnd(timeStringDay5);
  showAnswers(DAY5, part1, part2);
});

const mapAlmanac = input => {
  let currType;
  return input.reduce((acc, curr) => {
    if (curr.length) {
      const split = curr.split(/\s+|:\s*/gi);
      if (split[0] === 'seeds') {
        const seeds = split.slice(1).map(n => parseInt(n));
        acc.seeds = seeds;
      } else if (split[1] === 'map') {
        const [source, destination] = split[0].split('-to-');
        currType = source;
        acc[currType] = { destination, mappings: [] };
      } else if (split.length === 3) {
        acc[currType].mappings.push(split.map(n => parseInt(n)));
      }
    }
    return acc;
  }, {});
};

const getLowestLocation = almanac => {
  return Math.min(...almanac.seeds.map(seed => getLocationFromSeed(seed, almanac)));
};

const getLowestLocationByRange = almanac => {
  return Math.min(...getLocationsFromSeedRanges(getSeedRanges(almanac.seeds), almanac).map(range => range[0]));
};

const getSeedRanges = seeds => {
  const seedRanges = [];
  for (let i=0; i<seeds.length; i++) {
    if (i % 2 !== 0) {
      const seedStart = seeds[i - 1];
      const seedEnd = seedStart + seeds[i] - 1;
      seedRanges.push([seedStart, seedEnd]);
    }
  }
  return seedRanges;
}

const getLocationFromSeed = (seed, almanac) => {
  let id = seed;
  for (let curr = almanac.seed; curr; curr = almanac[curr.destination]) {
    for (let i=0; i<curr.mappings.length; i++) {
      const [destination, source, range] = curr.mappings[i];
      if (id >= source && id <= source + range) {
        id =  id - source + destination;
        break;
      }
    }
  }
  return id;
};

const getLocationsFromSeedRanges = (originalSeedRanges, almanac) => {
  const seedRanges = originalSeedRanges.map(arr => arr.slice());
  const locationRanges = [];

  for (let i=0; i<seedRanges.length; i++) {
    const seedRange = seedRanges[i];
    let [ startId, endId ] = seedRange;
    for (let curr = almanac.seed; curr; curr = almanac[curr.destination]) {
      for (let j=0; j<curr.mappings.length; j++) {
        const [destination, source, range] = curr.mappings[j];
        const intersectionStart = Math.max(startId, source);
        const intersectionEnd = Math.min(endId, source + range);
        if (intersectionStart < intersectionEnd) {
          if (intersectionStart > startId) {
            seedRanges.push([startId, intersectionStart]);
          }
          if (endId > intersectionEnd) {
            seedRanges.push([intersectionEnd, endId]);
          }

          startId = intersectionStart - source + destination;
          endId = intersectionEnd - source + destination;
          break;
        }
      }
    }
    locationRanges.push([startId, endId]);
  }

  return locationRanges;
};


