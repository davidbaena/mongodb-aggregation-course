package chapter1

import com.mongodb.client.model.Aggregates.match
import com.mongodb.client.model.Filters.*
import provideCollection
import provideMongoClient

//var pipeline = {
//    $and: [
//    {"imdb.rating" : {$gte:7}},
//    {"genres":{$nin:["Crime", "Horror"]}},
//    {"rated":{$in:["G","PG"]}},
//    {"languages":{$all:["English","Japanese"]}}
//    ]
//}

fun main() {
    provideMongoClient().use { client ->
        val pipeline = listOf(
            match(
                and(
                    gte("imdb.rating", 7),
                    nin("genres", listOf("Crime", "Horror")),
                    `in`("rated", listOf("G", "PG")),
                    all("languages", listOf("English", "Japanese"))
                )
            )
        )

        val moviesCollection = client.provideCollection("aggregations", "movies")
        val results = moviesCollection.aggregate(pipeline)
        results.forEach {
            println(it)
        }
    }
}