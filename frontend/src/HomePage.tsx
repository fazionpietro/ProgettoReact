import { useState } from "react";
import "./stylesheets/HomePage.css";

import Papa from "papaparse";
import StoricoPassiGiornaliero from "./Grafici/StoricoPassiGiornaliero";
import StoricoPassiSettimanale from "./Grafici/StoricoPassiSettimanale";
import StoricoPassiMensile from "./Grafici/StoricoPassiMensile";
import StoricoCalorieGiornaliero from "./Grafici/StoricoCalorieGiornaliero";
import StoricoCalorieSettimanale from "./Grafici/StoricoCalorieSettimanale";
import StoricoCalorieMensile from "./Grafici/StoricoCalorieMensile";
import GraficoTorta from "./Grafici/GraficoTorta";
import GraficoDistGiornaliero from "./Grafici/GraficoDistGiornaliero";
import GraficoDistSettimanale from "./Grafici/GraficoDistSettimanale";
import GraficoDistMensile from "./Grafici/GraficoDistMensile";
import Navbar from "./Navbar";

function HomePage() {
    const [_data, setData] = useState<any[]>([]);
    const [maxSteps, setMaxSteps] = useState<number | null>(null);
    const [stoMaxSteps, stoSetMaxSteps] = useState<number | null>(null);
    const [graficoAttivo, setGraficoAttivo] = useState(1);
    const [graficoCal, setGraficoCal] = useState(1);
    const [graficoDistanza, setGraficoDistanza] = useState(1);
    const [stoData, setStoData] = useState<any[]>([]);
    const [gDistance, setGDistance] = useState<number | null>(null);
    const [totDistance, setTotDistance] = useState<number | null>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
            complete: (results: any) => {
                setData(results.data);
                console.log(results.data);
                const dat = results.data.filter(
                    (el: any) => typeof el.time === "number" && !isNaN(el.time)
                );
                const tempoMassimo = Math.max(...dat.map((el: any) => el.time));
                const limiteT = tempoMassimo - 24 * 60 * 60;
                const tFiltrato = dat.filter((el: any) => el.time >= limiteT);
                const distance = tFiltrato
                    .map((el: any) => el.distance)
                    .filter((s: any) => typeof s === "number" && !isNaN(s));
                const maxDistance =
                    distance.length > 0
                        ? Math.max(...distance.map(Number))
                        : null;
                const steps = tFiltrato
                    .map((el: any) => el.steps)
                    .filter((s: any) => typeof s === "number" && !isNaN(s));
                const maxS =
                    steps.length > 0 ? Math.max(...steps.map(Number)) : null;
                setMaxSteps(maxS);
                setGDistance(maxDistance);
            },
        });
    };

    const handleStorico = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
            complete: (results) => {
                const sto_steps = results.data
                    .map((el: any) => el.steps)
                    .filter((s: any) => typeof s === "number" && !isNaN(s));
                const sto_maxs = Math.max(...sto_steps.map(Number));
                const distanza = results.data
                    .map((el: any) => el.distance)
                    .filter((s: any) => typeof s === "number" && !isNaN(s));
                console.log(results.data.filter((el: any) => el.distance));
                console.log(distanza);
                const maxTotDistance =
                    distanza.length > 0
                        ? Math.max(...distanza.map(Number))
                        : null;
                setTotDistance(maxTotDistance);
                stoSetMaxSteps(sto_maxs);
                setStoData(results.data);
            },
        });
    };

    const storicoPassiPlot = () => {
        switch (graficoAttivo) {
            case 1:
                return <StoricoPassiGiornaliero dati={stoData} />;
            case 2:
                return <StoricoPassiSettimanale dati={stoData} />;
            case 3:
                return <StoricoPassiMensile dati={stoData} />;
            default:
                return null;
        }
    };

    const storicoCalPlot = () => {
        switch (graficoCal) {
            case 1:
                return <StoricoCalorieGiornaliero dati={stoData} />;
            case 2:
                return <StoricoCalorieSettimanale dati={stoData} />;
            case 3:
                return <StoricoCalorieMensile dati={stoData} />;
            default:
                return null;
        }
    };

    const storicoDistanza = () => {
        switch (graficoDistanza) {
            case 1:
                return <GraficoDistGiornaliero dati={stoData} />;
            case 2:
                return <GraficoDistSettimanale dati={stoData} />;
            case 3:
                return <GraficoDistMensile dati={stoData} />;
            default:
                return null;
        }
    };

    // Verifica se ci sono dati da mostrare
    const hasData = stoData.length > 0 || _data.length > 0;

    return (
        <div>
            <Navbar />
            <div>
                {/* Mostra la grid solo se ci sono dati */}
                {hasData && (
                    <div className="homeContainer parent">
                        <div className="item div1">
                            <p>Grafico Storico dei Passi</p>
                            <button onClick={() => setGraficoAttivo(1)}>
                                grafico giornaliero
                            </button>
                            <button onClick={() => setGraficoAttivo(2)}>
                                grafico settimanale
                            </button>
                            <button onClick={() => setGraficoAttivo(3)}>
                                grafico mensile
                            </button>
                            {stoData.length > 0 ? (
                                storicoPassiPlot()
                            ) : (
                                <p>nessun dato</p>
                            )}
                        </div>
                        
                        <div className="item div2">
                            <p>Tipologia di Cardio</p>
                            {stoData.length > 0 ? (
                                <GraficoTorta dati={stoData} />
                            ) : (
                                <p>nessun dato</p>
                            )}
                        </div>
                        
                        <div className="item div3">
                            <p>Grafico Storico delle Calorie</p>
                            <button onClick={() => setGraficoCal(1)}>
                                grafico giornaliero
                            </button>
                            <button onClick={() => setGraficoCal(2)}>
                                grafico settimanale
                            </button>
                            <button onClick={() => setGraficoCal(3)}>
                                grafico mensile
                            </button>
                            {stoData.length > 0 ? (
                                storicoCalPlot()
                            ) : (
                                <p>nessun dato</p>
                            )}
                        </div>

                        <div className="item div4">
                            <p>Grafico Storico della Distanza</p>
                            <button onClick={() => setGraficoDistanza(1)}>
                                grafico giornaliero
                            </button>
                            <button onClick={() => setGraficoDistanza(2)}>
                                grafico settimanale
                            </button>
                            <button onClick={() => setGraficoDistanza(3)}>
                                grafico mensile
                            </button>
                            {stoData.length > 0 ? (
                                storicoDistanza()
                            ) : (
                                <p>nessun dato</p>
                            )}
                        </div>

                        <div className="item div5 record">
                            <p>Record Passi</p>
                            <h4>
                                {stoMaxSteps !== null ? stoMaxSteps : "nessun dato"}
                            </h4>
                        </div>
                        
                        <div className="item div6 record">
                            <p>Record Passi Giornaliero</p>
                            <h4>{maxSteps !== null ? maxSteps : "nessun dato"}</h4>
                        </div>

                        <div className="item div7 record">
                            <p>Record Distanza</p>
                            <h4>
                                {totDistance !== null ? totDistance : "nessun dato"}
                            </h4>
                        </div>
                        
                        <div className="item div8 record">
                            <p>Record Distanza Giornaliero</p>
                            <h4>
                                {gDistance !== null ? gDistance : "nessun dato"}
                            </h4>
                        </div>
                    </div>
                )}
                
                <div className="fileInput">
                    <div className="fileInputItem">
                        <label className="fileLabel">
                            Inserire il file di dati
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleFileUpload}
                                className="fileInputField"
                            />
                        </label>
                    </div>
                    <div className="fileInputItem">
                        <label className="fileLabel">
                            Inserire lo storico
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleStorico}
                                className="fileInputField"
                            />
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;