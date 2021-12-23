const db = require('../../config/db');
const { perfil: obterPerfil } = require('../Query/perfil');

module.exports = {
  async novoPerfil(_, { dados }) {
    try {
      const [id] = await db('perfis').returning('id').insert(dados);
      return await obterPerfil(_, { filtro: { id } });
    } catch (err) {
      throw new Error(err.detail);
    }
  },
  async alterarPerfil(_, { filtro, dados }) {
    try {
      const perfil = await obterPerfil(_, { filtro });
      if (!perfil) return null;

      const { id } = perfil;
      await db('perfis').where({ id }).update(dados);

      return { ...perfil, ...dados };
    } catch (err) {
      console.error(err);
    }
  },
  async excluirPerfil(_, { filtro }) {
    try {
      const perfil = await obterPerfil(_, { filtro });
      if (!perfil) return null;

      const { id } = perfil;
      await db('usuarios_perfis').where({ perfil_id: id }).delete();
      await db('perfis').where({ id }).delete();

      return perfil;
    } catch (err) {
      console.error(err);
    }
  },
};
