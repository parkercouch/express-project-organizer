var express = require('express');
var db = require('../models');
var router = express.Router();

// GET /categories - Show list of all categories
router.get('/', function(req, res){
  db.category.findAll({
    attributes: [
      'id',
      'name',
    ],
  })
  .then(function(categories){
    res.render('categories/index', { categories: categories });
  })
  .catch(function(error) {
    res.status(400).render('main/404');
  });
});

// GET /categories/:id - Show details of one category
router.get('/:id', function(req, res){
  db.category.findOne({
    where: {
      id: req.params.id,
    },
    include: [ db.project ],
  })
  .then(function(category){
    res.render('categories/show', { category: category });
  })
  .catch(function(error) {
    res.status(400).render('main/404');
  });
});

module.exports = router;
