import React from "react";
import '../App.css';
import { GoogleMap, LoadScript, MarkerF, DirectionsRenderer } from '@react-google-maps/api';


function Home() {
    const mapContainerStyle = {
        position: "absolute",
        top: 0,
        right: 0,
        width:"80%",
        height:"100%"
    }

    const center = {
        lat: (48.8588897+50.6365654)/2,
        lng: (2.320041+3.0635282)/2
    }

    const destination = {
        lat: 48.8588897,
        lng: 2.320041
    }

    const origin = {
        lat: 50.6365654,
        lng: 3.0635282
    }

    const onLoad = marker => {
        console.log('marker: ', marker)
    }

    return (
        <div className="Home">
            <h1>Home Page</h1>
            <LoadScript
                googleMapsApiKey="AIzaSyCjzCI3yJUBRRNwH822WmWNcOzFeFf-qvk"
            >
                <GoogleMap
                    id="marker-example"
                    mapContainerStyle={mapContainerStyle}
                    zoom={7}
                    center={center}
                >
                    <MarkerF
                        onLoad={onLoad}
                        position={origin}
                    />
                    <MarkerF
                        onLoad={onLoad}
                        position={destination}
                    />
                </GoogleMap>
            </LoadScript>
        </div>
    )
}

export default Home;