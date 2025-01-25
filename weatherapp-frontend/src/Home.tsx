import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function TimeToDate(time:String):String{
    return time.slice(8, 10) + "/" + time.slice(5, 7) + "/" + time.slice(0, 4);
  }

  async function CheckLocation() {
      setLoading(true);
      
      try {
        const response = await fetch(
            '/api/weather/locations/byname/' + location
        );
        if (!response.ok) {
            throw new Error('Error while loading data');
        }
        console.log(response.status);
        if (response.status == 204) {
          const weatherResponse = await fetch(
            "/api/weather?location=" + location
          );
          let weatherData = await weatherResponse.json();
          console.log(weatherData);
          if (weatherResponse.status == 200) {
            console.log(JSON.stringify({
              "name": weatherData["location"]["name"]
            }));
            const locationUploadResponse = await fetch("/api/weather/locations", {
              method: 'POST', 
              body: JSON.stringify({
                "name": weatherData["location"]["name"]
              }),
              headers: {
                'Content-Type': 'application/json'
              }
            })
            const locationUploadData = await locationUploadResponse.json();
            const dailyWeatherData = weatherData["timelines"]["daily"];
            for (let i = 0; i < dailyWeatherData.length; i++) {
              await fetch("/api/weather/days/" + locationUploadData["id"], {
                method: 'POST', 
                body: JSON.stringify({
                  "date": TimeToDate(dailyWeatherData[i]["time"]),
                  "temperature": dailyWeatherData[i]["values"]["temperatureAvg"],
                  "windSpeed": dailyWeatherData[i]["values"]["windSpeedAvg"],
                  "humidity": dailyWeatherData[i]["values"]["humidityAvg"],
                  "precipitation": dailyWeatherData[i]["values"]["precipitationProbabilityAvg"]
                }),
                headers: {
                  'Content-Type': 'application/json'
                }
              })
            }
            navigate("/info/" + locationUploadData["id"]);
          } else {
            throw new Error('Invalid location');
          }
        } else {
          let locationsData = await response.json();
          navigate("/info/" + locationsData["id"]);
          setError("");
        }
        
    } catch (err: any) {
      setError("Invalid location");
    } finally {
        setLoading(false);
    }
  }

  return (
    <>
      <div className="card">
        <h1>Check the Weather</h1>
        
        <form>
          {error && <p className="errorText">Invalid location</p>}
          <label> Enter location:
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)}></input>
          </label>
        </form>
        <button onClick={CheckLocation} className={loading? "disabled" : ""} disabled={loading? true : false}>Check</button>
        <button onClick={() => navigate("/checks")} className={loading? "disabled" : ""} disabled={loading? true : false}>Database</button>
      </div>
    </>
  )
}

export default Home
