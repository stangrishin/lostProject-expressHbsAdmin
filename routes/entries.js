const express = require('express');
const { checkAuth } = require('../middleweare/auth');

const router = express.Router();
const Item = require('../models/item');
const User = require('../models/user');

router.get('/', async (req, res, next) => {
  if (req.session?.user?.email) {
    return res.redirect(`/users/${req.session.user.id}/main`)
  }
  return res.render('entries/index');
});

router.post('/', async (req, res, next) => {
  let id = req.session.user.id
  const newEntry = new Item({ nameItems: req.body.nameItems, describe: req.body.describe, price: req.body.price, linkPhoto: req.body.linkPhoto, authorID: id });
  await newEntry.save();
  const user = await User.findOne({ _id: req.session.user.id });
  res.redirect(`/users/${id}/main`);
});

router.get('/new', checkAuth, (req, res, next) => {
  res.render('entries/new');
});

router.get('/:id', checkAuth, async (req, res, next) => {
  const item = await Item.findById(req.params.id);
  res.render('entries/show', { item });
});

router.put('/:id', checkAuth, async (req, res, next) => {
  const item = await Item.findById(req.params.id);

  item.nameItems = req.body.nameItems;
  item.describe = req.body.describe;
  item.price = req.body.price
  item.linkPhoto = req.body.linkPhoto
  item.authorID = req.session.user._id
  await item.save();

  res.redirect(`/entries/${item.id}`);
});

router.delete('/:id', checkAuth, async (req, res, next) => {
  await Item.deleteOne({ _id: req.params.id });
  res.redirect(`/users/${req.session.user.id}/main`);
});

router.get('/:id/edit', checkAuth, async (req, res, next) => {
  const item = await Item.findById(req.params.id);
  res.render('entries/edit', { item });
});

router.post('/edit/:id', checkAuth, async (req, res, next) => {
  let { nameItems, describe, price, linkPhoto } = req.body
  let { id } = req.params
  let advitise = await Item.findOne({ _id: id })
  advitise.nameItems = nameItems
  advitise.describe = describe
  advitise.price = price
  advitise.linkPhoto = linkPhoto

  await advitise.save()

  res.redirect(`/users/${req.session.user.id}/main`);
});


module.exports = router;
