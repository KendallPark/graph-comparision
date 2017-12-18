<template>
  <div id="app">
    <b-navbar toggleable="md" type="dark" variant="info">
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown :text="currentData" right>
          <b-dropdown-item href="#" v-for="item in dataOptions" @click="SET_CURRENT_DATA(item)">{{item}}</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-navbar>
    <b-container fluid>
      <router-view/>
    </b-container>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'app',
  methods: {
    ...mapMutations(['SET_CURRENT_DATA'])
  },
  computed: {
    currentData () {
      return this.$store.state.data.currentData
    },
    dataOptions () {
      return this.$store.state.data.options
    }
  }
}
</script>

<style>
*:focus {
  outline: none;
}
/* #app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
</style>
