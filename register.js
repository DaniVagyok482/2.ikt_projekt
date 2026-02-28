function reg(){
    const email = document.getElementById("email").value
    const passwd = document.getElementById("passwd1").value
    const passwd2 = document.getElementById("passwd2").value
    if(passwd === passwd2 && passwd.length > 5 && email.includes("@")){
        
    }else{
        
    }
}
/*szem müködése*/
function togglePassword(inputId, icon){
    const pass = document.getElementById(inputId);

    if(pass.type === "password"){
        pass.type = "text";
        icon.classList.replace("fa-eye","fa-eye-slash");
    }else{
        pass.type = "password";
        icon.classList.replace("fa-eye-slash","fa-eye");
    }
}
