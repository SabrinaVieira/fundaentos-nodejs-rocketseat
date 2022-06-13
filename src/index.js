const express = require('express');
const { v4: uuidv4 } = require("uuid")
const app = express();
app.use(express.json());

const customers = [];

app.post("/account", (request, respose)=>{
    const { cpf, name } = request.body; //tratando de inserção de dados
    const cusomerAlreadyExists = customers.some((customers) => customers.cpf === cpf)

    if(cusomerAlreadyExists){
        return respose.status(400).json({error: "Cliente já existe!"})
    }
    customers.push({
        cpf,
        name,
        id: uuidv4(),
        statement: []
    })
    return respose.status(201).send()
});

app.listen(3333);