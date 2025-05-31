

import { BrowserRouter, Route,Routes } from "react-router";
import ReactDOM from "react-dom/client";
import PrivateRoute from './PrivateRoute.tsx';
import AppLogin from './Login.tsx';
import AppRegister from './Register.tsx';
import HomePage from './HomePage.tsx';
import Exercise from './Exercise.tsx';
import Patience from './Patience.tsx';
import Profile from './Profile.tsx';
import AddSchede from './AddSchede.tsx';
import AggiungiUtente from './AggiungiUtente.tsx';
import AddEsercizio from "./AggiungiEsercizio.tsx";
import TableScheda from "./TableScheda.tsx";
import TablePaziente from "./TablePaziente.tsx";
import TableSchedaDoc from "./TableSchedaDoc.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      
        <Route path='/login' element={<AppLogin />} />
        <Route path='/Register' element={<AppRegister />} />
        
        <Route path='/addEsercizio' element={<AddEsercizio/>}/>

        <Route element={<PrivateRoute />}>
          <Route path='/utente' element={<AggiungiUtente/>}/>
          <Route path='/' element={<HomePage />}></Route>
          <Route path='/schede' element={<AddSchede/>}></Route>
          <Route path='/Exercise' element={<Exercise />}></Route>
          <Route path='/Patience' element={<Patience />}></Route>
          <Route path='/Profile' element={<Profile />}></Route>
          <Route path='/scheda/:id' element={<TableScheda />}></Route>
          <Route path='/paziente/:email' element={<TablePaziente/>}></Route>
          <Route path="/schedaDoc/:id/:email" element={<TableSchedaDoc />}></Route>
       
        </Route>
        

    </Routes>
  </BrowserRouter>
)