package com.example.weatherapp.weather;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import jakarta.transaction.Transactional;

public interface WeatherDayRepository extends JpaRepository<WeatherDay, Long> {
    List<WeatherDay> findByLocationId(Long locationId);

    @Transactional
    void deleteByLocationId(Long locationId);
}
