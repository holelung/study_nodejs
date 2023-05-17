var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});
router.get('/join',function(req,res){
  res.render('join')
})

router.post('/api/join', async function(req,res,rows){
  console.log(req.body)
  var[rows] = await connection.query("select * from user where id=?",[req.body.id])
  if(rows.length==0){ //중복된 아이디 없음: 회원가입 가능
    var[rows] = await connection.query("insert into user (id,name,email,password) values (?,?,?,?)", 
    [req.body.id, req.body.name, req.body.email, req.body.password])
 
  }else{//아이디 중복: 회원가입 불가

  }
  
  /* connection.query("select * from user where id=?",[req.body.id],function(err,rows){
    console.log(err,rows)
    if(rows.length==0){ //중복된 아이디 없음: 회원가입 가능
      connection.query("insert into user (id,name,email,password) values (?,?,?,?)", 
      [req.body.id, req.body.name, req.body.email, req.body.password],function(err,rows){
        console.log(err,rows)
      })
    }else{ //아이디 중복: 회원가입 불가

    } */

  //})
})


module.exports = router;
