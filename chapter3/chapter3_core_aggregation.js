//Group
var pipeline1 = [{
    $match: {
      awards: /Won \d{1,2} Oscars?/
    }
  },
  {
    $group: {
      _id: null,
      highest_rating: {
        $max: "$imdb.rating"
      },
      lowest_rating: {
        $min: "$imdb.rating"
      },
      average_rating: {
        $avg: "$imdb.rating"
      },
      deviation: {
        $stdDevSamp: "$imdb.rating"
      }
    }
  }
]
db.movies.aggregate(pipeline1)

//Unwind
var pipeline2 = [{
    $match: {
      "languages": {
        $eq: "English"
      }
    }
  },
  {
    $unwind: "$cast"
  },
  {
    $group: {
      _id: "$cast",
      "numFilms": {
        $sum: 1
      },
      "average": {
        $avg: "$imdb.rating"
      }
    }
  },
  {
    $sort: {
      "numFilms": -1
    }
  }
]
db.movies.aggregate(pipeline2)

//Lookup
var pipeline3 = [{
    $match: {
      airplane: /747|380/
    }
  },
  {
    $lookup: {
      from: "air_alliances",
      localField: "airline.name",
      foreignField: "airlines",
      as: "alliance"
    }
  },
  {
    $unwind: "$alliance"
  },
  {
    $group: {
      _id: "$alliance.name",
      count: {
        $sum: 1
      }
    }
  },
  {
    $sort: {
      count:-1
    }
  }
]
db.air_routes.aggregate(pipeline3)
