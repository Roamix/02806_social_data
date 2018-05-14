// JavaScript source code

d3.csv("data/2017_collisions_zip_all.csv", function make_map(error, input) {
    d3.json("data/nyc_zip.geojson", function (nycjson) {

    var data = input;

    // Date formater
    function parse_date(d) {
        return new Date(2017,
            d.substring(0, 2) - 1,
            d.substring(2, 4),
            d.substring(4, 6),
            d.substring(6, 8));
    }

    data.forEach(function (d) {
        d.DATE = parse_date(d.DATE);
        d.ZIP_CODE = String(+d.ZIP_CODE)
    });

    // Crossfilter data
    var cross_data = crossfilter(data);

    // Data dimensions
    var date_dim = cross_data.dimension(function (fact) { return fact.DATE; });
    var borough_dim = cross_data.dimension(function (fact) { return fact.BOROUGH; });
    var geo_borough_dim = cross_data.dimension(function (fact) { return fact.BOROUGH; });
    var zipcode_dim = cross_data.dimension(function (fact) { return fact.ZIP_CODE; });

    var vehicle_factor1_dim = cross_data.dimension(function (fact) { return fact.CONTRIBUTING_FACTOR_VEHICLE_1; });
    var vehicle_factor2_dim = cross_data.dimension(function (fact) { return fact.CONTRIBUTING_FACTOR_VEHICLE_2; });

    // Data groups
    var num_data_dates = date_dim.group(d3.timeDay);
    var num_boroughs = borough_dim.group();
    var num_zipcode = zipcode_dim.group();

    var num_vehicle_factor1 = vehicle_factor1_dim.group();
    var num_vehicle_factor2 = vehicle_factor2_dim.group();

    var all = cross_data.groupAll();

    // First and last date
    var minDate = date_dim.bottom(1)[0].DATE;
    var maxDate = date_dim.top(1)[0].DATE;

    // Chart definitions
    var borough_chart = dc.barChart("#borough-chart");
    var factor1_chart = dc.pieChart("#factor1-chart");
    var factor2_chart = dc.pieChart("#factor2-chart");
    var date_chart = dc.barChart("#date-chart");
    var geo_chart = dc.geoChoroplethChart("#geo-chart");


    // Count all the data
    dc.dataCount(".dc-data-count")
        .dimension(cross_data)
        .group(all);

    // Chart the borough
    borough_chart
        .width(500)
        .height(300)
        .margins({ top: 0, right: 50, bottom: 35, left: 50 })
        .x(d3.scaleBand())
        .xUnits(dc.units.ordinal)
        .brushOn(true)
        .xAxisLabel('Borough')
        .yAxisLabel('Number of collisions')
        .dimension(borough_dim)
        .group(num_boroughs)
        .barPadding(0.1)
        .outerPadding(0.05);

    // Chart the factors 1
    factor1_chart
        .width(700)
        .height(300)
        .slicesCap(10)
        .innerRadius(75)
        .dimension(vehicle_factor1_dim)
        .group(num_vehicle_factor1)
        .legend(dc.legend())
        .on('pretransition', function (chart) {
            chart.selectAll('text.pie-slice').text(function (d) {
                //return d.data.key + ' ' + dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2 * Math.PI) * 100) + '%';
                return dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2 * Math.PI) * 100) + '%';
            })
        });

    // Chart the factors 2
    factor2_chart
        .width(700)
        .height(300)
        .slicesCap(10)
        .innerRadius(75)
        .dimension(vehicle_factor2_dim)
        .group(num_vehicle_factor2)
        .legend(dc.legend())
        .on('pretransition', function (chart) {
            chart.selectAll('text.pie-slice').text(function (d) {
                //return d.data.key + ' ' + dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2 * Math.PI) * 100) + '%';
                return dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2 * Math.PI) * 100) + '%';
            })
        });

    date_chart
        .width(990)
        .height(200)
        .margins({ top: 0, right: 50, bottom: 20, left: 40 })
        .dimension(date_dim)
        .group(num_data_dates)
        .centerBar(true)
        .gap(1)
        .x(d3.scaleTime().domain([minDate, maxDate]))
        .round(d3.timeDay.round)
        .alwaysUseRounding(true)
        .xUnits(d3.timeDay);


    var nycprojection = d3.geoMercator()
  					.center([-73.94, 40.70])
  					.scale(50000)
  					.translate([(700) / 2, (500)/2]);

    geo_chart
        .width(700)
        .height(500)
        .dimension(zipcode_dim)
        .group(num_zipcode)
        .colors(d3.scaleQuantize().range(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"]))
        .colorDomain([0, num_zipcode.top(1)[0].value])
        .overlayGeoJson(nycjson.features, "zip", function(d) { return d.properties.postalCode;})
        .projection(nycprojection);

        dc.renderAll();
    });
});
