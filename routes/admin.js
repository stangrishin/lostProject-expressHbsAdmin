const express = require('express');
const Item = require('../models/item');
const User = require('../models/user');

const bcrypt = require('bcrypt');

const { checkAdmin } = require('../middleweare/auth');

const router = express.Router();
router.get('/', (req, res, next) => {
  res.render('signinAdmin');
});

router.post('/signin', async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email);
  try {
    if (email && password) {
      const currentUser = await User.findOne({ email });
      if (currentUser) {
        if (await bcrypt.compare(password, currentUser.password)) {
          console.log('Success login');
          req.session.user = {
            email: currentUser.email,
            id: currentUser._id,
            phone: currentUser.phone,
            nameLombard: currentUser.nameLombard,
            adressLombard: currentUser.adressLombard,
            managerName: currentUser.managerName,
            admin: currentUser.admin,
            authorised: currentUser.authorised,
          },
            res.redirect(`/admin/main`);
        } else { res.render('error', { message: 'Неверный логин или пароль! Повторите ввод!' }); }
      } else { res.render('error', { message: 'Неверный логин или пароль! Повторите ввод!' }); }
    } else { res.render('error', { message: 'Заполните все поля' }); }
  } catch (error) {
    res.render('error', { error });
  }
});

router.get('/main', checkAdmin, async (req, res, next) => {
  let allUsersForAdminAuth = await User.find({ admin: false, authorised: true });
  let allUsersForAdminNonAuth = await User.find({ admin: false, authorised: false });

  res.render('mainAdmin', { allUsersForAdminAuth, allUsersForAdminNonAuth });
});

router.get("/organisation/:id", checkAdmin, async (req, res) => {
  let id = req.params.id
  console.log(id);
  let itemsOfUser = await Item.find({ authorID: id })
  res.render("itemsOfuserForAdmin", { itemsOfUser })
})
router.post("/deleteUser/:id", async (req, res) => {
  let id = req.params.id
  Item.deleteMany({ authorID: id })
  await User.deleteOne({ _id: id })
  res.redirect("/")
})
router.post("/activate/:id", async (req, res) => {
  let id = req.params.id
  let userForUpgrade = await User.findOne({ _id: id })
  userForUpgrade.authorised = true
  await userForUpgrade.save()
  res.redirect("/")
})
router.post("/deactivate/:id", async (req, res) => {
  let id = req.params.id
  let userForUpgrade = await User.findOne({ _id: id })
  userForUpgrade.authorised = false
  await userForUpgrade.save()
  res.redirect("/")
})

module.exports = router;
