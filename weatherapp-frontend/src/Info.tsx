import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Info() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [locationData, setLocationData] = useState(null);
    const [daysData, setDaysData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState("");
    const [editing, setEditing] = useState(false);
    const [newName, setNewName] = useState("");

    function deleteDay(id: number) {
        setDaysData(daysData.filter(d =>d["id"] !== id))
        fetch("/api/weather/days/" + id, {
            method: "DELETE"
        });
    }

    async function fetchData():Promise<void> {
        try {
            const response = await fetch(
                '/api/weather/locations/' + id
            );
            if (!response.ok) {
                throw new Error('Error while loading data');
            }
            let locationsData = await response.json();
            setLocationData(locationsData);
            const daysReponse = await fetch(
                "http://localhost:8080/api/weather/days/" + locationsData["id"]
            );
            if (!response.ok) {
                throw new Error('Error while loading data');
            }
            const daysData = await daysReponse.json();
            setDaysData(daysData);
            setError("");
        } catch (err: any) {
            setError(err.message);
            setLocationData(null);
        } finally {
            setLoading(false);
        }
    }

    async function updateName():Promise<void> {
        setUpdating(true);
        try {
            const response = await fetch("http://localhost:8080/api/weather/locations/" + id, {method: 'PUT', headers: {
                  'Content-Type': 'application/json'
                }, body: JSON.stringify({
                name: newName
            })});
        } catch (err: any) {
            setError("");
            console.log(err);
        } finally {
            await fetchData();
            setUpdating(false);
            setEditing(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            { loading?  
            <div className="loader"></div>
            :
            <>
                {locationData == null?
                <div className={"card"}>
                    <h1>Invalid ID</h1>
                    <button onClick={() => navigate("/")}>Back</button>
                </div>
                :
                <div className="container">
                    {editing? 
                    <>
                        <form style={{marginTop: "0px"}}>
                            {error && <p className="errorText">{error}</p>}
                            <label> New name:
                                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className="lightBorder"></input>
                            </label>
                            <i style={{display: "inline", lineHeight: "20px", margin: "10px", float: "none"}} className={"accentIconButton fa-solid fa-floppy-disk " + (updating? "disabled" : "")} onClick={() => {
                                if (!updating) {
                                    if (newName == "") {
                                        setError("Invalid name");
                                    } else {
                                        updateName();
                                    }
                                }
                            }}></i>
                            <i style={{display: "inline", lineHeight: "20px", margin: "10px", float: "none"}} className={"redIconButton fa-solid fa-ban " + (updating? "disabled" : "")} onClick={() => updating? void(0) : setEditing(false)}></i>
                        </form>
                    </>
                    :
                    <>
                        <h1 style={{display: "inline"}}>{locationData["name"]}</h1>
                        <i style={{display: "inline", lineHeight: "50px", margin: "10px", float: "none"}} className="accentIconButton fa-solid fa-pen-to-square" onClick={() => setEditing(true)}></i>
                    </>
                    }
                    
                    <div className="daysContainer">
                        {
                            daysData.map(({id, date, temperature, windSpeed, humidity, precipitation}:any) => {
                                return <div className="card" key={id}>
                                    <h3>
                                        {date}
                                    </h3>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>Temperature</td>
                                                <td>{temperature}C</td>
                                            </tr>
                                            <tr>
                                                <td>Wind Speed</td>
                                                <td>{windSpeed}m/s</td>
                                            </tr>
                                            <tr>
                                                <td>Humidity</td>
                                                <td>{humidity}%</td>
                                            </tr>
                                            <tr>
                                                <td>Precipitation</td>
                                                <td>{precipitation}%</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <i style={{float: "none", marginTop: "10px"}} className="fa-solid fa-trash redIconButton" onClick={() => deleteDay(id)}></i>
                                </div>
                            })
                        }
                    </div>
                    <button onClick={() => navigate("/")}>Back</button>
                </div>
                }
            </>
            }
        </>
    );
}

export default Info