import { LineChart } from "@mui/x-charts";

function media(array : number[], punti : number): number[]{
    return array.map((elemento,i) => {
        const primo = Math.max(0, i - punti+1);
        const sottoGruppo =array.slice(primo, i+1);
        const somma = sottoGruppo.reduce((a,b) => a+b, 0);
        return somma/ sottoGruppo.length;
    });
}

const GraficoDistGiornaliero= ({ dati } : { dati : any }) => {
    const start_time = dati.map((el:any) => el.start_time).filter((s:any) => typeof s==='number' && !isNaN(s));;
    const tempoMassimo = Math.max(...start_time.map(Number));
    const limiteTempo = (tempoMassimo-3*24*60*60);
    const tempoOrdine = dati.sort((a:any ,b:any) => a.start_time - b.start_time);
    const filtrato = tempoOrdine.filter((el:any) => el.start_time >= limiteTempo);
    const x = filtrato.map((el:any) => new Date(el.start_time*1000));
    const y = filtrato.map((el:any) => el.distance);
    const ymedia= media(y,10);

    return <LineChart
            xAxis={[{
                data : x,
                scaleType : "time",
            }]}
            series={[{data: ymedia, showMark : false}]}
            height={300}
        />
}

export default GraficoDistGiornaliero;