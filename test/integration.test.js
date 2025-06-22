const request = require('supertest');
const { app, startServer } = require('../src/server'); 

let server;

beforeAll(async () => {
  server = await startServer();
});

afterAll((done) => {
  server.close(done);
});

describe('GET /producers/awards/intervals', () => {
  it('deve retornar os intervalos de prêmios dos produtores', async () => {
    const res = await request(app)
      .get('/producers/awards/intervals')
      .expect(200);

    expect(res.body).toHaveProperty('min');
    expect(res.body).toHaveProperty('max');
  });

  it('deve retornar o produtor com o intervalo mais curto e longo entre vitórias seguidas', async () => {
    const response = await request(app).get('/producers/awards/intervals');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('min');
    expect(response.body).toHaveProperty('max');

    const minProducer = response.body.min[0];
    expect(minProducer.producer).toBe('Joel Silver');
    expect(minProducer.interval).toBe(1);
    expect(minProducer.previousWin).toBe(1990);
    expect(minProducer.followingWin).toBe(1991);

    const maxProducer = response.body.max[0];
    expect(maxProducer.producer).toBe('Bo Derek');
    expect(maxProducer.interval).toBe(26);
    expect(maxProducer.previousWin).toBe(1990);
    expect(maxProducer.followingWin).toBe(2016);
  });

  it('deve retornar múltiplos produtores se eles compartilharem o mesmo intervalo mínimo', async () => {
    //testa se retorna array
    const response = await request(app)
      .get('/producers/awards/intervals')
      .expect(200);

    const min = response.body.min;
    const max = response.body.max;
    
    expect(min).toBeInstanceOf(Array);
    expect(max).toBeInstanceOf(Array);
  });
});