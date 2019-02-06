// Set up our chart
// ================================
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper,
// append an SVG group that will hold our chart,
// =================================
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import data from the data.csv file
// =================================
d3.csv("/assets/data/data.csv").then(function(stateData) {
// Format the data
    stateData.forEach(function(data) {
        data.proverty = +data.proverty;
        data.healthcare = +data.healthcare;
  });

// Create scaling functions   
    var xLinearScale = d3.scaleLinear()
        .domain([5, d3.max(stateData, d => d.proverty)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(stateData, d => d.healthcare)])
        .range([height, 0]);

// Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale1);  

// Add axis
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    var circlesGroup = chartGroup.selectAll("circle")
        .data(stateData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.proverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "10")
        .attr("fill", "lightblue")
        .attr("opacity", ".5")
        .attr("stroke", "black");    

    var circlesLabel = chartGroup.selectAll(".fill-text")
        .data(stateData)
        .enter()
        .append("text")
        .text(d => d.attr)
        .attr("x", d => xLinearScale(d.proverty)-8)
        .attr("y", d => yLinearScale(d.healthcare)+2)
        .attr("font-size", "8px")
        .attr("font-family", "sans-serif")
        .attr("fill", "black")
        .classed("fill-text", true);  

    var labelGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2.5}. ${height + 30})`);

    var healthcareLabel = labelGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 200)
        .attr("y", -600)
        .style("text-anchor", "middle")
        .attr("value", "healthcare")
        .classed("active", true)
        .text("Lacks Healthcare (%)");    

    var provertyLabel = labelGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "proverty")
        .attr("value", "healthcare")
        .classed("active", true)
        .text("Popluation In Poverty (%)");     

// Initalize Tooltip
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
            return (`${d.state}<br>Population In Poverty (%): ${d.poverty}<br>Lacks Healthcare (%): ${d.healthcare}`)
        });      

// tooltip in the chart
    chartGroup.call(toolTip);   
    
// Add an onmouseover event to display a tooltip   
    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
    })

    // Add an on mouseout    
    .on("mouseout", function(data, index) {
        toolTip.hide(data);
    });

    
});