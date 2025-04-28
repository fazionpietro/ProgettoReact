import { use, useState, useEffect } from 'react';
import './stylesheets/LoginRegister.css';
import axios, {isCancel, AxiosError, Axios} from 'axios';
//import { Card } from 'react-bootstrap';
import { NavLink } from "react-router";


function HomePage(){
    return(
            <div className='card'>
                <div className='container'>
                    <div className='item'>
                        <p>grafico storico</p>
                    </div>
                    <div className='item'>
                        <p>grafico torta</p>
                    </div>
                    <div className='item'>
                        <p>storico calorie</p>
                    </div>

                    <div className='containerecord'>
                        <div className='item'>
                            <p>obbiettivo calorie</p>
                        </div>
                        <div className='item'>
                            <p>record passi</p>
                        </div>
                        <div className='item'>
                            <p>obbiettivo passi</p>
                        </div>
                        <div className='item'>
                            <p>record passi</p>
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default HomePage;