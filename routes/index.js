var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index',{message: null });
});
router.get('/join',function(req,res){
  res.render('join',{message: null })
})

router.post('/api/join', async function(req,res,rows){
  console.log(req.body)
  var[rows] = await connection.query("select * from user where id=?",[req.body.id])
  if(rows.length==0){ //중복된 아이디 없음: 회원가입 가능
    var[rows] = await connection.query("insert into user (id,name,email,password) values (?,?,?,?)", 
      [req.body.id, req.body.name, req.body.email, req.body.password])
    
    res.redirect('/')
  }else{//아이디 중복: 회원가입 불가
    res.render('join',{message: "이미 가입되어있는 아이디 입니다."})
  }
})

router.post('/api/login',async function(req, res, rows){
  var[rows] = await connection.query("select * from user where id=? and password=?",
    [req.body.id, req.body.password])
  console.log(req.body.id)
  if(rows.length==0){//로그인 실패 - 아이디 또는 패스워드가 틀렸을 경우
    res.render('index', {message: "아이디 또는 패스워드가 틀렸습니다."})

  }else{//로그인 성공
    req.session.user = rows[0]
    res.redirect('/main')
  }
})


router.get('/main',async function(req, res){
  var[rows]= await connection.query("select * from namecard where userId=?", [req.session.user.id])
  
  res.render('main', {namecards: rows})
})

router.get('/namecard/create',async function(req, res){
  res.render('namecard_create')
})

router.post('/api/namecard/create', async function(req, res, rows){
  console.log(req.body)
  console.log(req.session)
  await connection.query("insert into namecard(name, company, title, phone, email, address, web, userId) values(?,?,?,?,?,?,?,?)",
    [req.body.name, req.body.company, req.body.title, req.body.phone, req.body.email, req.body.address, req.body.web, req.session.user.id])


  res.redirect('/main')
})

router.get('/api/namecard/delete/:id', async function(req, res){
  console.log(req.params.id) 
  await connection.query("delete from namecard where id=?",[req.params.id])
  res.redirect('/main') 
})
router.get('/namecard/modify/:id', async function(req, res, rows){
  var[rows]=await connection.query("select * from namecard where id=?",[req.params.id])
  res.render('namecard_modify', { namecard: rows[0] })
})


router.post('/api/namecard/modify', async function(req, res){//명함수정 
  console.log(req.body)
  await connection.query("update namecard set name=?, company=?, title=?, phone=?, email=?, address=?, web=? where id=?",
  [req.body.name, req.body.company, req.body.title, req.body.phone, req.body.email, req.body.address, req.body.web, req.body.id])

  res.redirect('/main')
})

router.get('/namecard/:id', async function(req, res, rows){
  var[rows]=await connection.query("select * from namecard where id=?", [req.params.id]) 
  var loginUserId = null;
  if(req.session.user){ //로그인 되어있을 경우
    loginUserId = req.session.user.id
  }

  res.render('namecard_item', {namecard: rows[0], loginUserId: loginUserId })
})

router.get('/api/logout', async function(req, res, rows){
  req.session.destroy
  res.redirect('/')
})
module.exports = router;
