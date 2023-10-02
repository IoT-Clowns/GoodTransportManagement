//document.getElementById("login").addEventListener("click", function() 
function login(){
    var base_url = "https://ap-southeast-1.aws.data.mongodb-api.com/app/application-0-xtvas/endpoint/web_browser/login"
    // Get the value of the input field
    var email = document.getElementById("user_email").value;
    var password = document.getElementById("user_password").value;
    // Create HTTP request
    var xhr = new XMLHttpRequest();
    // Send user email and password to the server
    var url = base_url + "?user=" + email + "&password=" + password;
    xhr.open("GET", url); // change to POST if you want
    xhr.setRequestHeader("Content-Type", "application/json"); // Specify JSON content type
    xhr.responseType = 'json';
    xhr.send();
    console.log("debug");
    xhr.onload = function() {
      if (xhr.status == 200) 
      {
        console.log(xhr.response);
        var user_ = xhr.response["user"];
        var password_ = xhr.response["password"];
        if (email==user_ && password==password_) 
        {
            console.log(user_);
            document.location = "html/home.html";
        }
        else
        {
            email = '';
            password = '';
        }
      }
    };
};
