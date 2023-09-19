module.exports = (err, res) => {
  if (err) {
    console.log('error', err);
    return;
  }
  console.log('result:', res);
};
