const DAY5 = 5;
parseData(DAY5, (input) => {
  const almanac = mapAlmanac(input);
  console.log(almanac);

  const part1 = getLowestLocation(almanac);;
  const part2 = '';
  showAnswers(DAY5, part1, part2);
});

const mapAlmanac = input => {
  let currType;
  return input.reduce((acc, curr) => {
    if (curr.length) {
      const split = curr.split(/\s+|:\s*/gi);
      if (split[0] === 'seeds') {
        const seeds = split.slice(1).map(n => parseInt(n));
        acc['seedsToPlant'] = seeds;
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
  return Math.min(...almanac.seedsToPlant.map(seed => getLocationFromSeed(seed, almanac)));
}

const getLocationFromSeed = (seed, almanac) => {
  let id = seed;
  for (let curr = almanac.seed; curr; curr = almanac[curr.destination]) {
    for (let i=0; i<curr.mappings.length; i++) {
      let [destination, source, range] = curr.mappings[i];
      if (id >= source && id <= source + range) {
        id =  id - source + destination;
        break;
      }
    }
  }
  return id;
}
