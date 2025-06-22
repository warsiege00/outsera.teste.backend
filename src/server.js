const express = require('express');
const movieService = require('./services/movies.service');
const producersService = require('./services/producers.service');
const debugService = require('./services/debug.service');

const PORT = process.env.PORT || 3000;
const app = express();



app.use(express.json());
app.get('/producers/awards/intervals', async (req, res) => {
  try {
    const rows = await producersService.getProducerIntervals();
    if (!rows.length) {
      console.log('[LOG]: Retorno vazio');
      return res.json({ min: [], max: [] });
    }
    const minVal = Math.min(...rows.map(i => i.interval));
    const maxVal = Math.max(...rows.map(i => i.interval));
    const min = rows.filter(i => i.interval === minVal);
    const max = rows.filter(i => i.interval === maxVal);
    res.json({ min, max });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Apenas para teste
// app.get('/debug/:table', async (req, res) => {
//   try {
//     const rows = await debugService.getTable(req.params.table);
//     res.json(rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

async function startServer() {
  try {
    console.log('Iniciando servidor');
    console.log('Criando tabelas');
    await movieService.createMoviesTable();
    await producersService.createProducerIntervalsTable();

   
    await movieService.insertMoviesFromCSV();
    await producersService.processAndInsertProducerIntervals();
    
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
