/*
    Author: Johnathan Sutan
    Last Updated: 6/13/21
    File linked: main.html, main.css, audio_visual.js
*/

  var config = {
    items: [],
    min_distance: 7,
    max_distance: 22,
    number_of_lines: 100,
    line_height: 50,
    line_spacing: 4,
    line_with: 2,
    line_color: '#000000'
  };
  
/*  function that makes a random soundwave for visual */
    function randomSoundwave(){
    
    config.items = Array(config.max_distance - config.min_distance + 1).fill().map((_, idx) => 7 + idx);
    
    document.getElementById('svg').innerHTML = '';
    
    var svgns = "http://www.w3.org/2000/svg";
    for (var i = 1; i < config.number_of_lines; i++) {
        var y1 = config.items[Math.floor(Math.random() * config.items.length)];
        var y2 = config.line_height - y1;
        var line = document.createElementNS(svgns, 'line');
        var x = i * config.line_spacing;
    
        line.setAttributeNS(null, 'x1', x);
        line.setAttributeNS(null, 'y1', y1);
        line.setAttributeNS(null, 'x2', x);
        line.setAttributeNS(null, 'y2', y2);
        line.setAttributeNS(null, 'stroke-width', config.line_width);
        line.setAttributeNS(null, 'stroke', config.line_color);    
    
        document.getElementById('svg').appendChild(line);
    }
  
  }