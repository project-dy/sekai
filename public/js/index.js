/*
;;; ___ ;;;
*/

//eval([]);

const $1sp = document.getElementById('sp1');
const $2sp = document.getElementById('sp2');

/**
 * 
 * @param {Element} i 
 */
function fadeIn(i) {
  i.classList.remove('hid');
  i.classList.add('fadeIn');
  i.addEventListener('animationend', () => {
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
  let next = i.attributes.next.value;
  if (next == "sp3") {
    return;
  }
  next = document.getElementById(next);
  i.classList.remove('fadeIn');
  i.classList.add('fadeOut');
  //i.classList.add('hid');
  i.addEventListener('animationend', () => {
    if (next) {
      fadeIn(next);
    }
    //console.log(next);
  });
}

setTimeout(() => {
  fadeIn($1sp);
}, 500);