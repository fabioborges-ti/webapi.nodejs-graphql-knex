const bcrypt = require('bcrypt-nodejs');
const db = require('../../config/db');
const { perfil: obterPerfil } = require('../Query/perfil');
const { usuario: obterUsuario } = require('../Query/usuario');

const mutations = {
  async registrarUsuario(_, { dados }) {
    return mutations.novoUsuario(_, {
      dados: {
        nome: dados.nome,
        email: dados.email,
        senha: dados.senha,
      },
    });
  },
  async novoUsuario(_, { dados }, ctx) {
    ctx && ctx.validarAdmin();

    try {
      // verifica de email já está cadastrado na base
      const emailExistente = await obterUsuario(_, {
        filtro: { email: dados.email },
      });

      if (emailExistente) return new Error('Email já cadastrado');

      // verifica se foi enviado payload de registro comum
      if (!dados.perfis || !dados.perfis.length) {
        dados.perfis = [{ nome: 'admin' }];
      }

      // recupera e valida todos os perfis enviados no payload
      const idsPerfis = [];

      for (const filtro of dados.perfis) {
        const perfil = await obterPerfil(_, { filtro });
        if (perfil) {
          idsPerfis.push(perfil.id);
        }
      }

      // gera senha criptografada
      const salt = bcrypt.genSaltSync();
      dados.senha = bcrypt.hashSync(dados.senha, salt);

      // remove atributo perfis do objeto DADOS porque não há coluna perfis na tabela de usuários
      delete dados.perfis;

      // insere usuario e recupera ID
      const [id] = await db('usuarios').returning('id').insert(dados);

      // prepara e grava colecao de perfis do usuario
      for (const idPerfil of idsPerfis) {
        await db('usuarios_perfis').insert({
          perfil_id: idPerfil,
          usuario_id: id,
        });
      }

      // recupera e retorna novo usuario
      return await obterUsuario(_, { filtro: { id } });
    } catch (err) {
      throw new Error(err.detail);
    }
  },
  async alterarUsuario(_, { filtro, dados }, ctx) {
    ctx && ctx.validarUsuarioFiltro(filtro);
    try {
      // verifica se registro de usuário existe
      const usuario = await obterUsuario(_, { filtro });
      if (!usuario) return null;

      // recupera ID do usuario
      const { id } = usuario;

      if (ctx.admin && dados.perfis) {
        // remove as relações de perfis do usuário
        await db('usuarios_perfis').where({ usuario_id: id }).delete();

        // recria as relações de perfis com usuário
        for (const filtro of dados.perfis) {
          const perfil = await obterPerfil(_, { filtro });
          if (perfil) {
            await db('usuarios_perfis').insert({
              perfil_id: perfil.id,
              usuario_id: id,
            });
          }
        }
      }

      // remove propriedade perfis do payload, afinal não há coluna perfis na tabela de usuários
      delete dados.perfis;

      // se atributo senha foi enviado gerar nova criptografia
      if (dados.senha) {
        const salt = bcrypt.genSaltSync();
        dados.senha = bcrypt.hashSync(dados.senha, salt);
      }

      // atualiza tabela de usuários
      await db('usuarios').where({ id }).update(dados);

      // recupera e retorna usuario atualizado
      return await db('usuarios').where({ id }).first();
    } catch (err) {
      throw new Error(err.detail);
    }
  },
  async excluirUsuario(_, { filtro }, ctx) {
    ctx && ctx.validarAdmin();

    try {
      const usuario = await obterUsuario(_, { filtro });
      if (usuario) {
        const { id } = usuario;
        await db('usuarios_perfis').where({ usuario_id: id }).delete();
        await db('usuarios').where({ id }).delete();
      }
      return usuario;
    } catch (err) {
      throw new Error(err.detail);
    }
  },
};

module.exports = mutations;
