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

router.post('api/login',async function(req, res){
  console.log(req.body)
  var [rows] = await connection.query("select * from user where id=? and password=?",
    [req.body.id, req.body.password])
  if(rows.length==0){//로그인 실패 - 아이디 또는 패스워드가 틀렸을 경우
    res.render('index', {message: "아이디 또는 패스워드가 틀렸습니다."})

  }else{//로그인 성공
    res.redirect('/main')
  }
})


module.exports = router;
