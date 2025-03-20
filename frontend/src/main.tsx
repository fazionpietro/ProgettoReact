import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Router, Routes } from "react-router";
import { useState } from 'react';
import ReactDOM from "react-dom/client";

import AppLogin from './Login.tsx';
import AppRegister from './Register.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<AppLogin />} />
      <Route path='/Register' element={<AppRegister />} />
    </Routes>
  </BrowserRouter>
)
