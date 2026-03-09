function reg(){
    const email = document.getElementById("email").value
    const passwd = document.getElementById("passwd1").value
    const passwd2 = document.getElementById("passwd2").value
    if(passwd === passwd2 && passwd.length > 5 && email.includes("@")){

        localStorage.setItem("email", email)
        localStorage.setItem("password", passwd)

        window.location.href = "jegyzet.html";

    }else{
        alert("Valami baj van a registrácioval!!")
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
/*bejelentkezés */
function bejelentkezés(){
    
    let email = document.getElementById("email").value;
    let password = document.getElementById("passwd1").value;

    let storedEmail = localStorage.getItem("email");
    let storedPassword = localStorage.getItem("password");

    if(email === storedEmail && password === storedPassword){
        window.location.href = "jegyzet.html";
    }
    else{
        alert("A felhasználó név vagy a jelszó hibás!")
    }

}