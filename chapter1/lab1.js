var favorites = [
  "Sandra Bullock",
  "Tom Hanks",
  "Julia Roberts",
  "Kevin Spacey",
  "George Clooney"
]

var pipeline = [{
      $match: {
        countries: {
          $in: ["USA"]
        }
      }
    },
    {
      $match: {
        "tomatoes.viewer.rating": {
          $gte: 3
        }
      }
    },
    {
      $match: {
        "cast": {
          $in: favorites
        }
      }
    }, {
      $addFields: {
        num_favs: {
          $size: {
            "cast": {
              $elemMatch: {
                $in: favorites
              }
            }
          }
        ]



        var a = db.movies.aggregate(pipeline)

        var pipeline = [{
          $project: {
              "cast": {
                $filter: {
                  input: "$cast",
                  as: "actor",
                  cond: {
                    "$$actor": {
                      $in: favorites
                    }
                  }
                }
              }
            }
        }]
