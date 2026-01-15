export const getLiked = () =>
  JSON.parse(localStorage.getItem("likedFlats")) || [];

export const setLiked = arr =>
  localStorage.setItem("likedFlats", JSON.stringify(arr));

export function renderFlats(container, flats) {
  container.innerHTML = "";

  if (!flats.length) {
    container.innerHTML = "<p>Немає обраних квартир</p>";
    return;
  }

  flats.forEach(item => {
    const section = document.createElement("section");
    section.className = "d-flex-custom my-3 border";
    section.dataset.id = item.id;

    section.innerHTML = `
      <div class="col-lg-6 col-12 p-0">
        <div class="carousel">
          <div class="carousel-track">
            ${item.images.map(img => `
              <div class="carousel-slide">
                <img loading="lazy" src="${img}">
              </div>`).join("")}
          </div>
          <button class="carousel-btn prev">&#10094;</button>
          <button class="carousel-btn next">&#10095;</button>
        </div>
      </div>

      <div class="col-lg-6 col-12 flat-text-block">
        <div class="price-block d-flex">
          <p class="price px-2">${item.price}</p>
          <p class="price-per-m px-2">${item.price_per_m2}</p>
        </div>

        <p class="street px-2">${item.address}</p>

        <div class="location-block d-flex">
          <p class="rayon px-2">${item.district}</p>
          <p class="city px-2">${item.city}</p>
          <p class="complex-name px-2">${item.complex}</p>
        </div>

        <div class="detail-block d-flex">
          <p class="room-amount px-2">${item.rooms} кімнати</p>
          <p class="area px-2">${item.total_area}</p>
          <p class="floor px-2">${item.floor}</p>
        </div>

        <p class="description px-2">${item.description}</p>

        <div class="date-block d-flex">
          <p class="date px-2">${item.created}</p>
          <p class="checked px-2">${item.verified ? "Перевірено" : ""}</p>
        </div>

        <div class="like-flat">
          <button class="like-btn">
            <i class="fa-${getLiked().includes(String(item.id)) ? "solid" : "regular"} fa-heart fa-2x"></i>
          </button>
        </div>
      </div>
    `;

    container.appendChild(section);
  });

  initCarousels(container);
}

export function initCarousels(scope) {
  scope.querySelectorAll(".carousel").forEach(carousel => {
    const track = carousel.querySelector(".carousel-track");
    const slides = carousel.querySelectorAll(".carousel-slide");
    let index = 0;

    const update = () => {
      const w = slides[0].getBoundingClientRect().width;
      track.style.transform = `translateX(-${index * w}px)`;
    };

    carousel.querySelector(".next").onclick = () => {
      index = (index + 1) % slides.length;
      update();
    };

    carousel.querySelector(".prev").onclick = () => {
      index = (index - 1 + slides.length) % slides.length;
      update();
    };

    window.addEventListener("resize", update);
    update();
  });
}
