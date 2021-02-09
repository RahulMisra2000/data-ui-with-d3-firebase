const data = [
  { name: 'news', parent: '' },
  { name: 'tech', parent: 'news' },
  { name: 'sport', parent: 'news' },
  { name: 'music', parent: 'news' },
  { name: 'ai', parent: 'tech', amount: 7 },
  { name: 'coding', parent: 'tech', amount: 5 },
  { name: 'tablets', parent: 'tech', amount: 4 },
  { name: 'laptops', parent: 'tech', amount: 6 },
  { name: 'd3', parent: 'tech', amount: 3 },
  { name: 'gaming', parent: 'tech', amount: 3 },
  { name: 'football', parent: 'sport', amount: 6 },
  { name: 'hockey', parent: 'sport', amount: 3 },
  { name: 'baseball', parent: 'sport', amount: 5 },
  { name: 'tennis', parent: 'sport', amount: 6 },
  { name: 'f1', parent: 'sport', amount: 1 },
  { name: 'house', parent: 'music', amount: 3 },
  { name: 'rock', parent: 'music', amount: 2 },
  { name: 'punk', parent: 'music', amount: 5 },
  { name: 'jazz', parent: 'music', amount: 2 },
  { name: 'pop', parent: 'music', amount: 3 },
  { name: 'classical', parent: 'music', amount: 5 },
];

// Creates an <svg element in the DOM under an element whose id is canvas
const svg = d3.select('.canvas')
  .append('svg')
  .attr('width', 1060)
  .attr('height', 800);

// Under the <svg element that we just created, create a <g element ....  a group element and just move it over so that it is not snug to the parent (<svg element)
const graph = svg.append('g')
  .attr('transform', 'translate(50, 50)'); // to give a 50px margin

// The we provide the id and the parentId names in our data, and we get a function back
const f1 = d3.stratify()
  .id(d => d.name)
  .parentId(d => d.parent);

// We send our input data to the function. We get back an array of nodes. D3 adds a few additional properties to the nodes
const rootNode = f1(data)
  .sum(d => d.amount);

// This is one type of visualization D3 recommends for hierarchical data
const pack = d3.pack()
  .size([960, 700])
  .padding(5);

// The descendants method adds additional properties to the nodes
const bubbleData = pack(rootNode).descendants();

// create an ordinal scale
const xyz = d3.scaleOrdinal(['#d1c4e9', '#b39ddb', '#9575cd']);

// join data and add group for each node
// Obviously it won't find any <g elements under graph, so, the .enter will kick in and it will append as many <g elements as there are 
// records in bubbleData and return an array of these <g elements
const nodes = graph.selectAll('g')
  .data(bubbleData)
  .enter()
  .append('g')
  .attr('transform', d => `translate(${d.x}, ${d.y})`);
  // returns an array of nodes entered into the DOM (groups)

//console.log(nodes)

// add circle to each group that we created above
nodes.append('circle')
  .attr('r', d => d.r)
  .attr('stroke', 'white')
  .attr('stroke-width', 2)
  .attr('fill', d => xyz(d.depth));

// add text to each group that has no children
nodes.filter(d => !d.children)
  .append('text')
    .attr('text-anchor', 'middle')
    .attr('dy','0.3em')
    .attr('fill', 'white')
    .style('font-size', d => (d.value * 5))
    .text(d => d.data.name);
      
