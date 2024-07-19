/*
;;; ___ ;;;
*/

//eval([]);

const root = document.getElementById("root");
const $sp1 = document.getElementById("sp1");

/**
 *
 * @param {Element} i
 */
function fadeIn(i) {
  i.classList.remove("hid");
  i.classList.add("fadeIn");
  // if (i.attributes?.next?.value == "sp3") return;
  window.titleEvent = root.addEventListener("click", () => {
    fadeOut(i);
  });
  i.addEventListener("animationend", () => {
    setTimeout(() => {
      fadeOut(i);
    }, 3000);
  });
}

/**
 *
 * @param {Element} i
 */
function fadeOut(i) {
  root.removeEventListener("click", window.titleEvent);
  i.classList.remove("fadeIn");
  i.classList.add("fadeOut");
  let next = i.attributes?.next?.value;
  if (!next) return;
  //i.classList.add("fadeOut");
  next = document.getElementById(next);
  //i.classList.add('hid');
  i.addEventListener("animationend", () => {
    if (next) {
      fadeIn(next);
    }
    //console.log(next);
  });
}

setTimeout(() => {
  fadeIn($sp1);
}, 500);
