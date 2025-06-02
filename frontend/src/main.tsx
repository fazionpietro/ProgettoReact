import { BrowserRouter, Route, Routes } from "react-router";
import ReactDOM from "react-dom/client";
import PrivateMedRoute from "./routing/PrivateMedRoute.tsx";

import PrivateRoute from "./routing/PrivateRoute.tsx";
import AppLogin from "./Login.tsx";
import AppRegister from "./Register.tsx";
import HomePage from "./HomePage.tsx";
import Exercise from "./Exercise.tsx";
import Pazienti from "./Pazienti.tsx"
import Profile from "./Profile.tsx";
import AddSchede from "./AddSchede.tsx";
import AggiungiUtente from "./AggiungiUtente.tsx";
import AddEsercizio from "./AggiungiEsercizio.tsx";
import TableScheda from "./Tabelle/TableScheda.tsx";
import TablePaziente from "./Tabelle/TablePaziente.tsx";
import TableSchedaDoc from "./Tabelle/TableEserciziSchedaUtente.tsx";



ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>

    <Routes>
      
        <Route path='/login' element={<AppLogin />} />
        <Route path='/Register' element={<AppRegister />} />
        <Route path='/addEsercizio' element={<AddEsercizio/>}/>
        
        
        
        

        <Route element={<PrivateRoute/>}>
          <Route path='/' element={<HomePage />}></Route>
          <Route path='/addScheda' element={<AddSchede/>}></Route>
          <Route path='/Exercise' element={<Exercise />}></Route>
          <Route path='/Profile' element={<Profile />}></Route>
          <Route path='/scheda/:id' element={<TableScheda />}></Route>

          <Route element={<PrivateMedRoute/>}>
            <Route path='/addUtente' element={<AggiungiUtente/>}/>
            <Route path='/paziente/:email' element={<TablePaziente/>}></Route>
            <Route path="/schedaDoc/:id/:email" element={<TableSchedaDoc />}></Route>
            <Route path='/Pazienti' element={<Pazienti />}></Route>
            
          </Route>
        </Route>
        
        

    </Routes>
  </BrowserRouter>
);
