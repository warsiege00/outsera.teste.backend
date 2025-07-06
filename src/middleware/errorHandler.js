function errorHandler(err, req, res, next) {
  console.error('[ERRO] Erro não tratado:', err);
  
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: 'Algo deu errado'
  });
}

function notFoundHandler(req, res) {
  res.status(404).json({
    error: 'Endpoint não encontrado',
    message: `A rota ${req.method} ${req.path} não existe`
  });
}

module.exports = {
  errorHandler,
  notFoundHandler
}; 