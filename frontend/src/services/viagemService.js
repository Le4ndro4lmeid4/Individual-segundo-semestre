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



export {listarViagens, adicionarViagem};