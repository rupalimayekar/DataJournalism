var svgWidth = 800;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 20,
    bottom: 40,
    left: 40
  };
  
  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

// Step 2: Create an SVG wrapper,
// append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
// =================================
var svg = d3.select("#svgcontainer")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);


// Load csv data
d3.csv("data/data.csv", function (error, healthData) {

  if (error) return console.warn(error);

  console.log(healthData);

  //cast the data from the csv as numbers
  healthData.forEach(function (data) {
    data.heartAttack = +data.heartAttack;
    data.medianIncome = +data.medianIncome;
  })

  //Create a scale for your independent (x) coordinates
  // Adding in buffer to the axis domain so that the circles do not overlap
  // the axes or do not get cut.
  var xScale = d3.scaleLinear()
      .domain([0, d3.max(healthData, d => d.medianIncome)+10000])
      .range([0, width])

  //Create a scale for your dependent (y) coordinates
    var yScale = d3.scaleLinear()
      .domain([0, d3.max(healthData, d => d.heartAttack)+1])
      .range([height, 0])
  
  // Step 7: Create the axes
  // =================================
  var bottomAxis = d3.axisBottom(xScale);
  var leftAxis = d3.axisLeft(yScale);

  // Add x-axis
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis)
    svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width+40)
    .attr("y", height + 60)
    .text("Median Income")
   
  // Add y-axis
  chartGroup.append("g")
    .call(leftAxis)
    .append("text")
    svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("x", -20)
    .attr("y", 5)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Had a Heart Attack");
    
    // append circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.medianIncome))
        .attr("cy", d => yScale(d.heartAttack))
        .attr("r", "10")
        .attr("fill", "lightblue")
        .attr("stroke-width", "1")
        .attr("stroke", "black")
    
    var textGroup = chartGroup.selectAll("t")
        .data(healthData)
        .enter()
        .append("text")
        .text(d => d.stateAbbr)
        .attr("x", d => xScale(d.medianIncome)-5)
        .attr("y", d => yScale(d.heartAttack)+4)
        .attr("stroke-width", "1")
        .attr("fill", "black")
        .attr("font-size", 8)


});
