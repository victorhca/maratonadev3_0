//configurando servidor
const express = require("express")
const server = express()

//configurando o servidor para apresentar os arquivos estáticos
server.use(express.static('public'))

//habilitar body do formulário
server.use(express.urlencoded({extended: true}))

//configurando o banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user:'postgres', 
    password:'1234',
    host:'localhost',
    port:5432,
    database:'doe'
})


//configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server, 
    noCache: true,
})

//configurando a apresentação da página
server.get("/", function(req, res){

    db.query("select * from donors", function(err, result){
        if(err) return res.send("Erro ao buscar dados.")

        const donors = result.rows
        return res.render("index.html", {donors})

    })
})

server.post("/", function(req, res){
    //recuperando os dados do formulário
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if(name == "" || email == "" || blood == ""){
        return res.send("Todos os campos devem ser preenchidos.")
    }

    const query = `insert into donors ("name", "email", "blood") values ($1, $2, $3)`

    db.query(query, [name, email, blood], function(err){
        //fluxo de erro
        if(err) return res.send("Erro de banco de dados.")

        //fluxo ideal
        return res.redirect("/")
    })

    
})

//ligar o servidor e direcionar para a porta 3000
server.listen(3000)