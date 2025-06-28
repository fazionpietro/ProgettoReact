import * as sqlite3 from 'sqlite3';

import * as users from './Users';
import * as esercizi from './Esercizi';
import * as schede from './Schede';

export const initializeDatabase = (database: sqlite3.Database) => {
    users.setDatabase(database);
    esercizi.setDatabase(database);
    schede.setDatabase(database);
};


export { users, esercizi, schede };
