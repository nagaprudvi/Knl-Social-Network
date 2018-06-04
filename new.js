var exp=require('express')
var app=exp()
var ejs=require('ejs')
app.set('view engine','ejs');
var bodyparser=require('body-parser')
var mongojs=require('mongojs')
 var db=mongojs('mongodb://naga:naga111@ds245680.mlab.com:45680/nagaprudvi',['admin'])

app.use(exp.static('public'))
app.use(bodyparser.urlencoded({ extended : false}))


var session=require('express-session');
app.use(session({secret:'nnnkk'}))

app.get('/signup',function(req,res) {
	//console.log(res);
	if(req.session.pw==true){
		res.redirect('/logged');
	}
	else{
	res.sendFile(__dirname+'/public/pgsign.html')
}
	})
app.post('/signsubmit',function(req,res){
var a= req.body.name;
var b=req.body.email;
var c=req.body.uname;
var d=req.body.password;

var doc={
	Name:a,
	email:b,
	uname:c,
	password:d,
}
db.admin.insert(doc,function(err,newdoc){
	if(err){
		res.send("something went wrong")
	}
	else{
	console.log(newdoc);
res.sendFile(__dirname+'/public/pglog.html')
}})

})
app.get('/login',function(req,res){
	if(req.session.pw==true){
		res.redirect('/logged')
	}
	else{
	
	res.sendFile(__dirname+'/public/pglog.html')
}
})
app.post('/loginsubmit',function(req,res){
	req.session.pw=false;
	var docc={
		email:req.body.email,
		password:req.body.password 
	}
	db.admin.find(docc,function(err,newdoc){
		if(newdoc.length>0)
		{
			req.session.pw=true;
			req.session.username=newdoc;
			db.admin.find({},function(error,docw){
				
					res.render('datee',{result:docw,user:newdoc});
					
			})
		}
		else{
			res.send('password wrong')
		}
	})
	
})
app.get('/logged',function(req,res){
	db.admin.find({},function(err,docs){
		res.render('datee',{result:docs,user:req.session.username})
	})
})

app.get('/profile/:uname',function(req,res){
	var uname=req.params.uname;
		db.admin.find({uname:uname},function(err,docs){
			if(req.session.pw==true)
			{

			res.render('mine',{re:docs});
		}

		else{
			res.redirect('/login');
		}
})})
app.get('/logout',function(req,res){
	req.session.destroy(function(){
		console.log('logout')
	})
	res.redirect('/login')
})

app.listen(8080,function(){
	console.log('it is 8080')
})