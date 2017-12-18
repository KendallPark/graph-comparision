import _ from 'lodash'

export default class {
  constructor (nodes, links) {
    this.nodes = nodes
    this.links = links
  }

  traverse (node) {
    const helper = function (node, visited, depth) {
      node.visited = true
      const visit = visited.slice(0)
      visit.push(node.node.id)
      const children = _.map(node.children, function (child) {
        if (depth > 8) {
          return {id: child.node.id, name: child.node.name, cycle: false, size: 1, weight: child.weight}
        } else if (!visit.includes(child.node.id)) {
          return helper(child, visit, depth + 1)
        } else {
          return {id: child.node.id, name: child.node.name, cycle: true, size: 1, weight: child.weight}
        }
      })
      if (children.length > 0) {
        return {
          name: node.node.name,
          id: node.node.id,
          size: children.length + 1,
          children: children,
          weight: node.weight
        }
      }
      return {
        name: node.node.name,
        id: node.node.id,
        size: 1,
        weight: node.weight
      }
    }
    const nodes = _.map(this.nodes, (d) => ({ node: d, children: [], visited: false, weight: null }))
    for (let link of this.links) {
      nodes[link.sid].children.push(Object.assign({}, nodes[link.tid], {weight: link.value}))
    }
    console.log(nodes)
    var start = nodes[node]
    return helper(start, [start.node.id], 0)
  }
}
