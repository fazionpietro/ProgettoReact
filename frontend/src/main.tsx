import { BrowserRouter, Route, Routes } from "react-router";
import ReactDOM from "react-dom/client";
import PrivateMedRoute from "./routing/PrivateMedRoute.tsx";

import PrivateRoute from "./routing/PrivateRoute.tsx";
import AppLogin from "./Login.tsx";
import AppRegister from "./Register.tsx";
import HomePage from "./HomePage.tsx";
import Esercizi from "./Esercizi.tsx";
import Pazienti from "./Pazienti.tsx"
import Routine from "./Routine.tsx";
import AggiungiSchede from "./AggiungiSchede.tsx";
import AggiungiUtente from "./AggiungiUtente.tsx";
import AggiungiEsercizio from "./AggiungiEsercizio.tsx";
import TableScheda from "./Tabelle/TableScheda.tsx";
import TablePaziente from "./Tabelle/TablePaziente.tsx";
import TableSchedaDoc from "./Tabelle/TableEserciziSchedaUtente.tsx";





ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>

    <Routes>
      
        <Route path='/Login' element={<AppLogin />} />
        <Route path='/Register' element={<AppRegister />} />
        
        
        
        
        

        <Route element={<PrivateRoute/>}>
          <Route path="/Routine" element={<Routine />}/>
          <Route path='/AggiungiEsercizio' element={<AggiungiEsercizio/>}/>
          <Route path='/' element={<HomePage />}></Route>
          <Route path='/AggiungiScheda/:emailParam' element={<AggiungiSchede/>}></Route>
          <Route path='/AggiungiAScheda/:id/:emailParam' element={<AggiungiSchede/>}></Route>
          <Route path='/Esercizi' element={<Esercizi />}></Route>
          <Route path='/scheda/:id' element={<TableScheda />}></Route>
          <Route path="*" element={<HomePage />} />
          
          <Route element={<PrivateMedRoute/>}>
            <Route path='/AggiungiUtente' element={<AggiungiUtente/>}/>
            <Route path='/paziente/:email' element={<TablePaziente/>}></Route>
            <Route path="/schedaDoc/:id/:email" element={<TableSchedaDoc />}></Route>
            <Route path='/Pazienti' element={<Pazienti />}></Route>
            
          </Route>
        </Route>
        
        

    </Routes>
  </BrowserRouter>
);
