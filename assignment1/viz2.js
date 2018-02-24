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

var w = 500;
var h = 375;
var padding = 20;

var xscale, yscale;
var xaxis, yaxis;

d3.csv('data\\part4_mens_open.csv', rowConverter, function(data_men) {
    d3.csv('data\\part4_womens_open.csv', rowConverter, function(data_women) {
        console.log(data_men);
        console.log(data_women);

        xscale = d3.scaleLinear()
                        .domain([d3.min(data_men, function(d) {return d.Year;}),
                                 d3.max(data_men, function(d) {return d.Year;})])
                        .range([padding, w - padding * 2])
                        .nice();

        yscale = d3.scaleLinear()
                        .domain([0, d3.max(data_men, function(d) {return d.Time;})])
                        .range([h - padding, padding])
                        .nice();

        xaxis = d3.axisBottom(xscale);
        yaxis = d3.axisLeft(yscale);

        var svg = d3.select("#viz2")
                    .append('svg')
                    .attr('width', w)
                    .attr('height', h)

        var men_circ = svg.selectAll("circle")
                          .data(data_men);

        var women_circ = svg.selectAll("circle")
                          .data(data_women);

        men_circ.enter()
            .append('circle')
            .attr('cx', function(d) {
                return xscale(d.Year);
            })
            .attr('cy', function(d) {
                return yscale(d.Time);
            })
            .attr('r', 2)
            .style('fill', '#111');

    });
});
