const DAY15 = 15;
parseData(DAY15, (input) => {
  const timeStringDay15 = `Day ${DAY15}, Total Execution Time`;
  console.time(timeStringDay15);

  const timeStringData1 = `Day ${DAY15}, Part 1 Data Setup Execution Time`;
  console.time(timeStringData1);
  const sequence1 = splitStringsPart1(input[0]);
  console.timeEnd(timeStringData1);

  const timeString1 = `Day ${DAY15}, Part 1 Execution Time`;
  console.time(timeString1);
  const part1 = getSumOfHASHes(sequence1);
  console.timeEnd(timeString1);

  const timeStringData2 = `Day ${DAY15}, Part 2 Data Setup Execution Time`;
  console.time(timeStringData2);
  const sequence2 = splitStringsPart2(input[0]);
  console.timeEnd(timeStringData2);

  const timeString2 = `Day ${DAY15}, Part 2 Execution Time`;
  console.time(timeString2);
  const hashmap = buildHASHMap(sequence2);
  const part2 = getAllFocusingPowers(hashmap);
  console.timeEnd(timeString2);

  console.timeEnd(timeStringDay15);
  showAnswers(DAY15, part1, part2);
});

const splitStringsPart1 = input => {
  return input.split(',');
};

const splitStringsPart2 = input => {
  return input.split(',').map(line => {
    const split = line.split(/-|=/);
    return [split[0], split[1]].filter(Boolean);
  });
};

const applyHashAlgorithm = instruction => {
  return instruction.reduce((acc, curr) => {
    acc += curr.charCodeAt();
    acc *= 17;
    acc %= 256;
    return acc;
  }, 0);
};

const getSumOfHASHes = sequence => {
  return sequence.reduce((acc, curr) => acc += applyHashAlgorithm(curr.split('')), 0);
}

const buildHASHMap = sequence => {
  const labelMap = new Map();
  const boxMap = new Map();

  sequence.forEach(instruction => {
    const label = instruction[0];
    const focalLength = instruction[1];

    let labelHash = labelMap.get(label);
    if (!labelHash) {
      labelHash = applyHashAlgorithm(label.split(''));
      labelMap.set(label, labelHash);
    }

    let box = boxMap.get(labelHash);
    if (focalLength) {
      if (!box) {
        box = new Map();
        boxMap.set(labelHash, box);
      }
      box.set(label, focalLength);
    } else {
      if (box?.get(label)) {
        box.delete(label);
      }
    }
  });

  return boxMap;
};

const getFocusingPowerOfBox = (boxNumber, box) => {
  let position = 1;
  let total = 0;
  box.forEach(focalLength => total += (boxNumber + 1) * position++ * focalLength);
  return total;
};

const getAllFocusingPowers = boxes => {
  let total = 0;
  for (let [boxNumber, box] of boxes) {
    total += getFocusingPowerOfBox(boxNumber, box);
  }
  return total;
};
