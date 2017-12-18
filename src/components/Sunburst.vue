<template>
  <svg preserveAspectRatio="none" viewBox="0 0 600 600"></svg>
</template>

<script>
import * as d3 from 'd3'
import Graph from '@/components/Graph'

export default {
  name: 'Sunburst',
  props: { data: Object, node: { type: Number, default: 0 } },
  mounted () {
    this.draw(this.data)
  },
  methods: {
    draw (newData, node = 0) {
      // console.log(newData, node)
      d3.select(this.$el).selectAll('*').remove()
      const graph = new Graph(newData.nodes, newData.links)
      // console.log(graph.traverse(node))
      const width = 600
      const height = 600
      const radius = (Math.min(width, height) / 2) - 10

      const formatNumber = d3.format(',d')

      const x = d3.scaleLinear()
          .range([0, 2 * Math.PI])

      const y = d3.scaleSqrt()
          .range([0, radius])

      const color = d3.scaleOrdinal(d3.schemeCategory20)

      const partition = d3.partition()

      const arc = d3.arc()
          .startAngle(function (d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x0))) })
          .endAngle(function (d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x1))) })
          .innerRadius(function (d) { return Math.max(0, y(d.y0)) })
          .outerRadius(function (d) { return Math.max(0, y(d.y1)) })

      const svg = d3.select(this.$el)
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + (height / 2) + ')')

      var text

      const root = d3.hierarchy(graph.traverse(node))
      root.sum(function (d) { return 1 }).sort(function (a, b) { return b.height - a.height || b.size - a.size })

      svg.selectAll('path')
        .data(partition(root).descendants())
        .enter().append('g').attr('class', 'group')
      svg.selectAll('.group')
        .append('path')
          .attr('d', arc)
          .style('fill', function (d) { return d3.schemeCategory20[d.data.id] })
          .on('click', click)
      svg.selectAll('.group')
        .append('title')
          .text(function (d) { return d.data.name + '\n' + formatNumber(d.value) })
      text = svg.selectAll('.group')
         .append('text')
            .attr('transform', function (d) {
              return 'rotate(' + computeTextRotation(d) + ')'
            })
            .attr('x', function (d) {
              return y(d.y0)
            })
            .attr('dx', '6') // margin
            .attr('dy', '.30em') // vertical-align
            .text(function (d) {
              return d.data.name === 'root' ? '' : d.data.name
            })

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
      this.draw(newData, 0)
    },
    node (newNode, oldNode) {
      this.draw(this.data, newNode)
    }
  }
}
</script>

<style scope>
path {
  stroke: #fff;
}
text {
  font-size: 10px;
}
</style>
