import { LineChart } from "@mui/x-charts";

const StoricoCalorieSettimanale = ({ dati } : { dati : any }) => {
    const start_time = dati.map((el:any) => el.start_time).filter((s:any) => typeof s==='number' && !isNaN(s));;
    const tempoMassimo = Math.max(...start_time.map(Number));
    const limiteTempo = (tempoMassimo-7*24*60*60);
    const tempoOrdine = dati.sort((a:any ,b:any) => a.start_time - b.start_time);
    const filtrato = tempoOrdine.filter((el:any) => el.start_time >= limiteTempo);
    const x = filtrato.map((el:any) => new Date(el.start_time*1000))
    const y = filtrato.map((el:any) => el.calories)
    
        return <LineChart
            xAxis={[{
                data : x,
                scaleType : "time",
            }]}
            series={[{data: y, showMark : false}]}
            height={300}
        />
}

export default StoricoCalorieSettimanale;