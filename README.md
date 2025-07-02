## Dashboard per la creazione di un piano di esercizi fisici settimanali

---

#### Autori

- **VR501347**: Fazion Pietro
- **VR500305**: Dal Degan Pietro

---

## Front End

#### Aspetto Applicazione Web

###### Pagina Login

i vari utenti possono accedere inserendo la propria mail e la propria password, nel caso non si abbia un account da questa pagina si può navigare alla pagina **Register** per crearne uno nuovo

###### Pagina Register

i nuovi utenti possono registrarsi inserendo le credenziali e il ruolo tra Medico, Personal trainer, e utente

###### Home Page

qui gli utenti possono visualizzare i propri file di dati giornalieri e gli storici dei dati

###### Pagina Esercizi

utenti e medici visualizzano, i nomi, la descrizione e la difficoltà dei singoli esercizi

###### Pagina Pazienti

pagina visibili solo ai medici e personal trainer dove visualizzano la lista dei pazienti seguiti, da questa pagina possono creare nuovi utenti, eliminare quelli presenti, e visualizzare tramite i pulsante visualizza le loro schede.

###### Pagina Routine

visibile solo agli utenti, qui possono vedere le schede create per loro dai medici/personal trainer con una descrizione impostata che può specificare la frequenza della scheda nella settimana e gli obbiettivi dell'allenamento. Da questa pagina l'utente può creare una scheda personale e eliminare quelle già presenti. Navigando con il pulsante visualizza l'utente può vedere di quali esercizi è composta una determinata scheda e nel caso aggiungerne di nuovi o eliminare i precedenti

#### Componenti e Funzionalità Aggiuntive

###### Navbar Component

componente di navigazione principale che si adatta dinamicamente in base al ruolo dell'utente. Include il logo dell'applicazione, i link di navigazione specifici per ruolo e il pulsante di logout che cancella la sessione utente.

###### Protezione delle Route

- **PrivateRoute**: componente che protegge le pagine accessibili solo agli utenti autenticati, verifica la validità del token e reindirizza al login se necessario
- **PrivateMedRoute**: componente specializzato per proteggere le pagine riservate solo a medici e personal trainer, con controllo aggiuntivo del ruolo utente

###### Sistema di Autenticazione

gestione completa dell'autenticazione con token JWT, controllo automatico della validità delle sessioni e reindirizzamento intelligente basato sui permessi utente.

#### Funzionalità Applicazione Web

- visualizzazione dataset
- creazione, eliminazione utenti
- creazione, eliminazione, modifica schede personalizzate con obbiettivi e frequenza settimanale
- visualizzazione e gestione pazienti
- sistema di autenticazione e autorizzazione basato su ruoli
- navigazione protetta e personalizzata per tipologia utente
- gestione sessioni utente con logout automatico

#### Tecnologie e Librerie usate

- **typescript**: creazione dell'applicazione web
- **chart.js** e **react-chartjs-2**: creazione grafico a torta
- **mui/x-charts**: creazione grafici
- **axios**: gestione delle API
- **react-router**: navigazione delle pagine e protezione delle route

---

## Back End

il backend è gestito da un server in **express.js** il quale serve delle **API** personalizzate che inseriscono, eliminano, condividono dati da un database **SQLite**. Inoltre il server hosta in locale sulla porta 5000 l'applicazione web in react.

#### Architettura Backend

Il server è strutturato in moduli separati per una migliore organizzazione:

- **server.ts**: entry point principale con configurazione Express e definizione delle route API
- **components/**: moduli per la gestione delle entità del database
    - **Users.ts**: gestione utenti, autenticazione e autorizzazioni
    - **Esercizi.ts**: CRUD operations per gli esercizi fisici
    - **Schede.ts**: gestione schede di allenamento e associazioni esercizi-utenti

#### API Endpoints

##### Autenticazione

- `POST /api/login` - autenticazione utente con email/password
- `POST /api/signup` - registrazione nuovo utente
- `GET /api/checkAuth` - verifica validità token JWT

##### Gestione Utenti

- `GET /api/getDatiUtente` - recupero dati utente autenticato
- `GET /api/getPazienti` - lista pazienti (solo medici/PT)
- `GET /api/getAllIdenty` - lista completa utenti
- `DELETE /api/deleteUtente/:email` - eliminazione utente

##### Esercizi

- `GET /api/esercizi` - lista completa esercizi
- `POST /api/addEsercizi` - aggiunta nuovo esercizio
- `GET /api/getNomeEsercizio` - nomi esercizi associati a schede
- `DELETE /api/deleteEsercizio/:id` - eliminazione esercizio

##### Schede di Allenamento

- `GET /api/schede` - lista schede disponibili
- `GET /api/getSchedeUtente` - schede specifiche utente
- `GET /api/schedeEsercizi` - associazioni schede-esercizi
- `GET /api/schedeEserciziUtente` - schede personalizzate per utente
- `POST /api/AggiungiScheda` - creazione nuova scheda
- `POST /api/AggiungiSchedaEsercizi` - associazione esercizi a scheda
- `DELETE /api/deleteSCheda/:id` - eliminazione scheda
- `DELETE /api/deleteExSCheda/:id` - rimozione esercizio da scheda

#### Sicurezza e Middleware

- **Autenticazione JWT**: middleware `authenticateToken` per protezione route
- **Crittografia password**: utilizzo bcryptjs per hash delle password
- **CORS**: configurazione per richieste cross-origin
- **Validazione email**: funzione `checkEmail` per validazione formato email
- **Foreign Keys**: abilitazione vincoli di integrità referenziale

#### Funzinalità server

- creazione, eliminazione utenti con ruoli differenziati
- gestione autenticazione e sessione con token JWT
- crittografia password con salt
- creazione, eliminazione, modifica esercizi e schede
- recupero informazioni dal db tramite API RESTful
- validazione token JWT per controllo accessi
- API per verifica ruoli utente (utente/medico/personalTrainer)
- endpoint per recupero dati utente personalizzati
- gestione graceful shutdown del database

#### Tecnologie e Librerie usate

- **typescript**: linguaggio usato per creazione del server
- **express.js**: framework web per gestione delle API e serving della pagina
- **sqlite3**: driver per database SQLite
- **SQLite**: tecnologia del database relazionale
- **jsonwebtoken**: gestione dei token JWT per autenticazione
- **bcryptjs**: crittografia e hashing delle password
- **cors**: middleware per gestione Cross-Origin Resource Sharing
- **dotenv**: gestione variabili d'ambiente (.env file)

---

## Struttura del Progetto

```
ProgettoReact/
├── backend/
│   ├── components/
│   ├── data/
│   ├── types/
│   ├── .env
│   ├── package.json
│   ├── server.ts
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── stylesheets/
│   │   └── types/
│   ├── public/
│   ├── dist/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── index.html
├── .gitignore
├── README.md
└── yarn.lock
```

## Set-up del progetto

scaricare ed estrarre il progetto o clonare la repository con

```
git clone https://github.com/fazionpietro/ProgettoReact.git
```

### Build e Avvio

Il progetto include script automatici per semplificare il processo di build e avvio.
La versione di node utilizzata è la v20.18.1 mentre quella di React è la v19.0.0

#### Opzione 1: Build Automatico con Script

##### Con Yarn (raccomandato)

```bash
cd ProgettoReact
chmod +x yarn-server-start.sh
./yarn-server-start.sh
```

##### Con Npm

```bash
cd ProgettoReact
chmod +x npm-server-start.sh
./npm-server-start.sh
```

Gli script eseguono automaticamente:

1. **Frontend**: installazione dipendenze e build di produzione
2. **Backend**: installazione dipendenze e avvio del server

#### Opzione 2: Build Manuale

Se si preferisce eseguire i comandi manualmente:

##### Frontend

```bash
cd frontend
npm install        # o yarn
npm run build      # o yarn build
```

##### Backend

```bash
cd backend
npm install        # o yarn
npm run start      # o yarn start
```

#### Accesso all'Applicazione

Una volta avviato il server, accedere alla pagina web seguendo l'URL: **http://localhost:5000**

