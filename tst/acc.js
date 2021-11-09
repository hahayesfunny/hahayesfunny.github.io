const signUp = document.getElementById("sign-up");
const signIn = document.getElementById("sign-in");
const email = document.getElementById("user");
const password = document.getElementById("pass");

signUp.onclick = function() {
    const promise = auth.createUserWithEmailAndPassword(email.value + "@gmail.com", password.value);
    promise.catch(e => alert(e.message));
    accounts.push({"username": email.value, "password": password.value});
}

signIn.onclick = function() {
    const promise = auth.signInWithEmailAndPassword(email.value + "@gmail.com", password.value);
    promise.catch(e => document.getElementById("loginError").innerHTML = e.message);
}

auth.onAuthStateChanged(function(user) {
    if (user) {
        window.location = "chat.html";
    } else {

    }
})