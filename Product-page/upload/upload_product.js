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

// Rbase blog writter extended code
let limitation = {};
function elementAdd(html, parent) {
  const placeholder = document.createElement("div");
  placeholder.insertAdjacentHTML("afterbegin", html);
  const node = placeholder.firstElementChild;
  parent.appendChild(node);
}
let blog_tools = document.querySelector(".tools").childNodes;
console.log(blog_tools);
let tools = {
  "tools.heading": {
    template: "<{attr0}>{input1}</{attr0}>",
    attr: [["h2", "h3", "h4", "h5", "h6"]],
    input: ["Text", "Sellect|attr0"],
    enable_input: true,
  },
  "tools.paragraph": {
    template: "<p>{textarea1}</p>",
    input: ["TextArea"],
    enable_input: true,
  },
  "tools.image": {
    template: `<img width="{input2}{attr0}" height="{input3}{attr1}" src="{input1}" class="bl_{attr2}"></img>`,
    attr: [
      ["px", "%", "rem", "rex"],
      ["px", "%", "rem", "rex"],
      ["img-contain", "img-fit", "img-cover", "scale-down"],
    ],
    input: [
      "Text",
      "Number",
      "Sellect|attr0",
      "Number",
      "Sellect|attr1",
      "Sellect|attr2",
    ],
    enable_input: true,
    file_input: true,
  },
  "tools.link": {
    template: `<a href="{input1}">{input2}</a>`,
    input: ["Text", "Text"],
    enable_input: true,
  },
  "tools.spacer": {
    template: `<div style="height:{input1}{attr0};width:100%;"></div>`,
    attr: [["px", "%", "rem", "rex"]],
    input: ["Number", "Sellect|attr0"],
    enable_input: true,
  },
  "tools.grid-view": {
    disabled: true,
  },
  "tools.master_tool": {
    tool_role: "master",
    attr_label: ["Choose a tool below (master tool)"],
    attr: [["place_holder", "Delete", "Center", "Left", "Right"]],
  },
};
let using_master_tool = false;
let current_master_tool = "";
let master_tool_direct_root = undefined;
let toggle_editor = true;

blog_tools.forEach((tool) => {
  tool.addEventListener("click", (e) => {
    console.log(`trigger: ${tool.id}`);
    if (
      (tool.id != "tools.toggle-editor") &
      (toggle_editor == true) &
      (tool.id != "tools.master_tool")
    ) {
      console.log("Loading trigger...");
      console.log(tools[tool.id]);
      let trigger = tools[tool.id];
      let trigger_data = {
        txt_area_ind: 1,
      };
      if (tool.id != "e.logo") {
        if (trigger.hasOwnProperty("enable_input")) {
          let index = 1;
          let template_cache = trigger.template || "";
          let temp = `
          <form id="om-form-master" class="center">
            {master}
              
            </form>`;
          let master = "";
          trigger.input.forEach((type) => {
            if (type == "Text") {
              master += `
              <div class="formInput">
                <p for="input${index}">{input${index}}:</p>
                <input type="text" id="input${index}">  
              </div>`;
              index += 1;
            }
            if (type == "TextArea") {
              master += `
              <div class="formInput">
                <p for="textarea${trigger_data.txt_area_ind}">{TextArea${trigger_data.txt_area_ind}}:</p>
                <textarea type="text" id="textarea${trigger_data.txt_area_ind}" cols="30" rows="10"> </textarea>  
              </div>`;
              index += 1;
            }
            if (type == "Number") {
              master += `
              <div class="formInput">
                <p for="input${index}">{input${index}}:</p>
                <input type="number" id="input${index}">  
              </div>`;
              index += 1;
            }
            if (type.split("|")[0] == "Sellect") {
              console.log("Loading: " + type);
              let attr_t = type.split("|")[1];
              let placed_ind = Number(attr_t.replace("attr", ""));
              let outer = `
              <div class="formInput">
                <p>{Select${type.split("|")[1]}}:</p>
                <div class="mb-3" >
                  <select value="${trigger.attr[placed_ind][0]}" for="${
                type.split("|")[1]
              }" class="form-select form-select-lg" name="" id="select${
                type.split("|")[1]
              }">
                    {master}
                  </select> 
                </div>
              </div>
              `;
              let _master = "";
              console.log(trigger.attr[placed_ind]);
              trigger.attr[placed_ind].forEach((inp) => {
                _master += `<option value="${inp}">${inp}</option>`;
                console.log(_master);
              });
              console.log(attr_t);
              template_cache = template_cache.replaceAll(
                `{${attr_t}}`,
                trigger.attr[placed_ind][0]
              );
              console.log(template_cache);
              outer = outer.replace("{master}", _master);
              master += outer;
            }
          });

          let preview_cont = `"${template_cache}"

          `;

          document.querySelector(".preview_element").innerHTML = "";
          elementAdd(preview_cont, document.querySelector(".preview_element"));
          master = temp.replace("{master}", master);
          document.querySelector(".om-form").innerHTML = "";
          elementAdd(master, document.querySelector(".om-form"));
          document.querySelector(".om-bg").classList.remove("hide");
          document.querySelector(".om-bg").classList.add("show");
          document
            .querySelector("#om-form-master")
            .setAttribute("editing_element", tool.id);
          document
            .querySelector("#om-form-master")
            .addEventListener("submit", (e) => {
              e.preventDefault();
            });
          function reload_inp() {
            let container = document.querySelector("#om-form-master");
            let template_cache_m = template_cache;
            container.childNodes.forEach((p) => {
              p.childNodes.forEach((e) => {
                if (e.tagName == "INPUT") {
                  console.log(e.tagName);
                  console.log("Changed");
                  template_cache = template_cache.replaceAll(
                    `{${e.id}}`,
                    e.value
                  );
                } else if (e.tagName == "TEXTAREA") {
                  console.log(e.tagName);
                  console.log("Changed");
                  template_cache = template_cache.replaceAll(
                    `{${e.id}}`,
                    e.value.replaceAll("\n", "<br>")
                  );
                }
              });
            });
            document.querySelector(".preview_element").innerHTML =
              template_cache;
            template_cache = template_cache_m;
          }
          document
            .querySelector("#om-form-master")
            .addEventListener("change", (e) => {
              console.log("Changed");
              let container = document.querySelector("#om-form-master");
              let template_cache_m = template_cache;
              template_cache = trigger.template;
              container.childNodes.forEach((p) => {
                p.childNodes.forEach((t) => {
                  t.childNodes.forEach((c) => {
                    console.log(c);
                    if (c.tagName == "SELECT") {
                      console.log(trigger.template);
                      console.log(c.getAttribute("for"));
                      template_cache = template_cache.replaceAll(
                        `{${c.getAttribute("for")}}`,
                        c.value
                      );
                    }
                  });
                });
              });
              document.querySelector(".preview_element").innerHTML =
                template_cache;
              console.log(template_cache);
              reload_inp();
            });
          document
            .querySelector("#om-form-master")
            .addEventListener("keyup", (e) => {
              reload_inp();
            });
        }
      }
    } else {
      if (
        (tool.id != "tools.toggle-editor") &
        (tool.id != "tools.master_tool")
      ) {
        console.log("Error:_toggle_editor=false");
        Swal.fire(
          "Error_Failed",
          `You can't add an element while editor is disabled`,
          "error"
        );
      } else if (tool.id == "tools.toggle-editor") {
        toggle_editor = !toggle_editor;
        if (!toggle_editor) {
          document.querySelector(".webpage_viewer").classList.add("non-select");
        } else {
          document
            .querySelector(".webpage_viewer")
            .classList.remove("non-select");
        }
      } else if (tool.id == "tools.master_tool" && !toggle_editor) {
        let trigger = tools["tools.master_tool"]; //master_tool data
        let outer = `
          <form id="om-form-master" class="center">

          <div class="formInput">
                <p>${trigger.attr_label[0]}</p>
                <div class="mb-3" >
                <select class="form-select form-select-lg" name="" id="master_tool_trigger" value="${trigger.attr[0][0]}>
                  {master}
                </select>
                </div>
              </div>
              </form>
          `;

        let inner = "";
        trigger.attr[0].map((a) => {
          inner += `<option value="${a}">${a}</option> \n`;
        });
        console.log(inner);
        outer = outer.replaceAll("{master}", inner);
        document.querySelector(".preview_element").innerHTML = "";
        document.querySelector(".om-form").innerHTML = "";
        elementAdd(outer, document.querySelector(".om-form"));
        document.querySelector(".om-bg").classList.remove("hide");
        document.querySelector(".om-bg").classList.add("show");
        console.log(document.querySelector("#om-form-master"));
        document
          .querySelector("#om-form-master")
          .setAttribute("editing_element", tool.id);
        document
          .querySelector("#om-form-master")
          .addEventListener("submit", (e) => {
            e.preventDefault();
          });
      } else if (tool.id == "tools.master_tool" && toggle_editor) {
        Swal.fire(
          "Error|master_tool",
          "You can't use master tool while turned of editor",
          "error"
        );
      }
    }
  });
});
document.querySelector(".webpage_viewer").addEventListener("mousemove", (e) => {
  console.log("Hoveron");
  if (!toggle_editor) {
    if (e.target.parentNode == document.querySelector(".webpage_viewer")) {
      e.target.style.border = "1px solid blue";
      e.target.style.cursor = "pointer";
      e.target.setAttribute("blg-hoveron", "true");
      e.target.addEventListener("mouseleave", (p) => {
        p.target.setAttribute("blg-hoveron", "false");
        p.target.style.border = "none";
        p.target.style.cursor = "default";
      });
      e.target.addEventListener("click", (c) => {
        if (c.target.getAttribute("blg-hoveron") == "true") {
          master_tool_direct_root = c.target;
          document.getElementById("tools.master_tool").click();
        }
      });
    }
  } else {
    if (e.target.parentNode == document.querySelector(".webpage_viewer")) {
      e.target.style.border = "none";
      e.target.style.cursor = "default";
    }
  }
});

document.querySelector(".webpage_viewer").addEventListener("click", (e) => {
  if (!toggle_editor && using_master_tool) {
    if (e.target.parentNode == document.querySelector(".webpage_viewer")) {
      if (e.target.classList.contains("left")) {
        e.target.classList.remove("left");
      } else if (e.target.classList.contains("right")) {
        e.target.classList.remove("right");
      } else if (e.target.classList.contains("center")) {
        e.target.classList.remove("center");
        e.target.classList.remove("center-left");
      }
      switch (current_master_tool) {
        case "Delete":
          e.target.remove();
          break;
        case "Center":
          e.target.classList.add("center");
          e.target.classList.add("center-left");
          break;
        case "Left":
          e.target.classList.add("left");
          break;
        case "Right":
          e.target.classList.add("right");
          break;
      }

      e.target.style.border = "none";
      e.target.style.cursor = "default";
      using_master_tool = false;
    }
  } else if (!toggle_editor && using_master_tool) {
  }
});
document.querySelector("#om-form-complete").addEventListener("click", (e) => {
  if (toggle_editor && !using_master_tool) {
    document.querySelector(".om-bg").classList.add("hide");
    document.querySelector(".om-bg").classList.remove("show");
    document
      .querySelector(".preview_element")
      .childNodes[0].setAttribute(
        "type_const",
        document
          .querySelector("#om-form-master")
          .getAttribute("editing_element")
      );
    elementAdd(
      document.querySelector(".preview_element").innerHTML,
      document.querySelector(".webpage_viewer")
    );
  } else {
    document.querySelector(".om-bg").classList.add("hide");
    document.querySelector(".om-bg").classList.remove("show");
    if (master_tool_direct_root == undefined) {
      let trigger = document.querySelector("#master_tool_trigger");
      let tool_n = trigger.value;
      current_master_tool = tool_n;
      using_master_tool = true;
    } else {
      let trigger = document.querySelector("#master_tool_trigger");
      let tool_n = trigger.value;
      let e = { target: master_tool_direct_root };
      if (e.target.classList.contains("left")) {
        e.target.classList.remove("left");
      } else if (e.target.classList.contains("right")) {
        e.target.classList.remove("right");
      } else if (e.target.classList.contains("center")) {
        e.target.classList.remove("center");
        e.target.classList.remove("center-left");
      }
      switch (tool_n) {
        case "Delete":
          e.target.remove();
          break;
        case "Center":
          e.target.classList.add("center");
          e.target.classList.add("center-left");
          break;
        case "Left":
          e.target.classList.add("left");
          break;
        case "Right":
          e.target.classList.add("right");
          break;
      }

      e.target.style.border = "none";
      e.target.style.cursor = "default";
      using_master_tool = false;
    }
  }

  // switch () {
  //   case "tools.heading":

  //     break;
  //   case "tools.image":
  //     break;
  //   case "tools.link":
  //     break;
  //   case "tools.spacer":
  //     break;
  // }
});
document.querySelector("#om-form-disable").addEventListener("click", (e) => {
  document.querySelector(".om-bg").classList.add("hide");
  document.querySelector(".om-bg").classList.remove("show");
  document.querySelector(".om-form").innerHTML = "";
});

// PACK_CREATE_FUNC

let pack_data = {
  total_pack: 0,
  allPack: [],
};

document.querySelector("#pack_img_upload").addEventListener("change", (e) => {
  console.log(document.querySelector("#pack_img_upload").value);
  var src = URL.createObjectURL(e.target.files[0]);
  document.querySelector("#img_pack_preview").src = src;
});
document.querySelector("#pack_form_master").addEventListener("submit", (e) => {
  e.preventDefault();
  pack_data.total_pack += 1;
  pack_data.allPack.push({
    pack_id: `pack_${pack_data.total_pack}`,
    Pack_img: document.querySelector("#img_pack_preview").src,
    Pack_name: document.querySelector("#pack_name").value,
    Pack_description: document.querySelector("#pack_des").value,
    Pack_price: document.querySelector("#pack_price").value,
  });
  elementAdd(
    `<div class="col-4 preview_pack_card">
        <div class="card">
          <img src="${
            document.querySelector("#img_pack_preview").src
          }" class="img-fit center center-left"  alt="" width="90%" height="200px" style="border: 1px solid black; aspect-ratio: 1/1; width: 100%; border-radius: inherit;">
          <div class="card-body" style="padding: 5px;">
            <h4 class="card-title">${
              document.querySelector("#pack_name").value
            }</h4>
            <p class="card-text">${
              document.querySelector("#pack_des").value
            }</p>
            <p class="card-text">Price: ${formatter.format(
              document.querySelector("#pack_price").value
            )}</p>
            <button type="button" class="btn btn-danger center center-left pack_del" style="width: 100%; height: 2rem;" pack="${
              pack_data.total_pack
            }" id="del_pack_${pack_data.total_pack}" >Delete</button>
          </div>
        </div>
      </div>`,
    document.querySelector("#pack_preview")
  );
  document
    .querySelector(`#del_pack_${pack_data.total_pack}`)
    .addEventListener("click", (e) => {
      let ind = 0;
      let pack_data_clone = pack_data;
      pack_data.allPack.forEach((c) => {
        if (c.pack_id == `pack_${e.target.getAttribute("pack")}`) {
          pack_data.allPack.splice(ind, 1);
          console.log("del");
          console.log(ind);
          console.log(pack_data.allPack);
        }
        ind++;
      });
      console.log(pack_data);
      e.target.parentNode.parentNode.parentNode.remove();
    });
});

let current_heading_img_ind = 0;
document.querySelector("#Heading_image").addEventListener("change", (e) => {
  var src = URL.createObjectURL(e.target.files[0]);
  let indi = ""
  let img = ""
  if(current_heading_img_ind == 0){
    indi = `<li data-bs-target="#Media_preview_carousel" class="active" data-bs-slide-to="${current_heading_img_ind}"></li>`;
     img = `
    <div class="carousel-item active" >
                          <img class="img-fit heading-img" src="${src}" alt="">
                        </div>`;
  }else{
    indi = `<li data-bs-target="#Media_preview_carousel" class="" data-bs-slide-to="${current_heading_img_ind}"></li>`;

     img = `
  <div class="carousel-item" >
                        <img class="img-fit heading-img" src="${src}" alt="">
                      </div>`;
  }
  
  elementAdd(indi, document.querySelector("#carousel_img_indi"));
  elementAdd(img, document.querySelector("#carousel_img_head"));
  console.log("Added heading img")
  current_heading_img_ind += 1;
});


document.querySelector("#profile-tab").addEventListener("click", (e)=>{
  console.log("Loading card view")
  let html = `<div class="card space-10px col-4">
      <div class="card-cover-layer">
        <button type="button" class="btn btn-dark">Checkout</button>
      </div>
      <img class="card-img-top" src="${document.querySelector(".heading-img").src || ""}" alt="Title">
      <div class="card-body">
        <h4 class="card-title">${document.querySelector("#Heading").value}</h4>
        <p class="card-text">
          ${document.querySelector("#Project-description").value}
        </p>
        <p class="pricing">
        <div class="progress" style="height: inherit;">
        <div class="progress-bar bg-dark" role="progressbar" style="width:1%; padding: 5px;"
            aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">${0}%</div>
        </div>                
        <strong><p>${formatter.format(0)} / ${formatter.format(document.querySelector("#target_price").value)}</p></strong>
        </p>
      </div>
      </div>`
      document.querySelector(".card_viewer").innerHTML = ""
      document.querySelector(".card_viewer").innerHTML = html
})