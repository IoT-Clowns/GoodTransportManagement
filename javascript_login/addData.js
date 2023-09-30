const mongoose =require('mongoose')
mongoose.connect('mongodb://0.0.0.0:27017/login_page',{useNewUrlParser: true, useUnifiedTopology: true});


const db= mongoose.connection;

const loginSignupSchema = new mongoose.Schema({ 
    name: String,
    phone: String,
    email: String,
    password: String
});
const LoginSignup =mongoose.model('user',loginSignupSchema);

const newData={
    name:'nguyennhattung',
    phone:'123456789',
    email:'nguyennhattung03@gmail.com',
    password:'1234567'
}
const newAccount =new LoginSignup(newData);
newAccount.save()
    .then(account =>{
        console.log('du lieu duoc them thanh cong: ', account);
    })
    .catch(err => {
        console.error(err);
        mongoose.connection.close();
    });

