import sqlite3 from 'sqlite3'
import express from 'express' 


const app = express()
app.use(express.json())


app.listen(5000, () => {
    console.log("Server starded at http://localhost:5000")
});


const db = new sqlite3.Database("./Fitness.db", sqlite3.OPEN_READWRITE, (err) => {
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
        const data = await getExercises();
        console.log(data)
        res.status(200).json(data)
        
    } catch (err) {
        res.status(400).json({"error":err.message});
        console.error(err.message);
    }
        

        
        
    
})

async function getExercises() {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM prova', (err, rows) => {
            if(err)
                reject(err);
            else
                resolve(rows);
        });
    });
}