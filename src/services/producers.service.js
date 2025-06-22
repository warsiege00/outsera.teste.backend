const splitProducers = require('../utils/splitProducers');
const db = require('../db')
const moviesService = require('./movies.service');
  
function createProducerIntervalsTable() {
  return new Promise((resolve, reject) => {
    db.run(
      `CREATE TABLE producer_intervals (
        producer TEXT,
        interval INTEGER,
        previousWin INTEGER,
        followingWin INTEGER
      )`,
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

async function processAndInsertProducerIntervals() {
  const winningMovies = await moviesService.getWinningMovies();
  console.log(`Filmes vencedores encontrados: ${winningMovies.length}`);
  
  const producerToWinningYears = mapProducersToWinningYears(winningMovies);
  // console.log(producerToWinningYears);

  const intervals = calculateProducerIntervals(producerToWinningYears);
  await saveProducerIntervals(intervals);
}

function getProducerIntervals() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM producer_intervals', (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

//res: producer': [ano1, ano2, etc..]
function mapProducersToWinningYears(winningMovies) {
  // console.log(winningMovies)
  const producerToWinningYears = {};
  for (const movie of winningMovies) {
    const winningYear = parseInt(movie.year, 10);
    if (!movie.producers) continue;
    const producersList = splitProducers(movie.producers);
    for (const producerName of producersList) {
      if (!producerToWinningYears[producerName]) producerToWinningYears[producerName] = [];
      producerToWinningYears[producerName].push(winningYear);
    }
  }
  return producerToWinningYears;
}

function calculateProducerIntervals(producerToWinningYears) {
  const intervals = [];
  for (const producer in producerToWinningYears) {
    const sortedWinningYears = producerToWinningYears[producer].sort((a, b) => a - b);
    // console.log(sortedWinningYears);
    for (let i = 1; i < sortedWinningYears.length; i++) {
      // console.log(`sortedWinningItem: ${sortedWinningYears[i]}`)
      // console.log(`i: ${i}`)
      const interval = sortedWinningYears[i] - sortedWinningYears[i - 1];
      const previousWin = sortedWinningYears[i - 1];
      const followingWin = sortedWinningYears[i];
      intervals.push({ producer, interval, previousWin, followingWin });
      // console.log(`interval: ${interval}`)
      // console.log(`prev: ${previousWin}`)
      // console.log(`fw: ${followingWin}`)
      // console.log('--')
    }
  }
  return intervals;
}

function saveProducerIntervals(intervals) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare('INSERT INTO producer_intervals (producer, interval, previousWin, followingWin) VALUES (?, ?, ?, ?)');
    let pending = intervals.length;
    if (pending === 0) {
      stmt.finalize();
      return resolve();
    }
    let errored = false;
    for (const item of intervals) {
      stmt.run(item.producer, item.interval, item.previousWin, item.followingWin, function(err) {
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

module.exports = {
  createProducerIntervalsTable,
  processAndInsertProducerIntervals,
  getProducerIntervals,
  mapProducersToWinningYears,
  calculateProducerIntervals,
  saveProducerIntervals
};
