"use strict";

import {
  default as React,
  Component,
} from 'react';

import {
  default as d3
} from 'd3';

import {
  default as ReactFauxDOM
} from 'react-faux-dom';

export default class Pie extends Component {
  constructor (props) {
    super(props);
  }

  static defaultProps = {
  }

  _mkPie (dom) {
    const {
      innerRadius,
      outerRadius,
      pieSort,
      value,
      chartSeriesData,
      radius,
      onMouseOut,
      onMouseOver
    } = this.props;


    var arc = d3.svg.arc()
      .outerRadius(outerRadius)
      .innerRadius(innerRadius);

    var arcOver = d3.svg.arc()
      .outerRadius(outerRadius + 10)
      .innerRadius(innerRadius);

    var pie = d3.layout.pie()
      .sort((a, b) => { return pieSort(a.value, b.value)})
      .value((d) => { return d.value; })

    var pieDom = d3.select(dom);

    var g = pieDom.selectAll('.arc')
              .data(pie(chartSeriesData))
            .enter().append('g')
              .attr('class', 'arc');

    g.append("path")
      .attr("d", arc)
      .style("fill", (d) => { return d.data.color; })
      .style("stroke", "#FFF")
      // not using ES6 fat arrow syntax, cause it will cause 'this' variable not passing issue see details in here:
      // https://github.com/mbostock/d3/issues/2246
      .on("mouseover", function(d) { return onMouseOver(d, this, arcOver); })
      .on("mouseout", function(d) { return onMouseOut(d, this, arc); })
      .attr("style", (d) => {
        var s = '';
        if(d.data.style) {
          for(var key in d.data.style) {
            s += key + ':' + d.data.style[key] + ';';
          }
        }
        return s;
      })


    var labelr = radius + 10;

    g.append("text")
      .attr("transform", (d) => {
        var c = arc.centroid(d),
          x = c[0],
          y = c[1],
          // pythagorean theorem for hypotenuse
          h = Math.sqrt( x * x + y * y);

        return "translate(" + (x / h * labelr) +  ',' +
           (y / h * labelr) +  ")";
      })
      .attr("dy", ".35em")
      .style("text-anchor", (d) => {
        return (d.endAngle + d.startAngle)/2 > Math.PI ?
          "end" : "start";
      })
      .text((d) => { return d.data.name; });

    return pieDom;
  }

  render() {

    const{
      width,
      height,
      margins
    } = this.props;

    var t = `translate(${(width - margins.left - margins.right) / 2},  ${(height - margins.top - margins.bottom) / 2})`;

    var pieChart = ReactFauxDOM.createElement('g');
    pieChart.setAttribute("transform", t);
    var pie = this._mkPie(pieChart);

    return pie.node().toReact();
  }
}
