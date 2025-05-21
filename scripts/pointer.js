// Sparkle Mouse Trail Animation (Modern + Faster)
let colour = "random"; // Use any valid CSS color or "random"
const sparkles = 100;

let x = 0, y = 0, ox = 0, oy = 0;
let swide = window.innerWidth, shigh = window.innerHeight;
let sleft = 0, sdown = 0;

const tiny = [], star = [], starv = [], starx = [], stary = [], tinyx = [], tinyy = [], tinyv = [];

document.addEventListener("DOMContentLoaded", () => {
  for (let i = 0; i < sparkles; i++) {
    const t = createDiv(3, 3);
    t.style.visibility = "hidden";
    t.style.zIndex = "999";
    document.body.appendChild(t);
    tiny[i] = t;
    tinyv[i] = 0;

    const s = createDiv(5, 5);
    s.style.position = "absolute";
    s.style.visibility = "hidden";
    s.style.zIndex = "999";

    const l = createDiv(1, 5);
    const d = createDiv(5, 1);
    l.style.top = "2px";
    l.style.left = "0px";
    d.style.top = "0px";
    d.style.left = "2px";

    s.appendChild(l);
    s.appendChild(d);
    document.body.appendChild(s);
    star[i] = s;
    starv[i] = 0;
  }

  window.addEventListener("mousemove", mouseMove);
  window.addEventListener("scroll", setScroll);
  window.addEventListener("resize", setDimensions);

  setDimensions();
  sparkle();
});

function createDiv(height, width) {
  const div = document.createElement("div");
  div.style.position = "absolute";
  div.style.height = `${height}px`;
  div.style.width = `${width}px`;
  div.style.overflow = "hidden";
  return div;
}

function newColour() {
  const c = [255, Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)];
  c.sort(() => 0.5 - Math.random());
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}

function mouseMove(e) {
  x = e.pageX;
  y = e.pageY;
}

function setScroll() {
  sdown = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
  sleft = window.scrollX || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
}

function setDimensions() {
  swide = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  shigh = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
}

function sparkle() {
  if (Math.abs(x - ox) > 0.5 || Math.abs(y - oy) > 0.5) {
    ox = x;
    oy = y;

    let activated = 0;
    for (let c = 0; c < sparkles && activated < 3; c++) {
      if (!starv[c]) {
        star[c].style.left = `${(starx[c] = x)}px`;
        star[c].style.top = `${(stary[c] = y + sdown)}px`;
        star[c].style.clip = "rect(0px, 5px, 5px, 0px)";
        const color = colour === "random" ? newColour() : colour;
        star[c].children[0].style.backgroundColor = star[c].children[1].style.backgroundColor = color;
        star[c].style.visibility = "visible";
        starv[c] = 50;
        activated++;
      }
    }
  }

  for (let c = 0; c < sparkles; c++) {
    if (starv[c]) updateStar(c);
    if (tinyv[c]) updateTiny(c);
  }

  requestAnimationFrame(sparkle);
}

function updateStar(i) {
  if (--starv[i] === 25) star[i].style.clip = "rect(1px, 4px, 4px, 1px)";
  if (starv[i]) {
    stary[i] += 2 + Math.random() * 4;
    starx[i] += ((i % 5) - 2) / 5;
    if (stary[i] < shigh + sdown) {
      star[i].style.top = `${stary[i]}px`;
      star[i].style.left = `${starx[i]}px`;
    } else {
      star[i].style.visibility = "hidden";
      starv[i] = 0;
    }
  } else {
    tinyv[i] = 50;
    tiny[i].style.top = `${(tinyy[i] = stary[i])}px`;
    tiny[i].style.left = `${(tinyx[i] = starx[i])}px`;
    tiny[i].style.width = "2px";
    tiny[i].style.height = "2px";
    tiny[i].style.backgroundColor = star[i].children[0].style.backgroundColor;
    star[i].style.visibility = "hidden";
    tiny[i].style.visibility = "visible";
  }
}

function updateTiny(i) {
  if (--tinyv[i] === 25) {
    tiny[i].style.width = "1px";
    tiny[i].style.height = "1px";
  }
  if (tinyv[i]) {
    tinyy[i] += 2 + Math.random() * 4;
    tinyx[i] += ((i % 5) - 2) / 5;
    if (tinyy[i] < shigh + sdown) {
      tiny[i].style.top = `${tinyy[i]}px`;
      tiny[i].style.left = `${tinyx[i]}px`;
    } else {
      tiny[i].style.visibility = "hidden";
      tinyv[i] = 0;
    }
  } else {
    tiny[i].style.visibility = "hidden";
  }
}
