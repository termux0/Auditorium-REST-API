var mongoose = require('mongoose'),
    errors = require('restify-errors'),
    User = require('../models/user'),
    ObjectId = mongoose.Types.ObjectId;
    

exports.allUser = function(req, res, next) {
    if(!req.Admin){
        return next(
				new errors.UnauthorizedError("You are not admin")
			);
    }
    User.apiQuery(req.params, function(err, user) {
        if (err){
        return next(
				new errors.InternalServerError("USER ID not found") //500
			); 
      } else {
            if (user) {
                res.json(user);
            } else {
                res.json("User Data not found");
            }
        }
    });
};
exports.listUser = function(req, res, next) {
    if(!req.Admin){
        return next(
				new errors.UnauthorizedError("You are not admin")
			);
    }
    User.find({isAdmin :false},{pass: 0, isAdmin: 0, token: 0 }, function(err, user) {
        if (err){
        return next(
				new errors.InternalServerError("USER ID not found") //500
			); 
      } else {
            if (user) {
                res.json(user);
            } else {
                res.json("User Data not found");
            }
        }
    });
};

exports.createUser = function(req, res, next) {
    if (!req.is('application/json')) {
			return next(
				new errors.InvalidContentError("Requires 'Content-type: application/json'")
			);
	}
	if(!req.Admin){
        return next(
				new errors.UnauthorizedError("You are not admin")
			);
    }
    //var body1 = "{"+req.params.name , req.params.user ,req.params.pass
    var userModel = new User({name : req.params.name , user : req.params.user , pass : req.params.pass });
    userModel.save(function(err, user) {
        if (err){
        return next(
				new errors.InternalServerError(err) //500
			); 
      } else {
            res.json(user);
        }
    });
};
 
exports.viewUser = function(req, res, next) {
    if (req.params.id.length != 12) {
			return next(
				new errors.InvalidContentError("Requires 'id' parameter")
			);
	}
	if(!req.Admin){
        return next(
				new errors.UnauthorizedError("You are not admin")
			);
    }
    User.findById(new ObjectId(req.params.id), function(err, user) {
        if (err){
        return next(
				new errors.InternalServerError(err) //500
			); 
      } else {
            if (user) {
                res.json(user);
            } else {
                res.json("User: " + req.params.id + " not found");
            }
        }
    });
};

exports.updateUser = function(req, res, next) {
    if (req.params.id.length != 12) {
			return next(
				new errors.InvalidContentError("Requires 'id' parameter")
			);
	}
    if (!req.is('application/json')) {
			return next(
				new errors.InvalidContentError("Requires 'Content-type: application/json'")
			);
	}
	if(!req.Admin){
        return next(
				new errors.UnauthorizedError("You are not admin")
			);
    }
    var updatedUserModel = new User(req.body);
    User.findByIdAndUpdate(new ObjectId(req.params.id), updatedUserModel, function(err, user) {
        if (err){
        return next(
				new errors.InternalServerError(err) //500
			); 
      } else {
            if (user) {
                res.json(user);
            } else {
                res.json("User: " + req.params.id + " not found");
            }
        }
    });
};
 
exports.deleteUser = function(req, res, next) {
    if (req.params.id.length != 12) {
			return next(
				new errors.InvalidContentError("Requires 'id' parameter")
			);
	}
	if(!req.Admin){
        return next(
				new errors.UnauthorizedError("You are not admin")
			);
    }
    User.findByIdAndRemove(new Object(req.params.id), function(err, user) {
        if (err){
        return next(
				new errors.InternalServerError(err) //500
			); 
      } else {
            res.json("User: " + req.params.id + " deleted successfully");
        }
    });
};