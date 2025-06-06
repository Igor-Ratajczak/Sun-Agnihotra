# Sun-set-rise

A modern application that tracks sunrise and sunset times for your location, built with Svelte and Capacitor.

## Download 
[Sun Set Rise.apk](https://github.com/Igor-Ratajczak/Sun-Agnihotra/raw/refs/heads/master/Sun%20Set%20Rise.apk)

## Features

- Real-time sunrise and sunset time calculations based on your location
- GPS location support
- Manual location input (latitude/longitude)
- Customizable notifications before sunrise and sunset
- Draggable UI elements for personalized layout
- Local data persistence
- Background notifications with sound alerts

## Permissions

The app requires the following permissions:

- Location access (for GPS coordinates) (optional)
- Notification permissions (for sunrise/sunset alerts)

## How It Works

1. The app gets your location (via GPS or manual input)
2. Calculates precise sunrise and sunset times for your coordinates using SunCalc Library
3. Allows you to set notification preferences (0-60 minutes before events)
4. Sends local notifications before each sunrise and sunset
5. Stores your preferences locally for future use

## Technologies

- SvelteKit - Frontend framework
- Capacitor - Native runtime
- SunCalc - Sun position calculations
- Temporal API - Date/time handling

## Contributing

Feel free to open issues and submit pull requests to help improve the application.
