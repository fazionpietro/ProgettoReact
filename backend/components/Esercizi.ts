import * as sqlite3 from 'sqlite3';
import esercizioData from '../types/esercizioType'; 

let db: sqlite3.Database;

export const setDatabase = (database: sqlite3.Database) => {
    db = database;
};

export async function getAllExcercise(): Promise<esercizioData[]> {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM esercizi', (err, res: esercizioData[]) => {
            if (err) reject(err);
            else resolve(res);
        });
    });
}

export async function addEsercizio(data: esercizioData): Promise<boolean> {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO esercizi(nome, descrizione, muscolo_targhet, difficolta) VALUES(?,?,?,?)',
            [data.nome, data.descrizione, data.muscolo_targhet, data.difficolta],
            (err: any) => {
                if (err) reject(err);
                resolve(true);
            });
    });
}

export async function getNomeEsercizio(): Promise<string[]> {
    return new Promise((resolve, reject) => {

        db.all(`SELECT nome FROM esercizi INNER JOIN schedaEsercizi ON esercizi.id=schedaEsercizi.esercizio_id`, (err, res: string[]) => {
            if (err) reject(err);
            else resolve(res);
        });
    });
}

export async function deleteEsercizio(id: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        db.run(`DELETE FROM Esercizi WHERE id=?`, [id], function(err) {
            if (err) {
                reject(err);
            } else if (this.changes === 0) {
                reject(new Error("Esercizio non trovato"));
            } else {
                resolve();
            }
        });
    });
}