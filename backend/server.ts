import express from "express";
import * as sqlite3 from 'sqlite3';
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import * as dotenv from 'dotenv';

import path from "path";

import userData from './types/userType';
import esercizioData from './types/esercizioType';
import schedaData from './types/schedaType';
import schedaEserciziData from './types/schedaEserciziType';


import { users, esercizi, schede, initializeDatabase } from './components/';


dotenv.config();
const app = express();
const secretKey = process.env.SECRET_KEY || "";
const databasePath = process.env.DATABASE || ""; 

app.use(cors());
app.use(express.json());
const frontendDistPath = path.resolve('../frontend/dist');
console.log(`Serving static files from: ${frontendDistPath}`);

let isDbClosed = false;

app.use(express.static(frontendDistPath));

const server = app.listen(5000, () => {
    console.log("Server started, can now view the \x1b[1mmproject\x1b[0m in the browser\n\n\t\x1b[1mLocal:\t\t\x1b[36mhttp://localhost:5000\x1b[0m\n");
});

app.get("/", (req, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"));
});


process.on('SIGINT', function(){
    if (!isDbClosed) {
        db.close((err) => {
            if (err) {
                console.error("Error closing database:", err.message);
            } else {
                console.log("Database connection closed.");
                isDbClosed = true;
            }
        });
    } else {
        console.log("Database already closed, skipping further close attempt.");
    }

    server.close(async () => {
        console.log("Server closed.");
        process.exit(0); 
    });
});

const db = new sqlite3.Database(databasePath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error("Error connecting to database:", err.message);
    console.log("Successfully connected to the database");

    
    initializeDatabase(db);

    db.run("PRAGMA foreign_keys = ON;", (err) => {
        if (err) {
            console.error("Error enabling Foreign key:", err.message);
        } else {
            console.log("Foreign key Enabled.");
        }
    });
});






const authenticateToken = (req: any, res: any, next: any) => {
    const bearerToken = req.headers['authorization'];
    if (!bearerToken) return res.status(401).send('Token required');
    const token = bearerToken.slice(7);
    jwt.verify(token, secretKey, (err: any, user: any) => {
        if (err) return res.status(403).send('Invalid or expired token');
        req.user = user;
        next();
    });
};

app.get('/api/getPazienti', authenticateToken, async (req: express.Request, res: express.Response) => {
    try {
        const response = await users.getPazienti();
        res.status(200).json(response);
    } catch (error: any) {
        res.status(401).json({"error": error.message});
        console.error(error.message);
    }
});

app.get('/api/getDatiUtente', authenticateToken, async (req: express.Request, res: express.Response) => {
    try {
        const bearerToken = req.headers['authorization'];
        if (bearerToken) {
            const decodedToken: any = jwt.decode(bearerToken.slice(7));
            if (decodedToken) {
                const email: string = decodedToken.id;
                const datiUtente: userData = await users.getDatiUtente(email);
                res.status(200).send({
                    "username": `${datiUtente.name} ${datiUtente.surname}`,
                    "email": datiUtente.email,
                    "ruolo": datiUtente.ruolo
                });
            } else {
                res.status(401).send("Invalid or expired token");
            }
        } else {
            res.status(401).send("Token Required");
        }
    } catch (error: any) {
        res.status(401).json({"error": error.message});
        console.error(error.message);
    }
});

app.get('/api/getAllIdenty', authenticateToken, async (req: express.Request, res: express.Response) => {
    try {
        const bearerToken = req.headers['authorization'];
        if (bearerToken) {
            const decodedToken: any = jwt.decode(bearerToken.slice(7));
            if (decodedToken) {
                const allUsers = await users.getAllIdenty();
                res.status(200).send(allUsers);
            }
        }
    } catch (error: any) {
        res.status(401).json({"error": error.message});
        console.error(error.message);
    }
});

app.get('/api/checkAuth', (req: express.Request, res: express.Response) => {
    try {
        res.header("Access-Control-Allow-Origin", "*");
        const bearerToken = req.headers['authorization'];
        if (bearerToken) {
            const token = bearerToken.slice(7);
            const decodedToken: any = jwt.decode(bearerToken.slice(7));
            jwt.verify(token, secretKey, (err: any) => {
                if (err) throw new Error('Invalid or expired token');
            });
            res.status(200).send({ruolo: decodedToken.ruolo});
        } else {
            res.status(401).send("Token Required");
        }
    } catch (err: any) {
        res.status(401).json({"error": err.message});
        console.error(err.message);
    }
});

app.get("/api/esercizi", authenticateToken, async (req, res) => {
    try {
        res.header("Access-Control-Allow-Origin", "*");
        res.set({'Content-type': 'application/json'});
        const all = await esercizi.getAllExcercise();
        res.status(200).json(all);
    } catch (err: any) {
        res.status(500).json({"error": err.message});
        console.error(err.message);
    }
});

app.get("/api/schede", authenticateToken, async (req, res) => {
    try {
        res.header("Access-Control-Allow-Origin", "*");
        res.set({'Content-type': 'application/json'});
        const all = await schede.getAllSchede();
        res.status(200).json(all);
    } catch (err: any) {
        res.status(400).json({"error": err.message});
        console.error(err.message);
    }
});

app.get("/api/schedeEsercizi", authenticateToken, async (req, res) => {
    try {
        res.header("Access-Control-Allow-Origin", "*");
        res.set({'Content-type': 'application/json'});
        const all = await schede.getAllSchedaEsercizi();
        res.status(200).json(all);
    } catch (err: any) {
        res.status(500).json({"error": err.message});
        console.error(err.message);
    }
});

type eserciziUtente = {
    id: number;
    scheda_id: number;
    esercizio_id: number;
    user_email: string;
    nome_scheda: string;
    serie: number;
    ripetizioni: number;
    note: string; 
}

app.get('/api/schedeEserciziUtente',authenticateToken, async (req: express.Request<{},{},{},{email: string}>, res: express.Response)=> {
    try {
        if(!checkEmail(req.query.email)) throw new Error('invalid email');

        res.header("Access-Control-Allow-Origin", "*");
        res.set({'Content-type': 'application/json'})
        const data : eserciziUtente[]= await schede.getUserSchedeEsercizi(req.query.email)
        
        res.status(200).json({data})
    } catch (err: any) {

        res.status(500).json({"error":err.message});
        
    }
})
app.get('/api/getNomeEsercizio', authenticateToken, async (req, res) => {
    try {
        res.header("Access-Control-Allow-Origin", "*");
        res.set({'Content-type': 'application/json'});
        const data = await esercizi.getNomeEsercizio();
        res.status(200).json({ data });
    } catch (err: any) {
        res.status(500).json({"error": err.message});
    }
});

app.get('/api/getSchedeUtente', authenticateToken, async (req, res) => {
    try {
        res.header("Access-Control-Allow-Origin", "*");
        res.set({'Content-type': 'application/json'});
        const data = await schede.getSchedeUtente();
        res.status(200).json({ data });
    } catch (err: any) {
        res.status(500).json({"error": err.message});
    }
});

app.post('/api/signup', async (req: express.Request<{}, {}, {}, userData>, res: express.Response) => {
    const query: userData = req.query;
    try {
        if (!checkEmail(query.email)) throw new Error('Invalid email');
        const allUsers: userData[] = await users.getAllIdenty();
        for (let i = 0; i < allUsers.length; i++) {
            if (allUsers[i].email === query.email) {
                throw new Error('Email already exists');
            }
            
            if (await bcrypt.compare(query.password, allUsers[i].password)) {
                 throw new Error('Password already exists for another user. Choose a different one.');
            }
        }
        const hashedPsw = await bcrypt.hash(query.password, 8);
        await users.addUser(query.email, hashedPsw, query.ruolo, query.name, query.surname);
        const token = jwt.sign({ id: query.email, ruolo: query.ruolo }, secretKey, { expiresIn: '1h' });
        res.status(200).json({"token": token});
    } catch (err: any) {
        res.status(400).json({"error": err.message});
    }
});

app.post('/api/login', async (req: express.Request<{}, {}, {}, userData>, res: express.Response) => {
    const query: userData = req.query;
    try {
        res.header("Access-Control-Allow-Origin", "*");
        if (!checkEmail(query.email)) throw new Error('Invalid email');
        const allUsers: userData[] = await users.getAllIdenty();
        let userFound: userData | undefined;

        for (let i = 0; i < allUsers.length; i++) {
            if (allUsers[i].email === query.email && (await bcrypt.compare(query.password, allUsers[i].password))) {
                userFound = allUsers[i];
                break;
            }
        }

        if (userFound) {
            const token = jwt.sign({ id: query.email, ruolo: userFound.ruolo }, secretKey, { expiresIn: '1h' });
            res.status(200).json({'token': token});
        } else {
            res.status(400).json({"error": 'Invalid credentials'});
        }
    } catch (err: any) {
        res.status(400).json({"error": err.message});
    }
});

app.post('/api/addSchedaEsercizi', authenticateToken, async (req: express.Request, res: express.Response) => {
    try {
        await schede.addEserciziScheda(req.body);
        res.status(200).json({success: true});
    } catch (err: any) {
        res.status(400).json({"error": err.message});
    }
});

app.post('/api/addEsercizi', authenticateToken, async (req: express.Request, res: express.Response) => {
    const data: esercizioData = req.body;
    try {
        const newD = await esercizi.addEsercizio(data);
        res.status(200).json({'success': newD});
    } catch (err: any) {
        res.status(400).json({"error": err.message});
    }
});

app.post('/api/addScheda', authenticateToken, async (req: express.Request<{}, {}, {}, schedaData>, res: express.Response) => {
    const query: schedaData = req.query; // Assumi che 'note' sia presente in schedaData
    try {
        const newD = await schede.addScheda(query);
        res.status(200).json({'success': newD});
    } catch (err: any) {
        res.status(400).json({"error": err.message});
    }
});

app.delete('/api/deleteExSCheda/:id', authenticateToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        await schede.deleteExSCheda(id);
        res.status(200).json({ success: true });
    } catch (err: any) {
        res.status(500).json({"error": err.message});
    }
});

app.delete('/api/deleteSCheda/:id', authenticateToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        await schede.deleteSCheda(id);
        res.status(200).json({ success: true });
    } catch (err: any) {
        res.status(500).json({"error": err.message});
    }
});

app.delete('/api/deleteEsercizio/:id', authenticateToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        await esercizi.deleteEsercizio(id);
        res.status(200).json({ success: true });
    } catch (err: any) {
        res.status(500).json({"error": err.message});
    }
});

app.delete('/api/deleteUtente/:email', authenticateToken, async (req, res) => {
    try {
        await users.deleteUtente(req.params.email);
        res.status(200).json({ success: true });
    } catch (err: any) {
        res.status(500).json({"error": err.message});
    }
});

function checkEmail(email: string): boolean {
    return String(email)
        .toLowerCase()
        .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) !== null;
}