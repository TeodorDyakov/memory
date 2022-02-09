function login(){
    const pass = document.getElementById("pass").value;
    const emmail = document.getElementById("email").value;
}

function register(){
    const pass = document.getElementById("pass");
    const email = document.getElementById("email");
    if(validateEmail(email)){

    }
}

function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function validatePass(){
    
}
