/////// MENS OPEN ////////
// Year,Athlete,Country/State,Time,Notes
// 1897,John J. McDermott,United States (NY),2:55:10,

var parseTime = d3.timeParse("%Y");
var rowConverter = function(d) {
    return {
        Year: parseTime(d.Year),
        Time: parseInt(d.Time.substring(0,1)) * 60
              + parseInt(d.Time.substring(2,4))
              + parseInt(d.Time.substring(5, 7)) / 60,
        Athlete: d.Athlete
    };
};

var w = 600;
var h = 375;
var padding = 45;

var xscale, yscale;
var xaxis, yaxis;


d3.csv('data\\part4_mens_open.csv', rowConverter, function(data_men) {
    d3.csv('data\\part4_womens_open.csv', rowConverter, function(data_women) {
        var data_both = d3.merge([data_men, data_women]);

        var labels = ["Men", "Women", "Both"];
        var colors = {"Men":"navy", "Women":"teal"};
        var radius = 3;

        /// UPDATE TO MEN ONLY ///
        d3.select("#men_button")
            .on("click", function() {
                scatterPlot("Men");
            });

        /// UPDATE TO WOMEN ONLY ///
        d3.select("#women_button")
            .on("click", function() {
                scatterPlot("Women");
            });

        /// UPDATE TO BOTH ///
        d3.select("#both_button")
            .on("click", function() {
                scatterPlot("Both");
            });

        xscale = d3.scaleTime()
                        .domain([d3.timeDay.offset(
                                        d3.min(data_both, function(d) {return d.Year;}),
                                        -365*5),
                                 d3.timeDay.offset(
                                        d3.max(data_both, function(d) {return d.Year;}),
                                        365*5)])
                        .range([padding, w - padding]);

        yscale = d3.scaleLinear()
                        .domain([d3.min(data_both, function(d) {return d.Time;})-1,
                                 d3.max(data_both, function(d) {return d.Time;})+1])
                        .range([h - padding, padding])
                        .nice();

        xaxis = d3.axisBottom(xscale);
        yaxis = d3.axisLeft(yscale);

        var svg = d3.select("#viz2")
                    .append('svg')
                    .attr('width', w)
                    .attr('height', h)

        // var div = d3.select("body").append("div")
        //         .attr("class", "tooltip")
        //         .style("opacity", 0);

        ////// SCATTER PLOT ///////
        var formatTime = d3.timeFormat("%Y");

        var scatterPlot = function (toPlot) {
            var data;
            if (toPlot == "Men") {
                data = data_men
            } else if (toPlot == "Women") {
                data = data_women
            } else {
                data = data_both
            }

            xscale.domain([d3.timeDay.offset(
                            d3.min(data, function(d) {return d.Year;}),
                            -365*5),
                     d3.timeDay.offset(
                            d3.max(data, function(d) {return d.Year;}),
                            365*5)])

            yscale.domain([d3.min(data, function(d) {return d.Time;})-1,
                           d3.max(data, function(d) {return d.Time;})+1]);

            xaxis = d3.axisBottom(xscale);
            yaxis = d3.axisLeft(yscale);

            svg.selectAll("circle")
                .remove();

            svg.selectAll(".legend_text")
                .remove();

            if (toPlot == "Both") {
                svg.append("g")
                    .attr('id', 'men')
                    .selectAll("circle")
                    .data(data_men)
                    .enter()
                    .append('circle')
                    .attr('opacity', 0)
                    .attr('cx', function(d) {
                        return xscale(d.Year);
                    })
                    .attr('cy', function(d) {
                        return yscale(d.Time);
                    })
                    .attr('r', radius)
                    .attr('fill', colors["Men"])
                    .on('mouseover', function(d) {
                       d3.select(this)
                            .attr('fill', 'orange')

                       var xPosition = parseFloat(d3.select(this).attr('cx'));
                       var yPosition = parseFloat(d3.select(this).attr('cy'))+14;

                       d3.select('#tooltip')
                            .style("left", (d3.event.pageX + 12) + "px")
                            .style('top', (d3.event.pageY - 38) + "px")
                            .style("opacity", 0.9)
                            .select('#time')
                            .text("Minutes: " + parseInt(d.Time))

                        d3.select('#tooltip')
                            .select("#year")
                            .text("Year: " + formatTime(d.Year));

                        d3.select('#tooltip')
                            .select("#title")
                            .text("Athlete: " + d.Athlete);

                        d3.select('#tooltip').classed("hidden", false);
                    })
                    .on('mouseout', function(d) {
                       d3.select(this)
                          .transition("restoreBarColor")
                          .duration(250)
                          .attr('fill', colors["Men"]);

                       d3.select('#tooltip').classed("hidden", true);
                   })
                    .transition()
                    .duration(1000)
                    .attr('opacity', 1);

                svg.append("g")
                    .attr('id', 'women')
                    .selectAll("circle")
                    .data(data_women)
                    .enter()
                    .append('circle')
                    .attr('opacity', 0)
                    .attr('cx', function(d) {
                        return xscale(d.Year);
                    })
                    .attr('cy', function(d) {
                        return yscale(d.Time);
                    })
                    .attr('r', radius)
                    .attr('fill', colors["Women"])
                    .on('mouseover', function(d) {
                       d3.select(this)
                            .attr('fill', 'orange')

                       var xPosition = parseFloat(d3.select(this).attr('cx'));
                       var yPosition = parseFloat(d3.select(this).attr('cy'))+14;

                       d3.select('#tooltip')
                            .style("left", (d3.event.pageX + 12) + "px")
                            .style('top', (d3.event.pageY - 38) + "px")
                            .style("opacity", 0.9)
                            .select('#time')
                            .text("Minutes: " + parseInt(d.Time))

                        d3.select('#tooltip')
                            .select("#year")
                            .text("Year: " + formatTime(d.Year));

                        d3.select('#tooltip')
                            .select("#title")
                            .text("Athlete: " + d.Athlete);

                        d3.select('#tooltip').classed("hidden", false);
                    })
                    .on('mouseout', function(d) {
                       d3.select(this)
                          .transition("restoreBarColor")
                          .duration(250)
                          .attr('fill', colors["Women"]);

                       d3.select('#tooltip').classed("hidden", true);
                   })
                    .transition()
                    .duration(1000)
                    .attr('opacity', 1);

                svg.append("text")
                    .attr('class', 'legend_text')
                    .attr("transform",
                    "translate(" + (w - padding*2 - 5) + "," + (h - 300) + ")")
                    .style("text-anchor", "left")
                    .text("Men");

                svg.append("text")
                    .attr('class', 'legend_text')
                    .attr("transform",
                    "translate(" + (w - padding*2 - 5) + "," + (h - 280) + ")")
                    .style("text-anchor", "left")
                    .text("Women");

                svg.append("circle")
                    .attr('class', 'legend_circle')
                    .attr('cx', w - padding*2 - 15)
                    .attr('cy', h - 305)
                    .attr("r", 3)
                    .attr('fill', colors["Men"]);

                svg.append("circle")
                    .attr('class', 'legend_circle')
                    .attr('cx', w - padding*2 - 15)
                    .attr('cy', h - 285)
                    .attr("r", 3)
                    .attr('fill', colors["Women"]);

            } else {
                ///TRENDLINE///
                // MEN INTERCEPT: -0.29038071
                // MEN COEFF: 709.713060561

                // WOMEN INTERCEPT: -0.93566821
                // WOMEN COEFF: 2018.72386009

                svg.selectAll("circle")
                    .data(data)
                    .enter()
                    .append('circle')
                    .attr('opacity', 0)
                    .attr('class', 'circle')
                    .attr('cx', function(d) {
                        return xscale(d.Year);
                    })
                    .attr('cy', function(d) {
                        return yscale(d.Time);
                    })
                    .attr('r', radius)
                    .attr('fill', colors[toPlot])
                    .on('mouseover', function(d) {
                       d3.select(this)
                            .attr('fill', 'orange')

                       var xPosition = parseFloat(d3.select(this).attr('cx'));
                       var yPosition = parseFloat(d3.select(this).attr('cy'))+14;

                       d3.select('#tooltip')
                            .style("left", (d3.event.pageX + 12) + "px")
                            .style('top', (d3.event.pageY - 38) + "px")
                            .style("opacity", 0.9)
                            .select('#time')
                            .text("Minutes: " + parseInt(d.Time))

                        d3.select('#tooltip')
                            .select("#year")
                            .text("Year: " + formatTime(d.Year));

                        d3.select('#tooltip')
                            .select("#title")
                            .text("Athlete: " + d.Athlete);

                        d3.select('#tooltip').classed("hidden", false);
                    })
                    .on('mouseout', function(d) {
                       d3.select(this)
                          .transition("restoreBarColor")
                          .duration(250)
                          .attr('fill', colors[toPlot]);

                       d3.select('#tooltip').classed("hidden", true);
                   })
                    .transition()
                    .duration(1000)
                    .attr('opacity', 1);

                //// LEGEND ////
                svg.append("text")
                    .attr('class', 'legend_text')
                    .attr("transform",
                    "translate(" + (w - padding*2 - 5) + "," + (h - 300) + ")")
                    .style("text-anchor", "left")
                    .text(toPlot);

                svg.append("circle")
                    .attr('class', 'legend_circle')
                    .attr('cx', w - padding*2 - 15)
                    .attr('cy', h - 305)
                    .attr("r", 3)
                    .attr('fill', colors[toPlot]);

            }

            svg.select(".x.axis")
                .transition()
                .duration(1000)
                .call(xaxis);

            svg.select(".y.axis")
                .transition()
                .duration(1000)
                .call(yaxis);
        };

        scatterPlot("Both");

        //// ADD AXES ////
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (h - padding + 10) + ")")
            .call(xaxis);

        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + padding + ",0)")
            .call(yaxis);

        //// ADD AXIS LABELS ////
        svg.append("text")
            .attr("transform",
            "translate(" + (w/2) + "," + (h) + ")")
            .style("text-anchor", "middle")
            .text("Year");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0)
            .attr("x",0 - (h / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Value");


    });
});
