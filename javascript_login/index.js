//first import install library
var express= require("express");
var bodyParser= require('body-parser');
var mongoose= require('mongoose');

// crease app
const app= express()

app.use (bodyParser.json());
app.use (express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

//connect database

mongoose.connect('mongodb://0.0.0.0:27017/login_page',{useNewUrlParser: true, useUnifiedTopology: true});

var db= mongoose.connection;

//check connection

db.on('error',()=> console.log("error in connecting database"));
db.once('open',()=> console.log("database connected"));
// define schema
const loginSignupSchema = new mongoose.Schema({ 
    name: String,
    phone: String,
    email: String,
    password: String
  });
const LoginSignup =mongoose.model('user',loginSignupSchema);
//create checking page

app.get('/',(req,res)=>{
    return res.redirect('index.html');
}).listen(3000);

app.post('/login', (request,response)=>{
    try{
        //get data from index.html form
        const username= request.body.email;
        const password= request.body.password;

        //let check username and password
        //success
       
        // the data is post successfully
        const useremail= db.collection('users').findOne({email: username},(err,res)=>{
            if(err){
                console.error('Error in finding user', err);
                response.send('An error occured');
                return;
            }
            if (res === null ){
                response.send("Infomation not match, please create an account first");
                return;
            }
            if (res.password === password){
                console.log("login sucess");
                return response.redirect("login.html")
            }
            else{
                console.log("password not match");
                response.send("password not match");
            }
        })

        
        
    }catch(error){
        console.log("Invalid Information");
    }
});

app.post('/signup', (request, response) => {
    // Xử lý đăng ký người dùng
    const { name, phone, email, password } = request.body;

    // Kiểm tra xem email đã tồn tại chưa
    LoginSignup.findOne({ email })
        .then(existingUser => {
            if (existingUser) {
                return response.status(400).send('Email đã tồn tại, vui lòng chọn một email khác...');
            }

            // Nếu email chưa tồn tại, tạo người dùng mới
            const newUser = new LoginSignup({
                name,
                phone,
                email,
                password
            });

            return newUser.save();
        })
        .then(user => {
            console.log('Người dùng được tạo', user);
            return response.redirect("login.html");
        })
        .catch(err => {
            console.error('Lỗi trong quá trình tạo người dùng', err);
            return response.status(500).send('Đã xảy ra lỗi trong quá trình đăng ký');
        });
});
    
        


    





      

