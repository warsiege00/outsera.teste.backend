const app = require('./app');
const MovieService = require('./services/MovieService');
const ProducerService = require('./services/ProducerService');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    console.log('Iniciando servidor');
    console.log('Criando tabelas');
    
    await MovieService.initializeDatabase();
    await ProducerService.initializeDatabase();

    console.log('Carregando filmes do CSV...');
    const moviesCount = await MovieService.loadMoviesFromCSV();
    console.log(`${moviesCount} filmes carregados`);

    console.log('Processando intervalos de produtores...');
    const intervalsCount = await ProducerService.processAndSaveProducerIntervals();
    console.log(`${intervalsCount} intervalos processados`);
    
    return app.listen(PORT, () => {
      console.log('API disponível em http://localhost:' + PORT);
    });
  } catch (err) {
    console.error('[ERRO] Erro ao iniciar o servidor:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
