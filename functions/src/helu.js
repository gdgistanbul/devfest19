import * as functions from 'firebase-functions';
import { firestore } from 'firebase-admin';

import express from 'express';
import cors from 'cors';

const app = express();
// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

// build multiple CRUD interfaces:
app.get('/:id', (req, res) => res.send("Widgets.getById(req.params.id)"));
app.post('/', (req, res) => res.send("Widgets.create()"));
app.put('/:id', (req, res) => res.send("Widgets.update(req.params.id, req.body)"));
app.delete('/:id', (req, res) => res.send("Widgets.delete(req.params.id)"));
app.get('/', async (req, response) => {
    try {
        const fightQuerySnapshot = await firestore().collection('speakers').get();
        const fights = [];
        fightQuerySnapshot.forEach(
            (doc) => {
                fights.push({
                    id: doc.id,
                    data: doc.data()
                });
            }
        );
    
        response.json({"speakers": fights});
    
      } catch(error){
    
        response.status(500).send(error);
    
      }

});


const prerender = functions.https.onRequest(app);

// Expose Express API as a single Cloud Function:
exports.restful = prerender;