package com.example.weatherapp.weather;

import jakarta.persistence.*;

@Entity
@Table(name="locations")
public class WeatherLocation {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    
    private String name;

    public WeatherLocation() {}

    public WeatherLocation(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    
}
