$(document).ready(function () {
  $(".Main-carousel").slick({
    centerMode: true,
    centerPadding: "100px",
    slidesToShow: 1,
    arrows: true,
    speed: 600,
    waitForAnimate: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: "40px",
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: "0px",
          slidesToShow: 1,
        },
      },
    ],
  });
});
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
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // If the user is signed in, log a message and redirect
    console.log(user);

    console.log("Signed in, processing...");

    db.collection("users-data-public")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let data = doc.data();
          if (data.email == user.email) {
            Swal.fire(
              `Hello, ${data.name}!!`,
              "Hope you enjoy our service and don't forget to turn on notification!",
              "success"
            ).then(() => {
              document.querySelector(".accountIcon").children[0].innerHTML =
                data.name; //tam thoi, chua ket noi len Rbase
              document.querySelector(".accountIcon").parentNode.href =
                "/account/console.html";
            });
          }
        });
      });
  } else {
    // If the user is not signed in, do nothing
  }
});

async function GetData(url, mode) {
  console.log(`Current url:  ${window.location.href}`);
  console.log(`Getting at url:  ${url}${mode}`);
  let pack = undefined;
  const response = await fetch(`${url}${mode}`);
  // Storing data in form of JSON
  var data = await response.json();
  console.log(data);
  if (response) {
  }
  return Promise.resolve(data);
}
function elementAdd(html, parent) {
  const placeholder = document.createElement("div");
  placeholder.insertAdjacentHTML("afterbegin", html);
  const node = placeholder.firstElementChild;
  parent.appendChild(node);
}
fetch("https://649ed181245f077f3e9cf1a0.mockapi.io/product-1")
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    let display_max = 6;
    let index = 0;
    console.log(data);
    document.querySelector(".product-list").innerHTML = "";
    data.forEach((product_data) => {
      index++;
      if (index <= 6) {
        elementAdd(
          `<div class="card">
    <img class="card-img-top" src="https://picsum.photos/500/1000" alt="Title">
    <div class="card-body">
      <h4 class="card-title">${product_data.name}</h4>
      <p class="card-text">
        ${product_data.description}
      </p>
      <p class="pricing"><strong>
        Status: ${product_data.funding.funded}USD / ${product_data.funding.required}USD
      </strong> </p>
    </div>
  </div>`,
          document.querySelector(".product-list")
        );
      }
    });
  });
