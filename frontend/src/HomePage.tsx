import { use, useState, useEffect } from 'react';
import './stylesheets/LoginRegister.css';
import axios, {isCancel, AxiosError, Axios} from 'axios';
//import { Card } from 'react-bootstrap';
import { NavLink } from "react-router";
import {Chart as ChartJS} from "chart.js/auto";
import Papa from 'papaparse';
import StoricoPassiGiornaliero from './StoricoPassiGiornaliero';
import StoricoPassiSettimanale from './StoricoPassiSettimanale';
import StoricoPassiMensile from './StoricoPassiMensile';
import StoricoCalorieGiornaliero from './StoricoCalorieGiornaliero';
import StoricoCalorieSettimanale from './StoricoCalorieSettimanale';
import StoricoCalorieMensile from './StoricoCalorieMensile';

function HomePage(){

    const [data, setData] = useState<any[]>([]);
    const [maxSteps, setMaxSteps] = useState<number | null>(null);
    const [stoMaxSteps, stoSetMaxSteps] = useState<number | null>(null);
    const [graficoAttivo, setGraficoAttivo] = useState(1);
    const [graficoCal, setGraficoCal] = useState(1);
    const [stoData, setStoData] = useState<any[]>([]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) =>{
        const file = e.target.files?.[0];

        if(!file) return;

        Papa.parse(file, {
            header : true,
            skipEmptyLines : true,
            dynamicTyping : true,
            complete: (results) => {
                setData(results.data);
                const time = results.data.map((el:any) => el.time).filter((s:any) => typeof s==='number' && !isNaN(s));
                const steps = results.data.map((el:any) => el.steps).filter((s:any) => typeof s==='number' && !isNaN(s));
                const distance = results.data.map((el:any) => el.distance).filter((s:any) => typeof s==='number' && !isNaN(s));;
                const calories = results.data.map((el:any) => el.calories).filter((s:any) => typeof s==='number' && !isNaN(s));
                const maxs = Math.max(...steps.map(Number));
                setMaxSteps(maxs); 
                
            },
        });
    };

    const handleStorico = (e :React.ChangeEvent<HTMLInputElement>) =>{
        const file = e.target.files?.[0];

        if(!file) return;

        Papa.parse(file, {
            header : true,
            skipEmptyLines : true,
            dynamicTyping : true,
            complete: (results) => {
                const end_time = results.data.map((el:any) => el.end_time).filter((s:any) => typeof s==='number' && !isNaN(s));
                const start_time = results.data.map((el:any) => el.start_time).filter((s:any) => typeof s==='number' && !isNaN(s));
                const sto_steps = results.data.map((el:any) => el.steps).filter((s:any) => typeof s==='number' && !isNaN(s));
                const sto_distance = results.data.map((el:any) => el.distance).filter((s:any) => typeof s==='number' && !isNaN(s));
                const sto_calories = results.data.map((el:any) => el.calories).filter((s:any) => typeof s==='number' && !isNaN(s));
                const startTimeInDay =start_time.map((s:number) => s/(60*60*24));
                const endTimeInDay =end_time.map((s:number) => s/(60*60*24));
                const sto_maxs = Math.max(...sto_steps.map(Number));
                stoSetMaxSteps(sto_maxs);
                setStoData(results.data);
            },
        });
    }   

    const storicoPassiPlot = () => {
        switch (graficoAttivo){
            case 1:
                return <StoricoPassiGiornaliero dati={stoData}/>;
            case 2:
                return <StoricoPassiSettimanale dati={stoData}/>;
            case 3:
                return <StoricoPassiMensile dati={stoData}/>;
            default:
                return null;
        }
    }

    const storicoCalPlot = () => {
        switch (graficoCal){
            case 1:
                return <StoricoCalorieGiornaliero dati={stoData}/>;
            case 2:
                return <StoricoCalorieSettimanale dati={stoData}/>;
            case 3:
                return <StoricoCalorieMensile dati={stoData}/>;
            default:
                return null;
        }
    }

    return(
            <div className='card'>
                <div className='container'>
                    <div className='item'>
                        <p>grafico storico dei passi</p>
                        <button onClick={() => setGraficoAttivo(1)}>grafico giornaliero</button>
                        <button onClick={() => setGraficoAttivo(2)}>grafico settimanale</button>
                        <button onClick={() => setGraficoAttivo(3)}>grafico mensile</button>
                        {stoData.length > 0 ? storicoPassiPlot(): <p>nessun dato</p>};
                    </div>
                    <div className='item'>
                        <p>grafico torta</p>
                    </div>  
                    <div className='item'>
                        <p>grafico storico calorie</p>
                        <button onClick={() => setGraficoCal(1)}>grafico giornaliero</button>
                        <button onClick={() => setGraficoCal(2)}>grafico settimanale</button>
                        <button onClick={() => setGraficoCal(3)}>grafico mensile</button>
                        {stoData.length > 0 ? storicoCalPlot(): <p>nessun dato</p>};                       
                    </div>

                    <div className='containerecord'>
                        <div className='item'>
                            <p>obbiettivo calorie</p>
                            <input type= "number" placeholder="inserisci l'obbiettivo" className='inputObbiettivo'/>
                        </div>
                        <div className='item'>
                            <p>record passi</p>
                            {stoMaxSteps !==null ? stoMaxSteps : 'nessun dato'}
                        </div>
                        <div className='item'>
                            <p>obbiettivo passi</p>
                            <input type = "number" placeholder="inserisci l'obbiettivo" className='inputObbiettivo'/>
                        </div>
                        <div className='item'>
                            <p>record passi</p>
                        </div>
                    </div>
                </div>
                <br/>
                <label>
                    inserire il file di dati 
                    <input type='file' accept='.csv' onChange={handleFileUpload}></input>
                </label>
                <br/><br/>
                <label>
                    inserire lo storico
                    <input type='file' accept='.csv' onChange={handleStorico}></input>
                </label>
            </div>
    )
}

export default HomePage;