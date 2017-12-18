import _ from 'lodash'
import chains_simple7s from '@/data/json/11-chains-simple7s'
import partitioned_9_wt from '@/data/json/05-partitioned-9-wt'
import simplest_6x6 from '@/data/json/01-simplest-6x6'
import chain_partition_7 from '@/data/json/12-chain-partition-7'
import weighted_6x6 from '@/data/json/02-weighted-6x6'
import partitioned_12_wt from '@/data/json/06-partitioned-12-wt'
import paritions_12 from '@/data/json/08-paritions-12'
import partitioned_6 from '@/data/json/04-partitioned-6'
import varied_67 from '@/data/json/03-varied-67'
import chain_partition_varied from '@/data/json/13-chain-partition-varied'
import paritions_9 from '@/data/json/07-paritions-9'

const DATA = {
  // '01-simplest-6x6': simplest_6x6,
  // '02-weighted-6x6': weighted_6x6,
  // '03-varied-67': varied_67,
  // '04-partitioned-6': partitioned_6,
  // '05-partitioned-9-wt': partitioned_9_wt,
  // '06-partitioned-12-wt': partitioned_12_wt,
  // '07-paritions-9': paritions_9,
  // '08-paritions-12': paritions_12,
  '11-chains-simple7s': chains_simple7s,
  '12-chain-partition-7': chain_partition_7
  // '13-chain-partition-varied': chain_partition_varied
}

// initial state
const state = {
  currentData: '11-chains-simple7s',
  options: [
    // '01-simplest-6x6',
    // '02-weighted-6x6',
    // '03-varied-67',
    // '04-partitioned-6',
    // '05-partitioned-9-wt',
    // '06-partitioned-12-wt',
    // '07-paritions-9',
    // '08-paritions-12',
    '11-chains-simple7s',
    '12-chain-partition-7'
    // '13-chain-partition-varied'
  ],
  data: DATA['11-chains-simple7s'],
  graphs: _.map(DATA['11-chains-simple7s'], (d, i) => ({ text: d.name, value: i })),
  graph_1_index: 0,
  graph_2_index: 1,
  graph_1: DATA['11-chains-simple7s'][0],
  graph_2: DATA['11-chains-simple7s'][1],
  graph_1_node: 0,
  graph_2_node: 0
}

// getters
const getters = {
  getCurrentData: state => state.getCurrentData
}

// actions
const actions = {
  // this is just an example method... actions are usually used for async stuff
  // toggleFilterOutliers (context) {
  //   context.commit('TOGGLE_FILTER_OUTLIERS')
  // }
}

// mutations
const mutations = {
  SET_CURRENT_DATA: (state, value) => {
    state.currentData = value
    state.data = DATA[value]
    state.graphs = _.map(DATA[value], (d, i) => ({ text: d.name, value: i }))
    state.graph_1_index = 0
    state.graph_1 = state.data[0]
    state.graph_2_index = 1
    state.graph_2 = state.data[1]
  },
  SET_GRAPH_1: (state, value) => {
    state.graph_1_index = value
    state.graph_1 = state.data[value]
  },
  SET_GRAPH_2: (state, value) => {
    state.graph_2_index = value
    state.graph_2 = state.data[value]
  },
  SET_GRAPH_1_NODE: (state, value) => {
    state.graph_1_node = value
  },
  SET_GRAPH_2_NODE: (state, value) => {
    state.graph_2_node = value
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
