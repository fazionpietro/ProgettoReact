import { Pie } from "react-chartjs-2";
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';

ChartJS.register(ArcElement,Tooltip, Legend);

const GraficoTorta = ({ dati } : { dati : any }) => {
    const cammina = dati.map((el:any) => el.type).filter((s:any) => typeof s==='string' && s==='walking').length;
    const bici = dati.map((el:any) => el.type).filter((s:any) => typeof s==='string' && s==='cycling').length;
    const corri = dati.map((el:any) => el.type).filter((s:any) => typeof s==='string' && s==='running').length;

    return (
        <Pie
            data ={{
                labels:['walking', 'running', 'cycling'],
                datasets : [{
                        label : "Count",
                        data : [cammina,corri,bici],
                        backgroundColor: [
                            'rgba(255,0,0)',
                            'rgba(0,255,0)',
                            'rgba(0,0,255)',
                        ]
                }]
            }}
        />
    );
    
}

export default GraficoTorta;