const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) return res.status(500).json({ error: err });
        else {
            const user = new User({
                _id: mongoose.Types.ObjectId(),
                email: req.body.email,
                password: hash
            });
            user.save().then((result) => { res.status(201).json({ message: 'User Created' }) })
                .catch((err) => { console.log(err); res.status(500).json({ error: err }); });
        }
    });
};

exports.login = (req, res, next) => {
    User.findOne({email: req.body.email}).exec()
    .then(user => {
        if(user.length > 1) return res.status(401).json({message: 'Auth Fail'});
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if(err) return res.status(401).json({message: 'Auth Fail'});
            if(result){
                const token = jwt.sign({email: user.email,userId: user._id }, 'secret', {
                    expiresIn: '1h'
                });
                return res.status(200).json({message: 'Auth Success', token: token});
            }
            res.status(401).json({message: 'Auth Fail'});
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({error: err});
    });
};