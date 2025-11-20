import { Link } from 'react-router-dom';
import './Home.css';

function Home() {

    return (
        <div className="home-container">
            <h1 className='page-title'>Bem-vindo ao Fala Doutor!</h1>
            <p className='page-subtitle'>Escolha uma opção para começar a gerenciar cadastros.</p>


            <div className='home-cards'>
                <Link to="/medicos" className='home-card'>
                <h3>Gerenciar Médicos</h3>
                <p className='home-font-card'>Cadastre, edite e exclua médicos.</p>
                </Link>

                <Link to="/pacientes" className='home-card'>
                <h3>Gerenciar Pacientes</h3>
                <p>Cadastre, edite e exclua pacientes.</p>
                </Link>
                <Link to="/planos-saude" className='home-card'>
                <h3>Gerenciar Planos de Saúde</h3>
                <p>Cadastre, edite e exclua planos.</p>
                </Link>
            </div>
            {/* <div className='home-cards'>
                <Link to="/medicos" className='home-card'>
                <h3>Próximos Cadastros</h3>
                <p className='home-font-card'>Cadastre, edite e exclua médicos.</p>
                </Link>

                <Link to="/pacientes" className='home-card'>
                <h3>Próximos Cadastros</h3>
                <p>Cadastre, edite e exclua pacientes.</p>
                </Link>
                <Link to="/pacientes" className='home-card'>
                <h3>Próximos Cadastros</h3>
                <p>Cadastre, edite e exclua planos.</p>
                </Link>
            </div> */}
            
        </div>
    )

}

export default Home;