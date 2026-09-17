async function mensagemDoErro(response, mensagemPadrao) {
  const mensagem = await response.text();
  return mensagem.trim() || mensagemPadrao;
}

async function listarViagens() {
  try {
    const response = await fetch("http://localhost:8080/viagens", {
      method: "GET"
    });

    if (!response.ok) {
      throw new Error(await mensagemDoErro(response, "Não foi possível carregar as viagens."));
    }

    return response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Não foi possível conectar à API.");
    }
    throw error;
  }
}

async function adicionarViagem(formData) {
  try {
    const response = await fetch("http://localhost:8080/viagens", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(await mensagemDoErro(response, "Não foi possível cadastrar a viagem."));
    }

    return response.status;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Não foi possível conectar à API.");
    }
    throw error;
  }
}

async function editarViagem(id, dados) {
  try {
    const formData = new FormData();
    Object.entries(dados).forEach(([campo, valor]) => {
      if (valor !== undefined && valor !== null) {
        formData.append(campo, valor);
      }
    });

    const response = await fetch(`http://localhost:8080/viagens/${id}`, {
      method: "PATCH",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(await mensagemDoErro(response, "Não foi possível editar a viagem."));
    }

    return true;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Não foi possível conectar à API.");
    }
    throw error;
  }
}

async function removerViagem(id) {
  try {
    const response = await fetch(`http://localhost:8080/viagens/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(await mensagemDoErro(response, "Não foi possível excluir a viagem."));
    }

    return true;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Não foi possível conectar à API.");
    }
    throw error;
  }
}

export { listarViagens, adicionarViagem, editarViagem, removerViagem };