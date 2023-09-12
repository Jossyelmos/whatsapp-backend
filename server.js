// importing
import express from "express";
import mongoose from "mongoose";
import Messages from './dbMessages.js';
import Pusher from "pusher";
import cors from 'cors';

// app config
const app = express();
const port = process.env.PORT || 3200;

const pusher = new Pusher({
  appId: "1607528",
  key: "93ee3b8a93ee7b9ed4d4",
  secret: "5ea034f01143e9f4bc22",
  cluster: "eu",
  useTLS: true
});

// middleware
app.use(express.json());
app.use(cors());

// DB config
const connection_url = 'mongodb+srv://Admin:xrUtFC7A8obNojSQ@cluster0.ejsy3sw.mongodb.net/?retryWrites=true&w=majority';

mongoose
  .connect(connection_url, {
        useNewUrlParser: true
    })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

// ????
const db = mongoose.connection;

db.once('open', () => {
    console.log('DB Connected');

    const msgCollection = db.collection('messagecontents');
    const changeStream = msgCollection.watch();

    changeStream.on('change', (change) => {
        console.log('A Change Occured', change);

        if (change.operationType === 'insert') {
            const messageDetails = change.fullDocument;
            pusher.trigger('messages', 'inserted', {
                name: messageDetails.name,
                message: messageDetails.message,
                date: messageDetails.date,
                received: messageDetails.received
            });
        } else {
            console.log('Error triggering Pusher');
        }
    });
});

// Api routes
app.get('/messages/sync', (req, res) => {
    Messages.find()
    .then((data) => {
        res.status(200).send(data);
    })
    .catch((err) => {
            res.status(500).send(err);
    })

    // Messages.find((err, data) => {
    //     if (err) {
    //         res.status(500).send(err);
    //     } else {
    //         res.status(200).send(data);
    //     }
    // })
});

app.post('/messages/new', (req, res) => {
    const dbMessage = req.body

    Messages.create(dbMessage)
    .then((data) => {
        res.status(201).send(data);
    })
    .catch((err) => {
            res.status(500).send(err);
    })

    // Messages.create(dbMessage, () => {
    //     if (err) {
    //         res.status(500).send(err);
    //     } else {
    //         res.status(201).send(data);
    //     }
    // })
});

// listen
app.listen(port, () => console.log(`Server started on port ${port}`));