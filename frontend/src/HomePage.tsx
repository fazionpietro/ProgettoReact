import { useState } from 'react';
import './stylesheets/LoginRegister.css';
//import { Card } from 'react-bootstrap';
import Papa from 'papaparse';
import StoricoPassiGiornaliero from './StoricoPassiGiornaliero';
import StoricoPassiSettimanale from './StoricoPassiSettimanale';
import StoricoPassiMensile from './StoricoPassiMensile';
import StoricoCalorieGiornaliero from './StoricoCalorieGiornaliero';
import StoricoCalorieSettimanale from './StoricoCalorieSettimanale';
import StoricoCalorieMensile from './StoricoCalorieMensile';
import GraficoTorta from './GraficoTorta';
import GraficoDistGiornaliero from './GraficoDistGiornaliero';
import GraficoDistSettimanale from './GraficoDistSettimanale';
import GraficoDistMensile from './GraficoDistMensile';
import Navbar from './Navbar';

function HomePage(){

    const [data, setData] = useState<any[]>([]);
    const [maxSteps, setMaxSteps] = useState<number | null>(null);
    const [stoMaxSteps, stoSetMaxSteps] = useState<number | null>(null);
    const [graficoAttivo, setGraficoAttivo] = useState(1);
    const [graficoCal, setGraficoCal] = useState(1);
    const [graficoDistanza, setGraficoDistanza] = useState(1);
    const [stoData, setStoData] = useState<any[]>([]);
    const [gDistance, setGDistance] = useState<number | null>(null);
    const [totDistance, setTotDistance] = useState<number | null>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) =>{
        const file = e.target.files?.[0];

        if(!file) return;

        Papa.parse(file, {
            header : true,
            skipEmptyLines : true,
            dynamicTyping : true,
            complete: (results: any) => {
                setData(results.data);
                console.log(results.data);
                const dat =results.data.filter((el:any) => typeof el.time ==='number' && !isNaN(el.time));
                const tempoMassimo = Math.max(...dat.map((el:any)=> el.time));
                const limiteT = (tempoMassimo-24*60*60);
                const tFiltrato = dat.filter((el:any) => el.time >= limiteT);
                const distance = tFiltrato.map((el:any) => el.distance).filter((s:any) => typeof s === 'number' && !isNaN(s));
                const maxDistance = distance.length>0 ? Math.max(...distance.map(Number)) : null;
                const steps = tFiltrato.map((el:any) => el.steps).filter((s:any) => typeof s === 'number' && !isNaN(s));
                const maxS = steps.length>0 ? Math.max(...steps.map(Number)): null;
                setMaxSteps(maxS);
                setGDistance(maxDistance);
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
                const sto_steps = results.data.map((el:any) => el.steps).filter((s:any) => typeof s==='number' && !isNaN(s));
                const sto_maxs = Math.max(...sto_steps.map(Number));
                const distanza = results.data.map((el:any) => el.distance).filter((s:any) => typeof s==='number' && !isNaN(s));
                console.log(results.data.filter((el:any) => el.distance));
                console.log(distanza);
                const maxTotDistance = distanza.length>0 ? Math.max(...distanza.map(Number)): null;
                setTotDistance(maxTotDistance);
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

    const storicoDistanza = () =>{
        switch (graficoDistanza){
            case 1:
                return <GraficoDistGiornaliero dati={stoData}/>
            case 2:
                return <GraficoDistSettimanale dati={stoData}/>
            case 3:
                return <GraficoDistMensile dati={stoData}/>
            default:
                return null;
        }
    }

    return(
            <div>
                <Navbar/>
                <div className='card'>
                    <div className='container'>
                        <div className='item'>
                            <p>Grafico Storico dei Passi</p>
                            <button onClick={() => setGraficoAttivo(1)}>grafico giornaliero</button>
                            <button onClick={() => setGraficoAttivo(2)}>grafico settimanale</button>
                            <button onClick={() => setGraficoAttivo(3)}>grafico mensile</button>
                            {stoData.length > 0 ? storicoPassiPlot(): <p>nessun dato</p>};
                        </div>
                        <div className='item'>
                            <p>Tipologia di Cardio</p>
                            {stoData.length > 0 ? <GraficoTorta dati={stoData}/>: <p>nessun dato</p>};
                        </div>  
                        <div className='item'>
                            <p>Grafico Storico delle Calorie</p>
                            <button onClick={() => setGraficoCal(1)}>grafico giornaliero</button>
                            <button onClick={() => setGraficoCal(2)}>grafico settimanale</button>
                            <button onClick={() => setGraficoCal(3)}>grafico mensile</button>
                            {stoData.length > 0 ? storicoCalPlot(): <p>nessun dato</p>};                       
                        </div>
                        
                        

                        <div className='containerecord'>
                            <div className='item'>
                                <p>Obbiettivo Calorie</p>
                                <input type= "number" placeholder="inserisci l'obbiettivo" className='inputObbiettivo'/>
                            </div>
                            <div className='item'>
                                <p>Record Passi</p>
                                {stoMaxSteps !==null ? stoMaxSteps : 'nessun dato'}
                            </div>
                            <div className='item'>
                                <p>Obbiettivo Passi</p>
                                <input type = "number" placeholder="inserisci l'obbiettivo" className='inputObbiettivo'/>
                            </div>
                            <div className='item'>
                                <p>Record Passi Giornaliero</p>
                                {maxSteps !==null ? maxSteps : 'nessun dato'}
                            </div>
                        </div>

                        <div className='item'>
                            <p>Grafico Storico della Distanza</p>
                            <button onClick={() => setGraficoDistanza(1)}>grafico giornaliero</button>
                            <button onClick={() => setGraficoDistanza(2)}>grafico settimanale</button>
                            <button onClick={() => setGraficoDistanza(3)}>grafico mensile</button>
                            {stoData.length > 0 ? storicoDistanza(): <p>nessun dato</p>};                       
                        </div>

                        <div className='conainerecord'>
                            <div className='item'>
                                <p>Obbiettivo Distanza</p>
                                <input type = "number" placeholder="inserisci l'obbiettivo" className='inputObbiettivo'/>
                            </div>
                            <div className='item'>
                                <p>Record Distanza</p>
                                {totDistance !==null ? totDistance : 'nessun dato'}
                            </div>
                            <div className='item'>
                                <p>Record Distanza Giornaliero</p>
                                {gDistance !==null ? gDistance : 'nessun dato'}
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
            </div>
    )
}

export default HomePage;