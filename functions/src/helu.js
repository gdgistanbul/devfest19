import * as functions from 'firebase-functions';
import { firestore } from 'firebase-admin';

import express from 'express';
import cors from 'cors';
import { Session } from 'inspector';

const app = express();
// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

// build multiple CRUD interfaces:
// app.get('/:id', (req, res) => res.send("Widgets.getById(req.params.id)"));
app.post('/', (req, res) => res.send("Widgets.create()"));
app.put('/:id', (req, res) => res.send("Widgets.update(req.params.id, req.body)"));
app.delete('/:id', (req, res) => res.send("Widgets.delete(req.params.id)"));

app.get('/schedule', async (req, response) => {
    try {
        const sessions = await firestore().collection('schedule').get();
        const sessionArray = [];
        sessions.forEach(
            (doc) => {
                sessionArray.push({
                    id: doc.id,
                    data: doc.data()
                });
            }
        );
        response.json({ schedule: sessionArray });
    } catch (error) {
        response.status(500).send(error);
    }
});


app.get('/sessions', async (req, response) => {
    try {
        const sessions = await firestore().collection('sessions').get();
        const sessionArray = [];
        sessions.forEach(
            (doc) => {
                sessionArray.push({
                    id: doc.id,
                    data: doc.data()
                });
            }
        );
        response.json({ "sessions": sessionArray });
    } catch (error) {
        response.status(500).send(error);
    }
});

app.get('/:id', async (req, response) => {
    console.log(req.params.id);
    try {
        const sessions = await firestore().collection('speakers').get();
        const sessionArray = [];
        sessions.forEach(
            (doc) => {
                if (req.params.id == doc.id) {
                    sessionArray.push({
                        id: doc.id,
                        data: doc.data()
                    });
                }
            }
        );
        response.json({ "speakers": sessionArray.length != 0 ? sessionArray : [] });
    } catch (error) {
        response.status(500).send(error);
    }
});


app.get('/:id/sessions', async (req, response) => {
    console.log(req.params.id);
    try {
        const sessions = await firestore().collection('sessions').where("speakers", "array-contains", req.params.id).get();
        const sessionArray = [];
        sessions.forEach(
            (doc) => {
                sessionArray.push({
                    id: doc.id,
                    data: doc.data()
                });
            }
        );
        response.json({ "sessions": sessionArray });
    } catch (error) {
        response.status(500).send(error);
    }
});





app.get('/', async (req, response) => {
    try {
        const spakers = await firestore().collection('speakers').get();
        const fights = [];
        spakers.forEach(
            (doc) => {
                fights.push({
                    id: doc.id,
                    data: doc.data()
                });
            }
        );
        response.json({ "speakers": fights });

    } catch (error) {
        response.status(500).send(error);
    }

});


const prerender = functions.https.onRequest(app);

// Expose Express API as a single Cloud Function:
exports.restful = prerender;