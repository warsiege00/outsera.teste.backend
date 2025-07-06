const db = require('../config/database');
const Movie = require('../models/Movie');

class MovieRepository {
  async createTable() {
    return new Promise((resolve, reject) => {
      db.run(
        `CREATE TABLE movies (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          year INTEGER,
          title TEXT,
          studios TEXT,
          producers TEXT,
          winner TEXT
        )`,
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  async insert(movie) {
    return new Promise((resolve, reject) => {
      const stmt = db.prepare('INSERT INTO movies (year, title, studios, producers, winner) VALUES (?, ?, ?, ?, ?)');
      stmt.run(movie.year, movie.title, movie.studios, movie.producers, movie.winner, function(err) {
        if (err) {
          stmt.finalize();
          return reject(err);
        }
        movie.id = this.lastID;
        stmt.finalize();
        resolve(movie);
      });
    });
  }

  async insertMany(movies) {
    return new Promise((resolve, reject) => {
      const stmt = db.prepare('INSERT INTO movies (year, title, studios, producers, winner) VALUES (?, ?, ?, ?, ?)');
      let pending = movies.length;
      if (pending === 0) {
        stmt.finalize();
        return resolve();
      }
      let errored = false;
      
      for (const movie of movies) {
        stmt.run(movie.year, movie.title, movie.studios, movie.producers, movie.winner, function(err) {
          if (err && !errored) {
            errored = true;
            stmt.finalize();
            return reject(err);
          }
          pending--;
          if (pending === 0 && !errored) {
            stmt.finalize();
            resolve();
          }
        });
      }
    });
  }

  async findWinningMovies() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM movies WHERE TRIM(LOWER(winner)) = "yes"', (err, rows) => {
        if (err) return reject(err);
        const movies = rows.map(row => new Movie(row.id, row.year, row.title, row.studios, row.producers, row.winner));
        resolve(movies);
      });
    });
  }

  async findAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM movies', (err, rows) => {
        if (err) return reject(err);
        const movies = rows.map(row => new Movie(row.id, row.year, row.title, row.studios, row.producers, row.winner));
        resolve(movies);
      });
    });
  }
}

module.exports = new MovieRepository(); 