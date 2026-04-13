import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import validPipe from './middlewares/validPipe.js';
import prisma from './lib/prisma.js';
import Joi from 'joi';
import lobbyRoutes from './routes/lobby.routes.js';
import generateSecretKey from './utils/generateSecretKey.js';
import cardRoutes from './routes/card.routes.js';


const PORT = process.env.PORT || 4000;
const PREFIX = '/api/v1';

dotenv.config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());

app.get(`${PREFIX}/health`, (req, res) => {
    res.json({ status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
     });
});

app.get(`${PREFIX}/users`, async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get(`${PREFIX}/users/:id`, async (req, res) => {

    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(req.params.id) },
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ error: 'Internal Server Error' });   
    }

}); 

const userSchema = Joi.object({ name: Joi.string().required() })

app.post(`${PREFIX}/users`, validPipe(userSchema), async (req, res) => {
    try {
        const { name } = req.body;
        const user = await prisma.user.create({
        data: {
            name,
            playerId: generateSecretKey(),
        },
        });
        res.status(201).json(user);
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.use(`${PREFIX}/lobbies`, lobbyRoutes);
app.use(`${PREFIX}/cards`, cardRoutes);
app.use(`${PREFIX}/images`, express.static('/images'));

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// const io = Socket(server);


function closeServer(server) {
    return new Promise((resolve, reject) => {
        server.close(err => {
            if (err) {
                reject(err); 
            } else {
                resolve();   
            }
        });
    });
}

async function gracefulShutdown() {
    console.log('Shutting down gracefully...');
    try{
        await closeServer(server);
        await prisma.$disconnect();
        process.exit(0);

    }catch (err) {
        console.error('Shutdown error:', err);
        process.exit(1);
    }
}

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

