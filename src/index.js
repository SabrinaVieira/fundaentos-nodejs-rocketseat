const express = require('express');
const { v4: uuidv4 } = require("uuid")
const app = express();
app.use(express.json());

const customers = [];

app.post("/account", (request, respose)=>{
    const { cpf, name } = request.body; //tratando de inserção de dados
    const id = uuidv4();

    customers.push({
        cpf,
        name,
        id,
        statement: []
    })
    return respose.status(201).send()
});

app.listen(3333);