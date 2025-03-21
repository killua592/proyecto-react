
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import CreateIndicador from './CreateIndicador';
import Indicador from './Indicador';
import UpdateIndicador from './UpdateIndicador';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Indicador/>}></Route>
          <Route path='/create' element={<CreateIndicador/>}></Route>
          <Route path='/update/:id' element={<UpdateIndicador/>}></Route>
        </Routes>
      </BrowserRouter>  
    </div>
  );
}

export default App;
