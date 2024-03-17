const ratingVal = document.getElementById("rating-val");

function ratingChangeHandler(val) {
  console.log("In Handler");
  console.log(val);
  ratingVal.innerHTML = val;
  if (val == 5) {
    ratingVal.style.color = "limegreen";
  } else if (val == 1) {
    ratingVal.style.color = "red";
  } else {
    ratingVal.style.color = "black";
  }
}

function alertCancelHandler() {
  console.log("Cancel Button Clicked");
  const alert = document.getElementsByClassName("alert")[0];
  alert.classList.add("removeAlert");
}

let filter = document.querySelectorAll(".filter");
function rightClickHandler() {
  console.log("Right button clicked");
  for (let i = 0; i < filter.length; i++) {
    filter[i].classList.add("transNegative");
  }
  document.querySelector(".fa-circle-chevron-right").style.visibility =
    "hidden";
  document.querySelector(".fa-circle-chevron-left").style.visibility =
    "visible";
}

function leftClickHandler() {
  console.log("Left button clicked");

  for (let i = 0; i < filter.length; i++) {
    filter[i].classList.remove("transNegative");
  }
  document.querySelector(".fa-circle-chevron-right").style.visibility =
    "visible";
  document.querySelector(".fa-circle-chevron-left").style.visibility = "hidden";
}

const gstData = document.querySelectorAll(".gstData");
const btn = document.querySelector(".post-nav-btn-back");

function postNavClickHandler() {
  console.log("Clicked");
  btn.classList.toggle("postNavBtnTran");

  console.log(gstData[0].style.display);

  if (gstData[0].style.display === "none" || !gstData[0].style.display) {
    for (let i = 0; i < gstData.length; i++) {
      gstData[i].style.display = "inline";
    }
  } else {
    for (let i = 0; i < gstData.length; i++) {
      gstData[i].style.display = "none";
    }
  }
}
