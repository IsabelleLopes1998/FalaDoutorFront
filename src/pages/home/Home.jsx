import { Link } from 'react-router-dom';
import './Home.css';

function Home() {

    return (
        <div className="home-container">
            <h2>Bem-vindo ao Fala Doutor!</h2>
            <p>Escolha uma opção para começar:</p>

            <div className="home-cards">
                <Link to="/medicos" className="home-card">
                    <h3>Médicos</h3>
                    <p>Gerenciar cadastro de médicos.</p>
                </Link>


                <Link to="/pacientes" className="home-card">
                    <h3>Pacientes</h3>
                    <p>Gerenciar cadastro de pacientes.</p>
                </Link>
            </div>
        </div>
    )

}

export default Home;