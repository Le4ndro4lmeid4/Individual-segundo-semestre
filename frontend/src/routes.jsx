import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Viagens from "./pages/Viagens";
import CadastroViagem from "./pages/CadastroViagem";

function ErrorPage() {
  return (
    <main>
      <h1>Ocorreu um erro</h1>
      <p>Não foi possível carregar esta página.</p>
    </main>
  );
}

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/viagens",
    element: <Viagens />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/cadastro-viagem",
    element: <CadastroViagem />,
    errorElement: <ErrorPage />,
  },
]);

export default routes;
