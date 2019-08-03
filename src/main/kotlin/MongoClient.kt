import ConfigReader.DATABASE_NAME
import ConfigReader.HOST1
import ConfigReader.HOST2
import ConfigReader.HOST3
import ConfigReader.PASSWORD
import ConfigReader.USERNAME
import ConfigReader.getProperties
import com.mongodb.MongoClient
import com.mongodb.MongoClientOptions
import com.mongodb.MongoCredential
import com.mongodb.ServerAddress
import com.mongodb.client.MongoCollection
import com.mongodb.client.model.Filters.eq
import org.bson.BsonDocument


fun main() {
    val mongoClient = provideMongoClient()
    mongoClient.use { client ->
        val moviesCollection = client.provideCollection("aggregations", "movies")
        val movies = moviesCollection.find(eq("year", 1899))
        println("Fist movie is ${movies.first()}")
    }
}

fun provideMongoClient() = buildMongoClient(fromMongoProperties(getProperties()))

fun buildMongoClient(mongoConfig: MongoConfig): MongoClient {
    val credential = MongoCredential.createCredential(
        mongoConfig.userName,
        mongoConfig.databaseName,
        mongoConfig.password.toCharArray()
    )
    val options: MongoClientOptions = MongoClientOptions.builder().sslEnabled(true).build()
    return MongoClient(mongoConfig.replicaSet, credential, options)
}

fun MongoClient.provideCollection(database: String, collection: String): MongoCollection<BsonDocument> {
    return getDatabase(database)
        .getCollection(collection, BsonDocument::class.java)
}

data class MongoConfig(
    val userName: String,
    val password: String,
    val databaseName: String,
    val replicaSet: List<ServerAddress>
)

fun fromMongoProperties(mongoProperties: Map<String, String>): MongoConfig =
    MongoConfig(
        userName = mongoProperties.getValue(USERNAME),
        password = mongoProperties.getValue(PASSWORD),
        databaseName = mongoProperties.getValue(DATABASE_NAME),
        replicaSet = listOf(
            ServerAddress(mongoProperties.getValue(HOST1), 27017),
            ServerAddress(mongoProperties.getValue(HOST2), 27017),
            ServerAddress(mongoProperties.getValue(HOST3), 27017)
        )
    )