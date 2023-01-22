import './App.css';
import Home from './pages/Home';
import { useLoadScript } from '@react-google-maps/api';

function App() {
  
  const { isLoaded } = useLoadScript({
    googleMapsApiKey:"AIzaSyCjzCI3yJUBRRNwH822WmWNcOzFeFf-qvk"
  });
  if (!isLoaded) return <div>...</div>
  return (
    <div className="App">
      <Home/>
      
    </div>
  );
}

export default App;