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
    const resultado = await sql.query('select * from usuario where email = $1 AND senha = $2', [body.email, body.senha])    

    if (resultado.rows.length === 0) {
        reply.status(401).send({message: "Usuário ou senha inválidos!", login: false})
    } else if (resultado.rows.length === 1) {
        reply.status(200).send({message: "usuario logado", login: true})
    }

})

servidor.get('/usuarios', async () => {
    const resultado = await sql.query('select * from usuario')
    return resultado.rows
})

servidor.post('/usuarios', async (request, reply) => {
    const body = request.body;

    if (!body || !body.senha || !body.email) {
        return reply.status(400).send({
            message:"E-mail e senha são obrigatórios!"
        })
    }

    const resultado = await sql.query('INSERT INTO usuario (senha, email) VALUES ($1, $2)', [body.senha, body.email])          
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

    const resultado = await sql.query('UPDATE usuario SET senha = $1, email = $2 WHERE id_usuario = $3', [body.senha, body.email, id])      
    reply.status(201).send({message: `usuario: ${body.email} alterado!`})          
})

servidor.delete('/usuarios/:id', async (request, reply) => {
    const id = request.params.id
    const resultado = await sql.query('DELETE FROM usuario where id_usuario = $1', [id]) 
    console.log(resultado);    
    reply.status(200).send({message:'Usuário Deletado!'})
})

servidor.listen({   
    port: 3000
})