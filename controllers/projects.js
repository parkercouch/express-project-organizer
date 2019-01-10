var express = require('express');
var db = require('../models');
var router = express.Router();
var async = require('async');

// POST /projects - create a new project
router.post('/', function(req, res) {

  // Create array of tags, and filter empty tags
  const categories = req.body.categories
                      .split(',')
                      .map(c => c.trim())
                      .filter(c => !!c)


  db.project.create({
    name: req.body.name,
    githubLink: req.body.githubLink,
    deployedLink: req.body.deployedLink,
    description: req.body.description
  })
  .then(function(project) {

    async.forEach(categories, function(c, done){
      db.category.findOrCreate({
        where: { name: c },
      })
      .spread(function(newCategory, wasCreated){
        project.addCategory(newCategory)
        .then(function(){
          done();
        })
        .catch(done);
      })
      .catch(done);

    }, function(){
      res.redirect('/projects/' + project.id);
      // res.redirect('/');
    });
  })
  .catch(function(error) {
    res.status(400).render('main/404');
  });
});

// GET /projects/new - display form for creating a new project
router.get('/new', function(req, res) {
  res.render('projects/new');
});

// GET /projects/:id - display a specific project
router.get('/:id', function(req, res) {
  db.project.find({
    where: { id: req.params.id },
    include: [ db.category ],
  })
  .then(function(project) {
    if (!project) throw Error();
    res.render('projects/show', { project: project });
  })
  .catch(function(error) {
    res.status(400).render('main/404');
  });
});

module.exports = router;
