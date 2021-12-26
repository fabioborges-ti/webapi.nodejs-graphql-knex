const db = require('./db');
const { gerarTokenUsuario } = require('../resolvers/Auth/token');

const sql = `
   select u.*
     from usuarios u, perfis p, usuarios_perfis up
    where 1 = 1
      and u.id = up.usuario_id
      and up.perfil_id = p.id
      and u.ativo = TRUE
      and p.nome = :nomePerfil
    limit 1
`;

const getUsuario = async nomePerfil => {
  const res = await db.raw(sql, { nomePerfil });
  return res ? res.rows[0] : null;
};

module.exports = async req => {
  const usuario = await getUsuario('comum');
  if (usuario) {
    const { token } = await gerarTokenUsuario(usuario);
    req.headers = {
      authorization: `Bearer ${token}`,
    };
  }
};
