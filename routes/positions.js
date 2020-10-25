const express = require('express');
const router = express.Router();

const Positions = require('../models/positions');
const Applications = require('../models/applications');

router.use(checkSessionUser);

// Get courses
router.get('/list', (req, res, next) => {
    if (req.session.user.role == 'manager') {
        Positions.find({
            author: req.session.user.username,
            status: 'open',
        }, (err, positions) => {
            if (positions.length > 0) {
                console.log("positions: " + positions);
                res.render('position/listpositions', { title: 'Created Positions', positions: positions, viewFor: 'mgr' });
            } else {
                console.log('No positions found');
                res.render('position/createposition', { title: 'Start Creating Positions', toList: false, managerId: req.session.user.username });
            }
        });
    } else {
        Positions.find({
            status: 'open',
        }, (err, positions) => {
            res.render('position/listpositions', { title: 'Available Positions', positions: positions, viewFor: 'emp' });
        });
    }
});

router.get('/create', function (req, res, next) {
    Positions.find({
        author: req.session.user.username,
        status: 'open',
    }, (err, positions) => {
        if (positions.length > 0) {
            res.render('position/createposition', { title: 'Start Creating Positions', toList: true, managerId: req.session.user.username });
        } else {
            res.render('position/createposition', { title: 'Start Creating Positions', toList: false, managerId: req.session.user.username });
        }
    });
});

router.post('/create', function (req, res, next) {
    const position = new Positions(req.body);

    position.save((err, savedPosition) => {
        if (err) {
            console.log('Error while creating a position: ', err);
            res.render('position/createposition', { title: 'Start Creating Positions', toList: false, success: false, managerId: req.session.user.username });
        }
        res.render('position/createposition', { title: 'Start Creating Positions', toList: true, success: true, managerId: req.session.user.username });
    });
});

router.get('/view/:id', function (req, res, next) {
    var viewer = req.session.user.role == 'manager' ? 'mgr' : 'emp';
    Positions.findOne({
        code: req.params.id
    }, (error, position) => {
        if (position) {
            Applications.findOne({
                employee: req.session.user.username
            }, (err, application) => {
                if (application) {
                    res.render('position/positiondetails', { title: 'Opening', position: position, applied: true, viewFor: viewer });
                } else {
                    res.render('position/positiondetails', { title: 'Opening', position: position, applied: false, viewFor: viewer });
                }
            });
        } else {
            res.redirect('/positions/list');
        }
    });
});

router.post('/update', function (req, res, next) {
    Positions.findOne({
        code: req.body.code,
    }, (error, position) => {
        if (position) {
            position.project = req.body.project;
            position.client = req.body.client;
            position.role = req.body.role;
            position.technologies = req.body.technologies;
            position.status = req.body.status;
            position.description = req.body.description;
            position.save();
        }
        res.redirect('/positions/view/' + req.body.code);
    });
});

router.post('/apply/:code', function (req, res, next) {
    Positions.findOne({
        code: req.params.code,
    }, (error, position) => {
        if (position) {
            const application = new Applications({
                position: req.params.code,
                employee: req.session.user.username
            });
            application.save();
        }
        res.redirect('/positions/view/' + req.params.code);
    });
});

// Middleware
function checkSessionUser(req, res, next) {
    if (!req.session.user) {
        res.redirect('/auth/login');
    } else {
        next();
    }
}

module.exports = router;
