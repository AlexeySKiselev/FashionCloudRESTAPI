/**
 * API Express Route
 * Created by Alexey S. Kiselev on August 2017.
 */

var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.json({
        status: 'works'
    });
});

module.exports = router;
