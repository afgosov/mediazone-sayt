/* Mediazone sayti — umumiy skript: sarlavha, mobil menyu, pastki qism, paydo bo'lish */
(function () {
  var C = window.MZ || {};
  var page = document.body.getAttribute("data-page") || "";
  var ARROW = '<svg class="arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  window.MZ_ARROW = ARROW;

  var NAV = [
    { id: "studio", href: "studio.html", t: "Studiya", s: "5 ta xona" },
    { id: "production", href: "production.html", t: "Production", s: "Reels, montaj" },
    { id: "podcast", href: "podcast.html", t: "Podkast", s: "va jonli efir" },
    { id: "marketing", href: "marketing.html", t: "Marketing", s: "Performance" },
    { id: "academy", href: "academy.html", t: "Academy", s: "Shogirdlik" },
    { id: "aloqa", href: "aloqa.html", t: "Aloqa", s: "Bron" }
  ];

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function cur(id) { return id === page ? ' aria-current="page"' : ""; }

  /* ---- sarlavha ---- */
  var hdr = document.getElementById("hdr");
  if (hdr) {
    var links = NAV.map(function (n) { return '<a href="' + n.href + '"' + cur(n.id) + ">" + n.t + "</a>"; }).join("");
    var mlinks = NAV.map(function (n) { return '<a class="ml" href="' + n.href + '"' + cur(n.id) + ">" + n.t + "<small>" + n.s + "</small></a>"; }).join("");
    hdr.className = "hdr";
    hdr.innerHTML =
      '<div class="wrap">' +
        '<a class="brand" href="index.html" aria-label="Mediazone — bosh sahifa"><img src="assets/brand/logo_gorizontal_rangli.svg" alt="mediazone" width="160" height="59"></a>' +
        '<nav class="nav" aria-label="Asosiy menyu">' + links + "</nav>" +
        '<div class="hdr-cta">' +
          (C.phone ? '<a class="btn btn-line btn-sm btn-tel" href="tel:' + esc(C.phoneHref || C.phone) + '">' + esc(C.phone) + "</a>" : "") +
          '<a class="btn btn-terra btn-sm" href="aloqa.html#bron">Bron qilish</a>' +
          '<button class="burger" type="button" aria-label="Menyuni ochish" aria-expanded="false" aria-controls="mnav"><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 6h14M3 14h14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></button>' +
        "</div>" +
      "</div>";
    // menyu sarlavhadan tashqarida: sarlavhadagi backdrop-filter fixed elementni o'ziga qamab qo'yadi
    var mnav = document.createElement("div");
    mnav.className = "mnav"; mnav.id = "mnav";
    mnav.innerHTML = mlinks +
        '<div class="mfoot">' +
          (C.phone ? '<a class="btn btn-line" href="tel:' + esc(C.phoneHref || C.phone) + '">' + esc(C.phone) + "</a>" : "") +
          '<a class="btn btn-terra" href="aloqa.html#bron">Bron qilish</a>' +
        "</div>";
    hdr.insertAdjacentElement("afterend", mnav);

    var burger = hdr.querySelector(".burger");
    var OPEN = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 6h14M3 14h14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
    var CLOSE = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5 5l10 10M15 5 5 15" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
    function setMenu(open) {
      mnav.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.setAttribute("aria-label", open ? "Menyuni yopish" : "Menyuni ochish");
      burger.innerHTML = open ? CLOSE : OPEN;
      document.body.style.overflow = open ? "hidden" : "";
    }
    burger.addEventListener("click", function () { setMenu(!mnav.classList.contains("open")); });
    mnav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && mnav.classList.contains("open")) { setMenu(false); burger.focus(); } });
    window.addEventListener("resize", function () { if (window.innerWidth > 1020 && mnav.classList.contains("open")) setMenu(false); });

    var onScroll = function () { hdr.classList.toggle("scrolled", window.scrollY > 8); };
    window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  }

  /* ---- pastki qism ---- */
  var ftr = document.getElementById("ftr");
  if (ftr) {
    var contact = [];
    if (C.phone) contact.push('<li><a href="tel:' + esc(C.phoneHref || C.phone) + '">' + esc(C.phone) + "</a></li>");
    if (C.telegram) contact.push('<li><a href="https://t.me/' + esc(C.telegram) + '" target="_blank" rel="noopener">Telegram</a></li>');
    if (C.instagram) contact.push('<li><a href="https://instagram.com/' + esc(C.instagram) + '" target="_blank" rel="noopener">Instagram</a></li>');
    if (C.hours) contact.push("<li>" + esc(C.hours) + "</li>");
    if (C.address) contact.push("<li>" + (C.mapUrl ? '<a href="' + esc(C.mapUrl) + '" target="_blank" rel="noopener">' + esc(C.address) + "</a>" : esc(C.address)) + "</li>");
    ftr.className = "ftr";
    ftr.innerHTML =
      '<div class="wrap">' +
        '<div class="ftr-top">' +
          '<div><a class="ftr-logo" href="index.html" aria-label="Mediazone — bosh sahifa"><img src="assets/brand/logo_vertikal_teskari.svg" alt="mediazone" width="150" height="141"></a>' +
          "<p>Sifatli kontent orqali bizneslarning sotuvini oshirishga xizmat qilamiz.</p></div>" +
          "<div><h4>Yo'nalishlar</h4><ul>" + NAV.slice(0, 5).map(function (n) { return '<li><a href="' + n.href + '">' + n.t + "</a></li>"; }).join("") + "</ul></div>" +
          '<div><h4>Xonalar</h4><ul><li><a href="studio.html#reels">Reels</a></li><li><a href="studio.html#estetik">Estetik</a></li><li><a href="studio.html#classic">Classic</a></li><li><a href="studio.html#siklorama">Siklorama</a></li><li><a href="studio.html#onyx">Onyx</a></li></ul></div>' +
          "<div><h4>Aloqa</h4><ul>" + contact.join("") + "</ul></div>" +
        "</div>" +
        '<div class="ftr-bot"><span>© ' + new Date().getFullYear() + " Mediazone</span><span>Syomka, montaj va marketing bir joyda</span></div>" +
      "</div>";
  }

  /* ---- kontakt joylari (data-mz) ---- */
  document.querySelectorAll("[data-mz]").forEach(function (el) {
    var k = el.getAttribute("data-mz"), v = C[k];
    if (!v) { if (el.hasAttribute("data-mz-hide")) el.remove(); return; }
    if (k === "phone") { el.textContent = v; if (el.tagName === "A") el.href = "tel:" + (C.phoneHref || v); }
    else if (k === "telegram") { el.textContent = "@" + v; if (el.tagName === "A") el.href = "https://t.me/" + v; }
    else if (k === "instagram") { el.textContent = "@" + v; if (el.tagName === "A") el.href = "https://instagram.com/" + v; }
    else { el.textContent = v; if (k === "address" && C.mapUrl && el.tagName === "A") el.href = C.mapUrl; }
  });

  /* ---- xona rasmlari (rasm o'rniga brend geometriyasidagi chizma) ---- */
  function P(x, apex, s, body, head) { // spiker: uchburchak tana + nuqta bosh (belgi siluetidan)
    var b = apex + 66 * s;
    return '<polygon points="' + x + "," + apex + " " + (x + 38 * s) + "," + b + " " + (x - 38 * s) + "," + b + '" fill="' + body + '"/>' +
      '<circle cx="' + x + '" cy="' + (apex - 14 * s) + '" r="' + 7 * s + '" fill="' + head + '"/>';
  }
  var K = "#1A1A1A", KR = "#F4F1EA", T = "#D9502E", Q = "#E8E1D5", CH = "#D6CEC0", KU = "#6B645A";
  var ART = {
    reels: '<rect width="400" height="300" fill="' + Q + '"/><rect y="244" width="400" height="56" fill="#DDD4C4"/>' +
      '<circle cx="200" cy="150" r="80" fill="none" stroke="' + KR + '" stroke-width="12"/>' + P(200, 128, 1.5, K, T) +
      '<rect x="302" y="104" width="40" height="70" rx="7" fill="' + K + '"/><rect x="308" y="112" width="28" height="50" rx="3" fill="#3A3835"/>' +
      '<path d="M322 174 300 244M322 174 344 244M322 174V244" stroke="' + K + '" stroke-width="3"/>',
    estetik: '<rect width="400" height="300" fill="' + Q + '"/><rect y="244" width="400" height="56" fill="#DDD4C4"/>' +
      '<path d="M118 244V128a82 82 0 0 1 164 0v116z" fill="' + KR + '"/>' + P(200, 140, 1.4, K, T) +
      '<rect x="44" y="84" width="42" height="56" fill="none" stroke="' + K + '" stroke-width="3"/><circle cx="65" cy="106" r="8" fill="' + CH + '"/>' +
      '<ellipse cx="318" cy="176" rx="12" ry="30" fill="' + KU + '" transform="rotate(-18 318 176)"/><ellipse cx="340" cy="170" rx="11" ry="34" fill="#8A8174" transform="rotate(16 340 170)"/>' +
      '<path d="M310 206h40l-6 38h-28z" fill="' + K + '"/>',
    classic: '<rect width="400" height="300" fill="' + Q + '"/><rect y="244" width="400" height="56" fill="#DDD4C4"/>' +
      '<g fill="' + CH + '"><rect x="40" y="70" width="320" height="4"/><rect x="40" y="126" width="320" height="4"/></g>' +
      '<g fill="' + KU + '"><rect x="58" y="44" width="10" height="26"/><rect x="72" y="50" width="8" height="20"/><rect x="84" y="42" width="12" height="28"/><rect x="290" y="46" width="10" height="24"/><rect x="304" y="40" width="8" height="30"/><rect x="316" y="48" width="12" height="22"/><rect x="250" y="102" width="10" height="24"/><rect x="264" y="98" width="8" height="28"/><rect x="120" y="100" width="12" height="26"/></g>' +
      P(108, 152, 1.15, K, T) + P(292, 152, 1.15, K, K) +
      '<rect x="150" y="206" width="100" height="8" fill="' + K + '"/><path d="M164 214v30M236 214v30" stroke="' + K + '" stroke-width="4"/>' +
      '<path d="M172 206l-12-34M228 206l12-34" stroke="' + K + '" stroke-width="3"/><rect x="152" y="160" width="14" height="20" rx="7" fill="' + K + '"/><rect x="234" y="160" width="14" height="20" rx="7" fill="' + K + '"/>',
    siklorama: '<rect width="400" height="300" fill="' + KR + '"/><path d="M0 214q200-34 400 0v86H0z" fill="#ECE6DB"/>' +
      '<ellipse cx="200" cy="252" rx="62" ry="8" fill="#E0D8CA"/>' + P(200, 140, 1.6, K, T) +
      '<g transform="rotate(-24 70 96)"><rect x="40" y="70" width="64" height="52" fill="' + K + '"/><rect x="46" y="76" width="52" height="40" fill="#FBF9F5"/></g>' +
      '<path d="M78 128 62 250M78 128 94 250" stroke="' + K + '" stroke-width="3"/>' +
      '<g transform="rotate(24 330 96)"><rect x="298" y="70" width="64" height="52" fill="' + K + '"/><rect x="304" y="76" width="52" height="40" fill="#FBF9F5"/></g>' +
      '<path d="M322 128 306 250M322 128 338 250" stroke="' + K + '" stroke-width="3"/>',
    onyx: '<rect width="400" height="300" fill="' + K + '"/><rect y="244" width="400" height="56" fill="#141414"/>' +
      '<path d="M200 0v40" stroke="' + KU + '" stroke-width="2"/><circle cx="200" cy="72" r="32" fill="' + KR + '" opacity=".92"/>' +
      '<rect x="28" y="80" width="6" height="150" fill="' + T + '"/>' +
      P(124, 156, 1.1, KR, T) + P(276, 156, 1.1, KR, KR) +
      '<rect x="160" y="206" width="80" height="8" fill="#3A3835"/><path d="M174 214v30M226 214v30" stroke="#3A3835" stroke-width="4"/>' +
      '<rect x="168" y="168" width="12" height="20" rx="6" fill="' + KU + '"/><rect x="220" y="168" width="12" height="20" rx="6" fill="' + KU + '"/>' +
      '<rect x="340" y="90" width="34" height="58" fill="none" stroke="#3A3835" stroke-width="3"/><path d="M357 148v96" stroke="#3A3835" stroke-width="3"/>'
  };
  document.querySelectorAll("[data-art]").forEach(function (el) {
    var a = ART[el.getAttribute("data-art")];
    if (a) el.insertAdjacentHTML("afterbegin", '<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label="' + esc(el.getAttribute("data-label") || "") + '">' + a + "</svg>");
  });

  /* ---- katta raqamlar bo'linib ketmasin: "450 000" -> bitta bo'lak ---- */
  document.querySelectorAll(".big").forEach(function (el) {
    var t = el.firstChild;
    if (t && t.nodeType === 3) { var sp = document.createElement("span"); sp.style.whiteSpace = "nowrap"; sp.textContent = t.textContent.trim(); el.replaceChild(sp, t); }
  });

  /* ---- strelkalar ---- */
  document.querySelectorAll("[data-arrow]").forEach(function (el) { el.insertAdjacentHTML("beforeend", ARROW); });

  /* ---- paydo bo'lish ---- */
  var rv = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window && rv.length) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    rv.forEach(function (el) { io.observe(el); });
  } else { rv.forEach(function (el) { el.classList.add("in"); }); }
})();
