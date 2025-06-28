import * as sqlite3 from 'sqlite3';
import userData from '../types/userType'; 
let db: sqlite3.Database; 


export const setDatabase = (database: sqlite3.Database) => {
    db = database;
};

export async function getAllIdenty(): Promise<userData[]> {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM users', (err, rows: userData[]) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

export async function addUser(email: string, psw: string, ruolo: string, nome: string, cognome: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO users(email, password, ruolo, name, surname) VALUES(?,?,?,?,?)', [email, psw, ruolo, nome, cognome], (err) => {
            if (err) reject(err);
            else resolve(true);
        });
    });
}

export async function getDatiUtente(email: string): Promise<userData> {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM users WHERE email='${email}'`, (err: any, res: userData) => {
            if (err) reject(err);
            else resolve(res);
        });
    });
}

export async function getPazienti(): Promise<userData[]> {
    return new Promise((resolve, reject) => {
        db.all(`SELECT email FROM users WHERE ruolo="utente"`, (err: any, res: userData[]) => {
            if (err) reject(err);
            else resolve(res);
        });
    });
}

export async function deleteUtente(email: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        db.run(`DELETE FROM users WHERE email=?`, [email], function(err) {
            if (err) {
                reject(err);
            } else if (this.changes === 0) {
                reject(new Error("Utente non trovato"));
            } else {
                resolve();
            }
        });
    });
}