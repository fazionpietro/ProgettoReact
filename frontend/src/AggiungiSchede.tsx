import { useState, useEffect, useRef } from "react";
import axios from "axios";

import "./stylesheets/LoginRegister.css";
import schedaEserciziData from "./types/schedaEserciziType";
import { useNavigate, useParams } from "react-router";

type esercizioData = {
    esercizio_id: string;
    serie: string;
    ripetizioni: string;
    [key: string]: string;
};

function AddSchede() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string | undefined }>();
    const { emailParam } = useParams<{ emailParam: string | undefined }>();
    const [allSchedeName, setAlleSchedeName] = useState<{ nome: string }[]>();

    const [schedaError, setSchedaError] = useState("");
    const [esercizi, setEsercizi] = useState<esercizioData[]>();
    const isInitialized = useRef(false);
    const [eserciziDisponibili, setEserciziDisponibili] = useState<string[]>();

    const [note, setNote] = useState<string>("");

    const [scheda, _setScheda] = useState<schedaEserciziData>({
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
        await axios
            .post(
                `${import.meta.env.VITE_API_KEY}/AggiungiSchedaEsercizi`,
                JSON.stringify(scheda),
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "access_token"
                        )}`,
                        "Content-Type": "application/json",
                    },
                }
            )
            .then(() => {
                navigate(-1);
            })
            .catch((err) => {
                console.error(err);
                setSchedaError("l'utente non esiste");
            });
    }

    function createScheda(e: React.FormEvent) {
        e.preventDefault();
        scheda.note = note;

        if (id) {
            scheda.id = Number(id);
            scheda.nome_scheda = id;
        }
        if (
            allSchedeName?.some((item) => item.nome == scheda.nome_scheda) &&
            !id
        ) {
            setSchedaError("scheda già presente");
            return;
        }
        if (scheda.nome_scheda === "") {
            setSchedaError("la scheda deve avere un nome");
            return;
        }

        if (emailParam) {
            scheda.user_email_id = emailParam;
        }

        const flag = listaEsercizi.map((eser) => {
            const serie = Number(eser.serie);
            const ripetizioni = Number(eser.ripetizioni);
            const esercizio_id = Number(eser.esercizio_id);

            if (esercizio_id == 0) {
                setSchedaError("devi selezionare un esercizio");
                return false;
            }

            if (
                !Number.isNaN(serie) &&
                !Number.isNaN(ripetizioni) &&
                serie > 0 &&
                ripetizioni > 0
            ) {
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
        console.log(scheda);
        if (!flag.includes(false)) addScheda();
    }

    useEffect(() => {
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
        if (index < 0 || index >= listaEsercizi.length) return;
        const data = [...listaEsercizi];
        data.splice(index, 1);
        setListaEsercizi(data);
    };

    return (
        <>
            <div className="inputPage addEsercizo">
                <form className="inputForm">
                    {id ? (
                        <>
                            <h1>Aggiungi Esercizi</h1>
                        </>
                    ) : (
                        <>
                            <div>
                                <h1>Aggiungi Scheda</h1>
                                <div>
                                    <h4>Paziente: {emailParam}</h4>
                                </div>
                                <input
                                    className="inputLoginRegister"
                                    type="text"
                                    placeholder="Nome scheda"
                                    onChange={(e) => {
                                        scheda.nome_scheda = e.target.value;
                                    }}
                                />
                            </div>
                        </>
                    )}

                    {listaEsercizi.map((input, index) => {
                        return (
                            <div key={index}>
                                <h4>Esercizio {index + 1}:</h4>

                                {eserciziDisponibili ? (
                                    <select
                                        className="Dropdown"
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
                                        <option value="">
                                            Seleziona Esercizio
                                        </option>
                                        {eserciziDisponibili.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    ""
                                )}

                                {/* Container per serie */}
                                <div className="input-container">
                                    <input
                                        className="inputLoginRegister"
                                        value={input.serie}
                                        name="serie"
                                        placeholder="Serie"
                                        type="number"
                                        min="0"
                                        onChange={(event) =>
                                            handleFormChange(index, event)
                                        }
                                    />
                                </div>

                                {/* Container per ripetizioni con bottone elimina */}
                                <div className="input-container">
                                    <input
                                        className="inputLoginRegister with-button"
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
                                        className="remove-button"
                                        onClick={() => removeFields(index)}
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    <div>
                        <button
                            type="button"
                            className="buttonLoginRegister"
                            onClick={addFields}
                        >
                            Aggiungi Esercizio
                        </button>
                    </div>

                    {id && emailParam ? (
                        <></>
                    ) : (
                        <>
                            <div>
                                <h4>Note:</h4>
                                <textarea
                                    name="postContent"
                                    placeholder="Note per la scheda"
                                    rows={4}
                                    cols={40}
                                    value={note}
                                    onChange={(event) => {
                                        setNote(event.target.value);
                                    }}
                                />
                            </div>
                        </>
                    )}

                    <div className="loginErrorDiv">
                        <label className="loginError">{schedaError}</label>
                    </div>

                    {id && emailParam ? (
                        <>
                            <div>
                                <button
                                    type="button"
                                    className="buttonLoginRegister"
                                    onClick={createScheda}
                                >
                                    Aggiorna scheda
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                <button
                                    type="button"
                                    className="buttonLoginRegister"
                                    onClick={createScheda}
                                >
                                    Crea Scheda
                                </button>
                            </div>
                        </>
                    )}

                    <div className="navLink">
                        <a onClick={() => navigate(-1)}>Indietro</a>
                    </div>
                </form>
            </div>
        </>
    );
}

export default AddSchede;
