//CRUD Create Read Update and Delete
import mongodb from 'mongodb';

const MongoClient = mongodb.MongoClient;

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

// MongoClient.connect(connectionURL,
//                     { },
//                     (error, client) => {
//                         if (error) {
//                             return console.log('Unable to connect database!');
//                         }
//                         console.log('Connected to MongoDB');
//                     });

async function main() {
    const client = new MongoClient(connectionURL);

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        // Create DB
        const db = client.db(databaseName);

        // Create new Collection (record)
        const collection = db.collection('users');

        const result = await collection.insertOne({
            name: 'Tyler',
            age: 44,
        });

        console.log('Document inserted with _id: '+ result.insertedId);
    } catch(error) {
        console.error("Connection failed ", error);
    } finally {
        await client.close();
    }
}

main().catch(console.error);