package com.example.weatherapp.weather;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping(path="api/weather")
public class WeatherController {

    @Autowired
    WeatherLocationRepository weatherLocationRepository;

    @Autowired
    WeatherDayRepository weatherDayRepository;

    @Value("${weatherAPIKey}")
    String weatherAPIKey;

    @CrossOrigin
    @GetMapping
    public ResponseEntity<Object> getWeather(@RequestParam String location) {
        String url = "https://api.tomorrow.io/v4/weather/forecast?location=" + location + "&timesteps=daily&apikey=" + weatherAPIKey;
        try {
            RestTemplate restTemplate = new RestTemplate();
            Object weather = restTemplate.getForObject(url, Object.class);
            return new ResponseEntity<>(weather, HttpStatus.OK);
        } catch (HttpStatusCodeException exception) {
            return new ResponseEntity<>(null, HttpStatus.FAILED_DEPENDENCY);
        }
       
    }

    @CrossOrigin
    @GetMapping("/locations")
    public ResponseEntity<List<WeatherLocation>> getWeatherLocations() {
        List<WeatherLocation> weatherLocations = new ArrayList<WeatherLocation>();
        weatherLocationRepository.findAll().forEach(weatherLocations::add);

        return new ResponseEntity<>(weatherLocations, HttpStatus.OK);
    }

    @CrossOrigin
    @GetMapping("/locations/byname/{name}")
    public ResponseEntity<WeatherLocation> getWeatherLocationByName(@PathVariable(value="name") String name) {
        List<WeatherLocation> weatherLocation = weatherLocationRepository.findByNameContaining(name);
        if (weatherLocation.size() == 0) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        return new ResponseEntity<>(weatherLocation.get(0), HttpStatus.OK);
    }

    @CrossOrigin
    @GetMapping("/locations/{id}")
    public ResponseEntity<WeatherLocation> getWeatherLocation(@PathVariable(value="id") Long id) {
        Optional<WeatherLocation> weatherLocation = weatherLocationRepository.findById(id);
        if (!weatherLocation.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        return new ResponseEntity<>(weatherLocation.get(), HttpStatus.OK);
    }

    @CrossOrigin
    @GetMapping("/days/{locationId}")
    public ResponseEntity<List<WeatherDay>> getWeatherDays(@PathVariable(value="locationId") Long locationId) {
        if (!weatherLocationRepository.existsById(locationId)) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        List<WeatherDay> days = weatherDayRepository.findByLocationId(locationId);
        return new ResponseEntity<>(days, HttpStatus.OK);
    }

    @CrossOrigin
    @PostMapping("/locations")
    public ResponseEntity<WeatherLocation> postWeatherLocation(@RequestBody WeatherLocation weatherLocation) {
        WeatherLocation location = weatherLocationRepository.save(weatherLocation);
        return new ResponseEntity<>(location, HttpStatus.CREATED);
    }


    @CrossOrigin
    @PostMapping("/days/{locationId}")
    public ResponseEntity<WeatherDay> postWeatherDay(@PathVariable(value="locationId") Long locationId, @RequestBody WeatherDay weatherDay) {
        Optional<WeatherLocation> location = weatherLocationRepository.findById(locationId);
        if (location.isPresent()) {
            weatherDay.setLocation(location.get());
            WeatherDay day = weatherDayRepository.save(weatherDay);
            return new ResponseEntity<>(day, HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @CrossOrigin
    @PutMapping("/locations/{id}")
    public ResponseEntity<WeatherLocation> putWeatherLocation(@PathVariable(value="id") Long id, @RequestBody WeatherLocation weatherLocation) {
        System.out.println(id);
        Optional<WeatherLocation> location = weatherLocationRepository.findById(id);
        if (!location.isPresent()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        WeatherLocation _weatherLocation = location.get();
        _weatherLocation.setName(weatherLocation.getName());
        return new ResponseEntity<>(weatherLocationRepository.save(_weatherLocation), HttpStatus.OK);
    }

    @CrossOrigin
    @DeleteMapping("/locations/{id}")
    public ResponseEntity<HttpStatus> deleteWeatherLocation (@PathVariable(value="id") Long id) {
        if (!weatherLocationRepository.existsById(id)) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        weatherLocationRepository.deleteById(id);
        weatherDayRepository.deleteByLocationId(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @CrossOrigin
    @DeleteMapping("/days/{id}")
    public ResponseEntity<HttpStatus> deleteWeatherDay (@PathVariable(value="id") Long id) {
        if (!weatherDayRepository.existsById(id)) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        weatherDayRepository.deleteById(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
