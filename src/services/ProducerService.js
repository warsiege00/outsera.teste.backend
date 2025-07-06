const splitProducers = require('../utils/splitProducers');
const ProducerIntervalRepository = require('../repositories/ProducerIntervalRepository');
const MovieService = require('./MovieService');
const ProducerInterval = require('../models/ProducerInterval');

class ProducerService {
  async initializeDatabase() {
    await ProducerIntervalRepository.createTable();
  }

  async processAndSaveProducerIntervals() {
    const winningMovies = await MovieService.getWinningMovies();
    console.log(`Filmes vencedores encontrados: ${winningMovies.length}`);
    
    const producerToWinningYears = this.mapProducersToWinningYears(winningMovies);
    const intervals = this.calculateProducerIntervals(producerToWinningYears);
    
    await ProducerIntervalRepository.clear();
    await ProducerIntervalRepository.insertMany(intervals);
    
    return intervals.length;
  }

  async getProducerIntervals() {
    return await ProducerIntervalRepository.findAll();
  }

  async getProducerAwardIntervals() {
    const intervals = await this.getProducerIntervals();
    
    if (!intervals.length) {
      console.log('[LOG]: Retorno vazio');
      return { min: [], max: [] };
    }

    const minVal = Math.min(...intervals.map(i => i.interval));
    const maxVal = Math.max(...intervals.map(i => i.interval));
    
    const min = intervals.filter(i => i.interval === minVal);
    const max = intervals.filter(i => i.interval === maxVal);
    
    return { min, max };
  }

  mapProducersToWinningYears(winningMovies) {
    const producerToWinningYears = {};
    
    for (const movie of winningMovies) {
      const winningYear = parseInt(movie.year, 10);
      if (!movie.producers) continue;
      
      const producersList = splitProducers(movie.producers);
      for (const producerName of producersList) {
        if (!producerToWinningYears[producerName]) {
          producerToWinningYears[producerName] = [];
        }
        producerToWinningYears[producerName].push(winningYear);
      }
    }
    
    return producerToWinningYears;
  }

  calculateProducerIntervals(producerToWinningYears) {
    const intervals = [];
    
    for (const producer in producerToWinningYears) {
      const sortedWinningYears = producerToWinningYears[producer].sort((a, b) => a - b);
      
      for (let i = 1; i < sortedWinningYears.length; i++) {
        const previousWin = sortedWinningYears[i - 1];
        const followingWin = sortedWinningYears[i];
        const interval = ProducerInterval.create(producer, previousWin, followingWin);
        intervals.push(interval);
      }
    }
    
    return intervals;
  }
}

module.exports = new ProducerService(); 