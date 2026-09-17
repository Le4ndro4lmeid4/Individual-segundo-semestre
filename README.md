# Projeto Individual

Aplicação do tema de turismo, desenvolvida para guardar momentos importantes de viagens. O sistema permite registrar destinos, datas, descrições e imagens, formando um acervo pessoal de memórias de viagem.

O projeto utiliza React no front-end e Java/Spring Boot/JdbcTemplate no back-end.

## Estrutura

- `frontend`: cliente React com Vite.
- `backend`: API REST com Spring Boot e MySQL.

## Pré-requisitos

- Node.js e npm.
- Java 21 (JDK).
- MySQL em execução.
- Git.

## Banco de dados

Execute uma vez o script [backend/src/main/resources/schema.sql](backend/src/main/resources/schema.sql) no MySQL. O arquivo está dentro de `backend/src/main/resources`, mas o comando do cliente MySQL pode ser executado a partir da raiz do repositório:

```powershell
Set-Location "C:\caminho\para\Individual-segundo-semestre"
mysql -u seu_usuario_mysql -p < backend/src/main/resources/schema.sql
```

O script cria o banco `projetoindividual` e a tabela `viagem`.

## Configuração do back-end

Abra um terminal na raiz do repositório e entre no diretório `backend` antes de copiar o arquivo:

```powershell
Set-Location "C:\caminho\para\Individual-segundo-semestre\backend"
Copy-Item .env.example .env
```

Depois, edite `backend/.env` e informe as credenciais locais do MySQL:

```env
DB_URL=jdbc:mysql://localhost:3306/nome_do_banco
DB_USERNAME=seu_usuario_mysql
DB_PASSWORD=sua_senha_mysql
```

O arquivo `.env` não deve ser versionado.

## Execução

Abra o **Terminal 1** na raiz do repositório e execute os comandos abaixo. O primeiro comando entra em `backend`; o segundo inicia a API nesse diretório:

```powershell
Set-Location "C:\caminho\para\Individual-segundo-semestre\backend"
./mvnw.cmd spring-boot:run
```

Abra um **Terminal 2** separado na raiz do repositório. O front-end possui o `package.json` dentro de `frontend`, portanto os comandos npm devem ser executados nesse diretório:

```powershell
Set-Location "C:\caminho\para\Individual-segundo-semestre\frontend"
npm install
npm run dev
```

A aplicação ficará disponível em `http://localhost:5173` e a API em `http://localhost:8080`.

## Integração

O front-end consome a API pelo endereço `http://localhost:8080/viagens`.

O cadastro utiliza `multipart/form-data`, pois envia os dados da viagem e a imagem no mesmo formulário. A listagem utiliza `GET` e as alterações utilizam `PATCH` e `DELETE`.

O CORS está configurado para permitir o cliente executado em `http://localhost:5173`.

## Funcionalidades do front-end

- Cadastro de viagem com destino, datas, descrição e imagem.
- Consulta das viagens persistidas pela API.
- Paginação com até seis viagens por página.
- Edição dos dados e da imagem.
- Exclusão de viagens.
- Toasts para carregamento, sucesso e erro.

## Comandos do front-end

Os comandos npm devem ser executados dentro do diretório `frontend`, onde está o arquivo `package.json`.

Se o terminal estiver na raiz do repositório:

```powershell
Set-Location "C:\caminho\para\Individual-segundo-semestre\frontend"
npm install
npm run dev
```

Acesse `http://localhost:5173`.

Para validar o projeto front-end, ainda dentro de `frontend`, execute:

```powershell
npm run build
npm run lint
```

## Contrato da API

URL base:

```text
http://localhost:8080
```

### Listar viagens

```http
GET http://localhost:8080/viagens
```

Retorna as viagens persistidas.

Resposta: `200 OK`.

Exemplo:

```bash
curl http://localhost:8080/viagens
```

```json
[
	{
		"id": 1,
		"destino": "Paris",
		"dataInicio": "2026-06-10",
		"dataFim": "2026-06-20",
		"descricao": "Viagem especial",
		"imagem": "base64-da-imagem",
		"tipoImagem": "image/png"
	}
]
```

### Cadastrar viagem

```http
POST http://localhost:8080/viagens
Content-Type: multipart/form-data
```

Campos esperados:

| Campo | Obrigatório | Regra |
| --- | --- | --- |
| `destino` | Sim | De 1 a 30 caracteres |
| `dataInicio` | Sim | Formato `yyyy-MM-dd` |
| `dataFim` | Não | Formato `yyyy-MM-dd`; não pode ser anterior à inicial |
| `descricao` | Não | Até 30 caracteres |
| `imagem` | Sim | JPEG, PNG ou WebP |

Exemplo:

```bash
curl -X POST http://localhost:8080/viagens \
	-F "destino=Paris" \
	-F "dataInicio=2026-06-10" \
	-F "dataFim=2026-06-20" \
	-F "descricao=Viagem especial" \
	-F "imagem=@/caminho/foto.png"
```

Resposta: `201 Created`.

```text
Viagem cadastrada com sucesso!
```

### Editar viagem

```http
PATCH http://localhost:8080/viagens/{id}
Content-Type: multipart/form-data
```

`{id}` é o identificador numérico da viagem. Os campos são opcionais.

Exemplo:

```bash
curl -X PATCH http://localhost:8080/viagens/1 \
	-F "destino=Lisboa" \
	-F "descricao=Memória especial" \
	-F "imagem=@/caminho/foto.webp"
```

Respostas:

- `200 OK`: viagem atualizada.
- `400 Bad Request`: dados inválidos.
- `404 Not Found`: viagem inexistente.

### Excluir viagem

```http
DELETE http://localhost:8080/viagens/{id}
```

Exemplo:

```bash
curl -X DELETE http://localhost:8080/viagens/1
```

Respostas:

- `204 No Content`: viagem removida sem corpo de resposta.
- `404 Not Found`: viagem inexistente.

### Buscar imagem

```http
GET http://localhost:8080/viagens/{id}/imagem
```

Retorna o conteúdo binário da imagem com `Content-Type` `image/jpeg`, `image/png` ou `image/webp`.

Exemplo:

```bash
curl http://localhost:8080/viagens/1/imagem --output viagem.png
```

Respostas:

- `200 OK`: imagem encontrada.
- `404 Not Found`: viagem ou imagem inexistente.

## Regras de negócio da API

- O destino deve possuir entre 1 e 30 caracteres.
- A descrição pode possuir no máximo 30 caracteres.
- A data final não pode ser anterior à data inicial.
- São aceitos somente arquivos JPEG, PNG e WebP.
- Dados inválidos não são persistidos.

## CORS

A API permite requisições do front-end executado em:

```text
http://localhost:5173
```

Métodos permitidos:

```text
GET, POST, PATCH, PUT, DELETE, OPTIONS
```

Também são aceitos os cabeçalhos enviados pelo cliente.