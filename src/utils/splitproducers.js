function splitProducers(producersStr) {
    return producersStr
      .split(/,| and /i)
      .map(p => p.trim())
      .filter(Boolean);
  }
  
  module.exports = splitProducers;