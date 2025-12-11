import {Routes, Route, Link } from 'react-router-dom';
import Home from './pages/home/Home.jsx';
import Medicos from './pages/medicos/Medicos.jsx';
import Pacientes from './pages/pacientes/Pacientes.jsx';
import Planos from './pages/planos/Planos.jsx';
import Consultas from './pages/consultas/Consultas.jsx';
import './App.css';

function App() {

  return (
      <div className="app-root">
        <header className="app-header" >
          <div className="app-header-inner">
            <span className='app-logo'>Fala Doutor</span>
            <nav className='app-nav'>
              <Link to="/" className='app-nav-link'>Home</Link>
              <Link to="/medicos" className='app-nav-link'>Médicos</Link>
              <Link to="/pacientes" className='app-nav-link'>Pacientes</Link>
              <Link to="/planos-saude" className='app-nav-link'>Planos de Saúde</Link>
              <Link to="/consultas" className='app-nav-link'>Consultas</Link>
            </nav>
          </div>
        </header>

        <main className='app-main'>
          <div className='page-container'>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/medicos' element={<Medicos />} />
              <Route path='/pacientes' element={<Pacientes />} />
              <Route path='/planos-saude' element={<Planos />} />
              <Route path='/consultas' element={<Consultas />} />
            </Routes>
          </div>
        </main>
      </div>
  );
}

export default App
 