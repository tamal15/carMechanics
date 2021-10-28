const express=require ('express');
const { MongoClient } = require('mongodb');
const ObjectId=require('mongodb').ObjectId
const cors=require('cors')
require('dotenv').config()

const app=express();
const port=process.env.PORT || 5000;

// middleware 
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ev8on.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
    try{
        await client.connect();
        console.log("database connected")
        const database=client.db('carMechanics')
        const serviceCollection=database.collection('service')
 

        // get api 

        app.get('/services', async(req,res)=>{
            const cursor=serviceCollection.find({})
            const services=await cursor.toArray()
            res.send(services)
        })

        // single get api 
        app.get('/services/:id', async(req,res)=>{
            const id=req.params.id;
            const query={_id: ObjectId(id)};
            const service=await serviceCollection.findOne(query)
            res.json(service)
        })
    //    post api 
    app.post('/services',async(req,res)=>{
       const service=req.body;
       console.log("hit the post", service)

        const result=await serviceCollection.insertOne(service)
        console.log(result)
        res.json(result)
    })


    // delete api 
    app.delete('/services/:id', async(req,res)=>{
        const id=req.params.id;
        const query={_id: ObjectId(id)}
        const result=await serviceCollection.deleteOne(query)
        res.json(result)
    })

    }

    finally{
        // await client.close(); 
    }
}
run().catch(console.dir);

app.get('/', (req,res)=>{
    res.send("this is the new")
})

app.listen(port,()=>{
    console.log('listen to port',port)
})