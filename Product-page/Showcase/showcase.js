const queryString = window.location.search;
console.log(queryString);
const urlParams = new URLSearchParams(queryString);
const author = urlParams.get("author");
const post_id = urlParams.get("postid");
function elementAdd(html, parent) {
  const placeholder = document.createElement("div");
  placeholder.insertAdjacentHTML("afterbegin", html);
  const node = placeholder.firstElementChild;
  parent.appendChild(node);
}
console.log(author, post_id);
fetch(`https://rbase.zeaky.dev/post/project/get/${author}/${post_id}`)
  .then((res) => {
    return res.json();
  })
  .then((d) => {
    let mt = false;
    d.media.forEach((m) => {
      if (!mt) {
        elementAdd(
          `<div class="carousel-item active">
    <img src="https://rbase.zeaky.dev${m}" class="w-100 d-block">
  </div>`,
          document.querySelector("#media-carousel-content")
        );
        elementAdd(
          `    <li data-bs-target="#carouselId" data-bs-slide-to="0" class="active" aria-current="true" aria-label="First slide"></li>
  `,
          document.querySelector("#media-carousel-indi")
        );
        mt = true;
      } else {
        elementAdd(
          `<div class="carousel-item">
    <img src="https://rbase.zeaky.dev${m}" class="w-100 d-block">
  </div>`,
          document.querySelector("#media-carousel-content")
        );
        elementAdd(
          `    <li data-bs-target="#carouselId" data-bs-slide-to="0" class="" aria-current="true" aria-label="First slide"></li>
  `,
          document.querySelector("#media-carousel-indi")
        );
      }
      document.querySelector("#Detail").innerHTML = d.Marked_description_render;
    });
    d.tags.forEach((tag) => {
      elementAdd(
        `<a href="#" class="text-danger">${tag}</a>`,
        document.querySelector("#tag-display")
      );
    });
    document.querySelector("#Funding_progress_container").innerHTML = `
  <div class="progress-bar bg-danger" role="progressbar" style="width: ${Math.round(
    (d.funding.funded / d.funding.required) * 100
  )}%;">
  </div>
  `;
    document.querySelector("#Description").innerHTML = d.description;
    document.querySelector("#funded_value").innerHTML = `${formatter.format(
      d.funding.funded
    )} Funded`;
    document.querySelector("#funding_target").innerHTML = `${formatter.format(
      d.funding.required
    )} Target`;
    document.querySelector("#percent_funded").innerHTML = `${Math.round(
      (d.funding.funded / d.funding.required) * 100
    )}% success`;
    document.querySelector("#post_heading").innerHTML = d.name;
    document.querySelector("#post_heading_description").innerHTML =
      d.description;
    let ind_ = 1;
    d.funding.funded_by.forEach((dat) => {
      if (ind_ % 2 == 0) {
        elementAdd(
          `
        <li class="funded_block" style="background:white;">
                        <img src="/static/Asset/RRV-favicon.png" alt="" style="height: 100%; aspect-ratio: 1/1;">
                        <div class="info">
                          <h3>${Object.keys(dat)}</h3>
                          <p>Funded: ${formatter.format(
                            dat[Object.keys(dat)].funded_value
                          )} (${dat[Object.keys(dat)].funded_pack})</p>
                        </div>
                    </li>
        `,
          document.querySelector("#funded_container")
        );
      } else {
        elementAdd(
          `
          <li class="funded_block">
                          <img src="/static/Asset/RRV-favicon.png" alt="" style="height: 100%; aspect-ratio: 1/1;">
                          <div class="info">
                            <h3>${Object.keys(dat)}</h3>
                            <p>Funded: ${formatter.format(
                              dat[Object.keys(dat)].funded_value
                            )} (${dat[Object.keys(dat)].funded_pack})</p>
                            </div>
                      </li>
          `,
          document.querySelector("#funded_container")
        );
      }
      ind_ += 1;
    });
    let c = "";
    d.funding.Funding_pack.forEach((dat) => {
      c += `
    <div class="col-4">
                  <div class="card dark-text">
                    <img class="card-img-top pack-img" src="https://rbase.zeaky.dev${dat.pack_img}" alt="Title">
                    <div class="card-body">
                      <h4 class="card-title">${dat.pack_name}</h4>
                      <p class="card-text">${dat.pack_description}</p>
                      <button type="button" class="btn btn-dark" name="pack_checkout">Checkout</button>
                    </div>
                  </div>
                </div>
    `;
    });
    document.querySelector("#funding_pack_carousel").innerHTML = c
    document.getElementsByName("pack_checkout").forEach((e)=>{
      e.addEventListener("click", ()=>{
        document.querySelector(".payment_modal").style.display = "block"
      })
    })
  });

let fbconf = {
  apiKey: "AIzaSyAEZ5uxDiFaBv9SjEP9AmQhJgYngow8cQI",
  authDomain: "radiant-account.firebaseapp.com",
  projectId: "radiant-account",
  storageBucket: "radiant-account.appspot.com",
  messagingSenderId: "608247348483",
  appId: "1:608247348483:web:12e9634c164138ddadfd36",
};
const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
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
        url: "https://rbase.zeakydev.repl.co/user/update_token",
        method: "POST",
        timeout: 0,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          user_id: user.uid,
          user_token: idToken,
        }),
      };

      $.ajax(settings).done(function (response) {
        fetch(
          "https://rbase.zeakydev.repl.co/user/" + user.uid + "/public_data"
        )
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            document
              .querySelector(".account")
              .getElementsByTagName("a")[0].href = "/account/account-manager";
            document
              .querySelector(".accountIcon")
              .getElementsByTagName("span")[0].innerHTML = data.username;
            Swal.fire(
              `Wellcome, ${data.username}!`,
              "R.Fund - Rasdium @2023",
              "success"
            );
          });
      });
    });
  } else {
    // If the user is not signed in, do nothing
  }
});

window.onresize = () => {
  let mws = document.getElementsByName("master_width");
  let sws = document.getElementsByName("slave_width");
  let rela_width_sizing = {};

  mws.forEach((ele) => {
    rela_width_sizing[ele.getAttribute("mw-id")] = ele.clientWidth + "px";
  });
  sws.forEach((ele) => {
    ele.style.width = rela_width_sizing[ele.getAttribute("mw-id")];
  });
};
window.onload = () => {
  let mws = document.getElementsByName("master_width");
  let sws = document.getElementsByName("slave_width");
  let rela_width_sizing = {};

  mws.forEach((ele) => {
    rela_width_sizing[ele.getAttribute("mw-id")] = ele.clientWidth + "px";
  });
  sws.forEach((ele) => {
    ele.style.width = rela_width_sizing[ele.getAttribute("mw-id")];
  });
};
