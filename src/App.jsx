import { useEffect, useState } from 'react';

function App() {
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/hello')
      .then((r) => r.json())
      .then((data) => setMsg(data.message))
      .catch(console.error);
  }, []);

  return (
    <div style={{padding:20}}>
      <h1>Frontend React + Vite</h1>
      <p>Mensagem do backend: {msg || 'carregando...'}</p>
    </div>
  );
}

export default App;
