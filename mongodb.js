//CRUD Create Read Update and Delete
import {MongoClient, ObjectId} from 'mongodb';

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

        // const users = await db.collection('users').insertOne({
        //     name: 'Alastair',
        //     age: 99 
        // });

        // const tasks = await db.collection('tasks').insertMany([
        //     {
        //         description: 'Clean the house',
        //         completed: true
        //     },
        //     {
        //         description: 'Pay bills',
        //         completed: false
        //     },
        //     {
        //         description: 'Water garden',
        //         completed: false
        //     }
        // ]);

        // Find ONE item
        // const users = await db.collection('users').findOne({name: 'Alastair'});
        // if (users) {
        //     console.log('Found user: ' + JSON.stringify(users, null, 2));
        // } else {
        //     console.log('Cannot find what you are looking for');
        // }

        // // Find MULTIPLE items
        // const cursor = db.collection('users').find({age: { $gt: 40}});
        // const results = await cursor.toArray();

        // if (results.length > 0) {
        //     console.log("Users found");
        //     results.forEach((user, index) => {
        //         console.log(`${index + 1}.`, JSON.stringify(user, null, 2));
        //     });
        // } else {
        //     console.log('NO users found');
        // }
        
        //console.log('Inserted tasks: '+ JSON.stringify(tasks, null, 2));

        // UPDATE an item
        // const user = await db.collection('users').updateOne({
        //         _id : new ObjectId('66b3ecd4bd0f8f3239d4efee')
        //     }, {
        //         $set: {
        //             name: 'Winter',
        //             age: 8
        //         }
        //     }
        // );

        // console.log(user);

        // Remove an Item(s)
        const users = await db.collection('users').deleteMany({age: {$lt: 40}});
        console.log(users);

        
    } catch(error) {
        console.error("Error: ", error);
    } finally {
        await client.close();
    }
}

main().catch(console.error);