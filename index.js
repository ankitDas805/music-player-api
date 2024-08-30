const express = require("express");
const app = express();
const port = 8080  || 3000;
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

const cors = require("cors");
app.use(cors());
app.use(jsonParser);

console.log('express-backend-app');

const {MongoClient, ObjectId} = require('mongodb');
const uri = 'mongodb+srv://ankitdas0503:hd8sGXMSoceFQbVU@musicplayer.ilkfa.mongodb.net/';
const client= new MongoClient(uri); 
const db = client.db("MusicPlayer");

const collection = db.collection('Songs')

app.get('/allSongs', async(req,res) => {
    try{
        const songData = await collection.find({}).project({
            albumArt:1,
            songName:1
        }).toArray();
        console.log("ended",songData);
        if (!songData) {
            return res.status(404).json({ message: 'Song not found' });
        }
        res.send({
            status:200,
            data:songData
        });
    }
    catch(error){
          console.error(error);
          res.status(500).json({message:'Server error'});
    }
});

app.get('/getSong/:id',async(req,res) =>{
    try{
    const songData = await collection.find(_id = new ObjectId(req.params.id)).project({
        albumArt:1,
        songName:1,
        song:1}).toArray();

        if(!songData){
            return res.status(404).json({message:'Song not found'});
        }
        res.send({
            status:200,
            data:songData
        });
    }
    catch(error){
        res.status(500).json({message:'Server error'});
    }
    });








app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });


  