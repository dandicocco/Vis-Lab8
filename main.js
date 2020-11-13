

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
    }))
    .range([0, w]);

    const yScale = d3.scaleLinear()
    .domain(d3.extent(data, function(d) {
        return d.gas;
    })).nice()
    .range([h, 0]);  //reversed because of SVG

    const xAxis = d3.axisBottom()
                    .scale(xScale)

    const yAxis = d3.axisLeft()
                    .scale(yScale)
                    .tickFormat(d3.format("($.2f"))

                    
    // Draw the axes
    svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", `translate(0, ${h})`)
        .call(xAxis);

    svg.append("g")
        .attr("class", "axis y-axis")
 //       .attr("transform", `translate(0, ${h+margin.top/2})`)
        .call(yAxis);

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
            .attr("stroke-width", 0.5)
            .attr("stroke", "black")
            .attr("fill", "white")

    const labels = svg.selectAll('.textLabels')
                        .data(data);

    labels.enter()
            .append("text")
            .attr('x', function(d){
                return xScale(d.miles);
            })
            .attr('y', function(d){
                return yScale(d.gas)-4;
            })

                    

})

