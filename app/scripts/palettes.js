var width = 300,
    height = 200;
var svg = d3.select('#paintings').append('svg');
var circles = svg
        .append("g");

svg
    .attr("width", width)
    .attr("height", height);
var x = d3.scale.linear()
        .range([0, width])
        .domain([-0.1, 1.1]).nice();

var y = d3.scale.linear()
        .range([height, 0])
        .domain([-0.1, 1.1]).nice();


function updateColors(){
    // Select all colors
    var colors = [];
    d3.selectAll('circle.active').each(function(d){
        var color = d3.rgb(d.rgb[0]*255, d.rgb[1]*255, d.rgb[2]*255);
        colors.push(color);
    });
    sketch.palette = colors;
}


d3.select('#paintingsclear')
    .on('click', function(x){
        d3.selectAll('circle.active').classed('active', false);
        updateColors();
    });

d3.select('#paintingsall')
    .on('click', function(x){
        d3.selectAll('circle').classed('active', true);
        updateColors();
    });



function selectPalette(palette) {
    // use palette
    circles
        .selectAll("circle")
        .remove();
    circles
        .selectAll("circle")
        .data(palette)
        .enter()
        .append("circle")
        .attr("cx", function(d){return x(d.x);})
        .attr("cy", function(d){return y(d.y);})
        .attr("r", 10)
        .style("fill", function(d) {
            return d3.rgb(d.rgb[0]*255, d.rgb[1]*255, d.rgb[2]*255);
        })
        .on("click", function(d){
            console.log('click', d, this);
            // toggle active
            d3.select(this)
                .classed('active', !d3.select(this).classed('active'));
            updateColors();
        });
}

d3.json("/data/palettes.json",

        function(error, palettes) {

            d3.select('#paintings')
                .append('div')
                .classed('row', true)
                .selectAll('div')
                .data(palettes)
                .enter()
                .append('div')
                .classed({
                    'col-xs-3': true,
                    'thumbnail': true
                })
                .append('img')
                .attr('width', '60')
                .attr('height', '40')
                .attr('src', function(d){return d.url;})
                .on("click", function(d){
                    console.log('click', d, this);
                    // toggle active
                    selectPalette(d.palette);

                });


            palette = palettes[0].palette;
            selectPalette(palette);


        });
