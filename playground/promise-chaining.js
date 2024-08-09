import '../src/db/mongoose.js';
import {User} from '../src/models/user.js';
import {Task} from '../src/models/task.js'

// 66b41257a117473702c5304b

// User.findByIdAndUpdate('66b413038f4ba0d2d7b9c59e', { age: 1 }).then((user) => {
//     console.log(user);
//     return User.countDocuments({ age: 1 });
// }).then((result) => {
//     console.log(result);
// }).catch((err) => {
//     console.log(err);
// });

// const updateAgeAndCount = async (id, age) => {
//     const user = await User.findByIdAndUpdate(id, {age: age});
//     const count = await User.countDocuments({age});
//     return count;
// }

// updateAgeAndCount('66b41257a117473702c5304b', 2).then((count) => {
//     console.log(count);
// }).catch((error) => {
//     console.log(error);
// });

const deleteTaskAndCount = async (id) => {
    const task = await Task.findByIdAndDelete(id);
    const count = await Task.countDocuments({completed: false});
    return count;
}

deleteTaskAndCount('66b3fdb132e3bd07ed222f5b').then((count) => {
    console.log(count);
}).catch((error) => {
    console.log(error);
});
