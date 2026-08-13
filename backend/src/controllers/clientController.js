const { Client } = require("../models")

async function createClient(req,res){
    const {name} = req.body

    if(!name){
        return res.status(400).json({error:"name is required!"})
    }
    const client = await Client.create({agencyId:req.auth.agencyId,name})

res.status(201).json(client)
}


async function listClient(req,res) {
    const clients = await Client.find({agencyId:req.auth.agencyId}).sort({name:1})

    res.json(clients)
}

async function getClient(req,res) {
    const client = await Client.findOne({_id:req.params.id,agencyId:req.auth.agencyId})

    if(!client){
        return res.status(404).json({error:"Client not found"})
    }
    res.json(client)
}

module.exports = {createClient,getClient,listClient}