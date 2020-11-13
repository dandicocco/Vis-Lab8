

d3.csv('driving.csv', d3.autoType).then(data=>{ 

    //construct svg element
    const margin = ({top: 40, right: 40, bottom: 40, left: 40});

    const w = 650 - margin.left - margin.right,
    h = 500 - margin.top - margin.bottom;

    const svg = d3.select(".chart")
    .append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const xScale = d3.scaleLinear()
    .domain(d3.extent(data, function(d) {
        return d.miles;
    })).nice()
    .range([0, w]);

    const yScale = d3.scaleLinear()
    .domain(d3.extent(data, function(d) {
        return d.gas;
    })).nice()
    .range([h, 0]);  //reversed because of SVG

    const xAxis = d3.axisBottom()
                    .scale(xScale)
                    .ticks(7)

    //draw x axis
    let xAxisGroup = svg.append("g")
                        .call(xAxis)
                        .attr("class", "axis x-axis")
                        .attr("transform", `translate(0,${h})`);

    const yAxis = d3.axisLeft()
                    .scale(yScale)
                    .tickFormat(d3.format("($.2f"))

    //draw y axis
    let yAxisGroup = svg.append("g")
                        .attr("class", "axis y-axis")
                        .call(yAxis)
              
                        
    //connecting the dots & animating, from bostock's example
    //brought up from bottom so it goes under the dots
    line = d3.line()
        .curve(d3.curveCatmullRom)
        .x(d => xScale(d.miles))
        .y(d => yScale(d.gas))

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 2.5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-dasharray", `0,${length(line(data))}`)
        .attr("d", line)
      .transition()
        .duration(5000)
        .ease(d3.easeLinear)
        .attr("stroke-dasharray", `${length(line(data))},${length(line(data))}`);
  
    function length(path) {
            return d3.create("svg:path").attr("d", path).node().getTotalLength();
          }            


    //add circles
    const circles = svg.selectAll('.circles')
                         .data(data);
    
    // Implement the enter-update-exist sequence

    circles.enter()
            .append("circle")
            .attr('cx', function(d){
                return xScale(d.miles);
            })
            .attr('cy', function(d){
                return yScale(d.gas);
            })
            .attr('r', "3px")
            .attr("stroke-width", 1)
            .attr("stroke", "black")
            .attr("fill", "white")

    //add labels
    const labels = svg.selectAll('.textLabels')
                        .data(data);

    labels.enter()
            .append("text")
            .attr('x', function(d){
                return xScale(d.miles);
            })
            .attr('y', function(d){
                return yScale(d.gas);
            })
            .attr("font-family", "sans-serif")
            .attr("font-weight", "500")
            .attr("font-size", 10)
            .attr("opacity", 1)
            .text(d => d.year)
            .each(position)
            .call(halo);


    //remove axes, add grid
    xAxisGroup.call(xAxis)
        .call(g => g.select(".domain").remove())

    xAxisGroup.selectAll(".tick line")
        .clone()
        .attr("y2", -h)
        .attr("stroke-opacity", 0.1) // make it transparent

    xAxisGroup.select(".tick:last-of-type text") //add axis label
        .clone()    
        .attr("x", 35)
        .attr("y", -13)
          .attr("text-anchor", "end")
          .attr("font-weight", "bold")
          .attr("fill", "black")
          .text("Miles per person per year")
          .call(halo)
    
    yAxisGroup.call(yAxis)
        .call(g => g.select(".domain").remove())

    yAxisGroup.selectAll(".tick line")
        .clone()
        .attr("x2", w)
        .attr("stroke-opacity", 0.1)  

    yAxisGroup.selectAll(".tick:last-of-type text") //add axis label
        .clone()
        .attr("x", 4)
          .attr("text-anchor", "start")
          .attr("font-weight", "bold")
          .attr("fill", "black")
          .text("Cost per gallon")
          .call(halo)          


    function position(d) {
        const t = d3.select(this);
        switch (d.side) {
        case "top":
            t.attr("text-anchor", "middle").attr("dy", "-0.7em");
            break;
        case "right":
            t.attr("dx", "0.5em")
            .attr("dy", "0.32em")
            .attr("text-anchor", "start");
            break;
        case "bottom":
            t.attr("text-anchor", "middle").attr("dy", "1.4em");
            break;
        case "left":
            t.attr("dx", "-0.5em")
            .attr("dy", "0.32em")
            .attr("text-anchor", "end");
            break;
        }
    }

    function halo(text) {
    text
        .select(function() {
        return this.parentNode.insertBefore(this.cloneNode(true), this);
        })
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-width", 4)
        .attr("stroke-linejoin", "round");
    }


})

