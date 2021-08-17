var firebaseConfig = {
    apiKey: "AIzaSyAGAi2p52Xk8vgAQiDZmj4-GRF5rJ_4y-o",
    authDomain: "andromeda-2b-14196.firebaseapp.com",
    projectId: "andromeda-2b-14196",
    storageBucket: "andromeda-2b-14196.appspot.com",
    messagingSenderId: "793693836395",
    appId: "1:793693836395:web:6eede2d74b9fd912d18d2e"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebaseConfig = window.btoa(firebaseConfig);

let postCollection = document.querySelector("#posts-collection");

const db = firebase.firestore();

function createPost(title, time, content, author, clearData) {
    if (!clearData) {
        console.log(title + " " + time + " " + content);
        let div = document.createElement("div");
        div.setAttribute("class", "col-md-4");
        div.setAttribute("id", "articlesAndComments");

        let h2 = document.createElement("h2");
        let p = document.createElement("p");
        let small = document.createElement("small");
        let auth = document.createElement("small");

        h2.textContent = title;
        small.textContent = time;
        auth.textContent = author + " posted on ";
        p.textContent = content;

        h2.classList.add("blog-title");
        small.classList.add("date");
        auth.classList.add("date");
        p.classList.add("blog-content");

        div.appendChild(h2);
        div.appendChild(auth);
        div.appendChild(small);
        div.appendChild(p);

        postCollection.appendChild(div);
    } else {
        document.getElementById("articlesAndComments").innerHTML = "";
    }
}

// create new content in firebase collection called posts
function createPostInFirebase(title, time, content, author) {
    db.collection("posts").add({
        postName: title,
        createdAt: time,
        postContent: content,
        author: author,
        id: ""
    }).then(function (docRef) {
        console.log("Document created:", docRef.id);
        getPosts();
    });
}

// delete post inside a document knowing its id
function deletePost(search) {
    var results = db.collection('posts').where('postName', '==', search);
    results.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            doc.ref.delete();
            getPosts();
        });
    });
}

// Get Posts
function getPosts() {
    db.collection("posts")
        .get()
        .then(snapshot => {
            if (snapshot.docs.length == 0) {
                console.log("no data found");
                createPost("", "", "", "", true);
            } else {
                snapshot.docs.forEach(docs => {
                    createPost(
                        docs.data().postName,
                        docs.data().createdAt,
                        docs.data().postContent,
                        docs.data().author,
                        false
                    );
                    console.log(docs.data());
                });
            }
        })
        .catch(err => {
            console.log(err);
        });
}

var cont = false;
var loggedIn = false;

function validate() {
    var username = document.getElementById("uname");
    var password = document.getElementById("pwd");
    var confirmPassword = document.getElementById("confPwd");
    var email = document.getElementById("email");

    if (password.value.length < 8) {
        password.style.border = "1px solid red";
        password.focus();
        return false;
    }
    if (username == "" || password == "" || confirmPassword == "" || email == "") {
        return false;
    }
    if (confirmPassword.value.length < 8) {
        confirmPassword.style.border = "1px solid red";
        confirmPassword.focus();
        return false;
    }

    if (password.value != confirmPassword.value) {
        confirmPassword.style.border = "1px solid red";
        confirmPassword.focus();
        return false;
    }
    if (username.value.length < 3) {
        username.style.border = "1px solid red";
        username.focus();
        return false;
    }
    if (username.value.length > 20) {
        username.style.border = "1px solid red";
        username.focus();
        return false;
    }
    if (username.value.match(/[^a-zA-Z0-9-_]/g)) {
        username.style.border = "1px solid red";
        username.focus();
        return false;
    }
    if(document.getElementById("avatar").value == ""){
        return false;
    }
    var emailvalidator = db.collection("users").where('email', '==', email.value);
    emailvalidator.get().then(function (querySnapshot) {
        if (querySnapshot.size > 0) {
            email.style.border = "1px solid red";
            email.focus();
            console.log("GOD IT EXISTS");
            cont = false;
            return false;
        }
        if (querySnapshot.size == 0) {
            cont = true;
        }
    });
    return true;
}

getPosts();

function createAccount() {
    validate();
    console.log(cont);
    if (cont != false) {
        if (validate() != undefined || validate() != false) {
            console.log("valid");
            var uname = document.getElementById("uname").value;
            var pwd = document.getElementById("pwd").value;
            var email = document.getElementById("email").value;
            var pfp = document.getElementById("blah").src;
            var confirmPwd = document.getElementById("confPwd").value;

            db.collection("users").add({
                username: uname,
                email: email,
                pwd: pwd,
                avatar: pfp
            }).then(function (docRef) {
                console.log("Account created:", docRef.id);
            });
            cont = true;
            login(false, uname, email, pwd);
            document.getElementById("signupdiv").style.visibility = 'hidden';
        } else if (validate() == undefined || validate() == false) {
            console.log("Account will not be created.");
        }
    }
}

function login(doDbStuff, uname, email, pwd) {
    db.collection("users").where("username", "==", uname).where("pwd", "==", pwd).where("email", "==", email).get().then(function (querySnapshot) {
        if (querySnapshot.size == 0) {
            console.log("Username or password is incorrect");
        } else {
            console.log("Login successful");
            loggedIn = true;
            document.getElementById("blah").style.display = "initial";
            document.getElementById("notLoggedIn").style.display = "none";
            document.getElementById("blah").src = querySnapshot.docs[0].data().avatar;
            document.getElementById("usernameHolder").innerHTML = querySnapshot.docs[0].data().username;
            if (doDbStuff == true) {
                // create new item in localstorage with expiration time
                const now = new Date()
                const sessionID = {
                    value: (Math.random() + 1).toString(36).substring(2),
                    expiry: now.getTime() + 432000000,
                }
                localStorage.setItem(window.btoa("sessionData"), JSON.stringify(sessionID));
                // update the current document
                db.collection("users").doc(querySnapshot.docs[0].id).update({
                    sessionData: sessionID.value
                })
            }
            document.getElementById("signindiv").style.visibility = 'hidden';
            document.getElementById("signoutbutton").style.visibility = 'visible';
            document.getElementById("signupdiv").style.visibility = 'hidden';
        }
        console.log(querySnapshot);
    });
}

function getDataUrl(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            document.getElementById("blah").src = e.target.result;
        }

        reader.readAsDataURL(input.files[0]);
        console(reader.readAsDataURL(input.files[0]));
    }
}

function checkForLogin() {
    // look for sessionData in database where the value is the same as the one in localstorage
    db.collection("users").where("sessionData", "==", JSON.parse(localStorage.getItem(window.btoa("sessionData"))).value).get().then(function (querySnapshot) {
        login(true, querySnapshot.docs[0].data().username, querySnapshot.docs[0].data().email, querySnapshot.docs[0].data().pwd);
    })
}

function signOut() {
    localStorage.removeItem(window.btoa("sessionData"));
    // refresh page
    window.location.reload();
}

checkForLogin();

tippy('#usernameHolder', {
    content: 'User Profile',
    duration: 300,
    arrow: true,
    placement: 'left',
    theme: 'macOS',
});

