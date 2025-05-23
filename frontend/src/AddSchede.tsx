import { useState, useEffect, useRef } from "react";
import axios from "axios";
import PatientSelector from "./Dropdown/PatientSelectionComponent";

type esercizioData = {
    esercizio_id: string;
    serie: string;
    ripetizioni: string;
    [key: string]: string;
};
type schedaEserciziData = {
    esercizio_id: number[];
    user_email_id: string;
    nome_scheda: string;
    serie: number[];
    ripetizioni: number[];
    note: string;
};

function AddSchede() {
    const [allSchedeName, setAlleSchedeName] = useState<{ nome: string }[]>();
    const [ruolo, setRuolo] = useState("");
    const [email, setEmail] = useState("");
    const [schedaError, setSchedaError] = useState("");
    const [esercizi, setEsercizi] = useState<esercizioData[]>();
    const isInitialized = useRef(false);
    const [eserciziDisponibili, setEserciziDisponibili] = useState<string[]>();
    const [selectedPatient, setSelectedPatient] = useState<string>();
    const [note, setNote] = useState<string>("");

    const [scheda, setScheda] = useState<schedaEserciziData>({
        esercizio_id: [],
        user_email_id: "",
        nome_scheda: "",
        serie: [],
        ripetizioni: [],
        note: "",
    });

    const [listaEsercizi, setListaEsercizi] = useState<esercizioData[]>([
        {
            esercizio_id: "",
            serie: "",
            ripetizioni: "",
        },
    ]);

    const getEsercizi = async () => {
        try {
            await axios
                .get(`${import.meta.env.VITE_API_KEY}/esercizi`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "access_token"
                        )}`,
                    },
                })
                .then((resp) => {
                    if (resp.status === 200) setEsercizi(resp.data);
                    const r: esercizioData[] = resp.data;

                    setEserciziDisponibili(r.map((eser) => eser.nome));
                });
        } catch (error) {
            console.error(error);
        }
    };

    async function getAllSchede() {
        try {
            await axios
                .get(`${import.meta.env.VITE_API_KEY}/schede`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "access_token"
                        )}`,
                    },
                })
                .then((resp) => {
                    if (resp.status === 200) {
                        const all: { nome: string }[] = resp.data;
                        setAlleSchedeName(all);
                    } else {
                        throw new Error(resp.data);
                    }
                });
        } catch (error) {
            console.error(error);
        }
    }

    async function addScheda() {
        try {
            await axios.post(
                `${import.meta.env.VITE_API_KEY}/addSchedaEsercizi`,
                JSON.stringify(scheda),
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "access_token"
                        )}`,
                        "Content-Type": "application/json",
                    },
                }
            );
        } catch (error) {
            console.log(error);
        } finally {
            console.log(JSON.stringify(scheda));
            window.location.reload();
        }
    }

    function createScheda() {
        scheda.note = note


        if (allSchedeName?.some((item) => item.nome == scheda.nome_scheda)) {
            setSchedaError("scheda già presente");
            return;
        }
        if (scheda.nome_scheda === "") {
            setSchedaError("la scheda deve avere un nome");
            return;
        }
        if (ruolo == "utente") {
            scheda.user_email_id = email;
        } else {
            if (selectedPatient) {
                if (selectedPatient === "") {
                    setSchedaError("devi selezionare un paziente");
                    return;
                } else scheda.user_email_id = selectedPatient;
            } else {
                setSchedaError("devi selezionare un paziente");
                return;
            }
        }

        const flag = listaEsercizi.map((eser) => {
            const serie = Number(eser.serie);
            const ripetizioni = Number(eser.ripetizioni);
            const esercizio_id = Number(eser.esercizio_id);

            if (esercizio_id == 0) {
                setSchedaError("devi selezionare un esercizio");
                return false;
            }

            if (!Number.isNaN(serie) && !Number.isNaN(ripetizioni)) {
                scheda.esercizio_id.push(esercizio_id);
                scheda.serie.push(serie);
                scheda.ripetizioni.push(ripetizioni);
                setSchedaError("");
                return true;
            } else {
                setSchedaError(
                    "le serie e le ripetizioni devono essere un numero"
                );
                return false;
            }
        });
        if (!flag.includes(false)) addScheda();
    }

    useEffect(() => {
        console.log(listaEsercizi);
        if (isInitialized.current) return;

        isInitialized.current = true;
        getEsercizi();
        getAllSchede();
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
    };

    const handleRuoloFetch = (ruolo: string, email: string) => {
        setEmail(email);
        setRuolo(ruolo);
    };

    return (
        <>
            <div>
                <h2>Aggiungi Scheda</h2>
                <input
                    className="nameInput"
                    type="text"
                    placeholder="Nome scheda"
                    onChange={(e) => {
                        scheda.nome_scheda = e.target.value;
                    }}
                />
                <div>
                    <PatientSelector
                        onDataFetch={handleRuoloFetch}
                        setSelectedPatient={setSelectedPatient}
                        currentSelectedPatient={selectedPatient}
                    />
                </div>

                <form>
                    {listaEsercizi.map((input, index) => {
                        return (
                            <div key={index}>
                                <h4>Esercizio: {index + 1}</h4>

                                {eserciziDisponibili ? (
                                    <select
                                        value={
                                            esercizi?.find(
                                                (item) =>
                                                    item.id.toString() ===
                                                    input.esercizio_id
                                            )?.nome || ""
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
                                        <option value="">Select Option</option>
                                        {eserciziDisponibili.map((option) => (
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
                                    type="number"
                                    min="0"
                                    onChange={(event) =>
                                        handleFormChange(index, event)
                                    }
                                />
                                <input
                                    value={input.ripetizioni}
                                    name="ripetizioni"
                                    placeholder="Ripetizioni"
                                    type="number"
                                    min="0"
                                    onChange={(event) =>
                                        handleFormChange(index, event)
                                    }
                                />
                                <button
                                    type="button"
                                    onClick={() => removeFields(index)}
                                >
                                    X
                                </button>
                            </div>
                        );
                    })}
                </form>
            </div>
            <div>
                <button onClick={addFields}>Aggiungi Esercizio</button>
            </div>
            <div>
                <h3>Note: </h3>
                <label>
                    <textarea 
                        name="postContent" 
                        rows={4} 
                        cols={40} 
                        onChange={
                            (event) => {
                                setNote(event.target.value);
                            }
                        }/>
                </label>
            </div>
            
            <div>
                <button type="button" onClick={createScheda}>
                    Crea
                </button>
            </div>
            <div>
                <h4 className="schedaError">{schedaError}</h4>
            </div>
        </>
    );
}
export default AddSchede;
