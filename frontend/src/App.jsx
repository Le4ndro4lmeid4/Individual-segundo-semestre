import styles from "./App.module.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Viagens from "./pages/Viagens";
import CadastroViagem from "./pages/CadastroViagem";

function App() {
  return (
    <BrowserRouter>
      <main className={styles.container}>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/viagens" element={<Viagens />} />

          <Route path="/cadastro-viagem" element={<CadastroViagem />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
