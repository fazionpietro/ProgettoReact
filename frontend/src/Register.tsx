import { use, useState, useEffect } from 'react';
import './stylesheets/LoginRegister.css';
import axios, {isCancel, AxiosError, Axios} from 'axios';
import { Card } from 'react-bootstrap';
import { NavLink } from "react-router";

function AppRegister() {
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
          <label>Ripeti Password:</label>
          <div>
            <input type='text' name='password'/>
          </div>
          <button type='submit'>invia</button>

          <NavLink to="/" end>
            <button>Login</button>
          </NavLink>
        </form>
      </div>
    )
  }

  export default AppRegister;