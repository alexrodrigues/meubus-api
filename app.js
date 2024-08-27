require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
const category  = require('./routes/category');
const program  = require('./routes/program');
const home    = require('./routes/home');
const detail = require('./routes/detail');
const vod    = require('./routes/vod');
var boom = require('express-boom');
var path = require('path');
const API_KEY = process.env.PRIORITY_API_KEY;

var app = express();
app.use(bodyParser.json());
app.use(boom());

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Example app listening on port %s', port);
});
app.use(function(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'No credentials sent!' });
  }
  if (req.headers.authorization != API_KEY) {
    return res.status(401).json({ error: 'No credentials sent!' });
  }
  next();
});

app.get('/Home', function(req, res) {
  home.createHome((home, errorMessage) => {
    if (errorMessage) {
      res.boom.badRequest(errorMessage, {}); 
    } else {
      res.status(200);
      res.send(home);
    }
  });
});

app.get('/Detail', function(req, res) {

  var programId = req.query.programId;
  if (!programId) { 
    res.boom.badRequest("program identifier is required", {}); 
    return;
  }
  detail.fetchDetails(programId, (programDetail, errorMessage) => {
    if (errorMessage) {
      res.boom.badRequest(errorMessage, {}); 
    } else {
      res.status(200);
      res.send(programDetail);
    }
  });
});


app.get('/Category', function(req, res) {
  category.fetchCategories((categories, errorMessage) => {
    if (errorMessage) {
      res.boom.badRequest(errorMessage, {}); 
    } else {
      res.status(200);
      res.send(categories);
    }
  });
});
  
app.post('/Category', function(req, res) {
  if (req.body.name) {
    const newCategory = {name: req.body.name};

        category.saveCategory (newCategory, (response, errorMessage) => {
        if (errorMessage) {
          res.boom.badRequest(errorMessage, {}); 
        }

        res.status(200);
        res.send(response);
    })
  } else {
    res.boom.badRequest("Bad Request", {}); 
  }
});

app.get('/Program', function(req, res) {
  program.fetchPrograms((programs, errorMessage) => {
    if (errorMessage) {
      res.boom.badRequest(errorMessage, {}); 
    } else {
      res.status(200);
      res.send(programs);
    }
  });
});

app.post('/Program', function(req, res) {
  if (req.body.title && req.body.mediaUrl && req.body.idCategory) {

    const newProgram = {title: req.body.title,
                        mediaUrl: req.body.mediaUrl,
                        description: req.body.description,
                        seloCanal: req.body.seloCanal,
                        logoUrl: req.body.logoUrl,
                        type: req.body.type,
                        idCategory: req.body.idCategory};

        program.saveProgram (newProgram, (response, errorMessage) => {
        if (errorMessage) {
          res.boom.badRequest(errorMessage, {}); 
        }

        res.status(200);
        res.send(response);
    })
  } else {
    res.boom.badRequest("Missing parameters", {}); 
  }
});
  
app.get('/Vod', function(req, res) {

  var programId = req.query.programId;
  if (!programId) { 
    res.boom.badRequest("program identifier is required", {}); 
    return;
  }
  vod.fetchVods(programId ,(vods, errorMessage) => {
    if (errorMessage) {
      res.boom.badRequest(errorMessage, {}); 
    } else {
      res.status(200);
      res.send(vods);
    }
  });
});

app.post('/Vod', function(req, res) {
  if (req.body.title && req.body.mediaUrl && req.body.idCategory) {

    const newVod = {title: req.body.title,
                        mediaUrl: req.body.mediaUrl,
                        description: req.body.description,
                        seloCanal: req.body.seloCanal,
                        logoUrl: req.body.logoUrl,
                        idProgram: req.body.idProgram,
                        idCategory: req.body.idCategory};

        vod.saveVod (newVod, (response, errorMessage) => {
        if (errorMessage) {
          res.boom.badRequest(errorMessage, {}); 
        }

        res.status(200);
        res.send(response);
    })
  } else {
    res.boom.badRequest("Missing parameters", {}); 
  }
});