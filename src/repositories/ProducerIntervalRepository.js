const db = require('../config/database');
const ProducerInterval = require('../models/ProducerInterval');

class ProducerIntervalRepository {
  async createTable() {
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

  async insert(interval) {
    return new Promise((resolve, reject) => {
      const stmt = db.prepare('INSERT INTO producer_intervals (producer, interval, previousWin, followingWin) VALUES (?, ?, ?, ?)');
      stmt.run(interval.producer, interval.interval, interval.previousWin, interval.followingWin, function(err) {
        if (err) {
          stmt.finalize();
          return reject(err);
        }
        stmt.finalize();
        resolve(interval);
      });
    });
  }

  async insertMany(intervals) {
    return new Promise((resolve, reject) => {
      const stmt = db.prepare('INSERT INTO producer_intervals (producer, interval, previousWin, followingWin) VALUES (?, ?, ?, ?)');
      let pending = intervals.length;
      if (pending === 0) {
        stmt.finalize();
        return resolve();
      }
      let errored = false;
      
      for (const interval of intervals) {
        stmt.run(interval.producer, interval.interval, interval.previousWin, interval.followingWin, function(err) {
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

  async findAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM producer_intervals', (err, rows) => {
        if (err) return reject(err);
        const intervals = rows.map(row => new ProducerInterval(row.producer, row.interval, row.previousWin, row.followingWin));
        resolve(intervals);
      });
    });
  }

  async clear() {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM producer_intervals', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

module.exports = new ProducerIntervalRepository(); 