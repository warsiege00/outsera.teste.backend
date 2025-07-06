const ProducerService = require('../services/ProducerService');

class ProducerController {
  async getProducerAwardIntervals(req, res) {
    try {
      const result = await ProducerService.getProducerAwardIntervals();
      res.json(result);
    } catch (err) {
      console.error('[ERRO] Erro ao buscar intervalos de prêmios:', err);
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new ProducerController(); 