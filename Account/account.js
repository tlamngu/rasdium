let fbconf = {
    apiKey: "AIzaSyAEZ5uxDiFaBv9SjEP9AmQhJgYngow8cQI",
    authDomain: "radiant-account.firebaseapp.com",
    projectId: "radiant-account",
    storageBucket: "radiant-account.appspot.com",
    messagingSenderId: "608247348483",
    appId: "1:608247348483:web:12e9634c164138ddadfd36"
  };
// init firebase 
firebase.initializeApp(fbconf);
db = firebase.firestore()

let buttonLoader = document.getElementsByName("sign-in-3rd")
let authForm = document.getElementById("AuthDisplay")
buttonLoader.forEach(element => {
    element.addEventListener("click", ()=>{
        alert("Sorry, this feature comming soon!")
    })
});
function roa_validate(email, phone, password){
    let regex_password = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    let tel_regex = /^\+?\d{2} \d{9}$/
    let pw_b = regex_password.test(password.value) //Test password validate
    let tel_b = tel_regex.test(phone.value)
    console.log(pw_b, tel_b)
    return false
}

authForm.addEventListener("submit", (e)=>{
    e.preventDefault()
    console.log("Submited form")
    let email = document.getElementById("AuthEmail")
    let phone = document.getElementById("AuthPhone")
    let password = document.getElementById("AuthPassword")
    console.log(email.value, phone.value, password.value)
    roa_validate(email, phone, password)
    // firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
    //   .then(function (user) {
    //     console.log('Account register complete', user);
    //     db.collection("users").add({
    //       email: email.value,
    //       phone: phone.value,
    //     })
    //     alert("Account creation success.")
    //   })
    //   .catch(function (error) {
    //     // Xử lý lỗi đăng ký
    //     console.log('Register error', error);
    //     alert("Fail on creating account, retry")
    //   });
})
 