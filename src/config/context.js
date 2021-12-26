module.exports = async ({ req }) => {
  // em desenvolvimento
  await require('./usuarioLogado')(req);
  const auth = req.headers.authorization;
  console.log(auth);
};
