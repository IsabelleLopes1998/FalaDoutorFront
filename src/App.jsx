import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/home/Home.jsx';
import Medicos from './pages/medicos/Medicos.jsx';
import Pacientes from './pages/pacientes/Pacientes.jsx';

function App() {

  return (
    <div className='app'>
      <header>
        <h1>fala Doutor</h1>

        <nav className="app-nav">
          <Link to="/">Home</Link>
          <Link to="/medicos">Médicos</Link>
          <Link to="/pacientes">Pacientes</Link>
        </nav>
      </header>

      <main>  
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/medicos" element={<Medicos />} />
          <Route path="/pacientes" element={<Pacientes />} />
        </Routes>
      </main>
    </div>
  );

}

export default App
