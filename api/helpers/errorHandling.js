const error500 = (error, res) => {
  res.status(500).json({ error: "Algo saiu errado. Tente novamente." });
  console.log(error);
};

module.exports = { error500 };
