## Dashboard per la creazione di un piano di esercizi fisici settimanali
----
#### Autori
- **VR501347**: Fazion Pietro
- **VR500305**: Dal Degan Pietro

----
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
visibile solo agli utenti, qui possono vedere le schede create per loro dai medici/personal trainer con una descrizione impostata che può specificare la frequenza della scheda nella settimana e gli obbiettivi dell'allenamento.
Da questa pagina l'utente può creare una scheda personale e eliminare quelle già presenti.
Navigando con il pulsante visualizza l'utente può vedere di quali esercizi è composta una determinata scheda e nel caso aggiungerne di nuovi o eliminare i precedenti


#### Funzionalità Applicazione Web

- visualizzazione dataset
- creazione, eliminazione utenti
- creazione, eliminazione, modifica schede personalizzate con obbiettivi e frequenza settimanale
- visualizzazione e gestione pazienti



#### Tecnologie e Librerie usate

- **typescript**: creazione dell'applicazione web
- **chart.js** e **react-chartjs-2**: creazione grafico a torta
- **mui/x-charts**: creazione grafici
- **axios**: gestione delle API
- **react-router**: navigazione delle pagine
---

## Back End

il backend è gestito da un server in **express.js** il quale serve delle **API** personalizzate che inseriscono, eliminano, condividono dati da un database **SQLite**.
Inoltre il server hosta in locale sulla porta 5000 l'applicazione web in react.

#### Funzinalità server

- creazione, eliminazione utenti
- gestione autenticazione e sessione con token
- crittografia password
- creazione, eliminazione esercizi e schede
- recupero informazioni dal db tramite API

#### Tecnologie e Librerie usate

- **typescript**: linguaggio usato per creazione del server
- **express.js**: libreria usata per la gestione delle API e per servire la pagina
- **sqlite3**: libreria gestione database
- **SQLite**: tecnologia del database
- **jwt**: gestione dei token e dell'encryption delle password
- **dotenv**: gestione variabili d'ambiente

-----

## Set-up del progetto

scaricare ed estrarre il progetto o clonare la repository con

```
git clone https://github.com/fazionpietro/ProgettoReact.git
```

### Build

##### Yarn

```
cd ProgettoReact
chmod +x yarn-server-start.sh
./yarn-server-start.sh
```

##### Npm

```
cd ProgettoReact
chmod +x npm-server-start.sh
./npm-server-start.sh
```

accedere alla pagina web seguendo l'URL
	http://localhost:5000/
