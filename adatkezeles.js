
// Your Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyCUC-v_mXJfg_25yqmysxITUrD7-UHaPvU",
    authDomain: "notium-fb1c0.firebaseapp.com",
    projectId: "notium-fb1c0",
    storageBucket: "notium-fb1c0.firebasestorage.app",
    messagingSenderId: "1008722014168",
    appId: "1:1008722014168:web:2c3f7d441d2270a2b10cad"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore(); // Initialize Firestore

// Get DOM elements
const registerEmailInput = document.getElementById('registerEmail');
const registerPasswordInput = document.getElementById('registerPassword');
const registerUsernameInput = document.getElementById('registerUsername');
const registerButton = document.getElementById('registerButton');
const registerError = document.getElementById('registerError');

const loginEmailInput = document.getElementById('loginEmail');
const loginPasswordInput = document.getElementById('loginPassword');
const loginButton = document.getElementById('loginButton');
const loginError = document.getElementById('loginError');

const userInfoDiv = document.getElementById('userInfo');
const displayEmailSpan = document.getElementById('displayEmail');
const displayUsernameSpan = document.getElementById('displayUsername');
const signOutButton = document.getElementById('signOutButton');
const deleteAccountButton = document.getElementById('deleteAccountButton');
const deleteError = document.getElementById('deleteError');
const reauthenticateSection = document.getElementById('reauthenticateSection');
const reauthPasswordInput = document.getElementById('reauthPassword');
const confirmReauthButton = document.getElementById('confirmReauthButton');

const statusMessage = document.getElementById('status');

// --- Firebase Authentication Functions ---

// Listen for authentication state changes
auth.onAuthStateChanged(async (user) => {
    if (user) {
        // User is signed in
        userInfoDiv.style.display = 'block';
        displayEmailSpan.textContent = user.email;
        statusMessage.textContent = `User ${user.email} is signed in.`;
        registerError.textContent = '';
        loginError.textContent = '';
        deleteError.textContent = '';
        reauthenticateSection.style.display = 'none';

        // Fetch username from Firestore
        const userDocRef = db.collection('users').doc(user.uid);
        const userDoc = await userDocRef.get();
        if (userDoc.exists) {
            displayUsernameSpan.textContent = userDoc.data().username;
        } else {
            displayUsernameSpan.textContent = 'N/A (No username found)';
        }

    } else {
        // User is signed out
        userInfoDiv.style.display = 'none';
        displayEmailSpan.textContent = '';
        displayUsernameSpan.textContent = '';
        statusMessage.textContent = 'No user signed in.';
    }
});

// 1. Register New Account (Email, Password, and Username to Firestore)
registerButton.addEventListener('click', async () => {
    const email = registerEmailInput.value;
    const password = registerPasswordInput.value;
    const username = registerUsernameInput.value;
    registerError.textContent = '';

    if (!email || !password || !username) {
        registerError.textContent = 'Email, password, and username are required.';
        return;
    }

    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Store username in Firestore
        await db.collection('users').doc(user.uid).set({
            username: username,
            email: user.email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        statusMessage.textContent = `Successfully registered and logged in ${user.email} with username ${username}!`;
        registerEmailInput.value = '';
        registerPasswordInput.value = '';
        registerUsernameInput.value = '';

    } catch (error) {
        console.error('Registration error:', error.code, error.message);
        registerError.textContent = `Registration failed: ${error.message}`;
    }
});

// Sign In
loginButton.addEventListener('click', async () => {
    const email = loginEmailInput.value;
    const password = loginPasswordInput.value;
    loginError.textContent = '';

    if (!email || !password) {
        loginError.textContent = 'Email and password are required.';
        return;
    }

    try {
        await auth.signInWithEmailAndPassword(email, password);
        statusMessage.textContent = `Successfully signed in as ${email}.`;
        loginEmailInput.value = '';
        loginPasswordInput.value = '';
    } catch (error) {
        console.error('Login error:', error.code, error.message);
        loginError.textContent = `Login failed: ${error.message}`;
    }
});

// Sign Out
signOutButton.addEventListener('click', async () => {
    try {
        await auth.signOut();
        statusMessage.textContent = 'Successfully signed out.';
    } catch (error) {
        console.error('Sign out error:', error.message);
        statusMessage.textContent = `Sign out failed: ${error.message}`;
    }
});

// 2. Delete Account (with Re-authentication)
deleteAccountButton.addEventListener('click', async () => {
    const user = auth.currentUser;
    deleteError.textContent = '';
    reauthenticateSection.style.display = 'none';

    if (user) {
        try {
            // Attempt to delete directly. Firebase might require re-auth if not recently signed in.
            await user.delete();

            // If deletion successful, also delete user data from Firestore
            await db.collection('users').doc(user.uid).delete();

            statusMessage.textContent = 'Account successfully deleted!';
        } catch (error) {
            if (error.code === 'auth/requires-recent-login') {
                deleteError.textContent = 'Please re-enter your password to confirm account deletion.';
                reauthenticateSection.style.display = 'block';
            } else {
                console.error('Account deletion error:', error.code, error.message);
                deleteError.textContent = `Account deletion failed: ${error.message}`;
            }
        }
    } else {
        deleteError.textContent = 'No user is currently signed in.';
    }
});

// Confirm Re-authentication and Delete Account
confirmReauthButton.addEventListener('click', async () => {
    const user = auth.currentUser;
    const password = reauthPasswordInput.value;
    deleteError.textContent = '';

    if (!user) {
        deleteError.textContent = 'No user is currently signed in.';
        return;
    }
    if (!password) {
        deleteError.textContent = 'Please enter your password.';
        return;
    }

    try {
        const credential = firebase.auth.EmailAuthProvider.credential(user.email, password);
        await user.reauthenticateWithCredential(credential);

        // Now that the user is re-authenticated, try deleting again
        await user.delete();

        // Delete user data from Firestore
        await db.collection('users').doc(user.uid).delete();

        statusMessage.textContent = 'Account successfully deleted after re-authentication!';
        reauthenticateSection.style.display = 'none';
        reauthPasswordInput.value = '';

    } catch (error) {
        console.error('Re-authentication or deletion error:', error.code, error.message);
        deleteError.textContent = `Deletion failed: ${error.message}. Please check your password.`;
    }
});


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