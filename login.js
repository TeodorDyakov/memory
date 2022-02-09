document.getElementById("register-button").onclick = function(){
    document.location.href = "register.html";
}

function login(){
    const pass = document.getElementById("pass").value;
    const email = document.getElementById("email").value;
    
    var user = getUserFromLocalStorageByEmail(email);
    
    if(!user){
        document.getElementById("non-existent-err").style.display = "block";
    }else{
        document.getElementById("non-existent-err").style.display = "none";
        if(user.pass == pass){
            document.location.href = "memory.html";
        }else{
            document.getElementById("wrong-pass-err").style.display = "block";
        }
    }
}


function getUserFromLocalStorageByEmail(email){
    var users = localStorage.getItem("users");
    if(users){
        return remyArray.find(x => x.email === email);
    }
    return null;
}