import express from 'express'
import http from 'http'
import { Server as socketServer } from 'socket.io'
import pgPromise from 'pg-promise'



const app = express()
const server = http.createServer(app)
const io = new socketServer(server, {
    cors: {
        origin: "http://localhost:5173"
    }
})

const conectionString = 'postgres://postgres:tReFoS0nyTFYncT@sddb.internal:5432/postgres';
const pgp = pgPromise();
const db = pgp(conectionString)

io.on('connect', socket => {
    console.log(socket.id)

    socket.on('message', (body) => {
        console.log(body)
        socket.broadcast.emit('message', {
            body,
            from: socket.id.slice(6)
        })

    })
})

app.get('/consulta', async (req, res) => {
    try {
      const result = await db.any('SELECT * FROM students');
      res.json(result);
    } catch (error) {
      console.error('Error al ejecutar la consulta', error);
      res.status(500).send('Error en el servidor');
    }
  });


server.listen(3000)
console.log('Server on port', 3000);