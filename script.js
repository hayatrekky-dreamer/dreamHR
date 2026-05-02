document.addEventListener("DOMContentLoaded", function(){

/* =========================
   🎵 MUSIC (FIX CLEAN)
========================== */
const music = document.getElementById("music");
const btn = document.getElementById("musicBtn");
let isPlaying = false;

window.toggleMusic = function(){
  if(!music) return;

  if(isPlaying){
    music.pause();
    btn.innerText = "🔇";
  } else {
    music.play().then(()=> {
      btn.innerText = "🔊";
    }).catch(()=>{});
  }
  isPlaying = !isPlaying;
}

// 👉 CONNECT BUTTON
if(btn){
  btn.addEventListener("click", toggleMusic);
}

/* =========================
   💌 OPEN INVITATION
========================== */
window.openInvitation = function () {
  const cover = document.querySelector(".cover");
  const content = document.getElementById("content");
  const hero = document.querySelector(".hero");
  const bg = document.querySelector(".bg-fixed");

if(bg){
  bg.style.backgroundImage = "url('assets/bg-web.webp')";
}
  cover.classList.add("hide");

  setTimeout(() => {

    document.body.classList.add("opened");
    cover.style.display = "none";
    content.style.display = "block";

    window.scrollTo({ top: 0 });

    // 🎬 GSAP ANIMATION
    const tl = gsap.timeline();

    tl.fromTo(".bg-anim",
      { opacity: 0 },
      { opacity: 1, duration: 2 }
    )
    .fromTo(".fog",
      { opacity: 0 },
      { opacity: 0.5, duration: 3 },
      "-=1.5"
    )
    .fromTo(".pohon",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 2 },
      "-=2"
    )
    .fromTo(".rumah-anim",
      { scale: 0.6, opacity: 0, y: 50 },
      { scale: 1, opacity: 1, y: 0, duration: 1.5 },
      "-=1.5"
    );

    // 🌳 LOOP
    gsap.to(".pohon", {
      rotate: 2,
      duration: 3,
      yoyo: true,
      repeat: -1
    });

    gsap.to(".fog-1", {
      x: "-50%",
      duration: 60,
      repeat: -1,
      ease: "linear"
    });

    gsap.to(".fog-2", {
      x: "50%",
      duration: 80,
      repeat: -1,
      ease: "linear"
    });

    // 🎵 AUTO PLAY (LEGAL karena user klik)
    if (music) {
      music.volume = 0.5;
      music.play().then(() => {
        isPlaying = true;
        btn.innerText = "🔊";
      }).catch(()=>{});
    }

    // AUTO SCROLL
    setTimeout(() => {
      hero?.scrollIntoView({ behavior: "smooth" });
    }, 6000);

  }, 800);
};

/* =========================
   👤 NAMA TAMU
========================== */
const target = document.getElementById("guestName");

if(target){
  const params = new URLSearchParams(window.location.search);
  let guest = params.get("to") || "Tamu Undangan";

  let i = 0;
  function typeWriter(){
    if(i < guest.length){
      target.innerHTML += guest.charAt(i);
      i++;
      setTimeout(typeWriter, 50);
    }
  }
  typeWriter();
}

/* =========================
   ✨ SPARKLE
========================== */
setInterval(()=>{
  const container = document.getElementById("sparkle-container");
  if(!container) return;

  const el = document.createElement("div");
  el.className = "sparkle";

  el.style.left = Math.random()*100+"%";
  el.style.top = Math.random()*100+"%";

  container.appendChild(el);
  setTimeout(()=> el.remove(), 2000);
}, 500);

/* =========================
   ⏳ COUNTDOWN
========================== */
const targetDate = new Date("June 26, 2026 09:00:00").getTime();

const countdown = setInterval(()=>{
  const now = Date.now();
  let gap = targetDate - now;

  // 🔥 STOP kalau sudah lewat
 if(gap <= 0){
  clearInterval(countdown);

  document.querySelector(".countdown").innerHTML = 
    "✨ Acara Sedang Berlangsung / Telah Selesai";
  
  return;
}

  const d = Math.floor(gap/(1000*60*60*24));
  const h = Math.floor((gap/(1000*60*60))%24);
  const m = Math.floor((gap/(1000*60))%60);
  const s = Math.floor((gap/1000)%60);

  const format = n => n < 10 ? "0"+n : n;

  document.getElementById("days").innerText = format(d);
  document.getElementById("hours").innerText = format(h);
  document.getElementById("minutes").innerText = format(m);
  document.getElementById("seconds").innerText = format(s);

},1000);
/* =========================
   ✨ SCROLL ANIMATION (FIX SINGLE)
========================== */
const observer = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add("show");
    }
  });
},{threshold:0.2});

document.querySelectorAll(".fade, .fade-up").forEach(el => observer.observe(el));

/* =========================
   🧭 MAP
========================== */
window.openNavigation = function(){
  const dest = "-0.8047586,100.6853504";
  window.open(`https://www.google.com/maps/dir/?api=1&destination=${dest}`);
}

/* =========================
   💬 RSVP
========================== */
const sheetURL = "https://script.google.com/macros/s/AKfycbxT4iS4Qb6LHWsjJ9GvrweeWwZLk-aGiaypGLEdPC2qDBXo5JYxmViFDugyqeVEVxi9/exec";
const form = document.getElementById("rsvpForm");

if(form){
  form.addEventListener("submit", e=>{
    e.preventDefault();

    const data = new FormData(form);
    const status = document.getElementById("status");
    status.innerText = "Mengirim...";

    fetch(sheetURL,{method:"POST",mode:"no-cors",body:data})
    .then(()=>{
      status.innerText = "Terkirim ❤️";
      form.reset();
      setTimeout(loadUcapan,2000);
    })
    .catch(()=> status.innerText = "Gagal 😢");
  });
}

/* =========================
   📥 LOAD UCAPAN
========================== */
function loadUcapan(){
  fetch(sheetURL)
    .then(res=>res.json())
    .then(data=>{
      const list = document.getElementById("listUcapan");
      const judul = document.getElementById("judulUcapan");

      if(!data || !list) return;

      list.innerHTML = "";
      judul.innerHTML = `Ucapan Tamu<br> (${data.length} Ucapan)`;

      data.reverse().forEach(item=>{
        const div = document.createElement("div");
        div.className="chat-bubble chat-left";
        div.innerHTML=`
          <div class="chat-name">${item.nama}</div>
          <div class="chat-text">${item.ucapan}</div>
        `;
        list.appendChild(div);
      });
    })
    .catch(()=>{});
}

setTimeout(loadUcapan,500);
setInterval(loadUcapan,80000);

/* =========================
   💍 SLIDER (CLEAN)
========================== */
/* =========================
   💍 SLIDER PREMIUM + AUTO PAUSE
========================= */

const slider = document.querySelector(".slider-wrapper");
const slides = document.querySelectorAll(".slide");

let currentIndex = 0;
let autoSlide = null;
let startX = 0;
let isDown = false;
let isSwiping = false;
let isVisible = true;

/* =========================
   🎯 UPDATE SLIDE
========================= */
function updateSlide(){
  slides.forEach((s,i)=>{
    s.classList.toggle("active", i === currentIndex);
  });

  if(slider){
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
  }
}

/* =========================
   ▶️ START AUTO SLIDE
========================= */
function startAutoSlide(){
  if(autoSlide || !isVisible) return;

  autoSlide = setInterval(()=>{
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlide();
  }, 10000); // 👉 25 detik (ubah kalau mau)
}

/* =========================
   ⏸️ STOP AUTO SLIDE
========================= */
function stopAutoSlide(){
  clearInterval(autoSlide);
  autoSlide = null;
}

/* =========================
   📱 TOUCH (HP)
========================= */
if(slider){

  slider.addEventListener("touchstart", e=>{
    startX = e.touches[0].clientX;
    isSwiping = false;
    stopAutoSlide(); // pause saat disentuh
  });

  slider.addEventListener("touchmove", ()=>{
    isSwiping = true;
  });

  slider.addEventListener("touchend", e=>{
    if(!isSwiping){
      startAutoSlide();
      return;
    }

    let endX = e.changedTouches[0].clientX;
    let diff = startX - endX;

    if(diff > 50){
      currentIndex = (currentIndex + 1) % slides.length;
    } else if(diff < -50){
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    }

    updateSlide();
    startAutoSlide();
  });

/* =========================
   🖱️ DRAG (DESKTOP)
========================= */
  slider.addEventListener("mousedown", e=>{
    isDown = true;
    startX = e.clientX;
    stopAutoSlide();
  });

  slider.addEventListener("mouseup", e=>{
    if(!isDown) return;
    isDown = false;

    let diff = startX - e.clientX;

    if(diff > 50){
      currentIndex = (currentIndex + 1) % slides.length;
    } else if(diff < -50){
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    }

    updateSlide();
    startAutoSlide();
  });

}

/* =========================
   👁️ AUTO PAUSE (HEMAT PERFORMA)
========================= */
const sliderSection = document.querySelector(".mempelai-slider");

if(sliderSection){
  const observer = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        isVisible = true;
        startAutoSlide();
      } else {
        isVisible = false;
        stopAutoSlide();
      }
    });
  }, { threshold: 0.3 }); // muncul 30% baru aktif

  observer.observe(sliderSection);
}

/* =========================
   🚀 INIT
========================= */
updateSlide();
startAutoSlide();

});

document.addEventListener("DOMContentLoaded", function(){

/* =========================
   🖼️ GALLERY SWIPE FULL
========================= */

const modal = document.getElementById("galleryModal");
const modalImg = document.getElementById("modalImg");
const closeBtn = document.getElementById("closeModal");
const images = document.querySelectorAll(".gallery-img");

let currentIndex = 0;

// OPEN
images.forEach((img, index) => {
  img.addEventListener("click", () => {
    modal.classList.add("active");
    currentIndex = index;
    showImage();
  });
});

// SHOW IMAGE
function showImage(){
  modalImg.src = images[currentIndex].src;
}

// NEXT / PREV
function next(){
  currentIndex = (currentIndex + 1) % images.length;
  showImage();
}

function prev(){
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  showImage();
}

// CLOSE BUTTON
if(closeBtn){
  closeBtn.addEventListener("click", () => {
    modal.classList.remove("active");
  });
}

// CLICK OUTSIDE (lebih aman)
modal.addEventListener("click", (e) => {
  if(e.target === modal){
    modal.classList.remove("active");
  }
});


/* =========================
   📱 SWIPE (HP)
========================= */

let startX = 0;
let endX = 0;

modalImg.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
}, { passive: true });

modalImg.addEventListener("touchend", (e) => {
  endX = e.changedTouches[0].clientX;

  if(startX - endX > 50){
    next();
  } else if(endX - startX > 50){
    prev();
  }
});


/* =========================
   🖱️ DRAG (DESKTOP)
========================= */

let isDragging = false;

modalImg.addEventListener("mousedown", (e) => {
  isDragging = true;
  startX = e.clientX;
});

modalImg.addEventListener("mouseup", (e) => {
  if(!isDragging) return;

  endX = e.clientX;

  if(startX - endX > 50){
    next();
  } else if(endX - startX > 50){
    prev();
  }

  isDragging = false;
});

// tambahan biar smooth
modalImg.addEventListener("mouseleave", () => {
  isDragging = false;
});

});


document.querySelectorAll(".btn-copy").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    const no = btn.dataset.rek;

    navigator.clipboard.writeText(no).then(()=>{
      btn.innerText = "Tersalin ✔️";

      setTimeout(()=>{
        btn.innerText = "Salin Nomor";
      }, 2000);
    });
  });
});