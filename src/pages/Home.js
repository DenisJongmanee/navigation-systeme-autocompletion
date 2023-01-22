import React, { useEffect, useState } from "react";
import '../App.css';
import { GoogleMap, LoadScript, DirectionsRenderer } from '@react-google-maps/api';
import TextInput from 'react-autocomplete-input';
import 'react-autocomplete-input/dist/bundle.css';
import axios from 'axios';
/* global google */

const mapContainerStyle = {
    position: "absolute",
    top: 0,
    right: 0,
    width: "70%",
    height: "100%"
}

const meteo = {
    0: "Temps clair",
    1: "Partiellement nuageux",
    2: "Nuageux",
    3: "Neige"
}

const Home = () => {


    const DirectionsService = new google.maps.DirectionsService();
    const [itineraire, setItineraire] = useState("");

    const [optionsInputDepart, setOptionsInputDepart] = useState([]);
    const [optionsInputArrivee, setOptionsInputArrivee] = useState([]);
    const [valueInputDepart, setValueInputDepart] = useState("");
    const [valueInputArrivee, setValueInputArrivee] = useState("");

    const [historique, setHistorique] = useState([]);

    const formatDate = (object) => {
        return object.date.getDate() + "/" + (object.date.getMonth() + 2 <10 ? "" + object.date.getMonth() + 2 : object.date.getMonth() + 2) + "/" + object.date.getFullYear() + " à "
            + object.date.getHours() + ":" + object.date.getMinutes() + ":" + object.date.getSeconds();
    }

    const listHistorique = historique.map(trajet => {
        return (
            <ul key={trajet.date.toString() + trajet.villeDepart + trajet.villeArrivee} className="list">
                <li className="date">
                    {formatDate(trajet)}
                </li>
                <li className="villeDepart">
                    {trajet.villeDepart}
                </li>
                <li className="villeArrivee">
                    {trajet.villeArrivee}
                </li>
            </ul>
        )

    });

    const [regions, setRegions] = useState([]);
    const [regionDepart, setRegionDepart] = useState(null);
    const [regionArrivee, setRegionArrivee] = useState(null);

    const [departmentsDepart, setDepartementsDepart] = useState([]);
    const [departmentsArrivee, setDepartementsArrivee] = useState([]);
    const [departmentDepart, setDepartmentDepart] = useState(null);
    const [departmentArrivee, setDepartmentArrivee] = useState(null);

    const [citiesDepart, setCitiesDepart] = useState([]);
    const [citiesArrivee, setCitiesArrivee] = useState([]);
    const [cityDepart, setCityDepart] = useState(null);
    const [cityArrivee, setCityArrivee] = useState(null);

    const [coorCityDepart, setCoorCityDepart] = useState(null);
    const [coorCityArrivee, setCoorCityArrivee] = useState(null);
    const [center, setCenter] = useState({
        lat: 48.866667,
        lng: 2.333333
    });
    const [meteoDepart, setMeteoDepart] = useState("");
    const [meteoArrivee, setMeteoArrivee] = useState("");

    useEffect(() => {
        axios.get('http://127.0.0.1:3001/api/regions').then((response) => {
            const data = response.data;
            const regionNames = data.map((region) => {
                return region.name;
            });
            setRegions(data);
            setOptionsInputDepart(regionNames);
            setOptionsInputArrivee(regionNames);
        });
    }, []);


    const selectInputDepart = (choice) => {
        if (regionDepart === null) {
            setRegionDepart(choice);
            const region = regions.filter((region) => {
                return region.name === choice.trim();
            });
            const codeRegion = region[0].code;
            axios.get(`http://127.0.0.1:3001/api/departments/${codeRegion}`).then(response => {
                const data = response.data;
                const departmentsNames = data.map((department) => {
                    return department.name;
                });
                setDepartementsDepart(data);
                setOptionsInputDepart(departmentsNames);
                setValueInputDepart("");
            });
        } else if (departmentDepart === null) {
            setDepartmentDepart(choice);
            const department = departmentsDepart.filter((department) => {
                return department.name === choice.trim();
            });
            const codeDepartment = department[0].code;
            axios.get(`http://127.0.0.1:3001/api/cities/${codeDepartment}`).then(response => {
                const data = response.data;
                const citiesNames = data.map((city) => {
                    return `${city.name} -- ${city.zip_code}`;
                });
                setCitiesDepart(data);
                setOptionsInputDepart(citiesNames);
                setValueInputDepart("");
            });
        } else {
            setCityDepart(choice);
        }
    };

    const selectInputArrivee = (choice) => {
        if (regionArrivee === null) {
            setRegionArrivee(choice);
            const region = regions.filter((region) => {
                return region.name === choice.trim();
            });
            const codeRegion = region[0].code;
            axios.get(`http://127.0.0.1:3001/api/departments/${codeRegion}`).then(response => {
                const data = response.data;
                const departmentsNames = data.map((department) => {
                    return department.name;
                });
                setDepartementsArrivee(data);
                setOptionsInputArrivee(departmentsNames);
                setValueInputArrivee("");
            });
        } else if (departmentArrivee === null) {
            setDepartmentArrivee(choice);
            const department = departmentsArrivee.filter((department) => {
                return department.name === choice.trim();
            });
            const codeDepartment = department[0].code;
            axios.get(`http://127.0.0.1:3001/api/cities/${codeDepartment}`).then(response => {
                const data = response.data;
                const citiesNames = data.map((city) => {
                    return `${city.name} -- ${city.zip_code}`;
                });
                setCitiesArrivee(data);
                setOptionsInputArrivee(citiesNames);
                setValueInputArrivee("");
            });
        } else {
            setCityArrivee(choice);
        }
    };

    const affichageCoordonnees = () => {
        const cityD = citiesDepart.find(city => {
            return `${city.name} -- ${city.zip_code}` === cityDepart.trim();
        });
        const coorDepart = {
            lat: cityD.gps_lat,
            lng: cityD.gps_lng
        };
        setCoorCityDepart(coorDepart);

        axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${cityD.gps_lat}&longitude=${cityD.gps_lng}&current_weather=true`).then(response => {
            const weathercode = response.data.current_weather.weathercode;
            setMeteoDepart(`Temps (${cityDepart}) : ${response.data.current_weather.temperature}°C - ${meteo[weathercode]}`);
        });

        const cityA = citiesArrivee.find(city => {
            return `${city.name} -- ${city.zip_code}` === cityArrivee.trim();
        });
        const coorArrivee = {
            lat: cityA.gps_lat,
            lng: cityA.gps_lng
        };
        setCoorCityArrivee(coorArrivee);

        axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${cityA.gps_lat}&longitude=${cityA.gps_lng}&current_weather=true`).then(response => {
            const weathercode = response.data.current_weather.weathercode;
            setMeteoArrivee(`Temps (${cityArrivee}) : ${response.data.current_weather.temperature}°C - ${meteo[weathercode]}`);
        });

        const coorCenter = {
            lat: (cityD.gps_lat + cityA.gps_lat) / 2,
            lng: (cityD.gps_lng + cityA.gps_lng) / 2
        };
        setCenter(coorCenter);

        const listCurrentHistorique = historique;
        listCurrentHistorique.push({
            date: new Date(),
            villeDepart: cityDepart.trim(),
            villeArrivee: cityArrivee.trim()
        });
        setHistorique(listCurrentHistorique);
    }

    const reset = () => {
        setCityDepart(null);
        setCityArrivee(null);
        setDepartmentDepart(null);
        setDepartmentArrivee(null);
        setRegionDepart(null);
        setRegionArrivee(null);
        setCoorCityDepart(null);
        setCoorCityArrivee(null);
        axios.get('http://127.0.0.1:3001/api/regions').then((response) => {
            const data = response.data;
            const regionNames = data.map((region) => {
                return region.name;
            });
            setRegions(data);
            setOptionsInputDepart(regionNames);
            setOptionsInputArrivee(regionNames);
        });
        setValueInputDepart("");
        setValueInputArrivee("");
    }

    DirectionsService.route(
        {
            origin: coorCityDepart,
            destination: coorCityArrivee,
            travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                setItineraire(result);
            } else {
                console.error(`error fetching directions ${result}`);
            }
        }
    );

    return (
        <div className="homepage">
            <div className="sidebar">
                <button className="btnReset" onClick={reset}>Réinitialiser</button>
                <h1>Build Travel</h1>
                <p className="label">Départ {regionDepart === null ? "(choisir la région)" : (departmentDepart === null ? "(choisir le département)" : (cityDepart ? "" : "(choisir la ville)"))}</p>
                <TextInput className="textInput" trigger={[""]} options={{ "": optionsInputDepart }} onSelect={selectInputDepart} value={valueInputDepart} onChange={(value) => setValueInputDepart(value)} />
                <p className="label">Arrivée {regionArrivee === null ? "(choisir la région)" : (departmentArrivee === null ? "(choisir le département)" : (cityArrivee ? "" : "(choisir la ville)"))}</p>
                <TextInput className="textInput" trigger={[""]} options={{ "": optionsInputArrivee }} onSelect={selectInputArrivee} value={valueInputArrivee} onChange={(value) => setValueInputArrivee(value)} />
                <button className="btnLancer" onClick={affichageCoordonnees}>Démarrer</button>
                <p className="labelMeteo">Météo Actuelle</p>
                <p className="meteoDepart">{meteoDepart}</p>
                <p className="meteoArrivee">{meteoArrivee}</p>
                <p className="label">Historique</p>
                <p>{listHistorique} </p>
            </div>

            <GoogleMap
                id="marker-example"
                mapContainerStyle={mapContainerStyle}
                zoom={7}
                center={center}
            >
                {coorCityDepart !== null && coorCityArrivee !== null ? (
                    <>
                        <>{itineraire && <DirectionsRenderer directions={itineraire} />}</>;
                    </>
                ) : (
                    <></>
                )}
            </GoogleMap>
        </div>
    )
}


export default Home;