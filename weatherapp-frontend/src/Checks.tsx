import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Checks() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleting, setDeleting] = useState(false);


    function deleteLocation(id: number) {
        setData(data.filter(l => l["id"] !== id))
        fetch("/api/weather/locations/" + id, {
            method: "DELETE"
        });
        setDeleting(false);
    }

    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            try {
                const response = await fetch(
                    '/api/weather/locations'
                );
                console.log(response);
                if (!response.ok) {
                    throw new Error('Error while loading data');
                }
                let locationsData = await response.json();
                console.log(locationsData);
                setData(locationsData);
                setError(null);
            } catch (err: any) {
                setError(err.message);
                setData([]);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    return (
        <>
            { loading?  
            <div className="loader"></div>
            :
            <>
                { data.length == 0?
                <div className={"card"}>
                    <h1>No data found</h1>
                    <button onClick={() => navigate("/")}>Back</button>
                </div>
                :
                <div className="container">
                    <h1>Previous Weather Checks</h1>
                    <ul>
                        {
                            data.map(({id, name}:any) => {
                                return <div className="resultCard" key={id} onClick={() => (!deleting)? navigate("/info/" + id) : void(0)}>
                                    <h2>
                                        {name}
                                    </h2>
                                    <i className="fa-solid fa-trash redIconButton" onMouseEnter={(e) => setDeleting(true)} onMouseLeave={(e) => setDeleting(false)} onClick={() => deleteLocation(id)}></i>
                                </div>
                            })
                        }
                    </ul>
                    <button onClick={() => navigate("/")}>Back</button>
                </div>
                }
            </>
            }
        </>
    );
}

export default Checks