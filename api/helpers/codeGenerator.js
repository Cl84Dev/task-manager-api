const codeGenerator = () => {
  const numbers = [];
  for (let i = 0; i < 6; i++) {
    numbers.push(String(Math.floor(Math.random() * 10)));
  }

  return numbers.join("");
};

module.exports = codeGenerator;
