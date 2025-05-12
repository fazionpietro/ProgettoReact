import { useState, useEffect, useRef, use, ChangeEvent } from "react";
import axios, { isCancel, AxiosError, Axios, AxiosResponse } from "axios";
import { Card } from "react-bootstrap";
import { useNavigate, NavLink } from "react-router";
import Dropdown from "./Dropdown";

type esercizioData = {
    id: number;
    nome: string;
    descrizione: string;
    muscolo_targhet: string;
    difficolta: string;
};
type schedaEserciziData = {
    esercizio_id: number[];
    user_email_id: string;
    nome_scheda: string;
    serie: number[];
    ripetizioni: number[];
};

function AddSchede() {
    
    const [ruolo, setRuolo] = useState<string>();
    const [pazienti, setPazienti] = useState();
    const [esercizi, setEsercizi] = useState<esercizioData[]>();
    const isInitialized = useRef(false);
    const [s, setS] = useState<string[]>();
    const [selectedPatient , setSelectedPatient] = useState<string>()


    const scheda: schedaEserciziData = {
        esercizio_id: [],
        user_email_id: "",
        nome_scheda: "",
        serie: [],
        ripetizioni: [],
    };

    type EsercizioData = {
        esercizio_id: string;
        serie: string;
        ripetizioni: string;
        [key: string]: string; // Index signature allows dynamic property access with strings
    };

    const [listaEsercizi, setListaEsercizi] = useState<EsercizioData[]>([
        {
            esercizio_id: "",
            serie: "",
            ripetizioni: "",
        },
    ]);


    const getRuolo = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_API_KEY}/getDatiUtente`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "access_token"
                        )}`,
                    },
                })
                .then((resp) => {
                    if (resp.status === 200) setRuolo(resp.data.ruolo); 
                });
        } catch (error) {
            console.error(error);
            
        }
    }



    const getEsercizi = async () => {
        
        try {
            await axios.get(`${import.meta.env.VITE_API_KEY}/esercizi`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "access_token"
                        )}`,
                    },
                })
                .then((resp) => {
                    if (resp.status === 200) setEsercizi(resp.data);
                    const r: esercizioData[] = resp.data;
                    setS(r.map((eser) => eser.nome));
                });
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        console.log(listaEsercizi);
        if (isInitialized.current) return;
        
        isInitialized.current = true;
        getEsercizi();
        getRuolo();
    }, [listaEsercizi]);

    const handleFormChange = (
        index: number,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = event.target;
        let data = [...listaEsercizi];
        data[index][name] = value;
        setListaEsercizi(data);
    };

    const addFields = () => {
        let newfield = {
            esercizio_id: "",
            serie: "",
            ripetizioni: "",
        };
        setListaEsercizi([...listaEsercizi, newfield]);
    };

    const removeFields = (index: number) => {
        if (index < 0 || index >= listaEsercizi.length) return; // Verifica l'indice
        const data = [...listaEsercizi];
        data.splice(index, 1);
        setListaEsercizi(data); 
    }
    


    return (
        <>
            <div>
                <h2>Aggiungi Scheda</h2>
                <input
                    className="nameInput"
                    type="text"
                    placeholder="Nome scheda"
                    onChange={(e) => {
                        scheda ? (scheda.nome_scheda = e.target.value) : "";
                    }}
                />
                <div>
                    <h4>Paziente: </h4>
                    {ruolo != "utente" ? <Dropdown setSelectedValue={setSelectedPatient} itemList={["1","2","3"]}/> : "no"}

                </div>
                {scheda ? null : ""}
                <form>
                    {listaEsercizi.map((input, index) => {
                        return (
                            <div key={index}>
                                <h4>Esercizio: </h4>
                                {s ? (
                                    <select
                                    value={
                                        esercizi?.find((item) => item.id.toString() === input.esercizio_id)
                                            ?.nome || ""
                                    }
                                        onChange={(e) => {
                                            let data = [...listaEsercizi];
                                            const id = esercizi?.find(
                                                (item: esercizioData) =>
                                                    item.nome == e.target.value
                                            )?.id;
                                            data[index].esercizio_id =
                                                String(id);
                                            setListaEsercizi(data);
                                        }}
                                    >
                                        <option value="" >
                                            Select Option
                                        </option>
                                        {s.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    ""
                                )}
                                <input
                                    value={input.serie}
                                    name="serie"
                                    placeholder="Serie"
                                    onChange={(event) =>
                                        handleFormChange(index, event)
                                    }
                                />
                                <input
                                    value={input.ripetizioni}
                                    name="ripetizioni"
                                    placeholder="Ripetizioni"
                                    onChange={(event) =>
                                        handleFormChange(index, event)
                                    }
                                />
                                <button type="button" onClick={() => removeFields(index)}>X</button>
                            </div>
                        );
                    })}
                </form>
            </div>

            <div>
                <button onClick={addFields}>Aggiungi Esercizio</button>
            </div>
        </>
    );
}
export default AddSchede;
