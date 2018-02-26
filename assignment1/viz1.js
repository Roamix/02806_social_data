//data
// Month,Count
// Jan,0
// Feb,0
// Mar,0
// Apr,0
// May,0
// Jun,1
// Jul,7
// Aug,8
// Sep,10
// Oct,5
// Nov,0
// Dec,0

//Width and height


var rowConverter2 = function(d) {
    return {
        Month: d.Month,
        Count: parseInt(d.Count)
    };
};

var w = 600;
var h = 375;
var padding = 35;
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];

var xScale, yScale;
var xaxis, yaxis;

d3.csv('data\\fresh_fruit.csv', rowConverter2, function(ffruit) {
    d3.csv('data\\fresh_vegetable.csv', rowConverter2, function(fvege) {
        d3.csv('data\\storage_fruit.csv', rowConverter2, function(sfruit) {
            d3.csv('data\\storage_vegetable.csv', rowConverter2, function(svege) {

                d3.select("#ffruit_button")
                    .on("click", function() {
                        updateData(ffruit);
                    });

                d3.select("#sfruit_button")
                    .on("click", function() {
                        updateData(sfruit);
                    });

                d3.select("#fvege_button")
                    .on("click", function() {
                        updateData(fvege);
                    });

                d3.select("#svege_button")
                    .on("click", function() {
                        updateData(svege);
                    });


                var dataset = ffruit;

                xScale = d3.scaleBand()
                            .domain(d3.range(dataset.length))
                            .rangeRound([padding, w - padding])
                            .paddingInner(0.05);


                yScale = d3.scaleLinear()
                            .domain([0, d3.max(dataset, function(d) { return d.Count;})])
                            .range([h - padding, padding]);

                xaxis = d3.axisBottom(xScale)
                            .tickFormat(function(d, i) {
                                return months[i];
                            });

                yaxis = d3.axisLeft(yScale);

                //Create SVG element
                var svg = d3.select(".viz1")
                        .append("svg")
                        .attr("width", w)
                        .attr("height", h);
                //Create bars
                svg.selectAll("rect")
                    .data(dataset)
                    .enter()
                    .append("rect")
                    .attr("x", function(d, i) {
                        return xScale(i);
                    })
                    .attr("y", function(d) {
                        return yScale(d.Count);
                    })
                    .attr("width", xScale.bandwidth())
                    .attr("height", function(d) {
                        return h - yScale(d.Count) - padding;
                        // return h - yScale(d.Count) - (padding-15);
                    })
                    .attr('fill', 'navy')
                    // .attr("fill", function(d) {
                    //     return "rgb(0, 0, " + Math.round(d.Count * 10) + ")";
                    // })
                    .on("mouseover", function() {
                        d3.select(this)
                            .attr("fill", "orange");
                    })
                    .on("mouseout", function(d) {
                       d3.select(this)
                            .transition()
                            .duration(250)
                            .attr('fill', "navy");
                            // .attr("fill", "rgb(0, 0, " + (d.Count * 10) + ")");
                    });

                //Create labels
                svg.selectAll("text")
                    .data(dataset)
                    .enter()
                    .append("text")
                    .text(function(d) {
                        return d.Count;
                    })
                    .attr("text-anchor", "middle")
                    .attr("x", function(d, i) {
                        return xScale(i) + xScale.bandwidth() / 2;
                    })
                    .attr("y", function(d) {
                        return yScale(d.Count) + 14;
                    })
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "11px")
                    .attr("fill", "white");

                svg.append("g")
                     .attr("class", "x axis")
                     .attr("transform", "translate(0," + (h - padding) + ")")
                     .call(xaxis);

                svg.append("g")
                     .attr("class", "y axis")
                     .attr("transform", "translate(" + padding + ",0)")
                     .call(yaxis);

                ////////// UPDATE DATA //////////
                var updateData = function(dataset) {

                    // xscale.domain([0, d3.max(dataset, function(d) {return d[0];})]);
                    // console.log(d3.max(dataset, function(d) { return d.Count;}));
                    yScale.domain([0, d3.max(dataset, function(d) { return d.Count;})])

                    svg.selectAll("rect")
                        .data(dataset)
                        .transition()
                        .duration(1000)
                        .attr("x", function(d, i) {
                            return xScale(i);
                        })
                        .attr("y", function(d) {
                            return yScale(d.Count);
                        })
                        .attr("width", xScale.bandwidth())
                        .attr("height", function(d) {
                            return h - yScale(d.Count) - padding;
                        });

                    svg.selectAll("text")
                        .data(dataset)
                        .transition()
                        .duration(1000)
                        .text(function(d) {
                            return d.Count;
                        })
                        .attr("text-anchor", "middle")
                        .attr("x", function(d, i) {
                            return xScale(i) + xScale.bandwidth() / 2;
                        })
                        .attr("y", function(d) {
                            return yScale(d.Count) + 14;
                        });

                    svg.select(".x.axis")
                        .transition()
                        .duration(1000)
                        .call(xaxis);

                    svg.select(".y.axis")
                        .transition()
                        .duration(1000)
                        .call(yaxis);

                }

            });
        });
    });
});
