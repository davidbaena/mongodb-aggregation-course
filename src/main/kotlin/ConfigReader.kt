import java.io.FileNotFoundException
import java.io.InputStream
import java.util.*

object ConfigReader {
    const val USERNAME = "username"
    const val PASSWORD = "password"
    const val DATABASE_NAME = "databaseName"

    const val HOST1 = "host1"
    const val HOST2 = "host2"
    const val HOST3 = "host3"

    fun getProperties(): Map<String, String> {
        val properties = loadPropertiesFile("config.properties")
        val username = properties.getProperty(USERNAME)
        val password = properties.getProperty(PASSWORD)
        val database = properties.getProperty(DATABASE_NAME)
        val host1 = properties.getProperty(HOST1)
        val host2 = properties.getProperty(HOST1)
        val host3 = properties.getProperty(HOST1)

        return mapOf(
            USERNAME to username,
            PASSWORD to password,
            DATABASE_NAME to database,
            HOST1 to host1,
            HOST2 to host2,
            HOST3 to host3
        )
    }

    private fun loadPropertiesFile(propFileName: String): Properties {
        val prop = Properties()
        val inputStream: InputStream? = javaClass.classLoader.getResourceAsStream(propFileName)

        if (inputStream == null) {
            throw FileNotFoundException("property file $propFileName")
        } else {
            prop.load(inputStream)
            return prop
        }
    }
}
