const User = require('../models/user');

const checkAuth = async (req, res, next) => {
  const userId = req.session?.user?.id;

  if (userId) {
    const user = await User.findById(userId);
    if (user) {
      return next();
    }
    return res.status(402).render('error', { message: 'Пройдите авторизацию!' });
  }
  return res.status(401).render('error', { message: 'Пройдите авторизацию!' });
};

const checkAdmin = async (req, res, next) => {
  const userAdm = req.session?.user?.admin;
  if (userAdm) {
    return next()
  }
  return res.redirect('/entries');
};

module.exports = {
  checkAuth,
  checkAdmin,
};
