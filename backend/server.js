import sqlite3 from 'sqlite3'
import express from 'express'
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'



const app = express()
app.use(express.json())
const secretKey = 'triceratops-are-the-best-2025@1234'


app.listen(5000, () => {
    console.log("Server starded at http://localhost:5000")
    
});


const db = new sqlite3.Database("./data/Fitness.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err);
    console.log("Succesfully connected to the database");
})

app.get("/", (req, res)=> {
    console.log(req.headers) 
    res.send("Hello from server")
})




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
         
})



app.post('/signup', async (req, res)=> {
    if(!checkEmail(req.query.email)) return res.status(401).json({"error":"invalid email"});
    const email = req.query.email
    const role = req.query.role
    
    try {
        
        const all = await getAllIdenty()
        
        
        for(let i = 0; i < all.length; i++){
            if(all[i].email === email){
                
                return res.status(401).json({"error":"email already exist"});;
            }
            if(await bcrypt.compare(req.query.psw, all[i].password)){
                
                return res.status(401).json({"error":"password already exist"});;
            }
            
        }
        const hashedPsw = await bcrypt.hash(req.query.psw,8)
        await addUser(email, hashedPsw, role)
        const token = jwt.sign({ id: email }, secretKey, { expiresIn: '1h' });
        res.status(200).json({token})
    } catch (err) {
        console.error(err)
        res.status(400).json({"error":err.message});
    }
})


app.post('/login', async (req, res)=> {
    if(!checkEmail(req.query.email)) return res.status(401).json({"error":"invalid email"});
    var token;
    try {
        
        const all = await getAllIdenty()
       
        
        for(let i = 0; i < all.length; i++){
        
            
            if((all[i].email === req.query.email) && (await bcrypt.compare(req.query.psw, all[i].password))){
                token = jwt.sign({ id: req.query.email }, secretKey, { expiresIn: '1h' });
                return res.status(200).json({token});
            }
            
        }
        res.status(401).json({"error":"user dont exist"});

        
    } catch (err) {
        console.error(err)
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










async function getAllIdenty() {
    return new Promise((resolve, reject) => {
        db.all('SELECT email,password FROM users', (err, rows) => {
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
                resolve();
        });
    });
}
