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
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});
// Initialize firebase with the configuration object
firebase.initializeApp(fbconf);
// Get a reference to the firestore database
db = firebase.firestore();
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    console.log("Signed in, processing...");
    user.getIdToken().then((idToken) => {
      var settings = {
        "url": "https://rbase.zeakydev.repl.co/user/update_token",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Content-Type": "application/json"
        },
        "data": JSON.stringify({
          "user_id": user.uid,
          "user_token": idToken
        }),
      };
      
      $.ajax(settings).done(function (response) {
        fetch("https://rbase.zeakydev.repl.co/user/"+user.uid + "/public_data")
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          document.querySelector(".account").getElementsByTagName("a")[0].href = "/account/account-manager"
          document.querySelector(".accountIcon").getElementsByTagName("span")[0].innerHTML = data.username
          Swal.fire(
            `Wellcome, ${data.username}!`,
            'R.Fund - Rasdium @2023',
            'success'
          )
          document.querySelector(".account").addEventListener("click", (e)=>{
            e.preventDefault()
            Swal.fire({
              title: 'Do you want to sign-out?',
              showDenyButton: true,
              confirmButtonText: 'Confirm',
              denyButtonText: 'Cancel',

            }).then((result) => {
              if (result.isConfirmed) {
                firebase.auth().signOut().then(() => {
                  Swal.fire('Saved!', '', 'success')
                  window.location.reload()
                }).catch((error) => {
                  alert(error)
                  window.location.reload()

                });
              } else if (result.isDenied) {
                Swal.fire('Ok, nothing change!', '', 'info')
              }
            })
          })
        });
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
all_product_list = document.querySelectorAll(".product-list")
fetch("https://rbase.zeakydev.repl.co/data/rasdium/posts/9")
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    let addition = "active"
    let display_max = 6;
    let index = 0;
    console.log(data);
    let html_mem = ""
    data.map((product) => {
      console.log(product)
      product_data = product["post_data"]
      index++;
      function caculate_percent(now, target){
        percent = Math.round((now*100)/target)
        return percent < 100 || 100
      }
      html_mem += `<div class="card space-10px col-4">
      <div class="card-cover-layer">
        <button *type="button" class="btn btn-dark" onclick='window.open("http://127.0.0.1:5501/Product-page/Showcase/product-showcase.html?author=${product.author}&postid=${product.post_meta.projectID}")'>Checkout</button>
      </div>
      <img class="card-img-top" src="https://rbase.zeaky.dev${product_data.media[0]}" alt="Title">
      <div class="card-body">
        <h4 class="card-title">${product_data.name}</h4>
        <p class="card-text">
          ${product_data.description}
        </p>
        <p class="pricing">
        <div class="progress" style="height: inherit;">
        <div class="progress-bar bg-dark" role="progressbar" style="width: ${caculate_percent(product_data.funding.funded, product_data.funding.required)}%; padding: 5px;"
            aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">${Math.round((product_data.funding.funded*100)/product_data.funding.required)}%</div>
        </div>                
        <strong><p>${formatter.format(product_data.funding.funded)} / ${formatter.format(product_data.funding.required)}</p></strong>
        </p>
      </div>
      </div>`
      if (index == 3) {
        index = 0
        elementAdd(
          ` 
          <div class="carousel-item ${addition}">
            <div class="card_container_3">
              ${html_mem}
            </div>    
          </div>
          `,
          document.querySelector(".carousel-inner")
        );
        html_mem = ""
        addition = ""
      }
    });
  });
