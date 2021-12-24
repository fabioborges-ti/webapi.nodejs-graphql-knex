const jwt = require('jwt-simple');
const { perfis: ObterPerfis } = require('../Type/Usuario');

module.exports = {
  async gerarTokenUsuario(usuario) {
    const perfis = await ObterPerfis(usuario);
    const agora = Math.floor(Date.now() / 1000);
    const usuarioInfo = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      perfis: perfis.map(p => p.nome),
      iat: agora,
      exp: agora + 1 * 24 * 60 * 60,
    };

    const authSecret = process.env.APP_AUTH_SECRET;

    return {
      ...usuarioInfo,
      token: jwt.encode(usuarioInfo, authSecret),
    };
  },
};
