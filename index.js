const express = require("express");
const app = express();
const port = 8080  || 3000;
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json();
const jwt=require("jsonwebtoken")
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const EncryptDecryptHelper= require("./common_helper")
const AuthHandler=require("./AuthMiddleWare")

const cors = require("cors");
app.use(cors());
app.use(jsonParser);
app.use(express.json())

console.log('express-backend-app');

const {MongoClient, ObjectId, UUID} = require('mongodb');
const uri = 'mongodb+srv://ankitdas0503:hd8sGXMSoceFQbVU@musicplayer.ilkfa.mongodb.net/';
const client= new MongoClient(uri); 
const db = client.db("MusicPlayer");

const collection = db.collection('Songs')
const userCollection = db.collection('users')

app.get('/allSongs', AuthHandler.authMiddleware,async(req,res) => {
    try{
        
        console.log("req.user inside all songs api----", req.user)
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

app.get('/getSong/:id',AuthHandler.authMiddleware,async(req,res) =>{
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

app.post("/encryptTest",async(req,res)=>{
const data=req.body;
console.log("----data---",data)
 let encryptedData= await EncryptDecryptHelper.encryption(data.payload);
 res.send(encryptedData) 
})

app.post("/decryptTest",async(req,res)=>{
    const data=req.body;
    console.log("----data---",data)
     let decryptedData= await EncryptDecryptHelper.decryption(data.payload);
     console.log("---decryptedData---",decryptedData)
     
     res.send(decryptedData) 
    })
app.post("/logIn",async (req,res)=>{
    try{
        
        let privateKey="Radha"
        const data= req.body;
        const userData= await userCollection.findOne({
            username:data.username
        })
        console.log("---userData---",userData)
        let DecryptedPasswordFromDb= await EncryptDecryptHelper.decryption(userData.password);
        console.log("----DecryptedPasswordFromDb----",DecryptedPasswordFromDb)
        console.log("----password entered----",data.password)
        if(DecryptedPasswordFromDb==data.password && userData.username==data.username){
            
             console.log("user data exist")
        let token = jwt.sign(data.username,privateKey)
        let sessionId= new UUID();
        
        res.setHeader(
            "x-auth-token",token
        )
        res.setHeader(
            "sessionId",sessionId
        )
        res.send("user verified successfully")
        res.json()
       

        }
        
        else
        {
            res.statusCode=401
            res.send({
                message:"Credentials are wrong, you are a fraud!!!!"
            })
            res.json()
            
        }

        
       
    }
    catch(err){
        console.log(err)
    }
})






app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });


  