
let nextFrameButton = document.getElementsByName("frameNext");
let frameAnimation = document.querySelector(".animatedDisplay");
let descriptionDisplay = document.querySelector(".descriptionDisplay");
let formDisplay = document.querySelector(".formDisplay");
let frame_counter = 0;
let accountData = {
  name: "",
  email: "",
  password: "",
  story: "",
  tag: "",
  tel: "",
};
nextFrameButton.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    if (frame_counter == 0) {
      descriptionDisplay.style.display = "none";
      formDisplay.style.gridColumn = "1/ span 4";
    }
    let targetFrame = document.getElementById("fr" + String(frame_counter));
    let allowNext = false;
    frame_counter++;
    if (frame_counter > 8) {
      frame_counter = 8;
    }
    if (frame_counter > 1 && frame_counter <= 7) {
      console.log("Checking...");
      let frameInput =
        targetFrame.getElementsByTagName("input")[0] ||
        targetFrame.getElementsByTagName("textarea")[0];
      let inputTarget = targetFrame.getAttribute("inputTarget");
      let str = "";
      if (frameInput != undefined) {
        str = frameInput.value || "";
      }
      if (!containsHtmlScript(str)) {
        console.log(str)
        let regexCheckApprove = false;
        switch (inputTarget) {
          case "name":
            console.log("Skipped validate case: name");
            regexCheckApprove = true;
            accountData.name = str;
            break;
          case "mail":
            console.log("Case: mail");
            let regexr = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            regexCheckApprove = regexr.test(str);
            accountData.email = str;
            break;
          case "story":
            console.log("Case: story");
            if (str.trim().length < 1) {
              //   swal({
              //     title: "Wait a bit, are you sure to skip this step?",
              //     text: "Don't worry, you can write it soon!",
              //     icon: "warning",
              //     buttons: true,
              //     dangerMode: true,
              //   }).then((v) => {
              //     if (v) {
              //       console.log("Skipped");
              //       regexCheckApprove = true;
              //       console.log(regexCheckApprove);
              //     }
              //   });
              regexCheckApprove = confirm("Are you sure to skip it?");
            } else {
              accountData.story = str;
              regexCheckApprove = true;
            }
            break;
          case "tag":
            console.log("Case: tag");
            let counter = str.split(",").length;
            if (counter > 2) {
              regexCheckApprove = true;
              accountData.tag = str;
            }
            break;
          case "tel":
            console.log("Case: tel");
            let regextel = /^\+?(\d+)\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/;
            regexCheckApprove = regextel.test(str);
            accountData.tel = str;
            break;
          case "password":
            console.log("Case: pw");
            let regexpw =
              /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])([^ ]+){8,}$/;
            regexCheckApprove = regexpw.test(str);
            console.log("Regex result of pw: " + regexCheckApprove)
            if (regexCheckApprove) {
              accountData.password = str;
            }else{
              alert("Password is not match required!")
            }
            break;
          case "":
            alert("Something was wrong, page will refresh!")
            break
        }
        console.log(regexCheckApprove);
        if (!regexCheckApprove && inputTarget != "story") {
          swal({
            title:
              "Wait a bit, your input does not pass the validate, check it and try again!",
            text: "Don't worry, just change it!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          });
        }
        if (str.trim().length > 0 && regexCheckApprove) {
          console.log(str);
          allowNext = true;
        } else {
          allowNext = false;
          frame_counter--;
          if (regexCheckApprove && inputTarget != "story") {
            swal({
              title: "Wait a bit, your string seems empty!",
              text: "Try to change it, unless you won't be able to create account!",
              icon: "warning",
              dangerMode: true,
            });
          }
        }
      } else {
        allowNext = false;
        frame_counter--;
        swal({
          title:
            "Wait a bit, your string contains some unavailable characters!",
          text: "Try to change it, unless you won't be able to create account!",
          icon: "warning",
          dangerMode: true,
        });
      }
    } else {

      allowNext = true;
    }
    if (allowNext) {
      nextFrame = document.getElementById("fr" + String(frame_counter));
      frameAnimation.classList.add("load-animation");
      targetFrame.classList.add("frameDisable");
      targetFrame.classList.add("frameDark");
      console.log("waiting for animation...");
      $(".animatedDisplay").on(
        "webkitAnimationEnd oAnimationEnd msAnimationEnd animationend",
        function (e) {
          console.log("waiting to close animation...");
          targetFrame.classList.add("frame-hide");
          nextFrame.classList.remove("frame-hide");
          if (frame_counter - 1 == 7) {
            firebase
              .auth()
              .createUserWithEmailAndPassword(
                accountData.email,
                accountData.password
              )
              .then(function (user) {
                console.log("Account register complete", user);
                db.collection("users-data-public").add({
                  name: accountData.name,
                  email: accountData.email,
                  phone: accountData.tel,
                  story: accountData.story,
                  tag: accountData.tag,
                });
                swal({
                  title: "Your account is almost ready, login and complete the email >_<!",
                  text: "Wellcome to RFund comunity!",
                  icon: "success",
                }).then((e)=>{
                  window.open(window.location.origin + "/Account/account.html", "_self")
                });
              })
              .catch(function (error) {
                // Xử lý lỗi đăng ký
                swal({
                  title:
                    "Oops, we catch an error on creating account for you :(",
                  text: error.message,
                  icon: "error",
                  dangerMode: true,
                }).then((e)=>{
                  window.open(window.location.href, "_self")
                });
              });
          }
          if (this.classList.contains("animation-out")) {
            console.log("Closing anim-out");
            $(this).removeClass("animation-out"); //remove animation when done
            targetFrame.classList.remove("frameDisable");
            if(frame_counter == 7){
              frame_counter ++;
            }
          }
          setTimeout(
            () => {
              if (this.classList.contains("load-animation")) {
                console.log("Closing load-anim");
                $(this).removeClass("load-animation"); //remove animation when done
                $(this).addClass("animation-out");
                targetFrame.classList.remove("frameDark");
              }
            },
            500 //wait for 1sec for stable
          );
        }
      );
    }
  });
});

// account processing
function roa_validate(email, phone, password) {
  let regex_password =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  let tel_regex = /^\+?\d{2} \d{9}$/;
  let pw_b = regex_password.test(password.value); //Test password validate
  let tel_b = tel_regex.test(phone.value);
  console.log(pw_b, tel_b);
  return false;
}
function containsHtmlScript(input) {
  // Use the String.prototype.includes() method to check if the input includes any special characters
  return input.includes("<") || input.includes(">");
}
