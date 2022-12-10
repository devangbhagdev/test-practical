var express = require('express');
var router = express.Router();
var md5 = require('md5');

let mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UsersSchema = new Schema({
  name: String,
  email: String,
  age: Number,
  password: String
});
let secret = 'shhhhh';
const UserModel = mongoose.model('users', UsersSchema);

var jwt = require('jsonwebtoken');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', function(req, res, next) {
  let userData = req.body;
  UserModel.findOne({'email':userData.email,'password':md5(userData.password)}).then(function(user){
    console.log(user);
    var token = jwt.sign(user.toJSON(),secret);
    console.log(token);
    res.send({
      type:"success",
      data:{
        token:token
      },
      message:"Login Successfully"
    });
  }).catch(function(err){
    res.send({
      type:"error",
      message:err.message
    });
  })
});

router.post('/sign-up', function(req, res, next) {
  let userData = req.body;
  UserModel.create({'name':userData.name,'email':userData.email,'password':md5(userData.password)}).then(function(){
    res.send({
      type:"success",
      message:"Registration successfully"
    });
  }).catch(function(err){
    res.send({
      type:"error",
      message:err.message
    });
  })
});


router.post('/my-profile', function(req, res, next) {
  let userData = req.body;
  var userVerfied = jwt.verify(userData.token, secret);
  UserModel.updateOne({_id:userVerfied._id},{$set:{'name':userData.name,'age':userData.age}}).then(function(){
    res.send({
      type:"success",
      message:"Profile updated successfully"
    });
  }).catch(function(err){
    res.send({
      type:"error",
      message:err.message
    });
  })
});

router.get('/list', function(req, res, next) {
  let searchParams = req.query;
  let limit = 2;
  let page = searchParams.page;
  let skip = (page-1)*limit;
  let sort = { name : 1 };
  if(searchParams.sort && searchParams.sortDirection){
    if(searchParams.sortDirection=="desc"){
      searchParams.sortDirection=-1;
    } else {
      searchParams.sortDirection=1;
    }
    sort[searchParams.sort]=searchParams.sortDirection;
  }
  let conditions = {};
  if(searchParams.search){
    conditions['$or']=[{name:{'$regex': searchParams.search, '$options': 'i'}},{email:{'$regex': searchParams.search, '$options': 'i'}}];
  }
  //var userVerfied = jwt.verify(userData.token, secret);
  
  UserModel.find(conditions).skip(skip).sort(sort).limit(limit).then(function(users){
    res.send({
      type:"success",
      data: users,
      message:"List of users"
    });
  }).catch(function(err){
    res.send({
      type:"error",
      message:err.message
    });
  })
});


module.exports = router;
