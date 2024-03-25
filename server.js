const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const MongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'task_manager';

// Connect to MongoDB
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) {
        console.error('Failed to connect to MongoDB:', err);
        return;
    }
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const tasksCollection = db.collection('tasks');

    // Get tasks by course ID
    app.get('/courses/:courseId/tasks', (req, res) => {
        const courseId = req.params.courseId;

        tasksCollection.find({ courseId: courseId }).toArray((err, tasks) => {
            if (err) {
                console.error('Error fetching tasks:', err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }
            if (tasks.length === 0) {
                res.status(404).json({ error: 'No tasks found for the specified course ID' });
                return;
            }
            res.json(tasks);
        });
    });

    // Add a new task
    app.post('/courses/:courseId/tasks', (req, res) => {
        const courseId = req.params.courseId;
        const { taskName, dueDate, additionalDetails } = req.body;

        const newTask = {
            courseId: courseId,
            taskName: taskName,
            dueDate: dueDate,
            additionalDetails: additionalDetails
        };

        tasksCollection.insertOne(newTask, (err, result) => {
            if (err) {
                console.error('Error adding task:', err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }
            res.status(201).json({ message: 'Task added successfully', taskId: result.insertedId });
        });
    });

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});
