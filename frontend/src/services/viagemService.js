async function listarViagens() {
    try {
    const response = await fetch("http://localhost:8080/viagens", {
      method: "GET"
    });

    return response.json();

  } catch (error) {
    console.log("Failed to connect to the API");
}
}

async function adicionarViagem(formData) {
    try {
    const response = await fetch("http://localhost:8080/viagens", {
      method: "POST",
      body: formData,
    });

    return response.status;

  } catch (error) {
    console.log("Failed to connect to the API");
}
}

async function editarViagem(id, dados) {
  try {
    const formData = new FormData();
    formData.append("destino", dados.destino);
    formData.append("dataInicio", dados.dataInicio);
    formData.append("dataFim", dados.dataFim || "");
    formData.append("descricao", dados.descricao || "");
    if (dados.imagem) {
      formData.append("imagem", dados.imagem);
    }

    const response = await fetch(`http://localhost:8080/viagens/${id}`, {
      method: "PUT",
      body: formData,
    });

    return response.ok;
  } catch (error) {
    console.log("Failed to connect to the API");
    return false;
  }
}

async function removerViagem(id) {
  try {
    const response = await fetch(`http://localhost:8080/viagens/${id}`, {
      method: "DELETE",
    });

    return response.ok;
  } catch (error) {
    console.log("Failed to connect to the API");
    return false;
  }
}

export { listarViagens, adicionarViagem, editarViagem, removerViagem };