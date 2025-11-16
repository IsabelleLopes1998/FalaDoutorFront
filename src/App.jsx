import {Routes, Route, Link } from 'react-router-dom';
import Home from './pages/home/Home.jsx';
import Medicos from './pages/medicos/Medicos.jsx';
import Pacientes from './pages/pacientes/Pacientes.jsx';
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
            </nav>
          </div>
        </header>

        <main className='app-main'>
          <div className='page-container'>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/medicos' element={<Medicos />} />
              <Route path='/pacientes' element={<Pacientes />} />
            </Routes>
          </div>
        </main>
      </div>
  );
}

export default App
 