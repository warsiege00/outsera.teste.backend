const db = require('../db');

function getTable(table) {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM ${table}`, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }


module.exports = {
    getTable
};