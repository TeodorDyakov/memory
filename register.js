function register(){
    const pass = document.getElementById("pass").value;
    const email = document.getElementById("email").value;
    const repeatPass = document.getElementById("repeat-pass").value;

    var ok = true;
    
    if(!validateEmail(email)){
        console.log("asddfd");
        document.getElementById('email-err').style.display = "block";
        ok = false;
    }else{
        document.getElementById('email-err').style.display = "none";
    }

    if(pass.length < 6){
        document.getElementById('pass-err-len').style.display = "block";
        ok = false;
    }else{
        document.getElementById('pass-err-len').style.display = "none";
    }

    if(!isPassAlhpanumeric(pass)){
        document.getElementById('pass-alphanum-err').style.display = "block";
        ok = false;
    }else{
        document.getElementById('pass-alphanum-err').style.display = "none";
    }
    
    if(repeatPass != pass){
        ok = false;
        document.getElementById('pass-err-match').style.display = "block";
    }else{
        document.getElementById('pass-err-match').style.display = "none";
    }
    
    if(ok){
        var users = localStorage.getItem("users");
        
        if(!users){
            users = [];
        }else{
            users = JSON.parse(users);
        }

        var usernameExists = users.some(function(o){return o["email"] === email;});
        
        if(usernameExists){
            document.getElementById("username-exists").style = "block";
        }else{
            var user = {
                "email" : email,
                "pass" : pass
            }

            users.push(user);

            localStorage.setItem("users", users);
            document.location.href = "memory.html";
            localStorage.setItem("loggedUser", user);
        }
    }
}

function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function isPassAlhpanumeric(pass){
    var re = /^[a-z0-9]+$/i;
    return re.test(pass);
}