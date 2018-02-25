/////// MENS OPEN ////////
// Year,Athlete,Country/State,Time,Notes
// 1897,John J. McDermott,United States (NY),2:55:10,

var rowConverter = function(d) {
    return {
        Year: parseInt(d.Year),
        Time: parseInt(d.Time.substring(0,1)) * 60
              + parseInt(d.Time.substring(2,4))
              + parseInt(d.Time.substring(5, 7)) / 60
    };
};

var w = 600;
var h = 375;
var padding = 30;

var xscale, yscale;
var xaxis, yaxis;
var data_both;

d3.csv('data\\part4_mens_open.csv', rowConverter, function(data_men) {
    d3.csv('data\\part4_womens_open.csv', rowConverter, function(data_women) {
        // console.log(data_men);
        // console.log(data_women);

        console.log(data_both);

        xscale = d3.scaleLinear()
                        .domain([d3.min(data_men, function(d) {return d.Year;}),
                                 d3.max(data_men, function(d) {return d.Year;})])
                        .range([padding, w - padding])
                        .nice();

        // txscale = d3.scaleTime()
        //                 .domain([
        //                     d3.min(timedata, function(d) {return d.Date;}),
        //                     d3.max(timedata, function(d) {return d.Date;})
        //                 ])
        //                 .range([padding, w - padding * 2]);

        yscale = d3.scaleLinear()
                        .domain([d3.min(data_men, function(d) {return d.Time;}),
                                 d3.max(data_women, function(d) {return d.Time;})+1])
                        .range([h - padding, padding])
                        .nice();

        xaxis = d3.axisBottom(xscale);
        yaxis = d3.axisLeft(yscale).ticks(10);

        var svg = d3.select("#viz2")
                    .append('svg')
                    .attr('width', w)
                    .attr('height', h)

        svg.append('clipPath')
        	 .attr('id', 'chart-area')
        	 .append('rect')
        	 .attr('x', padding)
        	 .attr('y', padding)
        	 .attr('width', w - padding * 3)
        	 .attr('height', h - padding * 2);

        svg.append('g')
        	.attr('id', 'men_circles')
            .attr('clip-path', 'url(#chart-area)')
        	.selectAll("circle")
            .data(data_men)
            .enter()
            .append("circle")
            .attr("cx", function(d) {
                return xscale(d.Year);
            })
            .attr("cy", function(d) {
                return yscale(d.Time);
            })
            .attr("r", 1.5);

        svg.append('g')
            .attr('id', 'women_circles')
            .attr('clip-path', 'url(#chart-area)')
            .selectAll("circle")
            .data(data_women)
            .enter()
            .append("circle")
            .attr("cx", function(d) {
                return xscale(d.Year);
            })
            .attr("cy", function(d) {
                return yscale(d.Time);
            })
            .attr("r", 1.5);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (h - padding) + ")")
            .call(xaxis);

        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + padding + ",0)")
            .call(yaxis);

        /// UPDATE TO MEN ONLY ///
        d3.select("#men_button")
            .on("click", function() {
                console.log("men clicked.");

                //FIXME Remove women data points
                //OR
                //FIXME make women data points invisible
                svg.select("#women_circles")
                    // .style("opacity", 0)
                    // .transition()
                    // .duration(500)
                    .remove();

                xscale.domain([d3.min(data_men, function(d) {return d.Year;})-1,
                               d3.max(data_men, function(d) {return d.Year;})]);

                yscale.domain([d3.min(data_men, function(d) {return d.Time;}),
                               d3.max(data_men, function(d) {return d.Time;})+1]);

                xaxis = d3.axisBottom(xscale);
                yaxis = d3.axisLeft(yscale).ticks(10);

                svg.selectAll("circle")
                    .data(data_men)
                    .transition()
                    .duration(1000)
                    .on('start', function() {
                        d3.select(this)
                            .attr('fill', 'teal')
                            .attr('r', 5);
                    })
                    .attr("cx", function(d) {
                        return xscale(d.Year);
                    })
                    .attr("cy", function(d) {
                        return yscale(d.Time);
                    })
                    .transition()
                    .duration(1000)
                    .attr('fill', 'black')
                    .attr('r', 1.5);

                svg.select(".x.axis")
                    .transition()
                    .duration(1000)
                    .call(xaxis);

                svg.select(".y.axis")
                    .transition()
                    .duration(1000)
                    .call(yaxis);
            });

        /// UPDATE TO WOMEN ONLY ///
        d3.select("#women_button")
            .on("click", function() {
                console.log("women clicked.");

                //FIXME Remove women data points
                //OR
                //FIXME make women data points invisible
                svg.select("#men_circles")
                    //.style("opacity", 0)
                    // .transition()
                    // .duration(500)
                    .remove();

                xscale.domain([d3.min(data_women, function(d) {return d.Year;})-1,
                               d3.max(data_women, function(d) {return d.Year;})]);

                yscale.domain([d3.min(data_women, function(d) {return d.Time;}),
                               d3.max(data_women, function(d) {return d.Time;})+1]);

                xaxis = d3.axisBottom(xscale);
                yaxis = d3.axisLeft(yscale).ticks(10);

                svg.selectAll("circle")
                    .data(data_women)
                    .transition()
                    .duration(1000)
                    .on('start', function() {
                        d3.select(this)
                            .attr('fill', 'teal')
                            .attr('r', 5);
                    })
                    .attr("cx", function(d) {
                        return xscale(d.Year);
                    })
                    .attr("cy", function(d) {
                        return yscale(d.Time);
                    })
                    .transition()
                    .duration(1000)
                    .attr('fill', 'black')
                    .attr('r', 1.5);

                svg.select(".x.axis")
                    .transition()
                    .duration(1000)
                    .call(xaxis);

                svg.select(".y.axis")
                    .transition()
                    .duration(1000)
                    .call(yaxis);
            });

    });
});
