class ProducerInterval {
  constructor(producer, interval, previousWin, followingWin) {
    this.producer = producer;
    this.interval = interval;
    this.previousWin = previousWin;
    this.followingWin = followingWin;
  }

  static create(producer, previousWin, followingWin) {
    const interval = followingWin - previousWin;
    return new ProducerInterval(producer, interval, previousWin, followingWin);
  }
}

module.exports = ProducerInterval; 