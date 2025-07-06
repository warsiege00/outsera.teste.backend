class Movie {
  constructor(id, year, title, studios, producers, winner) {
    this.id = id;
    this.year = year;
    this.title = title;
    this.studios = studios;
    this.producers = producers;
    this.winner = winner;
  }

  static fromCSVRow(row) {
    return new Movie(
      null,
      parseInt(row.year, 10),
      row.title,
      row.studios,
      row.producers,
      row.winner
    );
  }

  isWinner() {
    return this.winner && this.winner.trim().toLowerCase() === 'yes';
  }
}

module.exports = Movie; 