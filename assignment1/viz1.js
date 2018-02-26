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

d3.csv('data\\fresh_fruit.csv', rowConverter2, function(ffruit) {
    d3.csv('data\\fresh_vegetable.csv', rowConverter2, function(fvege) {
        d3.csv('data\\storage_fruit.csv', rowConverter2, function(sfruit) {
            d3.csv('data\\storage_vegetable.csv', rowConverter2, function(svege) {
                // console.log(ffruit);
                // console.log(fvege);
                // console.log(sfruit);
                // console.log(svege);
                plotProduce(sfruit);
            });
        });
    });
});

// d3.csv('data\\storage_fruit.csv', rowConverter, function(sfruit) {
//     d3.csv('data\\storage_vegetable.csv', rowConverter, function(svege) {
//         // console.log(ffruit);
//         console.log(sfruit);
//         // console.log(fvege);
//         console.log(svege);
//     });
// });

function plotProduce(dataset) {
    var w = 600;
    var h = 250;
    var padding = 35;
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"]

    var xScale = d3.scaleBand()
                .domain(d3.range(dataset.length))
                .rangeRound([padding, w - padding])
                .paddingInner(0.05);


    var yScale = d3.scaleLinear()
                .domain([0, d3.max(dataset, function(d) { return d.Count;})])
                .range([h - padding + 15, padding]);

    var xaxis = d3.axisBottom(xScale)
                .tickFormat(function(d, i) {
                    return months[i];
                });

    var yaxis = d3.axisLeft(yScale);

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
            // return h - yScale(d.Count);
        })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) {
            return h - yScale(d.Count) - (padding-15);
        })
        .attr("fill", function(d) {
            return "rgb(0, 0, " + Math.round(d.Count * 10) + ")";
        })
        .on("mouseover", function() {
            d3.select(this)
                .attr("fill", "orange");
        })
        .on("mouseout", function(d) {
           d3.select(this)
                .transition()
                .duration(250)
                .attr("fill", "rgb(0, 0, " + (d.Count * 10) + ")");
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
            // return h - yScale(d.Count) + 14;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "white");

    svg.append("g")
         .attr("class", "x axis")
         .attr("transform", "translate(0," + (h - padding + 15) + ")")
         .call(xaxis);

    svg.append("g")
         .attr("class", "y axis")
         .attr("transform", "translate(" + padding + ",0)")
         .call(yaxis);
}
