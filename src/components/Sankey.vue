<template>
  <svg preserveAspectRatio="none" viewBox="0 0 600 600"></svg>
</template>

<script>
import * as d3 from 'd3'
import Graph from '@/components/Graph'

export default {
  name: 'Sankey',
  props: { data: Object, node: { type: Number, default: 0 } },
  mounted () {
    this.draw(this.data)
  },
  methods: {
    draw (newData, node = 0) {
      // console.log(newData, node)
      d3.select(this.$el).selectAll('*').remove()
      const graph = new Graph(newData.nodes, newData.links)
      const width = 600
      const height = 600

      const x = d3.scaleLinear()
          .range([0, 600])

      const y = d3.scaleLinear()
          .range([0, 600])

      const color = d3.scaleOrdinal(d3.schemeCategory20)

      const formatNumber = d3.format(',d')

      const partition = d3.partition()
        // .value(function (d) { return d.size })

      // const arc = d3.arc()
      //     .startAngle(function (d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x0))) })
      //     .endAngle(function (d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x1))) })
      //     .innerRadius(function (d) { return Math.max(0, y(d.y0)) })
      //     .outerRadius(function (d) { return Math.max(0, y(d.y1)) })

      const svg = d3.select(this.$el)
        .attr('width', width)
        .attr('height', height)
        .append('g')
        // .attr('transform', 'translate(' + width / 2 + ',' + (height / 2) + ')')

      var text

      // const link = d3.linkHorizontal()
      //   .x(function (d) { return d.y })
      //   .y(function (d) { return d.x })

      // link({source: })

      const root = d3.hierarchy(graph.traverse(node))
      root.sum(function (d) { return d.size }).sort(function (a, b) { return b.height - a.height || b.size - a.size })
      svg.selectAll('path')
        .data(partition(root).descendants())
        .enter().append('g').attr('class', (d) => d.parent ? 'group child' : 'group')
      svg.selectAll('.child')
        .append('line')
          .attr('x1', (d) => (x(d.x0) + (x(d.x1) - x(d.x0)) / 2))
          .attr('y1', (d) => (y(d.y0) + 5))
          .attr('x2', (d) => (x(d.parent.x0) + (x(d.parent.x1) - x(d.parent.x0)) / 2))
          .attr('y2', (d) => (y(d.parent.y0) + 5))
          .attr('stroke-width', (d) => Math.sqrt(d.data.weight) / 5)
          .attr('stroke', (d) => color(d.parent.data.id))
      svg.selectAll('.group')
        .append('rect')
          .attr('x', (d) => x(d.x0))
          .attr('y', (d) => x(d.y0))
          .attr('height', 20)
          .attr('width', (d) => x(d.x1 - d.x0))
          .style('fill', function (d) { return d3.schemeCategory20[d.data.id] })
          .on('click', click)
      svg.selectAll('.group')
        .append('title')
          .text(function (d) { return d.data.name + '\n' + formatNumber(d.value) + d.data.weight })
      // text = svg.selectAll('.group')
      //    .append('text')
      //       .attr('x', function (d) {
      //         return x(d.x0)
      //       })
      //       .attr('y', function (d) {
      //         return y(d.y0)
      //       })
      //       .attr('dx', '6') // margin
      //       .attr('dy', '.20em') // vertical-align
      //       .text(function (d) {
      //         return d.data.name === 'root' ? '' : d.data.name
      //       })

      function computeTextRotation (d) {
        return (x((d.x0 + d.x1) / 2) - Math.PI / 2) / Math.PI * 180
      }

      function click (d) {
        text.transition().attr('opacity', 0)
        svg.transition()
            .duration(750)
            .tween('scale', function () {
              const xd = d3.interpolate(x.domain(), [d.x0, d.x1])
              const yd = d3.interpolate(y.domain(), [d.y0, 1])
              const yr = d3.interpolate(y.range(), [d.y0 ? 20 : 0, radius])
              return function (t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)) }
            })
          .selectAll('path')
          .attrTween('d', function (d) { return function () { return arc(d) } })
          .on('end', function (e, i) {
            // check if the animated element's data e lies within the visible angle span given in d
            if (e.x0 > d.x0 && e.x0 < d.x1) {
              // get a selection of the associated text element
              var arcText = d3.select(this.parentNode).select('text')
              // fade in the text element and recalculate positions
              arcText.transition().duration(750)
              .attr('opacity', 1)
              .attr('class', 'visible')
              .attr('transform', function () { return 'rotate(' + computeTextRotation(e) + ')' })
              .attr('x', function (d) { return y(d.y0) })
              .text(function (d) {
                return d.data.name === 'root' ? '' : d.data.name
              })
            }
          })
      }
      d3.select(self.frameElement).style('height', height + 'px')
    }
  },
  watch: {
    data (newData) {
      this.draw(newData)
    },
    node (newNode, oldNode) {
      this.draw(this.data, newNode)
    }
  }
}
</script>


<style scope>
line {
  stroke-opacity: 0.3;
}
.net {
    margin: 0
}
.node {
    stroke: rgba(18, 120, 98, .7);
    stroke-width: 3px;
    transition: fill .5s ease;
    fill: #dcfaf3
}
.node.selected {
    stroke: #caa455
}
.node.pinned {
    stroke: rgba(190, 56, 93, .6)
}
.link {
    stroke: rgba(18, 120, 98, .3)
}
.link,
.node {
    stroke-linecap: round
}
.node:hover {
    stroke: #be385d;
    stroke-width: 5px
}
.link.selected {
    stroke: rgba(202, 164, 85, .6)
}
.curve {
    fill: none
}
.link-label,
.node-label {
    fill: #127862
}
.link-label {
    -webkit-transform: translateY(-.5em);
    -ms-transform: translateY(-.5em);
    transform: translateY(-.5em);
    text-anchor: middle
}
</style>
<style scope>
path {
  stroke: #fff;
}
</style>
