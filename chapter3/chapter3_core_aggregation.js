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
