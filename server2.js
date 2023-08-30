import express from 'express';
import mongoose from 'mongoose';
import Messages from './dbMessages.js';
import cors from 'cors';

const app = express();

const port = process.env.PORT || 3201;

app.use(express.json());
app.use(cors());

const connection_url = 'mongodb+srv://jossyelmos:bUVcYkvsJsJlPFZw@cluster0.4iwr70s.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(connection_url).then(() => {
    console.log("Connected to DB");
})
    .catch(() => {
        console.log(err);
    });

app.get('/', (req, res) => res.status(200).send("Hello World"));
app.get('/messages/sync', (req, res) => {

    Messages.find().then((err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    })
});

app.post('/messages/new', (req, res) => {
    const dbMessage = req.body

    Messages.create(dbMessage).then((err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send(data);
        }
    })
});

app.listen(port, () => console.log(`Listening on port:${port}`));