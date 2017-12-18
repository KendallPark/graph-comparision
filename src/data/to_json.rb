require 'pry'
require 'json'

Dir.glob("./gleicher/*.txt") do |txtfile|
  puts "working on: #{txtfile}..."

  title = true

  graphs = []

  nodes = nil
  links = nil
  name = nil
  size = 0

  File.open(txtfile).each.with_index do |line, i|
    if i % (size + 1) == 0
      graphs.push({ name: name, nodes: nodes, links: links, size: size }) unless i == 0
      size = line.split(" ")[0].to_i
      name = line.split(" ").drop(1).join(" ")
      nodes = []
      links = []
    else
      line.split(",").each.with_index do |num, j|
        if j == 0
          nodes.push({ name: num, id: i % (size + 1) - 1 })
        else
          links.push({ source: i % (size + 1) - 1, target: j - 1, sid: i % (size + 1) - 1, tid: j - 1, value: num.to_f }) unless num.to_f == 0
        end
      end
    end
  end
  graphs.push({ name: name, nodes: nodes, links: links, size: size })

  File.open("./json/#{txtfile.split("/").last.chomp(".txt")}.json","w") do |f|
    f.write(graphs.to_json)
  end
end
