import Fastify from 'fastify'
import { Pool } from 'pg'
import cors from '@fastify/cors'

const sql = new Pool({
    user: "postgres",
    password: "senai",
    host: "localhost",
    port: 5432,
    database: "adrian"
})

const servidor = Fastify();

servidor.register(cors, {
    origin: '*',
    methods: ['PUT', 'POST', 'DELETE', 'GET']
});

servidor.post('/login', async (request, reply) => {
    const body = request.body;
    if (!body || !body.email || !body.senha) {
        reply.status(400).send({error: "E-mail e senha obrigatórios!"})
    }
    const resultado = await sql.query('select * from Usuario where email = $1 AND senha = $2', [body.email, body.senha])    

    if (resultado.rows.length === 0) {
        reply.status(401).send({message: "Usuário ou senha inválidos!", login: false})
    } else if (resultado.rows.length === 1) {
        reply.status(200).send({message: "Usuario logado", login: true})
    }

})

servidor.get('/usuarios', async () => {
    const resultado = await sql.query('SELECT * from Usuario')
    return resultado.rows
})

servidor.post('/usuarios', async (request, reply) => {
    const body = request.body;

    if (!body || !body.senha || !body.email) {
        return reply.status(400).send({
            message:"E-mail e senha são obrigatórios!"
        })
    }

    const resultado = await sql.query('INSERT INTO Usuario (senha, email) VALUES ($1, $2)', [body.senha, body.email])          
    reply.status(201).send({message: 'Usuário Criado!'})
})

servidor.put('/usuarios/:id', async (request, reply) => {
    const body = request.body;
    const id = request.params.id;

    if (!body || !body.senha || !body.email) {
        return reply.status(400).send({
            message: "e-mail e senha são obrigatórios!"
        })
    } else if (!id) {
        return reply.status(400).send({
            message: "Faltou o ID!"
        })
    }

    const usuario = await sql.query('select * from usuario where id_usuario = $1', [id])  
    if (usuario.rows.length === 0) {
        return reply.status(400).send({
            message: "Usuário não existe!"
        })
    }

    const resultado = await sql.query('UPDATE Usuario SET senha = $1, email = $2 WHERE id_usuario = $3', [body.senha, body.email, id])      
    reply.status(201).send({message: `Usuario: ${body.email} alterado!`})          
})

servidor.delete('/usuarios/:id', async (request, reply) => {
    const id = request.params.id
    const resultado = await sql.query('DELETE FROM Usuario where id_usuario = $1', [id]) 
    console.log(resultado);    
    reply.status(200).send({message:'Usuário Deletado!'})
})


servidor.get('/arquivos', async () => {
    const resultado = await sql.query('select * from Arquivo')
    return resultado.rows
})

servidor.post('/arquivos', async (request, reply) => {
    const body = request.body;

    if (!body || !body.nome || !body.lingprog) {
        return reply.status(400).send({
            message:"Informações faltando"
        })
    }

    const resultado = await sql.query('INSERT INTO arquivos (Nome, LingProg) VALUES ($1, $2)', [body.nome, body.lingprog])          
    reply.status(201).send({message: 'Arquivo Criado!'})
})

servidor.put('/arquivos/:id', async (request, reply) => {
    const body = request.body;
    const id = request.params.id;

    if (!body || !body.nome || !body.lingprog) {
        return reply.status(400).send({
            message: "Nome e Linguagem selecionada são obrigatórios!"
        })
    } else if (!id) {
        return reply.status(400).send({
            message: "Faltou o ID!"
        })
    }

    const arquivo = await sql.query('SELECT * from Arquivo where id_arquivo = $1', [id])  
    if (arquivo.rows.length === 0) {
        return reply.status(400).send({
            message: "Usuário não existe!"
        })
    }

    const resultado = await sql.query('UPDATE Arquivo SET Nome = $1, LingProg = $2 WHERE id_arquivo = $3', [body.nome, body.lingprog, id])      
    reply.status(201).send({message: `Arquivo: ${body.email} alterado!`})          
})

servidor.delete('/arquivos/:id', async (request, reply) => {
    const id = request.params.id
    const resultado = await sql.query('DELETE FROM Arquivo where id_arquivo = $1', [id]) 
    console.log(resultado);    
    reply.status(200).send({message:'Arquivo Deletado!'})
})

servidor.listen({   
    port: 3000
})