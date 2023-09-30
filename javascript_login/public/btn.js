
// input field focus effects
const textInput = document.querySelectorAll('input');
textInput.forEach(textInput => {
    textInput.addEventListener('focus', () => {
        let parent =textInput.parentNode;
        parent.classList.add('active');
    });
    textInput.addEventListener('blur', () => {
        let parent =textInput.parentNode;
        parent.classList.remove('active');
    });
});

//password show/hide button
const passwordInput =document.querySelector(".password-input");
const eyeBtn =document.querySelector(".eye-btn");
const cpasswordInput =document.querySelector("[name='cpassword']");
const ceyeBtn =document.querySelector(".ceye-btn");

eyeBtn.addEventListener("click", () =>{
    if(passwordInput.type === "password"){
        passwordInput.type = "text";
        eyeBtn.innerHTML="<i class= 'uil uil-eye'></i>"
        
    }else{
        passwordInput.type = "password";
        eyeBtn.innerHTML= "<i class='uil uil-eye-slash'></i>";
     }
});


ceyeBtn.addEventListener("click", () =>{
    if(cpasswordInput.type === "password"){
        cpasswordInput.type = "text";
        ceyeBtn.innerHTML="<i class= 'uil uil-eye'></i>"
        
    }else{
        cpasswordInput.type = "password";
        ceyeBtn.innerHTML= "<i class='uil uil-eye-slash'></i>";
     }
});


//sliding between the sign in and sign up
// const signUpBtn = document.querySelector(".sign-up-btn")
// const signInBtn = document.querySelector(".sign-in-btn")
// const signUpForm = document.querySelector(".sign-up-form")
// const signInForm = document.querySelector(".sign-in-form")
// signUpBtn.addEventListener("click", () =>{
    
//     signInForm.classList.add("hide")
//     signUpForm.classList.add("show")
    
// });

        
          
