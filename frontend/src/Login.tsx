import { use, useState, useEffect } from 'react';
import './LoginRegister.css';
import axios, {isCancel, AxiosError, Axios} from 'axios';
import { Card } from 'react-bootstrap';
import { NavLink } from "react-router";




function AppLogin() {
  return(
    <div className="card">
      <form>
        <label>mail:</label>
        <div>
          <input type='text' name='mail' />
        </div>
        <label>Password:</label>
        <div>
          <input type='text' name='password'/>
        </div>
        <button type='submit'>Login</button>
        
        <NavLink to="/Register" end>
          <a>Register</a>
        </NavLink>
        
      </form>
    </div>
  )
}

export default AppLogin;