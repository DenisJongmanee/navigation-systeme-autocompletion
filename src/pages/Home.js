import React, { useEffect, useState } from "react";
import '../App.css';
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';
import TextInput from 'react-autocomplete-input';
import 'react-autocomplete-input/dist/bundle.css';
import axios from 'axios';
import Historique from "../components/Historique";

const mapContainerStyle = {
    position: "absolute",
    top: 0,
    right: 0,
    width: "70%",
    height: "100%"
}

const center = {
    lat: (48.8588897 + 50.6365654) / 2,
    lng: (2.320041 + 3.0635282) / 2
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
    // console.log('marker: ', marker)
}
const Home = () => {

    const [optionsInputDepart, setOptionsInputDepart] = useState([]);
    const [optionsInputArrivee, setOptionsInputArrivee] = useState([]);
    const [valueInputDepart, setValueInputDepart] = useState("");
    const [valueInputArrivee, setValueInputArrivee] = useState("");
    
    const [historique, setHistorique] = useState([]);
    
    const [regions, setRegions] = useState([]);
    const [regionDepart, setRegionDepart] = useState(null);
    const [regionArrivee, setRegionArrivee] = useState(null);
    
    const [departmentsDepart, setDepartementsDepart] = useState([]);
    const [departmentsArrivee, setDepartementsArrivee] = useState([]);
    const [departmentDepart, setDepartmentDepart] = useState(null);
    const [departmentArrivee, setDepartmentArrivee] = useState(null);

    const [citiesDepart, setCitiesDepart] = useState([]);
    const [citiesArivee, setCitiesArrivee] = useState([]);
    const [cityDepart, setCityDepart] = useState(null);
    const [cityArrivee, setCityArrivee] = useState(null);

    const [coorCityDepart, setCoorCityDepart] = useState({});
    const [coorCityArrivee, setCoorCityArrivee] = useState({});
 

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
                return region.name.trim() === choice.trim();
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
                return department.name.trim() === choice.trim();
            });
            const codeDepartment = department[0].code;
            axios.get(`http://127.0.0.1:3001/api/cities/${codeDepartment}`).then(response => {
                const data = response.data;
                const citiesNames = data.map((city) => {
                    return `${city.name} -- ${city.zip_code}` ;
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
                return region.name.trim() === choice.trim();
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
                return department.name.trim() === choice.trim();
            });
            const codeDepartment = department[0].code;
            axios.get(`http://127.0.0.1:3001/api/cities/${codeDepartment}`).then(response => {
                const data = response.data;
                const citiesNames = data.map((city) => {
                    return `${city.name} -- ${city.zip_code}` ;
                });
                setCitiesArrivee(data);
                setOptionsInputArrivee(citiesNames);
                setValueInputArrivee("");
            });
        } else {
            setCityArrivee(choice);
        }
    };

    return (
        <div className="homepage">
            <div className="sidebar">
                <h1>Hess Map</h1>
                <p className="label">Départ ({regionDepart === null ? "choisir la région" : "choisir le département"}) :</p>
                <TextInput className="textInput" trigger={[""]} options={{ "": optionsInputDepart }} onSelect={selectInputDepart} value={valueInputDepart} onChange={(value) => setValueInputDepart(value)}/>
                <p className="label">Arrivée ({regionArrivee === null ? "choisir la région" : "choisir le département"}) :</p>
                <TextInput className="textInput" trigger={[""]} options={{ "": optionsInputArrivee }} onSelect={selectInputArrivee} value={valueInputArrivee} onChange={(value) => setValueInputArrivee(value)}/>
                <p className="label">Historique :</p>
                <Historique historique={historique} />
            </div>


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