import './App.css'
import Possession from "../../models/possessions/Possession.js";
import {Button} from "react-bootstrap";
import {useEffect, useState} from "react";
import Patrimoine from "../../models/Patrimoine.js";
import {readFile} from "../../data/index.js";

let PossessionArray = [];

function Tableau(){
    const [possessions, setPossessions] = useState([])
    useEffect(()=>{
        readFile('../../data/data.json').then((result) => {
            setPossessions(result.find(item => item.model === "Patrimoine").data.possessions);
        });
    },[]);

    return (
        <table className={"table table-striped w-100"}>
            <thead>
            <tr>
                <th>Libelle</th>
                <th>Valeur</th>
                <th>DateDebut</th>
                <th>DateFin</th>
                <th>Amortissement</th>
                <th>Valeur Actuel</th>
            </tr>
            </thead>
            <tbody>
            {possessions.map((possession, index) => {
                const valeur = new Possession(
                    possession.possesseur, possession.libelle, possession.valeur, new Date(possession.dateDebut),
                new Date(possession.dateFin), possession.tauxAmortissement);
                PossessionArray.push(valeur);
                return (
                    <tr key={index}>
                        <td>{valeur.libelle}</td>
                        <td>{valeur.valeur}</td>
                        <td>{new Date(valeur.dateDebut).toLocaleDateString()}</td>
                        <td>{'null'}</td>
                        <td>{valeur.tauxAmortissement !== null ? valeur.tauxAmortissement : 0}</td>
                        <td>{valeur.getValeur(new Date())}</td>
                    </tr>
                )
                }
            )}
            </tbody>
        </table>
    );
}

function ValeurPatrimoine(date) {
    const patrimoine = new Patrimoine("John Doe", PossessionArray.slice(0,7))
    console.log(PossessionArray.slice(0,6));
    let result = patrimoine.getValeur(new Date(date));
    if (isNaN(result)){
        return '';
    }
    return result;
}

function App() {
    let [InputDate, setInputDate] = useState('');
    let [DateFinal, SetDateFinal] = useState('...');

    const handleInputChange = (e) => {
        setInputDate(e.target.value);
    };
    const handleButtonClick = () => {
        SetDateFinal(InputDate);
    }
    return (
        <div className={"body position-fixed top-0"}>
            <div className={"title"}>
                <h1>Patrimoine</h1>
            </div>
            <Tableau/>
            <h2 className={"mt-5"}>Valeur total du Patrimoine</h2>
            <div>
                <input
                    type={"date"}
                    value={InputDate}
                    onChange={handleInputChange}
                />
                <Button
                    className={"mx-lg-3"}
                    onClick={()=>{handleButtonClick()}}
                >Valider</Button>
            </div>
            <h5 className={"mt-3"}>La Valeur de la patrimoine à {DateFinal} est de : {ValeurPatrimoine(DateFinal)}</h5>
        </div>
    );
}

export default App;