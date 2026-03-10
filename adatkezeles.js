// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCSRRBexUfmzOYghegPV8rAX4RE7-mzgWU",
    authDomain: "notium-f56ab.firebaseapp.com",
    databaseURL: "https://notium-f56ab-default-rtdb.firebaseio.com",
    projectId: "notium-f56ab",
    storageBucket: "notium-f56ab.firebasestorage.app",
    messagingSenderId: "621619892864",
    appId: "1:621619892864:web:6e56128b395c3b94a50c65",
    measurementId: "G-YJ660TQ28Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

import { getDatabase, ref, child, get, set, update, remove } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";
const db = getDatabase();

function adddata(lusername, lemail, lpassword) {
    set(ref(db, "Users/" + lusername), {
        username: lusername,
        email: lemail,
        password: lpassword
    }).then(() => {
        alert("Sikeres regisztráció")
    }).catch((error) => {
        alert("Sikertelen regisztráció")
        console.log(error);
    })
}

function RetData() {
    const dbref = ref(db)
    get(child(dbref, "Users/" + username.value)).then((snapshot) => {
        if (snapshot.exists()) {
            email.value = snapshot.val().email
            password.value = snapshot.val().password
        }
    })
}

function updatedata() {
    remove(ref(db, "Users/" + username.value), {
        email: email.value,
        password: password1.value
    }).then(() => {
        alert("Data Updated Succesfully")
    }).catch((error) => {
        alert("Unsuccesful")
        console.log(error);
    })
}

function deletedata() {
    update(ref(db, "Users/" + username.value))
        .then(() => {
            alert("Data Deleted Succesfully")
        }).catch((error) => {
            alert("Unsuccesful")
            console.log(error);
        })
}


function reg() {
    let username = document.getElementById("username").value
    let email = document.getElementById("email").value
    let passwd = document.getElementById("passwd1").value
    let passwd2 = document.getElementById("passwd2").value
    if (passwd === passwd2 && passwd.length > 5 && email.includes("@")) {
        adddata(username, email, passwd)

    } else {
        alert("Valami baj van a registrácioval!!")
    }
}
/*szem müködése*/
function togglePassword(inputId, icon) {
    const pass = document.getElementById(inputId);

    if (pass.type === "password") {
        pass.type = "text";
        icon.classList.replace("fa-eye", "fa-eye-slash");
    } else {
        pass.type = "password";
        icon.classList.replace("fa-eye-slash", "fa-eye");
    }
}
/*bejelentkezés */
function login() {
    
}

register.addEventListener('click', reg)
bejelentkezes.addEventListener('click', login)