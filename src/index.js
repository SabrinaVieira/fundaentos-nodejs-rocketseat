const { request } = require('express');
const express = require('express');

const app = express();

app.use(express.json());

// requeste: recebendo
// response: enviando
// app.get("/", (request, respose)=>{
//     return respose.send("Olá Mundo!")
// })


app.get("/courses", (request, respose)=>{
    const query = request.query
    console.log(query)
//     return respose.send("Olá Mundo!")
//     return respose.json({message: "Olá Mundo de Sabrina!"})
return respose.json([
    "Curso 1",
    "Curso 2",
    "Curso 3"
    ])
})

app.post("/courses", (request, respose)=>{
    const body = request.body;
    console.log(body)

    return respose.json([
        "Curso 1",
        "Curso 2",
        "Curso 3",
        "Curso 4"
    ])
})

app.put("/courses/:id", (request, respose)=>{
    const { id } = request.params;
    console.log(id)
    return respose.json([
        "Curso 6",
        "Curso 2",
        "Curso 3",
        "Curso 4"
        ])
    })

app.patch("/courses/:id", (request, respose)=>{
    return respose.json([
        "Curso 6",
        "Curso 7",
        "Curso 3",
        "Curso 4"
        ])
})

app.delete("/courses/:id", (request, respose)=>{
    return respose.json("Curso 6", "Curso 2", "Curso 4")
})
    
// localhost:3333
app.listen(3333);