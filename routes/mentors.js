// require express
const express = require('express');

// Create express router
const router = express.Router();

// require mongoDB
const {MongoClient, ObjectId } = require('mongodb');

// require MongoDB_URL from config.js
const {MongoDB_URL} = require('../utilities/config');
// import { collection } from 'firebase/firestore';

// Create a MongoClient
const client = new MongoClient(MongoDB_URL);

// create a / endpoint to handle request
router.route('/')

// API to get all mentors
.get(async (req,res)=>{
    try{
        await client.connect();
        const DB = client.db("Guvi_Task");
        const collection = DB.collection("mentors");
        res.status(200).json({"all_Mentors": await collection.find().toArray()});
    }catch(err){
        res.status(500).json({"message": err.message})
    }finally{
        client.close();
    }
});

// create a /create endpoint to handle request
router.route('/create')

// API to create Mentor
.post(async (req,res) => {
    try{
        await client.connect();
        const DB = client.db("Guvi_Task");
        const collection = DB.collection("mentors");
        await collection.insertOne(req.body);
        res.status(200).json({message:"Mentor added successfully",all_Mentors: await collection.find().toArray()})
    }catch(err){
        res.status(500).json({"message": err.message})
    }finally{
        await client.close();
    }
})

// Create a /:id endpoint to handle request
router.route('/:id')

// API to Assign a student to Mentor by id
.put(async (req, res) => {
    try{
        // Connect to MongoDB
        await client.connect();

        // Connect to Guvi_Task database
        const DB = client.db("Guvi_Task");

        // Connect to Mentors collection
        const collection = DB.collection("mentors");
        const data = await collection.findOne({_id:new ObjectId(req.params.id)})

        // Check if student already assigned to this mentor
        if(data.students.includes(...req.body.student)){
            res.status(400).json({"message": "Student already assigned to this mentor"})
        }

        // Assign student to this mentor
        await collection.updateOne({_id:new ObjectId(req.params.id)},{$set:{students:[...data.students,...req.body.student]}})
        res.status(200).json({"message": "Student assigned successfully", "all_Mentors": await collection.findOne({_id:new ObjectId(req.params.id)})})
    }
    catch(err){
        res.status(500).json({"message": err.message})
    }
    finally{
        await client.close();
    }
});






module.exports = router;