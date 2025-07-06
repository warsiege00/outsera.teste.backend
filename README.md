# Backend - Movie Awards API - Categoria Pior Filme do Golden Raspberry Awards

Este projeto é uma API Node.js que processa uma lista de filmes, identifica os produtores com múltiplas vitórias e calcula os intervalos entre suas premiações.

##Tecnologias

- **Node.js**
- **Express**
- **SQLite3** 
- **csv-parser** 
- **Jest** e **Supertest** 

## Funcionalidades

1. **Carregamento de Dados**: Lê automaticamente o arquivo CSV `movielist.csv`
2. **Processamento de Produtores**: Separa produtores múltiplos (ex: "Joel Silver, Matthew Vaughn")
3. **Cálculo de Intervalos**: Calcula intervalos entre prêmios consecutivos
4. **API REST**: Fornece endpoint para consultar intervalos mínimo e máximo


## Arquitetura

O projeto segue uma arquitetura em camadas:

```
src/
├── config/           # Configurações (banco de dados, etc.)
├── controllers/      # Controladores HTTP
├── middleware/       # Middlewares (tratamento de erros, etc.)
├── models/          # Modelos
├── repositories/    # Camada de acesso a dados
├── routes/          # Definição de rotas
├── services/        # Lógica de negócio
├── utils/           # Utilitários
├── app.js           # Configuração da aplicação Express
└── server.js        # Ponto de entrada do servidor
```

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

## Testes

```bash
npm test
```


