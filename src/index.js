const { request } = require('express');
const { response } = require('express');
const express = require('express');
const { v4: uuidv4 } = require("uuid")
const app = express();
app.use(express.json());

const customers = [];

function VerifyExitsAccountCPF (request, response, next) {
    const { cpf } = request.headers;
    const customer = customers.find((customer) => customer.cpf === cpf);

    if(!customer){
        return response.status(400).json({error: "Cliente não encontrado"})
    }

    request.customer = customer;
    return next();
}

function GetBalance (statement) {
    const balance = statement.reduce((acumulador, objetoOperation) =>{
        if(objetoOperation.type == 'credit'){
            return acumulador + objetoOperation.amount;
        } else {
            return acumulador - objetoOperation.amount;
        }
    }, 0);

    return balance;
}

app.post("/account", (request, respose) => {
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

app.post("/deposit", VerifyExitsAccountCPF, (request, response) => {
    const {customer} = request;
    const {description, amount} = request.body;

    const statementOperation = {
        description,
        amount,
        creat_at: new Date(),
        type: "credit"
    }

    customer.statement.push(statementOperation);

    return response.status(201).send();
})

app.post("/withdraw", VerifyExitsAccountCPF, (request, response)=>{
    const { amount } = request.body;
    const { customer } = request;

    const balance = GetBalance(customer.statement);

    if( balance < amount ){
        return response.status(400).json({error: "Insufficient funds"})
    }

    const statementOperation = {
        amount,
        creat_at: new Date(),
        type: "withdraw"
    }

    customer.statement.push(statementOperation);

    return response.status(201).send();
})
// app.use(VerifyExitsAccountCPF);

// dentro da rota, esse Middleware é usado apenas nessa rotas
app.get("/statement", VerifyExitsAccountCPF, (request, response) => {
    const {customer} = request;
    return response.json(customer.statement);
}) 

app.get("/statement/date", VerifyExitsAccountCPF, (request, response) => {
    const {customer} = request;
    const { date } = request.query;
    
    const dateFormat = new Date(date + " 00:00");

    const statement = customer.statement.filter(((statem)=> 
        statem.creat_at.toDateString() === new Date(dateFormat).toDateString()
    ))

    console.log(statement);

    return response.json(statement)
})

app.put("/account", VerifyExitsAccountCPF, (request, response) => {
    const { name } = request.body;
    const { customer } = request;

    customer.name = name;

    return response.status(201).send();
})

app.get("/account", VerifyExitsAccountCPF, (request, response) => {
    const { customer } = request;
    
    return response.json(customer);
})

app.delete("/account", VerifyExitsAccountCPF, (request, response) => {
    const { customer } = request;

    // splice(ondeInicia, ateOnde)
    customers.splice(customer, 1)
    return response.status(200).json(customers);
})

app.get("/balance", VerifyExitsAccountCPF, (request, response) => {
    const { customer } = request;

    const balance = GetBalance(customer.statement);

    return response.json(balance);
})


app.listen(3333);