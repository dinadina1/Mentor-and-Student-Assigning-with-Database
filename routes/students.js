// require express
const express = require('express');

// require mongoDB
const {MongoClient, ObjectId} = require("mongodb");

const { MongoDB_URL} = require("../utilities/config");

// create a router
const router = express.Router();

// create a mongoDB client
const client = new MongoClient(MongoDB_URL);

// create a / endpoint to handle request
router.route('/')

// API to get all students
.get( async (req, res) => {
    try{
        await client.connect();
        console.log("connected to mongoDB");
        const DB = client.db("Guvi_Task");
        const collection = DB.collection("students");
        res.status(200).json({"all_Students":await collection.find().toArray()})
    }catch(err){
        res.status(500).json({"message": err.message})
    }finally{
       await client.close();
    }
    })

// API to create Student
router.route('/create')

// post a new student
.post( async (req, res) => {
    try{
        await client.connect();
        console.log("connected to mongoDB");
        const DB = client.db("Guvi_Task");
        const collection = DB.collection("students");
        await collection.insertOne(req.body);
        res.status(200).json({"message":"Student added Successfully","all_Students": await collection.find().toArray()})
    }catch(err){
        res.status(500).json({"message": err.message})
    }finally{
        client.close();
    }
})

// API to Assign or Change Mentor for particular Student
router.route('/assign_mentor/:id')

.put(async (req, res) => {
    try{
        await client.connect();
        const DB = client.db("Guvi_Task");
        const collection = DB.collection("students");
        const data = await collection.findOne({_id:new ObjectId(req.params.id)})

        // Check if student already assigned to this mentor
        if(data.current_mentor == req.body.mentor){
            res.status(400).json({"message": "Student already assigned to this mentor"})
        }

        // Assign student to this mentor
        await collection.updateOne({_id:new ObjectId(req.params.id)}, {$set:{previous_mentor:data.current_mentor}})
        await collection.updateOne({_id:new ObjectId(req.params.id)}, {$set:{current_mentor:req.body.mentor}})
        res.status(200).json({"message": "Student assigned successfully", "Student_Info": await collection.findOne({_id:new ObjectId(req.params.id)})})
    }catch(err){
        res.status(500).json({"message": err.message})
    }finally{
        client.close();
    }
})

// API to show all students for a particular mentor
router.route('/mentor/:name')

.get( async(req, res) => {
    try{
        client.connect();
        const DB = client.db("Guvi_Task");
        const collection = DB.collection("students");

        const data = await collection.find({"current_mentor":req.params.name}).toArray();

        if(data.length == 0){
            res.status(400).json({"message": "No students assigned to this mentor"})
        }else{
            res.status(200).json({"All_Students": data})
        }
    }catch(err){
        res.status(500).json({"message": err.message})
    }finally{
        client.close();
    }
})

// Create a /previous_mentor/:id endpoint to handle request
router.route('/previous_mentor/:id')

// API to show the previously assigned mentor for a particular student
.get( async (req,res)=>{
try{
    await client.connect();
    const DB = client.db("Guvi_Task");
    const collection = DB.collection("students");
    const data = await collection.findOne({_id:new ObjectId(req.params.id)})
    if(data.previous_mentor){
        res.status(200).json({"previous_mentor": data})
    }else{
        res.status(200).json({"message": "No previous mentor assigned"})
    }
}catch(err){
    res.status(500).json({"message": err.message})
}finally{
    client.close();
}
})

module.exports = router;