const fs = require('fs');
const csv = require('csv-parser');
const MovieRepository = require('../repositories/MovieRepository');
const Movie = require('../models/Movie');

class MovieService {
  async initializeDatabase() {
    await MovieRepository.createTable();
  }

  async loadMoviesFromCSV(csvPath = 'movielist.csv') {
    const movies = await this.readMoviesFromCSV(csvPath);
    await MovieRepository.insertMany(movies);
    return movies.length;
  }

  readMoviesFromCSV(csvPath) {
    return new Promise((resolve, reject) => {
      const movies = [];
      fs.createReadStream(csvPath)
        .pipe(csv({ separator: ';' }))
        .on('data', (row) => {
          const movie = Movie.fromCSVRow(row);
          movies.push(movie);
        })
        .on('end', () => {
          resolve(movies);
        })
        .on('error', (err) => {
          console.error('[ERRO] Falha ao ler o CSV:', err);
          reject(err);
        });
    });
  }

  async getWinningMovies() {
    return await MovieRepository.findWinningMovies();
  }

  async getAllMovies() {
    return await MovieRepository.findAll();
  }
}

module.exports = new MovieService(); 