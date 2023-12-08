const DAY8 = 8;
parseData(DAY8, (input) => {
  const timeStringData1 = `Day ${DAY8}, Part 1 Data Setup Execution Time`;
  console.time(timeStringData1);
  const network = buildNetwork(input);
  console.timeEnd(timeStringData1);

  const timeString1 = `Day ${DAY8}, Part 1 Execution Time`;
  console.time(timeString1);
  const part1 = findSteps(network, 'AAA', 'ZZZ');
  console.timeEnd(timeString1);

  const timeString2 = `Day ${DAY8}, Part 2 Execution Time`;
  console.time(timeString2);
  const part2 = '';
  console.timeEnd(timeString2);

  showAnswers(DAY8, part1, part2);
});

const instructionNums = {
  'L': 0,
  'R': 1
};

const buildNetwork = input => {
  return input.reduce((acc, curr, index) => {
    if (index === 0) {
      acc.instructions = curr.split('').map(d => instructionNums[d]);
    } else {
      const node = curr.match(/(\w{3})/gi);
      if (node && node.length === 3) {
        acc.nodes[node[0]] = [node[1], node[2]];
      }
    }
    return acc;
  }, { nodes: {} });
};

const findSteps = ({ instructions, nodes }, start, end) => {
  let count = 0;
  let currNode = start;
  for (let i=0; i < instructions.length && currNode !== end; i++) {
    count++;
    currNode = nodes[currNode][instructions[i]];
    if (i === instructions.length - 1) {
      i = -1;
    }
  }
  return count;
};
