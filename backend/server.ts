import sqlite3 from 'sqlite3'
import express, { Request, Response } from 'express';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import userData from './types/userType'





const app = express()
const secretKey = 'triceratops-are-the-best-2025@1234'


app.listen(5000, () => {
    console.log("Server starded at http://localhost:5000")
    
});


const db = new sqlite3.Database("./data/Fitness.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err);
    console.log("Succesfully connected to the database");
})

app.get("/", (req: Request, res: Response)=> {
    console.log(req.headers) 
    res.send("Hello from server")
})



/*
app.get("/api/prova", async (req, res)=> {
   
    try {
        res.header("Access-Control-Allow-Origin", "*");
        res.set({
            'Content-type': 'application/json', 
        })
        
        res.status(200).json(all)
        
    } catch (err) {
        res.status(400).json({"error":err.message});
        console.error(err.message);
    }
         
})*/





app.post('/signup', async (req: Request<{},{},{}, userData>, res: Response)=> {
    const query: userData = req.query;


    
    
    try {
        if(!checkEmail(query.email)) throw new Error('invalid email');
            
            const all: userData []= await getAllIdenty()
            for(let i = 0; i < all.length; i++){
                
                
                if(all[i].email === query.email){
                    
                    throw new Error('email already exis')
                }
                if(await bcrypt.compare(query.password, all[i].password)){
                    
                    throw new Error('password already exist')
                }
                
            }
            const hashedPsw = await bcrypt.hash(query.password,8)
            await addUser(query.email, hashedPsw, query.role)
            const token = jwt.sign({ id: query.email }, secretKey, { expiresIn: '1h' });
            res.status(200).json({token})
    } catch (err) {
        res.status(400).json({"error":err.message});
    }
     
})


app.post('/login', async (req: Request<{},{},{}, userData>, res: Response)=> {
    const query: userData = req.query;
    let flag = false;
    
    try {
        if(!checkEmail(query.email)) throw new Error('invalid email');
        const all: userData []= await getAllIdenty()
        for(let i = 0; i < all.length; i++){
            if((all[i].email === req.query.email) && (await bcrypt.compare(query.password, all[i].password))){
                
                flag=true;

            }
        }
        if(flag)
            res.status(200).json({})
        else
        res.status(400).json({"error":'Invalid credentials'});

        




    } catch (err) {
        res.status(400).json({"error":err.message});
        
    }
    
})










function checkEmail(email){
    return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}


/*






*/
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


function addUser(email,psw, role) {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO users(email, password, role) VALUES(?,?,?)', [email, psw, role], (err) => {

            if(err)
                reject(err);
            else
                resolve(true);
        });
    });
}
