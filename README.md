# Backend - Movie Awards API - Categoria Pior Filme do Golden Raspberry Awards

Este projeto é uma API Node.js que processa uma lista de filmes, identifica os produtores com múltiplas vitórias e calcula os intervalos entre suas premiações.

## Tecnologias Utilizadas

- **Node.js**
- **Express**
- **SQLite3** 
- **csv-parser** 
- **Jest** e **Supertest** 

## Instalação

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/warsiege00/outsera.teste.backend
   cd outsera.teste.backend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Coloque o arquivo `movielist.csv` na raiz do projeto** (já incluso).

## Como rodar

```bash
npm start
```

A API estará disponível em: [http://localhost:3000](http://localhost:3000)

## Endpoints

### `GET /producers/awards/intervals`

Retorna os produtores com o menor e maior intervalo entre vitórias.

**Exemplo de resposta:**
```json
{
  "min": [
    {
      "producer": "Producer Name",
      "interval": 1,
      "previousWin": 2000,
      "followingWin": 2001
    }
  ],
  "max": [
    {
      "producer": "Another Producer",
      "interval": 10,
      "previousWin": 1990,
      "followingWin": 2000
    }
  ]
}
```
## Estrutura do Projeto

```
src/
  services/
    movies.service.js         # Lógica de filmes e leitura do CSV
    producers.service.js      # Lógica de produtores e intervalos
    debug.service.js          # Utilitário para debug de tabelas
  utils/
    splitproducers.js         # Função utilitária para separar produtores
  db.js                       # Instância do banco SQLite
  server.js                   # Inicialização do servidor e rotas principais
movielist.csv                 # Base de dados de filmes (CSV)
```

## Fluxo de Processamento

1. **Criação das tabelas** no banco em memória.
2. **Leitura do CSV** e inserção dos filmes.
3. **Processamento dos produtores vencedores** e cálculo dos intervalos.
4. **Disponibilização dos dados** via endpoints REST.

## Testes

Para rodar os testes :

```bash
npm test
```
