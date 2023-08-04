function getElementHeightVisibility(element, percent, callback) {
    if (!element || !percent || !callback) {
      return;
    }
    if (typeof percent !== "number" || percent < 0 || percent > 100) {
      return;
    }
    if (typeof callback !== "function") {
      return;
    }
  
    let height = element.offsetHeight;
    let rect = element.getBoundingClientRect();
    let vh = window.innerHeight;
    let overlapHeight = Math.max(0, Math.min(rect.bottom, vh) - Math.max(rect.top, 0));
    let heightVisibilityRatio = (overlapHeight / height) * 100;
    if (heightVisibilityRatio >= percent) {
      callback(true, element);
    } else {
      callback(false, false);
    }
  }
  function lightOrDark(color) {
    if (color.match(/^rgb/)) {
      color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
      r = color[1];
      g = color[2];
      b = color[3];
    } 
    else {
      color = +("0x" + color.slice(1).replace( 
        color.length < 5 && /./g, '$&$&'
      )
               );
      r = color >> 16;
      g = color >> 8 & 255;
      b = color & 255;
    }
    hsp = Math.sqrt(
      0.299 * (r * r) +
      0.587 * (g * g) +
      0.114 * (b * b)
    );
    if (hsp>127.5) {
      return 'light';
    } 
    else {
      return 'dark';
    }
  }
function Track_element_color(callback_verify, element){
    if (!callback_verify && !element){
        return
    }
    
    let computedStyle = window.getComputedStyle(element,null);
    let color = computedStyle.getPropertyValue("background-color");
    Color_style = lightOrDark(color)
    let nav = document.querySelector(".navbar")
    nav.style.transition = "0.2s"
    nav.style.backgroundColor = color
    let element_color_change_targets = document.getElementsByName("nav_color_track")
    if(Color_style == "dark"){
        element_color_change_targets.forEach((ele)=>{
            ele.style.color = "white"
        })
    }else{
        element_color_change_targets.forEach((ele)=>{
            
            ele.style.color = "black"
        })
    }
}
let Track_element = document.querySelectorAll(".nav_color_tracking")

window.onscroll = ()=>{
  console.log("Nav_process")
  if(Track_element.length > 0){
    Track_element.forEach((element)=>{
      getElementHeightVisibility(element, 60, Track_element_color)        
    })    
  }else{
    let nav = document.querySelector(".navbar")
    nav.style.backgroundColor = "white"
  }
    
}


window.onload = ()=>{
  if(Track_element.length > 0){
    Track_element.forEach((element)=>{
      getElementHeightVisibility(element, 60, Track_element_color)        
    })    
  }else{
    let nav = document.querySelector(".navbar")

    nav.style.backgroundColor = "white"
  }
  let navbar_holder = document.querySelector(".navbar-placehold")
  let navbar = document.querySelector(".navbar")
  console.log("Navbar system loading")
  if(navbar_holder){
    navbar_holder.style.height = navbar.clientHeight + "px"
      navbar_holder.style.width = navbar.clientWidth + "px"
    window.onresize = ()=>{
      navbar_holder.style.height = navbar.clientHeight + "px"
      navbar_holder.style.width = navbar.clientWidth + "px"
  }
}

}