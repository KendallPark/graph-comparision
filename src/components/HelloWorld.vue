<template>
  <div class="compare">
    <b-row>
      <b-col cols="6">
        <b-form-select v-model="graph_1_index" :options="graphs" class="mb-3">
        </b-form-select>
        <!-- <force-graph :nodes="graph_1.nodes" :links="graph_1.links" :data="graph_1" /> -->
        <d3-network :net-nodes="graph_1.nodes" :net-links="graph_1.links" :options="force_options" @node-click="set_graph_1_node"/>
        <sunburst :data="graph_1_real" :node="graph_1_node"/>
        <sankey :data="graph_1_real" :node="graph_1_node"/>
      </b-col>
      <b-col cols="6">
        <b-form-select v-model="graph_2_index" :options="graphs" class="mb-3">
        </b-form-select>
        <!-- <force-graph :nodes="graph_2.nodes" :links="graph_2.links" :data="graph_2" /> -->
        <d3-network :net-nodes="graph_2.nodes" :net-links="graph_2.links" :options="force_options" @node-click="set_graph_2_node"/>
        <sunburst :data="graph_2_real" :node="graph_2_node"/>
        <sankey :data="graph_2_real" :node="graph_2_node"/>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import D3Network from 'vue-d3-network'
import ForceGraph from '@/components/ForceGraph'
import Sunburst from '@/components/Sunburst'
import Sankey from '@/components/Sankey'
import * as d3 from 'd3'
import _ from 'lodash'

export default {
  name: 'HelloWorld',
  components: {
    D3Network, ForceGraph, Sunburst, Sankey
  },
  methods: {
    set_graph_1_node (e, node) {
      this.$store.commit('SET_GRAPH_1_NODE', node.index)
    },
    set_graph_2_node (e, node) {
      this.$store.commit('SET_GRAPH_2_NODE', node.index)
    }
  },
  computed: {
    graph_1_index: {
      get () {
        return this.$store.state.data.graph_1_index
      },
      set (newValue) {
        this.$store.commit('SET_GRAPH_1', newValue)
      }
    },
    graph_2_index: {
      get () {
        return this.$store.state.data.graph_2_index
      },
      set (newValue) {
        this.$store.commit('SET_GRAPH_2', newValue)
      }
    },
    graph_1 () {
      const graph = JSON.parse(JSON.stringify(this.$store.state.data.graph_1))
      graph.nodes = _.map(graph.nodes, (d) => Object.assign({}, d, { _color: d3.schemeCategory20[d.id] }))
      return graph
    },
    graph_2 () {
      const graph = JSON.parse(JSON.stringify(this.$store.state.data.graph_2))
      graph.nodes = _.map(graph.nodes, (d) => Object.assign({}, d, { _color: d3.schemeCategory20[d.id] }))
      return graph
    },
    graph_1_real () {
      return this.$store.state.data.graph_1
    },
    graph_2_real () {
      return this.$store.state.data.graph_2
    },
    graph_1_node () {
      return this.$store.state.data.graph_1_node
    },
    graph_2_node () {
      return this.$store.state.data.graph_2_node
    },
    graphs () {
      return this.$store.state.data.graphs
    },
    force_options () {
      return {
        force: 3000,
        size: { w: 400, h: 300 },
        nodeSize: 20,
        nodeLabels: true,
        canvas: false,
        linkWidth: 2
      }
    }
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

<style scope>
.net {
    margin: 0
}
.node {
    stroke: #000;
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
    stroke: #000;
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

<!-- <style src="vue-d3-network/dist/vue-d3-network.css"></style> -->
