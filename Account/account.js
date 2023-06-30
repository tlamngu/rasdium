// Define the firebase configuration object
let fbconf = {
  apiKey: "AIzaSyAEZ5uxDiFaBv9SjEP9AmQhJgYngow8cQI",
  authDomain: "radiant-account.firebaseapp.com",
  projectId: "radiant-account",
  storageBucket: "radiant-account.appspot.com",
  messagingSenderId: "608247348483",
  appId: "1:608247348483:web:12e9634c164138ddadfd36",
};
// Initialize firebase with the configuration object
firebase.initializeApp(fbconf);
// Get a reference to the firestore database
db = firebase.firestore();

// Listen to the authentication state change event
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // If the user is signed in, log a message and redirect
    console.log("Signed in, redirect...");
    window.open("/Home/home.html", "_self")
  } else {
    // If the user is not signed in, do nothing
  }
});

// Get a reference to all the buttons with name "sign-in-3rd"
let buttonLoader = document.getElementsByName("sign-in-3rd");
// Get a reference to the authentication form element
let authForm = document.getElementById("AuthDisplay");
// Loop through each button and add a click event listener
buttonLoader.forEach((element) => {
  element.addEventListener("click", () => {
    // When the button is clicked, show an alert that this feature is not available yet
    alert("Sorry, this feature comming soon!");
  });
});
// Define a function to validate the email and password inputs
function roa_validate(email, password) {
  // Define the regular expressions for email and password validation
  let regex_password =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  let regex_email = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  // Test the email and password values against the regular expressions and return a boolean value for each
  let pw_b = regex_password.test(password.value); //Test password validate
  let email_b = regex_email.test(email.value);
  console.log(pw_b, email_b);
  return {
    passwordValidate: pw_b,
    emailValidate: email_b,
  };
}

// Define a function to set a cookie with a name, value and expiration date
function setCookie(cname, cvalue, exdays) {
  // Create a date object and set its time to the expiration date in milliseconds
  const d = new Date();
  d.setTime(exdays * 1000);
  // Format the expiration date as a UTC string
  let expires = "expires=" + d.toUTCString();
  // Set the document cookie with the name, value and expiration date
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
// Add a submit event listener to the authentication form
authForm.addEventListener("submit", (e) => {
  // Prevent the default form submission behavior
  e.preventDefault();
  console.log("Submited form");
  // Get the references to the email and password input elements
  let email = document.getElementById("AuthEmail");
  let password = document.getElementById("AuthPassword");
  console.log(email.value, password.value);
  // Validate the email and password inputs using the roa_validate function
  let inp_valid = roa_validate(email, password);
  // If both inputs are valid, try to sign in with firebase using email and password authentication
  if (inp_valid.passwordValidate && inp_valid.emailValidate) {
    firebase
      .auth()
      .signInWithEmailAndPassword(email.value, password.value)
      .then(function (userCredential) {
        // If the sign in is successful, listen to the authentication state change event again
        firebase.auth().onAuthStateChanged(function (user) {
          if (user) {
            // If the user is signed in, get their unique id and show a success message using swal library
            var uid = user.uid;
            let username = "";
            db.collection("users-data-public")
              .get()
              .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                  let data = doc.data();
                  if (data.email == email.value) {
                    console.log("Found user");
                    setCookie("userDataID", doc.id, 0);
                    Swal.fire(
                      `Wellcome back, ${data.name}!!`,
                      "User_id: " + user.id,
                      "success"
                    ).then(()=>{
                      window.open("/Home/home.html", "_self")
                    });
                  }
                });
              });
          } else {
            // If the user is not signed in, show an error message using swal library

            Swal.fire(
              "Hmm, something went wrong, please try again",
              "This can be an error from our server, sorry :(",
              "error"
            );
          }
        });
      })
      // Add this part to catch errors
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // You can also use a switch statement to handle different error codes
        Swal.fire(
          "Oops, something went wrong!",
          "Error code: " + errorCode,
          "error"
        );
      });
  }
});

//Auto comment was on @CodeCommandX [beta] --Powered by RadiantAI
//CSA01FD- runtime: 00h:54s:00ms
