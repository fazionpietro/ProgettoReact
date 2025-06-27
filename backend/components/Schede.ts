import * as sqlite3 from 'sqlite3';
import schedaData from '../types/schedaType'; 
import schedaEserciziData from '../types/schedaEserciziType';
import { rejects } from 'assert';

let db: sqlite3.Database;

export const setDatabase = (database: sqlite3.Database) => {
    db = database;
};

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

export async function getAllSchede(): Promise<schedaData[]> {
    return new Promise((resolve, reject) => {
        db.all('SELECT nome FROM schede', (err, res: schedaData[]) => {
            if (err) reject(err);
            else resolve(res);
        });
    });
}

export async function getAllSchedaEsercizi(): Promise<schedaEserciziData[]> {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM schedaEsercizi', (err, res: schedaEserciziData[]) => {
            if (err) reject(err);
            else resolve(res);
        });
    });
}

export async function getUserSchedeEsercizi(email: string): Promise<eserciziUtente[]> {
    return new Promise((resolve, reject) => {
        db.all(`SELECT
                SchedaEsercizi.id,
                SchedaEsercizi.scheda_id,
                SchedaEsercizi.esercizio_id,
                SchedaEsercizi.user_email,
                SchedaEsercizi.serie,
                SchedaEsercizi.ripetizioni,
                Schede.nome AS nome_scheda,
                Schede.Note AS note
                FROM SchedaEsercizi
                INNER JOIN Schede ON SchedaEsercizi.scheda_id = Schede.id
                WHERE SchedaEsercizi.user_email = ?`, [email], (err, res: eserciziUtente[]) => {
            if (err) reject(err);
            else resolve(res);
        });
    });
}

export async function getSchedaId(nome: string): Promise<number> {
    return new Promise((resolve, reject) => {
        db.get(`SELECT id FROM schede WHERE nome=?`, [nome], (err, res: { id: number }) => {
            if (err) reject(err);
            else if (!res) reject(new Error(`Scheda con nome "${nome}" non trovata.`));
            else resolve(res.id);
        });
    });
}

export async function getSchedeUtente(): Promise<schedaData[]> {
    return new Promise((resolve, rejects) => {
        
        db.all(`SELECT * FROM schede`, (err, res: schedaData[]) => {
            if (err) rejects(err);
            else resolve(res);
        });
    });
}

export async function addEserciziScheda(data: schedaEserciziData): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
        let scheda_id: number;

        if (data.id) { 
            scheda_id = data.id;
        } else { 
            try {
                await db.run('INSERT INTO schede(nome, note) VALUES(?,?)', [data.nome_scheda, data.note]);
                scheda_id = await getSchedaId(data.nome_scheda);
            } catch (error) {
                return reject(error); 
            }
        }

        const stmt = db.prepare('INSERT INTO SchedaEsercizi(scheda_id, esercizio_id, user_email, serie, ripetizioni) VALUES(?,?,?,?,?)');
        for (let i = 0; i < data.esercizio_id.length; i++) {
            stmt.run(
                scheda_id,
                data.esercizio_id[i],
                data.user_email_id,
                data.serie[i],
                data.ripetizioni[i],
                function(err: any) {
                    if (err) {
                        stmt.finalize();
                        return reject(err);
                    }
                }
            );
        }
        stmt.finalize((err) => {
            if (err) reject(err);
            else resolve(true);
        });
    });
}

export async function addScheda(data: schedaData): Promise<boolean> {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO schede(nome, note) VALUES(?,?)', 
            [data.nome, data.note], 
            (err: any) => {
                if (err) reject(err);
                resolve(true);
            });
    });
}

export async function deleteExSCheda(id: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        db.run(`DELETE FROM schedaEsercizi WHERE id=?`, [id], function(err) {
            if (err) {
                reject(err);
            } else if (this.changes === 0) {
                reject(new Error("Record SchedaEsercizi non trovato"));
            } else {
                resolve();
            }
        });
    });
}