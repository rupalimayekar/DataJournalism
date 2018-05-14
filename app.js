/*******************************************************************
 * This javascript file plots the interractive graphs for the census and health
 * data for this project using D3.js
 ******************************************************************/

 // set the svg size
var svgWidth = 800;
var svgHeight = 500;

// set the margins
var margin = {
    top: 40,
    right: 20,
    bottom: 90,
    left: 90
  };
  
  // calculate the plot area dimensions
  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

  //Scales for the axes
  var xScale = null;
  var yScale = null;

// Create an SVG wrapper,
// append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
// =================================
var svg = d3.select("#svgcontainer")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

function createXAxis(healthData, xValue){
    console.log("Recreating X Axis");

    // remove existing x-axis
    d3.select("#xAxis")
        .remove();
    
    switch (xValue) {
        case "medianIncome":
            console.log("medianIncome");
             xScale = d3.scaleLinear()
                .domain([0, d3.max(healthData, d => d.medianIncome)+10000])
                .range([0, width]);
                break;
        case "noHighSchoolGrad":
            console.log("noHighSchoolGrad");
            xScale = d3.scaleLinear()
                .domain([0, d3.max(healthData, d => d.noHighSchoolGrad)])
                .range([0, width]);
            break;
        case "povertyAbove200":
            console.log("povertyAbove200");
            xScale = d3.scaleLinear()
                .domain([0, d3.max(healthData, d => d.povertyAbove200)])
                .range([0, width]);
            break;
    }

    // Create the axes
    var bottomAxis = d3.axisBottom(xScale);

    // Add x-axis
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .attr("id", "xAxis")
        .call(bottomAxis)

};

function createYAxis(healthData, yValue){
    console.log("Recreating Y Axis");

    // remove existing y-axis
    d3.select("#yAxis")
    .remove();

    //Create a scale for your dependent (y) coordinates
    switch (yValue) {
        case "heartAttack":
            console.log("heartAttack");
            yScale = d3.scaleLinear()
                .domain([0, d3.max(healthData, d => d.heartAttack)+1])
                .range([height, 0])
            break;
        case "hasCancer":
            console.log("hasCancer");
            yScale = d3.scaleLinear()
                .domain([0, d3.max(healthData, d => d.hasCancer)+1])
                .range([height, 0])
            break;
        case "hasDiabetes":
            console.log("hasDiabetes");
            yScale = d3.scaleLinear()
                .domain([0, d3.max(healthData, d => d.hasDiabetes)+1])
                .range([height, 0])
            break;
    }

    var leftAxis = d3.axisLeft(yScale);

    // Add y-axis
    chartGroup.append("g")
        .call(leftAxis)
        .attr("id", "yAxis");

};

function transitionCircles(axis, dataColumn) {
    var circles = chartGroup.selectAll("circle");
    var texts = chartGroup.selectAll("#circleText");


    if (axis == "x") {  // transition the cx vaalues
        if (dataColumn == "medianIncome") {
            circles.transition().duration(1000).attr("cx", d => xScale(d.medianIncome));
            texts.transition().duration(1000).attr("x", d => xScale(d.medianIncome)-5);

        } else if (dataColumn == "noHighSchoolGrad") {
            circles.transition().duration(1000).attr("cx", d => xScale(d.noHighSchoolGrad));
            texts.transition().duration(1000).attr("x", d => xScale(d.noHighSchoolGrad)-5);

        }else {
            circles.transition().duration(1000).attr("cx", d => xScale(d.povertyAbove200));
            texts.transition().duration(1000).attr("x", d => xScale(d.povertyAbove200)-5);
            }
    } else {    // transition the cy values
        if (dataColumn == "heartAttack") {
            circles.transition().duration(1000).attr("cy", d => yScale(d.heartAttack));
            texts.transition().duration(1000).attr("y", d => yScale(d.heartAttack)+4);
        } else if (dataColumn == "hasCancer") {
            circles.transition().duration(1000).attr("cy", d => yScale(d.hasCancer));
            texts.transition().duration(1000).attr("y", d => yScale(d.hasCancer)+4);
        }else {
            circles.transition().duration(1000).attr("cy", d => yScale(d.hasDiabetes));
            texts.transition().duration(1000).attr("y", d => yScale(d.hasDiabetes)+4);
        }
    }
};

function addChartTitle() {
    d3.select("#chartTitle").remove();

    var activeLabels = d3.selectAll(".labelbold");
    console.log(activeLabels);
    var titleText = activeLabels._groups[0][0].textContent + " vs " + activeLabels._groups[0][1].textContent;
    console.log(titleText);

    svg.append("text")
        .attr("id", "chartTitle")
        .attr("x", (svgWidth / 2))             
        .attr("y", (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "20px") 
        .style("text-decoration", "underline")  
        .text(titleText);

}

// Load csv data and draw the chart
d3.csv("data/data.csv", function (error, healthData) {

    if (error) return console.warn(error);

    console.log(healthData);

    //cast the data from the csv as numbers
    healthData.forEach(function (data) {
        data.medianIncome = +data.medianIncome;
        data.noHighSchoolGrad = + data.noHighSchoolGrad;
        data.povertyAbove200 = + data.povertyAbove200;

        data.heartAttack = +data.heartAttack;
        data.hasCancer = +data.hasCancer;
        data.hasDiabetes = +data.hasDiabetes;
    })

    createXAxis(healthData, "medianIncome");

    // Add x-axis label for Median Income
    svg.append("text")
        .attr("class", "x label")
        .attr("id", "medianIncome")
        .attr("text-anchor", "middle")
        .attr("x", svgWidth/2)
        .attr("y", height + 80)
        .text("Median Household Income")
        .classed("labelbold", true)
        .on("click", function(){
            // if this label is already bold then don't do anything
            if (d3.select(this).classed("labelbold")) {
                // ignore this click
                console.log("Ignoring medianIncome click as it is already active");
            } else {
                //redraw x axis
                createXAxis(healthData, "medianIncome");

                d3.select(this).classed("labelbold", true);
                d3.select("#noHighSchoolGrad").classed("labelbold", false);
                d3.select("#povertyAbove200").classed("labelbold", false);

                transitionCircles("x", "medianIncome");
                addChartTitle();
            }
        })
        .on("mouseover", function() {
            d3.select(this).style("cursor", "pointer"); 
        })
        .on("mouseout", function() {
            d3.select(this).style("cursor", "default"); 
        });
   
    // Add x-axis label for No High School Graduation
    svg.append("text")
        .attr("class", "x label")
        .attr("id", "noHighSchoolGrad")
        .attr("text-anchor", "middle")
        .attr("x", svgWidth/2)
        .attr("y", height + 100)
        .text("No High School Graduation (%)")
        .on("click", function(){
            // if this label is already bold then don't do anything
            if (d3.select(this).classed("labelbold")) {
                // ignore this click
                console.log("Ignoring noHighSchoolGradLabel click as it is already active");
            } else {
                //redraw x axis
                createXAxis(healthData, "noHighSchoolGrad");
                
                d3.select(this).classed("labelbold", true);
                d3.select("#medianIncome").classed("labelbold", false);
                d3.select("#povertyAbove200").classed("labelbold", false);

                transitionCircles("x", "noHighSchoolGrad");
                addChartTitle();
            }
        });

   
    // Add x-axis label for 200% Above Poverty
    svg.append("text")
        .attr("class", "x label")
        .attr("id", "povertyAbove200")
        .attr("text-anchor", "middle")
        .attr("x", svgWidth/2)
        .attr("y", height + 120)
        .text("Above Poverty Line (%)")
        .on("click", function(){
            // if this label is already bold then don't do anything
            if (d3.select(this).classed("labelbold")) {
                // ignore this click
                console.log("Ignoring povertyAbove200Label click as it is already active");
            } else {
                //redraw x axis
                createXAxis(healthData, "povertyAbove200");
                
                d3.select(this).classed("labelbold", true);
                d3.select("#medianIncome").classed("labelbold", false);
                d3.select("#noHighSchoolGrad").classed("labelbold", false);

                transitionCircles("x", "povertyAbove200");
                addChartTitle();
            }
        });

    createYAxis(healthData, "heartAttack");

    // Add y-axis label for Heart Attack
    svg.append("text")
        .attr("class", "y label")
        .attr("id", "heartAttack")
        .attr("text-anchor", "middle")
        .attr("x", -svgHeight/2)
        .attr("y", 5)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Had Heart Attack (%)")
        .classed("labelbold", true)
        .on("click", function(){
            // if this label is already bold then don't do anything
            if (d3.select(this).classed("labelbold")) {
                // ignore this click
                console.log("Ignoring heartAttackLabel click as it is already active");
            } else {
                //redraw x axis
                createYAxis(healthData, "heartAttack");
                
                d3.select(this).classed("labelbold", true);
                d3.select("#hasCancer").classed("labelbold", false);
                d3.select("#hasDiabetes").classed("labelbold", false);

                transitionCircles("y", "heartAttack");
                addChartTitle();
            }
        });
    
    // Add y-axis label for Has Cancer
    svg.append("text")
        .attr("class", "y label")
        .attr("id", "hasCancer")
        .attr("text-anchor", "middle")
        .attr("x", -svgHeight/2)
        .attr("y", 25)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Had Cancer (%)")
        .on("click", function(){
            // if this label is already bold then don't do anything
            if (d3.select(this).classed("labelbold")) {
                // ignore this click
                console.log("Ignoring hasCancer click as it is already active");
            } else {
                //redraw x axis
                createYAxis(healthData, "hasCancer");
                
                d3.select(this).classed("labelbold", true);
                d3.select("#heartAttack").classed("labelbold", false);
                d3.select("#hasDiabetes").classed("labelbold", false);

                transitionCircles("y", "hasCancer");
                addChartTitle();
            }
        });

    // Add y-axis label for College Plus Education
    svg.append("text")
        .attr("class", "y label")
        .attr("id", "hasDiabetes")
        .attr("text-anchor", "middle")
        .attr("x", -svgHeight/2)
        .attr("y", 45)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Had Diabetes (%)")
        .on("click", function(){
            // if this label is already bold then don't do anything
            if (d3.select(this).classed("labelbold")) {
                // ignore this click
                console.log("Ignoring hasDiabetes click as it is already active");
            } else {
                //redraw x axis
                createYAxis(healthData, "hasDiabetes");
                
                d3.select(this).classed("labelbold", true);
                d3.select("#heartAttack").classed("labelbold", false);
                d3.select("#hasCancer").classed("labelbold", false);

                transitionCircles("y", "hasDiabetes");
                addChartTitle();
            }
        });
    
    // Change the mousepointer when hovered over any of the labels to indicate that they
    // are clickable
    d3.selectAll(".label")
    .on("mouseover", function() {
        d3.select(this).style("cursor", "pointer"); 
    })
    .on("mouseout", function() {
        d3.select(this).style("cursor", "default"); 
    });

    // append circles - one for each data point
    var circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.medianIncome))
        .attr("cy", d => yScale(d.heartAttack))
        .attr("r", "10")
        .attr("fill", "lightblue")
        .attr("stroke-width", "1")
        .attr("stroke", "black");
    
    // add the text on top of the circles
    var textGroup = chartGroup.selectAll("#circleText")
        .data(healthData)
        .enter()
        .append("text")
        .text(d => d.stateAbbr)
        .attr("id", "circleText")
        .attr("x", d => xScale(d.medianIncome)-5)
        .attr("y", d => yScale(d.heartAttack)+4)
        .attr("stroke-width", "1")
        .attr("fill", "black")
        .attr("font-size", 8);

    addChartTitle();


    // Initialize Tooltip
    var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-10, 0])
    .html(function(d){
        var activeLabels = d3.selectAll(".labelbold");
        var labelx = activeLabels._groups[0][0].id;
        var labely = activeLabels._groups[0][1].id;
        
        var xValue = null;
        var yValue = null;

        switch(labelx) {
            case "medianIncome":
                xValue = d.medianIncome;
                break;        
            case "noHighSchoolGrad":
                xValue = d.noHighSchoolGrad;
                break;
            default:
                xValue = d.povertyAbove200;
                break;
        }
        
        switch(labely) {
            case "heartAttack":
                yValue = d.heartAttack;
                break;        
            case "hasCancer":
                yValue = d.hasCancer;
                break;
            default:
                yValue = d.hasDiabetes;
                break;
        }

        var tipText = `<strong>State:</strong> <span style='color:lightblue'>${d.state}</span><br>
            <strong>${labelx}:</strong> <span style='color:lightblue'>${xValue}</span><br>
            <strong>${labely}:</strong> <span style='color:lightblue'>${yValue}</span><br>`

        return tipText;

    });

    chartGroup.call(toolTip);

    // Create "mouseover" event listener to display tooltip
    circlesGroup.on("mouseover", function (d) {
        toolTip.show(d);
    })
    // Create "mouseout" event listener to hide tooltip
    .on("mouseout", function (d) {
        toolTip.hide(d);
    });

  
});

// Add the Chart Analysis description for the chart
var chartAnalysis = d3.select("#chartAnalysis")
    .append("text")
    .html(`<br>The above chart shows our analysis on the current trends that are shaping people's lives. 
    We show some of the health risks that occur in people with certain demographics as listed here.
    We see that higher Median Household Income fewer the percentage of people that have had heart attacks or diabetes. 
    However Median Income does not seem to affect the percent of people having Cancer as much. This might be because of 
    the ability to get good preventive health care and lead a healthier lifestyle with the high incomes.
    <br><br>
    We also see that as the percentage of people with No High School Graduation increases, the percentage of people having
    heart attacks and diabetes also increases but it doesn't really affect Cancer as much. This shows that with more education
    there is more health awareness and also more income leading to better preventive care and lifestyle which again verifies our 
    analysis above.
    <br><br>
    Lastly we also see a similar trend with the percentage of people being 200% above the poverty line. With more percentage of people
    above the poverty line, there is a fewer percentage of people with heart attacks and diabetes, however it does not affect the p
    ercentage of people with cancer as much. This also verifies out analysis above.
    <br><br>
    You can try all the combinations in the above graph and see for yourself how the various demographics parameters affect the 
    health risks. Just click on the axis label to choose your parameter.`);

