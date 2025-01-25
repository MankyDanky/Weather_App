package com.example.weatherapp.weather;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface WeatherLocationRepository extends JpaRepository<WeatherLocation, Long> {
    List<WeatherLocation> findByNameContaining(String name);
}
