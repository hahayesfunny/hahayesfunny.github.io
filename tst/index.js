const messageDOM = document.getElementById("messages");
const message = document.getElementById("message");
let username = null;


auth.onAuthStateChanged(function(user) {
    if (user) {
        username = user.email.substring(0 ,user.email.length - 10);
    } else {

    }
})

let subscribed = false;

messages.on("value", getData, error)

function getData(data) {
    let d = data.val();
    let vals = Object.values(d);
    console.log(vals)
    if (!subscribed) {
        vals.forEach((val) => {
            let p = document.createElement("p");    
            p.className = "message"
            p.innerHTML = val.from + " : " + val.content;
            messageDOM.appendChild(p);
        })
        subscribed = true;
    } else {
        let p = document.createElement("p");    
        p.innerHTML = vals[vals.length - 1].from + " : " + vals[vals.length - 1].content;
        messageDOM.appendChild(p);
    }
}

document.addEventListener("keyup", function(event) {
    if (event.keyCode === 13 && message.value != "") {
        messages.push({content: message.value, time: new Date().toString(), from: username});
        message.value = "";
    }
});
function error(err) {
    console.log(err);
}