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
      count: -1
    }
  }
]
db.air_routes.aggregate(pipeline3)

//graphLookup
{
  "_id": 6,
  "name": "Karen",
  "title": "CTO",
  "reports_to": 3
} {
  "_id": 3,
  "name": "Eliot",
  "title": "CTO",
  "reports_to": 1
}

{
  "_id": ObjectId("56e9b497732b6122f8790280"),
  "airline": 4,
  "name": "2 Sqn No 1 Elementary Flying Training School",
  "alias": "",
  "iata": "WYT",
  "icao": "",
  "active": "N",
  "country": "United Kingdom",
  "base": "HGH"
}

{
  "_id": ObjectId("56e9b39b732b6122f877fa31"),
  "airline": {
    "id": 410,
    "name": "Aerocondor",
    "alias": "2B",
    "iata": "ARD"
  },
  "src_airport": "CEK",
  "dst_airport": "KZN",
  "codeshare": "",
  "stops": 0,
  "airplane": "CR2"
}

{
  "_id": ObjectId("581288b9f374076da2e36fe5"),
  "name": "Star Alliance",
  "airlines": [
    "Air Canada",
    "Adria Airways",
    "Avianca",
    "Scandinavian Airlines",
    "All Nippon Airways",
    "Brussels Airlines",
    "Shenzhen Airlines",
    "Air China",
    "Air New Zealand",
    "Asiana Airlines",
    "Brussels Airlines",
    "Copa Airlines",
    "Croatia Airlines",
    "EgyptAir",
    "TAP Portugal",
    "United Airlines",
    "Turkish Airlines",
    "Swiss International Air Lines",
    "Lufthansa",
    "EVA Air",
    "South African Airways",
    "Singapore Airlines"
  ]
}


//facets
var pipeline4 = [{
    $match: {
      "imdb.rating": {
        $gte: 0
      },
      "metacritic": {
        $gte: 0
      }
    }
  },
  {
    $project: {
      _id: 0,
      "metacritic": 1,
      "imdb": 1,
      "title": 1
    }
  },
  {
    $facet: {
      top_metacritic: [{
          $sort: {
            "metacritic": -1,
            "title": 1
          }
        },
        {
          $limit: 10
        },
        {
          $project: {
            title: 1
          }
        }
      ],
      top_imdb: [{
          $sort: {
            "imdb.rating": -1,
            "title": 1
          }
        },
        {
          $limit: 10
        },
        {
          $project: {
            "title": 1
          }
        }
      ]
    }
  },
  {
    $project: {
      movies_in_both: {
        $setIntersection: ["$top_metacritic", "top_imdb"]
      }
    }
  }
]
db.air_routes.aggregate(pipeline4)
