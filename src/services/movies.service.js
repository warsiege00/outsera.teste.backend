const fs = require('fs');
const csv = require('csv-parser');
const db = require('../db')

function createMoviesTable() {
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

async function insertMoviesFromCSV() {
  const movies = await readMoviesFromCSV('movielist.csv');
  await insertMovies(movies);
}

function readMoviesFromCSV(csvPath) {
  return new Promise((resolve, reject) => {
    const movies = [];
    fs.createReadStream(csvPath)
      .pipe(csv({ separator: ';' }))
      .on('data', (row) => {
        movies.push(row);
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

function insertMovies(movies) {
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

function getWinningMovies() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM movies WHERE TRIM(LOWER(winner)) = "yes"', (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

module.exports = {
  createMoviesTable,
  insertMoviesFromCSV,
  readMoviesFromCSV,
  insertMovies,
  getWinningMovies
};
