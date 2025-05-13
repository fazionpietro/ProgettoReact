import express from "express";
import userData from './types/userType';
import esercizioData from './types/esercizioType';
import schedaData from './types/schedaType';
import schedaEserciziData from './types/schedaEserciziType';
import * as sqlite3 from 'sqlite3';
import * as bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import cors from 'cors'
import * as dotenv from 'dotenv'
import { get } from "http";



dotenv.config();
const app = express()
const secretKey = process.env.SECRET_KEY || ""
const database = process.env.DATABASE || ""

app.use(cors());
app.use(express.json());

const server = app.listen(5000, () => {
    console.log("Server starded at http://localhost:5000 ")
    
});

process.on('SIGINT',function(){
    server.close();
});


const db = new sqlite3.Database( database, sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err);
    console.log("Succesfully connected to the database");
})

app.get("/", (req: express.Request, res: express.Response)=> {
    
    res.send("Hello from server")
})

const authenticateToken = (req: any, res: any, next: any) => {
    const bearerToken = req.headers['authorization'];
    //console.log(bearerToken)
    

    
    if (!bearerToken) return res.status(401).send('Token required');
    const token = bearerToken.slice(7)
    jwt.verify(token, secretKey, (err: any, user: any) => {
        if (err) return res.status(403).send('Invalid or expired token');
        req.user = user;
        next();
    });
  };


  app.get('/api/getPazienti',authenticateToken, async (req: express.Request, res: express.Response)=>{
    try {
        

        const response= await getPazienti()
        res.status(200).json(response);


    } catch (error:any) {
        res.status(401).json({"error":error.message});
        console.error(error.message);
    }
  })




  app.get('/api/getDatiUtente',authenticateToken, async (req: express.Request, res: express.Response)=>{
    try {
        const bearerToken = req.headers['authorization'];
      
        if(bearerToken){
            const decodedToken : any= jwt.decode(bearerToken.slice(7))
            if(decodedToken){
                const email : string = decodedToken.id
                const datiUtente : userData= await getDatiUtente(email)
                //console.log(datiUtente)
                res.status(200).send({
                    "email": datiUtente.email,
                    "ruolo": datiUtente.ruolo               
                });
            }else{
                res.status(401).send("Invalid or expired token");
            }

            

        }else{
            res.status(401).send("Token Required");

        }
    } catch (error: any) {
        res.status(401).json({"error":error.message});
        console.error(error.message);
    }
    
        
    })




  app.get('/api/checkAuth', (req: express.Request, res: express.Response)=> {
    try{
        res.header("Access-Control-Allow-Origin", "*");

        const bearerToken = req.headers['authorization'];

        if (bearerToken) {
            const token  = bearerToken.slice(7)
            //console.log(token)
            jwt.verify(token, secretKey, (err: any) => {
                if (err) throw new Error('Invalid or expired token');
                
            });

            
            res.status(200).send("");

        }else{
            res.status(401).send("Token Required");
        }

    }catch(err: any){
        res.status(401).json({"error":err.message});
        console.error(err.message);
    }

  }) 






  

app.get("/api/esercizi",authenticateToken, async (req, res)=> {
   
    try {
        res.header("Access-Control-Allow-Origin", "*");
        res.set({'Content-type': 'application/json'})
        const all = await getAllExcercise()
        //console.log(all)
        res.status(200).json(all)
        
    } catch (err: any) {
        res.status(500).json({"error":err.message});
        console.error(err.message);
    }
         
})


app.get("/api/schede",authenticateToken, async (req, res)=> {
   
    try {
        res.header("Access-Control-Allow-Origin", "*");
        res.set({'Content-type': 'application/json'})
        const all = await getAllSchede()
        //console.log(all)
        res.status(200).json(all)
        
    } catch (err: any) {
        res.status(400).json({"error":err.message});
        console.error(err.message);
    }
         
})

app.get("/api/schedeEsercizi",authenticateToken, async (req, res)=> {
   
    try {
        res.header("Access-Control-Allow-Origin", "*");
        res.set({'Content-type': 'application/json'})
        const all = await getAllSchedaEsercizi()
        //console.log(all)
        res.status(200).json(all)
        
    } catch (err: any) {
        res.status(500).json({"error":err.message});
        console.error(err.message);
    }
         
})


app.get('/api/schedeEserciziUtente',authenticateToken, async (req: express.Request<{},{},{},{email: string}>, res: express.Response)=> {
    try {
        if(!checkEmail(req.query.email)) throw new Error('invalid email');

        res.header("Access-Control-Allow-Origin", "*");
        res.set({'Content-type': 'application/json'})
        const data = await getUserSchedeEsercizi(req.query.email)
        res.status(200).json({data})
    } catch (err: any) {

        res.status(500).json({"error":err.message});
        
    }
})


app.post('/api/signup', async (req: express.Request<{},{},{}, userData>, res: express.Response)=> {
    const query: userData = req.query;


    
    
    try {
        if(!checkEmail(query.email)) throw new Error('invalid email');
            
            const all: userData []= await getAllIdenty()
            for(let i = 0; i < all.length; i++){
                
                
                if(all[i].email === query.email){
                    
                    throw new Error('email already exist')
                }
                if(await bcrypt.compare(query.password, all[i].password)){
                    
                    throw new Error('password already exist')
                }
                
            }
            const hashedPsw = await bcrypt.hash(query.password,8)
            await addUser(query.email, hashedPsw, query.ruolo)
            const token = jwt.sign({ id: query.email }, secretKey, { expiresIn: '1h' });
            res.status(200).json({"token": token})
    } catch (err: any) {
        res.status(400).json({"error":err.message});
    }
     
})


app.post('/api/login', async (req: express.Request<{},{},{}, userData>, res: express.Response)=> {
    const query: userData = req.query;
    let flag = false;
    
    try {
        res.header("Access-Control-Allow-Origin", "*");
        if(!checkEmail(query.email)) throw new Error('invalid email');
        const all: userData []= await getAllIdenty()
        for(let i = 0; i < all.length; i++){
            if((all[i].email === req.query.email) && (await bcrypt.compare(query.password, all[i].password))){
                
                flag=true;

            }
        }
        if(flag){
            const token = jwt.sign({ id: query.email }, secretKey, { expiresIn: '1h' });
            res.status(200).json({'token':token})
        }else{
            res.status(400).json({"error":'Invalid credentials'});
        }
        




    } catch (err: any) {
        res.status(400).json({"error":err.message});
        
    }
    
})




type newSchedaEsercizi = {
    esercizio_id: number[];
    user_email_id: string;
    nome_scheda: string;
    serie: number[];
    ripetizioni: number[];
}

app.post('/api/addSchedaEsercizi',authenticateToken, async (req: express.Request, res: express.Response)=> {
    
    try {
        console.log(req.body);
        console.log(await addEserciziScheda(req.body))
        res.status(200).json()
    } catch (err: any) {
        res.status(400).json({"error":err.message});
        
    }
    
})

app.post('/api/addEsercizi',authenticateToken, async (req: express.Request<{},{},{}, esercizioData>, res: express.Response)=> {
    const query: esercizioData = req.query;
    
    try {
        const newD = await addEsercizio(query)
        res.status(200).json({'success': newD})

    } catch (err: any) {
        res.status(400).json({"error":err.message});
        
    }
    
})

app.post('/api/addScheda',authenticateToken, async (req: express.Request<{},{},{}, schedaData>, res: express.Response)=> {
    const query: schedaData = req.query;
    
    try {
        const newD = await addScheda(query)
        res.status(200).json({'success': newD})

    } catch (err: any) {
        res.status(400).json({"error":err.message});
        
    }
    
})



function checkEmail(email: string){
    return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}

async function getAllSchedaEsercizi(){
    return new Promise<schedaEserciziData[]>((resolve, reject)=>{
        db.all('SELECT * FROM schedaEsercizi', (err, res: schedaEserciziData[])=>{
            if(err) reject(err);
            else resolve(res);
        })
    })
}
async function getAllSchede(){
    return new Promise<schedaData[]>((resolve, reject)=>{
        db.all('SELECT nome FROM schede', (err, res: schedaData[])=>{
            if(err) reject(err);
            else resolve(res);
        })
    })
}

async function getAllExcercise(){
    return new Promise<esercizioData[]>((resolve, reject)=>{
        db.all('SELECT * FROM esercizi', (err, res: esercizioData[])=>{
            if(err) 
                reject(err);
            else 
                resolve(res);
            
        })
    })
}


async function getAllIdenty() {
        
        return new Promise<userData[]>((resolve, reject) => {
        db.all('SELECT * FROM users', (err, rows: userData[]) => {
            if(err)
                reject(err);
            else
                resolve(rows);
        });
    });
}


function addUser(email: string,psw: string, ruolo: string) {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO users(email, password, ruolo) VALUES(?,?,?)', [email, psw, ruolo], (err) => {

            if(err)
                reject(err);
            else
                resolve(true);
        });
    });
}
async function getUserSchedeEsercizi(email: string){
    return new Promise<schedaEserciziData[]>((resolve, reject)=>{
        db.all(`SELECT * FROM schedaEsercizi INNER JOIN schede ON schedaEsercizi.scheda_id=schede.id WHERE user_email='${email}'`, (err, res: schedaEserciziData[])=>{
            if(err) reject(err);
            else resolve(res);
        })
    })
}


function getScheda(nome:string){
    return new Promise((resolve, reject)=>{
        db.get(`SELECT id FROM schede WHERE nome="${nome}"`, (err, res: {id: number}) => {  
            if(err) reject(err);
            
            resolve(res.id)
        });
    })
}

async function addEserciziScheda(data : newSchedaEsercizi){

    return new Promise(async (resolve, reject)=>{
        console.log("", data);
        
        await db.run('INSERT INTO schede(nome) VALUES(?)', [data.nome_scheda])
        let scheda_id = await getScheda(data.nome_scheda)
        console.log("", scheda_id)
        for (let index = 0; index < data.esercizio_id.length; index++) {
            console.log([   
                scheda_id,
                data.esercizio_id[index], 
                data.user_email_id,
                data.serie[index],
                data.ripetizioni[index]
            ])
            
            db.run('INSERT INTO SchedaEsercizi(scheda_id,esercizio_id,user_email,serie, ripetizioni) VALUES(?,?,?,?,?)', 
                [   
                    scheda_id,
                    data.esercizio_id[index], 
                    data.user_email_id,
                    data.serie[index],
                    data.ripetizioni[index]
                ],
                (err:any , res:any) => {
                    console.log("ok")
                    if(err) reject(err);
                });
            
        }
        resolve(true)
    })
}


async function addEsercizio(data : esercizioData){
    return new Promise((resolve, reject)=>{
        
        
        db.run('INSERT INTO esercizi(nome,descrizione,muscolo_targhet,difficolta) VALUES(?,?,?,?)', 
            [   data.nome,
                data.descrizione,
                data.muscolo_targhet,
                data.difficolta
            ], 
            (err: any, )=>{
                if(err) reject(err);
                resolve(true)
            })
    })
}

async function addScheda(data : schedaData){
    return new Promise((resolve, reject)=>{
        db.run('INSERT INTO esercizi(nome) VALUES(?)', 
            [data.nome], 
            (err: any )=>{
                if(err) reject(err);
                resolve(true)
            })
    })
}





async function getDatiUtente(email:string){
    return new Promise<userData>((resolve, reject)=>{
        
        db.get(`SELECT * FROM users WHERE email='${email}'`, (err:any, res : userData)=>{
            if(err) reject(err);
            resolve(res);
        })
    })
}

async function getPazienti(){
    return new Promise<userData>((resolve, reject)=>{
        
        db.all(`SELECT email FROM users WHERE ruolo="utente"`, (err:any, res : userData)=>{
            if(err) reject(err);
            resolve(res);
        })
    })
}