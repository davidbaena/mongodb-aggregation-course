var pipeline = [
  { $match: {title:{$type:"string"}}},
  { $project: {title: {$split :["$title", " "]}, _id:0}},
  { $match: {title:{$size:1 } }}
]

db.movies.aggregate(pipeline).itcount()
