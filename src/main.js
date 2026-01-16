import db from "./db.json";
import {
  populatePropertyDetails,
  populateInfrastructure,
  populateDistrictRating,
  initPropertyMap,
  initCarousel,
  openPhotosModal
} from "./phases/details.js";
import { getLiked, setLiked, renderFlats, initCarousels } from "./phases/storage.js";
let isAddModalOpen = false;
let modalClickHandler = null;
document.addEventListener('click', function (e) {
  const element = e.target;

  console.log('=== log USER CLICK ===');
  console.log('log Element:', element.tagName.toLowerCase());
  console.log('log ID:', element.id || 'no id');
  console.log('log Classes:', element.className || 'no classes');
  console.log('log Text:', element.textContent ? element.textContent.trim().substring(0, 100) : 'no text');
  console.log('========================\n');
}, true);


document.addEventListener('DOMContentLoaded', () => {
  const sidebars = ['likesSidebar', 'addListingSidebar', 'previewSidebar'];
  const overlays = ['likesOverlay', 'addOverlay', 'previewOverlay'];
  sidebars.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
  });
  overlays.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
  });
  document.body.style.overflow = '';
});

function openAddModal() {
  const addListingSidebar = document.getElementById('addListingSidebar');
  const addOverlay = document.getElementById('addOverlay');
  const closeAddSidebar = document.getElementById('closeAddSidebar');
  const cancelListingBtn = document.getElementById('cancelListingBtn');

  if (addListingSidebar && addOverlay) {
    addListingSidebar.classList.add('active');
    addOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');
    isAddModalOpen = true;

    if (modalClickHandler) {
      document.removeEventListener('click', modalClickHandler);
    }

    modalClickHandler = (e) => {
      const clickedElement = e.target;


      console.log('=== MODAL CLICK DEBUG ===');
      console.log('Clicked element:', clickedElement.tagName, clickedElement.id || clickedElement.className || 'no id/class');
      console.log('Is overlay?', clickedElement === addOverlay);
      console.log('Overlay element:', addOverlay);


      const isOverlay = clickedElement === addOverlay;
      const isInsideSidebar = addListingSidebar.contains(clickedElement);
      const isSidebarItself = clickedElement === addListingSidebar;
      const isCloseButton = clickedElement === closeAddSidebar ||
        (clickedElement.closest && clickedElement.closest('#closeAddSidebar'));
      const isCancelButton = clickedElement === cancelListingBtn ||
        (clickedElement.closest && clickedElement.closest('#cancelListingBtn'));

      console.log('isOverlay:', isOverlay);
      console.log('isInsideSidebar:', isInsideSidebar);
      console.log('isSidebarItself:', isSidebarItself);
      console.log('isCloseButton:', isCloseButton);
      console.log('isCancelButton:', isCancelButton);


      if (isOverlay) {

        const sidebarRect = addListingSidebar.getBoundingClientRect();
        const clickX = e.clientX;
        const clickY = e.clientY;


        const clickedInsideSidebar =
          clickX >= sidebarRect.left &&
          clickX <= sidebarRect.right &&
          clickY >= sidebarRect.top &&
          clickY <= sidebarRect.bottom;

        console.log('Clicked coordinates:', { x: clickX, y: clickY });
        console.log('Sidebar rect:', sidebarRect);
        console.log('Clicked inside sidebar area?', clickedInsideSidebar);

        if (!clickedInsideSidebar) {
          console.log('Closing modal - clicked on overlay outside sidebar');
          closeAddListingModal();
        } else {
          console.log('Not closing - clicked on overlay but inside sidebar area');
          e.stopPropagation();
        }
      }

      if (!isOverlay && !isInsideSidebar && !isSidebarItself && !isCloseButton && !isCancelButton) {
        console.log('Closing modal - clicked outside modal entirely');
        closeAddListingModal();
      }
    };

    setTimeout(() => {
      document.addEventListener('click', modalClickHandler, true);
    }, 0);

    const first = document.getElementById('fld_price_usd');
    if (first) first.focus();
  }
}

function closeAddListingModal() {
  const addListingSidebar = document.getElementById('addListingSidebar');
  const addOverlay = document.getElementById('addOverlay');

  if (addListingSidebar && addOverlay) {
    addListingSidebar.classList.remove('active');
    addOverlay.classList.remove('active');
    document.body.style.overflow = '';
    document.body.classList.remove('modal-open');
    isAddModalOpen = false;

    if (modalClickHandler) {
      document.removeEventListener('click', modalClickHandler, true);
      modalClickHandler = null;
    }

    const addListingForm = document.getElementById('addListingForm');
    if (addListingForm) addListingForm.reset();
  }
}

function initAddListingModal() {
  console.log('initAddListingModal called');
  
  const addListingBtn = document.querySelector('.add-listing-btn');
  const addOverlay = document.getElementById('addOverlay');
  const addListingSidebar = document.getElementById('addListingSidebar');
  const closeAddSidebar = document.getElementById('closeAddSidebar');
  const cancelListingBtn = document.getElementById('cancelListingBtn');
  
  if (!addOverlay || !addListingSidebar) {
    console.error('Modal elements not found');
    return;
  }
  
  document.addEventListener('click', function(e) {
  
    const clickedElement = e.target;
    const addListingBtnElement = clickedElement.closest('.add-listing-btn');
    
    if (addListingBtnElement) {
      e.preventDefault();
      e.stopImmediatePropagation(); 
      console.log('Add listing button clicked via delegation');
      openAddModal();
      return;
    }
  }, false); 
  

  if (addListingBtn) {
    addListingBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Add listing button direct click');
      openAddModal();
    });

    const btnChildren = addListingBtn.querySelectorAll('*');
    btnChildren.forEach(child => {
      child.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
      });
    });
  }
  
  if (closeAddSidebar) {
    closeAddSidebar.addEventListener('click', (e) => {
      e.preventDefault();
      closeAddListingModal();
    });
  }
  
  if (cancelListingBtn) {
    cancelListingBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeAddListingModal();
    });
  }

  if (addOverlay) {
    addOverlay.addEventListener('click', (e) => {
      console.log('Direct overlay click');
      if (e.target === addOverlay) {
        closeAddListingModal();
      }
    });
  }
  
  if (addListingSidebar) {
    addListingSidebar.addEventListener('click', (e) => {
      console.log('Sidebar clicked, preventing close');
      e.stopPropagation();
    });
  }
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isAddModalOpen) {
      e.preventDefault();
      closeAddListingModal();
    }
  });
  
  const addListingForm = document.getElementById('addListingForm');
  if (addListingForm) {
    addListingForm.addEventListener('click', (e) => {
      e.stopPropagation();
    });
    
    const formElements = addListingForm.querySelectorAll('input, textarea, select, button, label');
    formElements.forEach(element => {
      element.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    });
  }
  
  console.log('Add listing modal initialized');
}
const select = document.getElementById("roomSelect");

function loadUserListings() {
  try {
    const raw = localStorage.getItem('userListings');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to load userListings', err);
    return [];
  }
}

function saveUserListings(arr) {
  try {
    localStorage.setItem('userListings', JSON.stringify(arr));
  } catch (err) {
    console.error('Failed to save userListings', err);
  }
}

function getAllData() {
  const users = loadUserListings();
  return [...db, ...users];
}

const hidden = document.getElementById("propertyType");
const flatCountText = document.getElementById("flat-number");
let currentItem = null;

function parseNumberFromString(str) {
  if (!str) return NaN;
  const num = Number(String(str).replace(/[^0-9.-]+/g, ''));
  return isNaN(num) ? NaN : num;
}

function getFilterValues() {
  const rooms = hidden && hidden.value ? hidden.value : 'all';
  const priceMinEl = document.getElementById('priceMin');
  const priceMaxEl = document.getElementById('priceMax');
  const areaMinEl = document.getElementById('areaMin');
  const areaMaxEl = document.getElementById('areaMax');

  const priceMin = priceMinEl && priceMinEl.value ? Number(priceMinEl.value) : null;
  const priceMax = priceMaxEl && priceMaxEl.value ? Number(priceMaxEl.value) : null;
  const areaMin = areaMinEl && areaMinEl.value ? Number(areaMinEl.value) : null;
  const areaMax = areaMaxEl && areaMaxEl.value ? Number(areaMaxEl.value) : null;

  return { rooms, priceMin, priceMax, areaMin, areaMax };
}

function applyFilters() {
  const { rooms, priceMin, priceMax, areaMin, areaMax } = getFilterValues();
  let filtered = [...getAllData()];

  if (rooms && rooms !== 'all') {
    const roomCount = parseInt(rooms);
    if (!isNaN(roomCount)) filtered = filtered.filter(i => i.rooms === roomCount);
  }

  if (priceMin !== null || priceMax !== null) {
    filtered = filtered.filter(i => {
      const p = parseNumberFromString(i.price);
      if (isNaN(p)) return false;
      if (priceMin !== null && p < priceMin) return false;
      if (priceMax !== null && p > priceMax) return false;
      return true;
    });
  }

  if (areaMin !== null || areaMax !== null) {
    filtered = filtered.filter(i => {
      const a = parseNumberFromString(i.total_area);
      if (isNaN(a)) return false;
      if (areaMin !== null && a < areaMin) return false;
      if (areaMax !== null && a > areaMax) return false;
      return true;
    });
  }

  updateListingsDisplay(filtered);
}

function updateListingsDisplay(filteredData) {
  const container = document.getElementById("listings");
  if (!container) return;

  container.innerHTML = '';

  filteredData.forEach(item => {
    const section = document.createElement("section");
    section.className = "d-flex-custom my-3 border";
    section.dataset.id = item.id;

    section.innerHTML = `
      ${item.images && item.images.length > 0 ? `<div class="col-lg-6 col-12 p-0">
        <div class="carousel">
          <div class="carousel-track">
            ${item.images.map(img => `<div class="carousel-slide"><img loading="lazy" src="${img}" alt="Квартира"></div>`).join('')}
          </div>
          <button class="carousel-btn prev">&#10094;</button>
          <button class="carousel-btn next">&#10095;</button>
        </div>
      </div>` : ''}

      <div class="col-lg-6 col-12 flat-text-block">
        ${item.price || item.price_per_m2 ? `<div class="price-block d-flex m-0">
          ${item.price ? `<p class="price px-2 m-0">${item.price}</p>` : ''}
          ${item.price_per_m2 ? `<p class="price-per-m px-2">${item.price_per_m2}</p>` : ''}
        </div>` : ''}

        ${item.address ? `<div class="street-block">
          <p class="street px-2">${item.address}</p>
        </div>` : ''}

        ${(item.district || item.city || item.complex) ? `<div class="location-block d-flex">
          ${item.district ? `<p class="rayon px-2">${item.district}</p>` : ''}
          ${item.city ? `<p class="city px-2">${item.city}</p>` : ''}
          ${item.complex ? `<p class="complex-name px-2">${item.complex}</p>` : ''}
        </div>` : ''}

        ${(item.rooms || item.total_area || (item.floor && item.total_floors)) ? `<div class="detail-block d-flex">
          ${item.rooms ? `<p class="room-amount px-2">${item.rooms} кімнати</p>` : ''}
          ${item.total_area ? `<p class="area px-2">${item.total_area}</p>` : ''}
          ${item.floor && item.total_floors ? `<p class="floor px-2">${item.floor}</p>` : ''}
        </div>` : ''}

        ${item.description ? `<div class="house-description">
          <p class="description px-2">${item.description}</p>
        </div>` : ''}

        ${(item.created || item.verified) ? `<div class="date-block d-flex">
          ${item.created ? `<p class="date px-2">${item.created}</p>` : ''}
          ${item.verified ? `<p class="checked px-2">Перевірено</p>` : ''}
        </div>` : ''}

        <div class="like-flat">
          <button class="like-btn"><i class="fa-regular fa-heart fa-2x"></i></button>
        </div>
      </div>
    `;

    container.appendChild(section);
  });

  if (flatCountText) {
    flatCountText.textContent = "Знайдено " + filteredData.length + " помешкань";
  }

  initEventHandlers();
}

function initEventHandlers() {
  const container = document.getElementById("listings");
  if (!container) return;

  container.querySelectorAll("section").forEach(section => {
    const id = section.dataset.id;
    const likeBtn = section.querySelector(".like-btn");
    if (!likeBtn) return;

    const liked = getLiked();
    const isLiked = liked.includes(String(id));
    const icon = likeBtn.querySelector("i");
    
    if (icon) {
      icon.classList.toggle("fa-solid", isLiked);
      icon.classList.toggle("fa-regular", !isLiked);
    }
  });


  document.querySelectorAll(".carousel").forEach(carousel => {
    const track = carousel.querySelector(".carousel-track");
    const slides = carousel.querySelectorAll(".carousel-slide");
    if (slides.length === 0) return;

    let index = 0;

    const update = () => {
      const slideWidth = slides[0].getBoundingClientRect().width;
      track.style.transform = `translateX(-${index * slideWidth}px)`;
    };

    window.addEventListener("resize", update);

    const nextBtn = carousel.querySelector(".next");
    const prevBtn = carousel.querySelector(".prev");

    if (nextBtn) {
      nextBtn.onclick = () => {
        index = (index + 1) % slides.length;
        update();
      };
    }

    if (prevBtn) {
      prevBtn.onclick = () => {
        index = (index - 1 + slides.length) % slides.length;
        update();
      };
    }

    update();
  });
}

if (flatCountText) {
  flatCountText.textContent = "Знайдено " + getAllData().length + " помешкань";
}

document.addEventListener('DOMContentLoaded', function () {
  const mapButton = document.querySelector('.map-overlay');
  if (mapButton) {
    mapButton.addEventListener('click', function () {
      const mapSection = document.getElementById('map');
      if (mapSection) {
        mapSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
});

// Работает и локально, и на Render
if (
  window.location.pathname.includes("details.html") || 
  window.location.pathname.startsWith("/details")
) {
  document.addEventListener("DOMContentLoaded", () => {
    console.log("Загружаем сторінку details");

    // Читаем ID из URL
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    console.log("ID з URL:", id);

    if (!id) {
      console.error("ID не знайдено в URL");
      return;
    }

    // Ищем объект
    const currentItem = getAllData().find(el => el.id == id);
    console.log("Знайдено обєкта:", currentItem);

    if (!currentItem) {
      console.error("Об'єкт з ID", id, "не знайдено");
      alert("Об'єкт не знайдено! Поверніться на головну сторінку.");
      return;
    }

    // Заполняем страницу
    populatePropertyDetails(currentItem);
    initCarousel();

    // Кнопка "Повний опис"
    const toggleBtn = document.getElementById("toggleBtn");
    const fullDesc = document.getElementById("fullDesc");

    if (toggleBtn && fullDesc) {
      toggleBtn.addEventListener("click", () => {
        const isHidden = fullDesc.style.display === "none" || fullDesc.style.display === "";
        fullDesc.style.display = isHidden ? "block" : "none";
        toggleBtn.textContent = isHidden ? "Згорнути" : "Повний опис";
      });
    }

    // Превью фото
    const photosPreviewBtn = document.querySelector('.photos-preview-box');
    if (photosPreviewBtn) {
      photosPreviewBtn.addEventListener('click', () => openPhotosModal(currentItem));
    }
  });
}


if (select) {
  select.addEventListener("click", () => {
    select.classList.toggle("active");
  });

  document.querySelectorAll(".custom-options li").forEach(item => {
    item.addEventListener("click", (e) => {
      const selectedValue = e.target.dataset.value;
      const selectedText = e.target.innerText;

      select.querySelector("span").innerText = selectedText;
      hidden.value = selectedValue;
      select.classList.remove("active");

      applyFilters();
    });
  });

  function initEventHandlers() {
    const container = document.getElementById("listings");
    if (!container) return;

    document.querySelectorAll(".carousel").forEach(carousel => {
      const track = carousel.querySelector(".carousel-track");
      const slides = carousel.querySelectorAll(".carousel-slide");
      if (slides.length === 0) return;

      let index = 0;

      const update = () => {
        const slideWidth = slides[0].getBoundingClientRect().width;
        track.style.transform = `translateX(-${index * slideWidth}px)`;
      };

      const nextBtn = carousel.querySelector(".next");
      const prevBtn = carousel.querySelector(".prev");

      if (nextBtn) {
        nextBtn.onclick = () => {
          index = (index + 1) % slides.length;
          update();
        };
      }

      if (prevBtn) {
        prevBtn.onclick = () => {
          index = (index - 1 + slides.length) % slides.length;
          update();
        };
      }

      update();
    });
  }

  document.addEventListener("click", (e) => {
    if (!select.contains(e.target)) select.classList.remove("active");
  });

  ['priceMin', 'priceMax', 'areaMin', 'areaMax'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => applyFilters());
  });
}

function restoreLikesOnPageLoad() {
  if (!window.location.pathname.includes("details.html") && 
      (window.location.pathname.endsWith("index.html") || window.location.pathname === "/")) {
    
    setTimeout(() => {
      const container = document.getElementById("listings");
      if (!container) return;

      container.querySelectorAll("section").forEach(section => {
        const id = section.dataset.id;
        const likeBtn = section.querySelector(".like-btn");
        if (!likeBtn) return;

        const liked = getLiked();
        const isLiked = liked.includes(String(id));
        const icon = likeBtn.querySelector("i");
        
        if (icon) {
          icon.classList.toggle("fa-solid", isLiked);
          icon.classList.toggle("fa-regular", !isLiked);
        }
      });
    }, 100);
  }
}


if (window.location.pathname.endsWith("index.html") || window.location.pathname === "/") {
  document.addEventListener("DOMContentLoaded", () => {
    console.log("Загружаем головну сторінку");
    const container = document.getElementById("listings");
    if (!container) return;

    initAddListingModal();

    applyFilters();
    
    restoreLikesOnPageLoad();

    container.addEventListener("click", e => {
      const flatBlock = e.target.closest(".flat-text-block");
      if (flatBlock && !e.target.closest(".like-btn")) {
        const section = flatBlock.closest("section");
        const id = section.dataset.id;
        window.location.href = `details.html?id=${id}`;
      }
    });
  });
}

if (document.getElementById('map') && !window.location.pathname.includes("details.html")) {
  let map = L.map('map').setView([49.5535, 25.5948], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  getAllData().forEach(item => {
    if (item.coordinates && item.coordinates.lat && item.coordinates.lng) {
      L.marker([item.coordinates.lat, item.coordinates.lng])
        .addTo(map)
        .bindPopup(`
          <b>${item.address}</b><br>
          ${item.rooms} кімнати<br>
          ${item.total_area}<br>
          <b>${item.price}</b>
        `);
    }
  });
}



const userBtn = document.getElementById("userBtn");
const userOverlay = document.getElementById("userOverlay");
const closeUserOverlay = document.getElementById("closeOverlay");

userBtn.addEventListener("click", () => {
  userOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
  updateUserMenu();
});

closeUserOverlay.addEventListener("click", () => {
  userOverlay.classList.remove("active");
  document.body.style.overflow = "";
});

userOverlay.addEventListener("click", (e) => {
  if (e.target === userOverlay) {
    userOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && userOverlay.classList.contains("active")) {
    userOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }
});


function initUserMenuHandlers() {

  userOverlay.addEventListener('click', function(e) {
    const target = e.target;

    if (target.classList.contains('login-btn') || target.closest('.login-btn')) {
      e.preventDefault();
      handleLogin();
    }

    if (target.classList.contains('logout-btn') || target.closest('.logout-btn')) {
      e.preventDefault();
      handleLogout();
    }

    if (target.classList.contains('add-btn') || target.closest('.add-btn')) {
      e.preventDefault();
      handleAddListing();
    }
    

    if (target.classList.contains('menu-link') || target.closest('.menu-link')) {
      e.preventDefault();
      const menuItem = target.closest('.menu-link');
      const action = menuItem.dataset.action;
      handleMenuAction(action);
    }
    

    if (target.classList.contains('donate-btn') || target.closest('.donate-btn')) {
      e.preventDefault();
      alert('Перенаправлення на сторінку донату...');
      window.open('https://savelife.in.ua/donate/', '_blank');
    }
  });
}


function handleLogin() {
  const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
  
  if (isLoggedIn) {
    alert('Ви вже увійшли в систему');
    return;
  }
  
  const userName = prompt('Введіть ваше ім\'я:', 'Користувач');
  const userEmail = prompt('Введіть ваш email:', 'user@example.com');
  
  if (userName && userEmail) {
    localStorage.setItem('userLoggedIn', 'true');
    localStorage.setItem('userName', userName);
    localStorage.setItem('userEmail', userEmail);
    localStorage.setItem('userRegistrationDate', new Date().toISOString());
    
    updateUserMenu();
    alert(`Вітаємо, ${userName}! Ви успішно увійшли.`);
  }
}


function handleLogout() {
  if (confirm('Ви дійсно хочете вийти з акаунта?')) {
    localStorage.setItem('userLoggedIn', 'false');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    
    updateUserMenu();
    alert('Ви вийшли з акаунта.');
  }
}


function handleAddListing() {
  const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
  
  if (!isLoggedIn) {
    alert('Будь ласка, увійдіть в акаунт для додавання оголошень.');
    handleLogin();
    return;
  }
  
  userOverlay.classList.remove('active');
  document.body.style.overflow = '';
  

  setTimeout(() => {
    openAddModal();
  }, 300);
}


function handleMenuAction(action) {
  userOverlay.classList.remove('active');
  document.body.style.overflow = '';
  
  switch(action) {
    case 'search':
      window.location.href = '/';
      break;
      
    case 'listings':
      showUserListings();
      break;
      
    case 'ads':
      showAdsManagement();
      break;
      
    case 'notifications':
      showNotifications();
      break;
      
    case 'favorites':
      showFavorites();
      break;
      
    case 'help':
      showHelp();
      break;
  }
}

function showUserListings() {
  const userListings = loadUserListings();
  const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
  
  if (!isLoggedIn) {
    alert('Будь ласка, увійдіть для перегляду ваших оголошень.');
    return;
  }
  
  if (userListings.length === 0) {
    alert('У вас ще немає оголошень.');
    return;
  }
  
  const listingsHTML = userListings.map(item => `
    <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin-bottom: 10px; background: white;">
      <div style="display: flex; justify-content: space-between; align-items: start;">
        <div>
          <p style="margin: 0 0 5px 0; font-weight: 600;">${item.address || 'Без адреси'}</p>
          <p style="margin: 0 0 5px 0; color: #666;">${item.rooms} кімнати • ${item.total_area}</p>
          <p style="margin: 0; font-weight: bold; color: #007bff;">${item.price || 'Ціна не вказана'}</p>
        </div>
        <div>
          <p style="margin: 0; font-size: 12px; color: #666;">${item.created}</p>
          <p style="margin: 5px 0 0 0; font-size: 12px; color: ${item.verified ? '#28a745' : '#ffc107'};">
            ${item.verified ? '✅ Перевірено' : '⏳ На перевірці'}
          </p>
        </div>
      </div>
    </div>
  `).join('');
  
  alert(`Ваші оголошення (${userListings.length}):`);

}


function showAdsManagement() {
  alert('Розділ "Розміщення реклами" в розробці.\nТут буде управління рекламними кампаніями.');
}


function showNotifications() {
  const notifications = JSON.parse(localStorage.getItem('userNotifications')) || [];
  
  if (notifications.length === 0) {
    alert('Немає нових сповіщень.');
    return;
  }
  
  const notificationsHTML = notifications.map(notif => `
    <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
      <p style="margin: 0; font-weight: ${notif.read ? 'normal' : 'bold'};">
        ${notif.message}
      </p>
      <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">
        ${new Date(notif.date).toLocaleString('uk-UA')}
      </p>
    </div>
  `).join('');
  

  notifications.forEach(notif => notif.read = true);
  localStorage.setItem('userNotifications', JSON.stringify(notifications));
  
  alert(`Ваші сповіщення (${notifications.length}):`);

}


function showFavorites() {
  const likedItems = getLiked();
  const allData = getAllData();
  const favorites = allData.filter(item => likedItems.includes(String(item.id)));
  
  if (favorites.length === 0) {
    alert('У вас ще немає збережених оголошень.');
    return;
  }
  
  if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {
    likesBtn.click(); 
  } else {
    window.location.href = '/';
    setTimeout(() => {
      likesBtn.click();
    }, 500);
  }
}

function showHelp() {
  const helpContent = `
    🔍 **Пошук нерухомості:**
    - Використовуйте фільтри для пошуку
    - Зберігайте улюблені оголошення
    - Зв'язуйтесь з рієлторами через чат
    
    📋 **Додавання оголошення:**
    - Увійдіть в акаунт
    - Заповніть форму додавання
    - Додайте фото та опис
    - Оголошення зберігається локально
    
    ⭐ **Обране:**
    - Клацайте ♡ для збереження
    - Переглядайте в сайдбарі "Обране"
    
    📞 **Підтримка:**
    Email: support@dimria.com
    Телефон: 0 800 123 456
    
    Бажаємо успішних угод! 🏠
  `;
  
  alert(helpContent);
}



const userOverlayStyle = document.createElement("style");
userOverlayStyle.textContent = `
  #userOverlay {
    position: fixed;
    top: 0;
    left: 0; 
    width: 100%;
    max-width: 400px;
    height: 100%;
    background: white;
    z-index: 9999;
    display: none;
    flex-direction: column;
    box-shadow: 5px 0 15px rgba(0,0,0,0.2); 
    transform: translateX(-100%); 
    transition: transform 0.3s ease-out;
  }
  
  #userOverlay.active {
    display: flex;
    transform: translateX(0);
  }
  
  #userOverlay .overlay-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    background: #8fc9f6;
    border-bottom: 1px solid #7bb9f0;
    flex-shrink: 0;
  }
  
  #userOverlay .overlay-header img {
    height: 30px;
    width: auto;
  }
  
  #closeOverlay {
    background: none;
    border: none;
    font-size: 32px;
    color: white;
    cursor: pointer;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: background-color 0.2s;
  }
  
  #closeOverlay:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
  
  #userOverlay .overlay-body {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    background: #f8f9fa;
  }
  
  #userOverlay .login-box {
    background: white;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 20px;
    text-align: center;
  }
  
  #userOverlay .login-btn {
    display: inline-flex;
    align-items: center;
    padding: 12px 20px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  #userOverlay .login-btn:hover {
    background: #0056b3;
  }
  
  #userOverlay .logout-btn {
    transition: background-color 0.2s;
  }
  
  #userOverlay .logout-btn:hover {
    background: #c82333;
  }
  
  #userOverlay .add-btn {
    width: 100%;
    padding: 14px;
    background: #ffc107;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 20px;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  #userOverlay .add-btn:hover {
    background: #e0a800;
  }
  
  #userOverlay .overlay-menu {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  #userOverlay .overlay-menu li {
    margin-bottom: 8px;
  }
  
  #userOverlay .overlay-menu a {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    background: white;
    border-radius: 8px;
    text-decoration: none;
    color: #333;
    transition: all 0.2s;
    position: relative;
  }
  
  #userOverlay .overlay-menu a:hover {
    background: #e9ecef;
    transform: translateX(4px);
  }
  
  #userOverlay .menu-icon {
    margin-right: 12px;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  
  #userOverlay .menu-icon svg {
    width: 100%;
    height: 100%;
  }
  
  #userOverlay .menu-text {
    font-size: 16px;
    font-weight: 500;
    flex: 1;
  }
  
  #userOverlay .menu-badge {
    background: #dc3545;
    color: white;
    font-size: 12px;
    padding: 2px 6px;
    border-radius: 10px;
    min-width: 20px;
    text-align: center;
  }
  
  .chats-container {
    margin-top: 20px;
    background: white;
    border-radius: 12px;
    overflow: hidden;
  }
  
  .chats-header {
    padding: 15px 20px;
    background: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
    font-weight: 600;
    font-size: 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .new-chat-btn {
    background: #28a745;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 6px 12px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .new-chat-btn:hover {
    background: #218838;
  }
  
  .chats-list {
    max-height: 400px;
    overflow-y: auto;
  }
  
  .chat-item {
    display: flex;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid #f0f0f0;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .chat-item:hover {
    background: #f8f9fa;
  }
  
  .chat-item.unread {
    background: #f0f7ff;
  }
  
  .chat-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 15px;
    flex-shrink: 0;
  }
  
  .chat-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .chat-info {
    flex: 1;
    min-width: 0;
  }
  
  .chat-name {
    font-weight: 600;
    margin: 0 0 5px 0;
    color: #333;
  }
  
  .chat-last-message {
    margin: 0;
    font-size: 14px;
    color: #666;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .chat-meta {
    text-align: right;
    margin-left: 10px;
    flex-shrink: 0;
  }
  
  .chat-time {
    font-size: 12px;
    color: #999;
    margin: 0 0 5px 0;
  }
  
  .chat-unread {
    background: #007bff;
    color: white;
    font-size: 12px;
    padding: 2px 6px;
    border-radius: 10px;
    display: inline-block;
  }
  
  .chat-empty {
    text-align: center;
    padding: 40px 20px;
    color: #666;
  }
  
  .chat-empty p {
    margin: 10px 0;
  }
  
  .start-chat-btn {
    background: #007bff;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 10px 20px;
    margin-top: 15px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .start-chat-btn:hover {
    background: #0056b3;
  }
  
  .chat-window {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 800px;
    height: 80vh;
    background: white;
    border-radius: 12px;
    box-shadow: 0 5px 30px rgba(0,0,0,0.3);
    z-index: 10000;
    display: none;
    flex-direction: column;
  }
  
  .chat-window.active {
    display: flex;
  }
  
  .chat-header {
    padding: 15px 20px;
    background: #007bff;
    color: white;
    border-radius: 12px 12px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .chat-header-info {
    display: flex;
    align-items: center;
  }
  
  .chat-header-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 10px;
  }
  
  .chat-header-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .close-chat {
    background: none;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    background: #f5f5f5;
  }
  
  .message {
    margin-bottom: 15px;
    max-width: 70%;
  }
  
  .message.received {
    align-self: flex-start;
  }
  
  .message.sent {
    align-self: flex-end;
    margin-left: auto;
  }
  
  .message-content {
    padding: 10px 15px;
    border-radius: 18px;
    background: white;
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  }
  
  .message.received .message-content {
    background: #007bff;
    color: white;
    border-radius: 18px 18px 18px 4px;
  }
  
  .message.sent .message-content {
    background: #e9ecef;
    color: #333;
    border-radius: 18px 18px 4px 18px;
  }
  
  .message-time {
    font-size: 11px;
    color: #999;
    margin-top: 5px;
    text-align: right;
  }
  
  .chat-input {
    padding: 15px;
    background: white;
    border-top: 1px solid #e9ecef;
    border-radius: 0 0 12px 12px;
    display: flex;
  }
  
  .chat-input input {
    flex: 1;
    padding: 10px 15px;
    border: 1px solid #ddd;
    border-radius: 25px;
    margin-right: 10px;
    font-size: 14px;
  }
  
  .chat-input button {
    background: #007bff;
    color: white;
    border: none;
    border-radius: 25px;
    padding: 10px 20px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .chat-input button:hover {
    background: #0056b3;
  }
  
  #userOverlay .donate-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: linear-gradient(135deg, #ff6b6b, #ff8e53);
    color: white;
    padding: 15px;
    border-radius: 12px;
    text-decoration: none;
    margin-top: 20px;
    transition: opacity 0.2s;
  }
  
  #userOverlay .donate-btn:hover {
    opacity: 0.9;
  }
  
  #userOverlay .donate-btn img {
    width: 60px;
    height: 55px;
  }
  
  @media (max-width: 768px) {
    #userOverlay {
      max-width: 100%;
    }
    
    .chat-window {
      width: 95%;
      height: 90vh;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
`;

document.head.appendChild(userOverlayStyle);


function updateUserMenu() {
  const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
  const userName = localStorage.getItem('userName') || 'Користувач';
  
  const loginBox = userOverlay.querySelector('.login-box');
  const addBtn = userOverlay.querySelector('.add-btn');
  const favoritesCount = userOverlay.querySelector('.favorites-count');
  const notificationsCount = userOverlay.querySelector('.notifications-count');
  
  if (isLoggedIn) {
    loginBox.innerHTML = `
      <div style="display: flex; align-items: center; margin-bottom: 15px;">
        <div style="width: 50px; height: 50px; background: #007bff; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
          <span style="color: white; font-size: 20px; font-weight: bold;">${userName.charAt(0)}</span>
        </div>
        <div>
          <p style="margin: 0; font-size: 18px; font-weight: 600;">${userName}</p>
          <p style="margin: 0; font-size: 14px; color: #666;">Ваш кабінет</p>
        </div>
      </div>
      <button class="logout-btn" style="width: 100%; padding: 10px; background: #dc3545; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500;">
        Вийти
      </button>
    `;
  } else {
    loginBox.innerHTML = `
      <p style="margin-bottom: 15px; font-size: 18px; font-weight: 600;">Увійти в кабінет</p>
      <button class="login-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white" style="margin-right: 8px;">
          <circle cx="12" cy="12" r="11" stroke="white" stroke-width="2"></circle>
          <circle cx="12" cy="10" r="4" stroke="white" stroke-width="2"></circle>
          <circle cx="12" cy="23" r="9" stroke="white" stroke-width="2"></circle>
        </svg>
        Увійти
      </button>
    `;
  }

  const likedItems = getLiked();
  if (favoritesCount) {
    favoritesCount.textContent = likedItems.length > 0 ? `(${likedItems.length})` : '';
  }
}

function initUserOverlay() {
  // Создаем структуру сайдбара профиля с кнопкой закрытия
  userOverlay.innerHTML = `
    <div class="overlay-header" style="
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 20px;
      background: #007bff;
      color: white;
      border-bottom: 1px solid #006fe6;
      flex-shrink: 0;
    ">
      <div style="display: flex; align-items: center;">
        <img src="./src/img/logo.png" alt="Logo" style="height: 30px; margin-right: 10px;">
        <h3 style="margin: 0; font-size: 18px;">Особистий кабінет</h3>
      </div>
      <button id="closeUserOverlay" class="close-overlay-btn" style="
        background: none;
        border: none;
        font-size: 28px;
        color: white;
        cursor: pointer;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: background-color 0.2s;
      ">
        &times;
      </button>
    </div>
    
    <div class="overlay-body" style="
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      background: #f8f9fa;
    ">
      <!-- Остальной контент меню будет добавлен здесь -->
    </div>
  `;
  
  // Получаем ссылки на элементы
  const overlayBody = userOverlay.querySelector('.overlay-body');
  const closeUserOverlayBtn = document.getElementById('closeUserOverlay');
  
  // Добавляем контент в тело сайдбара
  overlayBody.innerHTML = `
    <div class="login-box"></div>

    <button class="add-btn" style="
      width: 100%;
      padding: 14px;
      background: #ffc107;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      margin-bottom: 20px;
      transition: background-color 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <i class="fa-solid fa-plus" style="margin-right: 8px;"></i>
      Додати оголошення
    </button>

    <ul class="overlay-menu" style="
      list-style: none;
      padding: 0;
      margin: 0;
    ">
      <li><a href="/" class="menu-link" data-action="search" style="
        display: flex;
        align-items: center;
        padding: 12px 16px;
        background: white;
        border-radius: 8px;
        text-decoration: none;
        color: #333;
        transition: all 0.2s;
        margin-bottom: 8px;
      ">
        <div class="menu-icon" style="margin-right: 12px; width: 24px; height: 24px;">
          <i class="fa-solid fa-magnifying-glass" style="color: #007bff;"></i>
        </div>
        <span class="menu-text" style="font-size: 16px; font-weight: 500;">Пошук</span>
      </a></li>
      
      <!-- Добавляем пункт меню для чатов -->
      <li><a href="#" class="menu-link" data-action="chats" style="
        display: flex;
        align-items: center;
        padding: 12px 16px;
        background: white;
        border-radius: 8px;
        text-decoration: none;
        color: #333;
        transition: all 0.2s;
        margin-bottom: 8px;
      ">
        <div class="menu-icon" style="margin-right: 12px; width: 24px; height: 24px; position: relative;">
          <i class="fa-regular fa-comment-dots" style="color: #007bff;"></i>
          <span id="chatsBadge" class="menu-badge" style="
            position: absolute;
            top: -5px;
            right: -5px;
            background: #dc3545;
            color: white;
            font-size: 10px;
            padding: 2px 5px;
            border-radius: 10px;
            display: none;
          ">0</span>
        </div>
        <span class="menu-text" style="font-size: 16px; font-weight: 500;">Мої чати</span>
      </a></li>
      
      <!-- Остальные пункты меню -->
    </ul>
  `;
  
  // Обработчик для кнопки закрытия
  if (closeUserOverlayBtn) {
    closeUserOverlayBtn.addEventListener('click', () => {
      userOverlay.classList.remove("active");
      document.body.style.overflow = "";
    });
  }
  
  // Обновляем обработчик для пункта "Мои чаты"
  const chatsMenuItem = overlayBody.querySelector('[data-action="chats"]');
  if (chatsMenuItem) {
    chatsMenuItem.addEventListener('click', (e) => {
      e.preventDefault();
      userOverlay.classList.remove("active");
      document.body.style.overflow = "";
      setTimeout(() => {
        openChatsSidebar();
      }, 300);
    });
  }
  
  // Инициализируем меню
  initUserMenuHandlers();
  updateUserMenu();
  updateChatsBadge();
}

// Функция для обновления бейджа с количеством непрочитанных сообщений
function updateChatsBadge() {
  const chatsBadge = document.getElementById('chatsBadge');
  if (!chatsBadge) return;
  
  const chats = loadUserChats();
  const unreadCount = chats.reduce((total, chat) => total + (chat.unread || 0), 0);
  
  if (unreadCount > 0) {
    chatsBadge.textContent = unreadCount > 9 ? '9+' : unreadCount;
    chatsBadge.style.display = 'block';
  } else {
    chatsBadge.style.display = 'none';
  }
}


function initRealtorChats() {
  const chatsContainer = document.getElementById('realtorChatsContainer');
  const chatsList = document.getElementById('chatsList');
  const newChatBtn = document.getElementById('newChatBtn');
  
  if (!chatsContainer || !chatsList) return;
  

  const userChats = loadUserChats();
  updateChatsList(chatsList, userChats);
  
 
  chatsContainer.style.display = 'block';
  

  if (newChatBtn) {
    newChatBtn.addEventListener('click', () => {
      createNewChat();
    });
  }
}

function loadUserChats() {
  try {
    const raw = localStorage.getItem('userChats');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to load user chats', err);
    return [];
  }
}

function saveUserChats(chats) {
  try {
    localStorage.setItem('userChats', JSON.stringify(chats));
  } catch (err) {
    console.error('Failed to save user chats', err);
  }
}

function updateChatsList(container, chats) {
  if (!container) return;
  
  if (chats.length === 0) {
    container.innerHTML = `
      <div class="chat-empty">
        <p>Ще немає повідомлень</p>
        <p>Почніть розмову з риєлтором</p>
        <button class="start-chat-btn" id="startFirstChat">Почати чат</button>
      </div>
    `;
    
    const startBtn = container.querySelector('#startFirstChat');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        createNewChat();
      });
    }
    return;
  }
  
  container.innerHTML = chats.map(chat => `
    <div class="chat-item ${chat.unread > 0 ? 'unread' : ''}" data-chat-id="${chat.id}">
      <div class="chat-avatar">
        <img src="${chat.realtorAvatar || './src/img/img1.webp'}" alt="${chat.realtorName}">
      </div>
      <div class="chat-info">
        <p class="chat-name">${chat.realtorName}</p>
        <p class="chat-last-message">${chat.lastMessage || 'Немає повідомлень'}</p>
      </div>
      <div class="chat-meta">
        <p class="chat-time">${formatTime(chat.lastMessageTime)}</p>
        ${chat.unread > 0 ? `<span class="chat-unread">${chat.unread}</span>` : ''}
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.chat-item').forEach(item => {
    item.addEventListener('click', () => {
      const chatId = item.dataset.chatId;
      openChatWindow(chatId);
    });
  });
}

function createNewChat() {
  const realtors = [
    { id: 1, name: "Оксана Михайлівна", avatar: "./src/img/img1.webp", rating: 10, experience: "2 роки", objects: 33 },
    { id: 2, name: "Андрій Петрович", avatar: "./src/img/realtor2.jpg", rating: 9.5, experience: "3 роки", objects: 45 },
    { id: 3, name: "Марія Іванівна", avatar: "./src/img/realtor3.jpg", rating: 9.8, experience: "5 років", objects: 67 },
    { id: 4, name: "Сергій Олександрович", avatar: "./src/img/realtor4.jpg", rating: 9.2, experience: "1 рік", objects: 18 }
  ];
  
  const realtorsList = realtors.map(realtor => `
    <div class="realtor-item" data-realtor-id="${realtor.id}">
      <div class="realtor-avatar-small">
        <img src="${realtor.avatar}" alt="${realtor.name}">
      </div>
      <div class="realtor-info">
        <p class="realtor-name">${realtor.name}</p>
        <p class="realtor-details">Рейтинг: ${realtor.rating}/10 • ${realtor.experience} досвіду</p>
      </div>
      <button class="select-realtor-btn">Обрати</button>
    </div>
  `).join('');
  
  const modalHTML = `
    <div class="realtor-selection-modal" id="realtorSelectionModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Оберіть риєлтора для спілкування</h3>
          <button class="close-modal">&times;</button>
        </div>
        <div class="modal-body">
          ${realtorsList}
        </div>
      </div>
    </div>
  `;
  
  const modalContainer = document.createElement('div');
  modalContainer.innerHTML = modalHTML;
  document.body.appendChild(modalContainer);
  

  const modal = modalContainer.querySelector('#realtorSelectionModal');
  modal.style.display = 'block';
  

  const modalStyle = document.createElement('style');
  modalStyle.textContent = `
    .realtor-selection-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      z-index: 10001;
      display: none;
    }
    
    .realtor-selection-modal .modal-content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border-radius: 12px;
      width: 90%;
      max-width: 500px;
      max-height: 80vh;
      overflow-y: auto;
    }
    
    .modal-header {
      padding: 20px;
      border-bottom: 1px solid #e9ecef;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .modal-header h3 {
      margin: 0;
      font-size: 20px;
    }
    
    .close-modal {
      background: none;
      border: none;
      font-size: 28px;
      cursor: pointer;
      color: #666;
    }
    
    .modal-body {
      padding: 20px;
    }
    
    .realtor-item {
      display: flex;
      align-items: center;
      padding: 15px;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      margin-bottom: 10px;
      transition: all 0.2s;
    }
    
    .realtor-item:hover {
      background: #f8f9fa;
      border-color: #007bff;
    }
    
    .realtor-avatar-small {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 15px;
    }
    
    .realtor-avatar-small img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .realtor-info {
      flex: 1;
    }
    
    .realtor-name {
      margin: 0 0 5px 0;
      font-weight: 600;
    }
    
    .realtor-details {
      margin: 0;
      font-size: 14px;
      color: #666;
    }
    
    .select-realtor-btn {
      background: #007bff;
      color: white;
      border: none;
      border-radius: 6px;
      padding: 8px 16px;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .select-realtor-btn:hover {
      background: #0056b3;
    }
  `;
  document.head.appendChild(modalStyle);
  

  modal.querySelector('.close-modal').addEventListener('click', () => {
    modal.remove();
    modalStyle.remove();
  });
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
      modalStyle.remove();
    }
  });

  modal.querySelectorAll('.select-realtor-btn').forEach((btn, index) => {
    btn.addEventListener('click', () => {
      const realtor = realtors[index];
      createChatWithRealtor(realtor);
      modal.remove();
      modalStyle.remove();
    });
  });

  const chatsListContainer = document.getElementById('chatsListContainer');
  if (chatsListContainer) {
    loadChatsIntoSidebar(chatsListContainer);
  }
}

function createChatWithRealtor(realtor) {
  const chatId = Date.now(); 
  const newChat = {
    id: chatId,
    realtorId: realtor.id,
    realtorName: realtor.name,
    realtorAvatar: realtor.avatar,
    messages: [],
    lastMessage: '',
    lastMessageTime: new Date().toISOString(),
    unread: 0,
    createdAt: new Date().toISOString()
  };
  
  const chats = loadUserChats();
  chats.push(newChat);
  saveUserChats(chats);
  

  const chatsList = document.getElementById('chatsList');
  if (chatsList) {
    updateChatsList(chatsList, chats);
  }
  

  openChatWindow(chatId);
}


function openChatWindow(chatId) {

  let chatData;
  try {
    const rawData = localStorage.getItem(chatId);
    if (!rawData) {
      console.error('Чат не найден:', chatId);
      return;
    }
    chatData = JSON.parse(rawData);
  } catch (e) {
    console.error('Ошибка загрузки чата:', e);
    return;
  }
  
  if (!Array.isArray(chatData) || chatData.length === 0) {
    console.error('Чат пустой:', chatId);
    return;
  }
  

  const realtorName = getRealtorNameFromChat(chatData);
  const realtorAvatar = './src/img/img1.webp';

  const chatWindowHTML = `
    <div class="chat-window" id="chatWindow-${chatId}" style="
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 90%;
      max-width: 800px;
      height: 80vh;
      background: white;
      border-radius: 12px;
      box-shadow: 0 5px 30px rgba(0,0,0,0.3);
      z-index: 10000;
      display: none;
      flex-direction: column;
    ">
      <div class="chat-header" style="
        padding: 15px 20px;
        background: linear-gradient(135deg, #007bff, #0056b3);
        color: white;
        border-radius: 12px 12px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      ">
        <div class="chat-header-info" style="display: flex; align-items: center;">
          <div class="chat-header-avatar" style="
            width: 40px;
            height: 40px;
            border-radius: 50%;
            overflow: hidden;
            margin-right: 10px;
          ">
            <img src="${realtorAvatar}" alt="${realtorName}" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <div>
            <h3 style="margin: 0; font-size: 18px;">${realtorName}</h3>
            <p style="margin: 0; font-size: 12px; opacity: 0.8;">
              <span style="display: inline-block; width: 8px; height: 8px; background: #28a745; border-radius: 50%; margin-right: 5px;"></span>
              Онлайн
            </p>
          </div>
        </div>
        <button class="close-chat" style="
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          &times;
        </button>
      </div>
      <div class="chat-messages" id="chatMessages-${chatId}" style="
        flex: 1;
        overflow-y: auto;
        padding: 20px;
        background: #f5f5f5;
      ">
        <!-- Сообщения будут загружены здесь -->
      </div>
      <div class="chat-input" style="
        padding: 15px;
        background: white;
        border-top: 1px solid #e9ecef;
        border-radius: 0 0 12px 12px;
        display: flex;
        gap: 10px;
      ">
        <input type="text" id="chatInput-${chatId}" placeholder="Напишіть повідомлення..." style="
          flex: 1;
          padding: 12px 15px;
          border: 1px solid #ddd;
          border-radius: 25px;
          font-size: 14px;
          outline: none;
        ">
        <button id="sendMessageBtn-${chatId}" style="
          background: #007bff;
          color: white;
          border: none;
          border-radius: 25px;
          padding: 12px 20px;
          cursor: pointer;
          transition: background-color 0.2s;
          font-weight: 500;
        ">
          Надіслати
        </button>
      </div>
    </div>
  `;
  
  const chatContainer = document.createElement('div');
  chatContainer.innerHTML = chatWindowHTML;
  document.body.appendChild(chatContainer);
  
  const chatWindow = chatContainer.querySelector(`#chatWindow-${chatId}`);
  const chatMessages = chatContainer.querySelector(`#chatMessages-${chatId}`);
  const chatInput = chatContainer.querySelector(`#chatInput-${chatId}`);
  const sendBtn = chatContainer.querySelector(`#sendMessageBtn-${chatId}`);
  const closeBtn = chatContainer.querySelector('.close-chat');

  setTimeout(() => {
    chatWindow.style.display = 'flex';
    chatWindow.classList.add('active');

    loadChatMessagesIntoWindow(chatData, chatMessages);

    setTimeout(() => {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 100);
  }, 10);

  sendBtn.addEventListener('click', () => {
    const message = chatInput.value.trim();
    if (message) {
      sendMessageToChat(chatId, message);
      chatInput.value = '';
      

      setTimeout(() => {
        const responses = [
          "Дякую за повідомлення! Я відповім вам найближчим часом.",
          "Зрозуміло, я перегляну ваше запитання і даду відповідь.",
          "Добре, я оброблю вашу інформацію та повідомлю вас.",
          "Дякую за звернення! Як я можу вам допомогти?",
          "Отримав ваше повідомлення. Давайте обговоримо деталі."
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        sendAutoReply(chatId, randomResponse);
      }, Math.random() * 2000 + 1000);
    }
  });

  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendBtn.click();
    }
  });

  setTimeout(() => {
    chatInput.focus();
  }, 100);

  closeBtn.addEventListener('click', () => {
    chatWindow.classList.remove('active');
    setTimeout(() => {
      chatContainer.remove();

      const chatsListContainer = document.getElementById('chatsListContainer');
      if (chatsListContainer) {
        loadChatsIntoSidebar(chatsListContainer);
      }
    }, 300);
  });
}


function loadChatMessagesIntoWindow(chatData, container) {
  if (!Array.isArray(chatData) || chatData.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #666;">Немає повідомлень</p>';
    return;
  }
  

  const sortedMessages = [...chatData].sort((a, b) => 
    (a.timestamp || 0) - (b.timestamp || 0)
  );
  
  container.innerHTML = sortedMessages.map(message => {
    const isUser = message.sender === 'user';
    const time = message.time || formatTime(message.timestamp);
    
    return `
      <div class="message ${isUser ? 'sent' : 'received'}" style="
        margin-bottom: 15px;
        max-width: 70%;
        ${isUser ? 'margin-left: auto;' : 'margin-right: auto;'}
      ">
        <div class="message-content" style="
          padding: 12px 16px;
          border-radius: 18px;
          background: ${isUser ? '#007bff' : 'white'};
          color: ${isUser ? 'white' : '#333'};
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
          border-radius: ${isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px'};
          position: relative;
        ">
          <p style="margin: 0; word-break: break-word; font-size: 14px;">${message.text || ''}</p>
          <div style="
            display: flex;
            justify-content: ${isUser ? 'flex-end' : 'flex-start'};
            margin-top: 5px;
          ">
            <span style="
              font-size: 11px;
              color: ${isUser ? 'rgba(255,255,255,0.8)' : '#999'};
              opacity: 0.8;
            ">
              ${time}
            </span>
            ${isUser ? `
              <span style="
                margin-left: 5px;
                font-size: 11px;
                color: rgba(255,255,255,0.8);
              ">
                <i class="fa-solid fa-check"></i>
              </span>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function sendMessageToChat(chatId, text) {

  let chatData;
  try {
    const rawData = localStorage.getItem(chatId);
    chatData = rawData ? JSON.parse(rawData) : [];
    if (!Array.isArray(chatData)) chatData = [];
  } catch (e) {
    chatData = [];
  }
  

  const newMessage = {
    sender: 'user',
    text: text,
    time: new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }),
    timestamp: Date.now()
  };
  

  chatData.push(newMessage);
  
  try {
    localStorage.setItem(chatId, JSON.stringify(chatData));
  } catch (e) {
    console.error('Ошибка сохранения сообщения:', e);
    return;
  }
  
  const chatMessages = document.getElementById(`chatMessages-${chatId}`);
  if (chatMessages) {
    loadChatMessagesIntoWindow(chatData, chatMessages);
    setTimeout(() => {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 100);
  }
  

  const chatsListContainer = document.getElementById('chatsListContainer');
  if (chatsListContainer) {
    loadChatsIntoSidebar(chatsListContainer);
  }
  

  updateChatsBadge();
}


function sendAutoReply(chatId, text) {

  let chatData;
  try {
    const rawData = localStorage.getItem(chatId);
    chatData = rawData ? JSON.parse(rawData) : [];
    if (!Array.isArray(chatData)) chatData = [];
  } catch (e) {
    chatData = [];
  }
  

  const replyMessage = {
    sender: 'realtor',
    text: text,
    time: new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }),
    timestamp: Date.now()
  };
  

  chatData.push(replyMessage);
  

  try {
    localStorage.setItem(chatId, JSON.stringify(chatData));
  } catch (e) {
    console.error('Ошибка сохранения авто-ответа:', e);
    return;
  }

  const chatMessages = document.getElementById(`chatMessages-${chatId}`);
  if (chatMessages) {
    loadChatMessagesIntoWindow(chatData, chatMessages);
    setTimeout(() => {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 100);
  }

  const chatsListContainer = document.getElementById('chatsListContainer');
  if (chatsListContainer) {
    loadChatsIntoSidebar(chatsListContainer);
  }

  updateChatsBadge();
}

function sendMessage(chatId, text, sender) {
  const chats = loadUserChats();
  const chatIndex = chats.findIndex(c => c.id == chatId);
  
  if (chatIndex === -1) return;
  
  const message = {
    id: Date.now(),
    text: text,
    sender: sender,
    time: new Date().toISOString(),
    read: true
  };
  
  chats[chatIndex].messages.push(message);
  chats[chatIndex].lastMessage = text;
  chats[chatIndex].lastMessageTime = message.time;
  
  if (sender === 'realtor') {
    chats[chatIndex].unread = (chats[chatIndex].unread || 0) + 1;
  }
  
  saveUserChats(chats);
  

  const chatMessages = document.getElementById(`chatMessages-${chatId}`);
  if (chatMessages) {
    loadChatMessages(chatId, chatMessages);
  }
  

  setTimeout(() => {
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }, 100);
  

  updateChatsListInSidebar();
  

  updateFloatingChatButton();
}
document.head.appendChild(userOverlayStyle);

initUserOverlay();



const likesBtn = document.getElementById("likesBtn");
const likesOverlay = document.getElementById("likesOverlay");
const likesSidebar = document.getElementById("likesSidebar");
const closeLikes = document.getElementById("closeLikes");
const likedListings = document.getElementById("likedListings");

document.body.addEventListener("click", e => {
  const likeBtn = e.target.closest(".like-btn");
  if (!likeBtn) return;

  const section = likeBtn.closest("section");
  const id = String(section.dataset.id);
  let liked = getLiked();

  liked.includes(id)
    ? liked = liked.filter(x => x !== id)
    : liked.push(id);

  setLiked(liked);

  const icon = likeBtn.querySelector("i");
  icon.classList.toggle("fa-solid");
  icon.classList.toggle("fa-regular");

  const isNowLiked = liked.includes(id);
  if (isNowLiked) animateLike(icon);

  e.stopPropagation();
});

function animateLike(iconEl) {
  const target = likesBtn;
  if (!iconEl || !target) return;

  const iconRect = iconEl.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();

  const clone = iconEl.cloneNode(true);
  clone.classList.add('flying-like');
  document.body.appendChild(clone);

  const startX = iconRect.left + iconRect.width / 2;
  const startY = iconRect.top + iconRect.height / 2;
  const endX = targetRect.left + targetRect.width / 2;
  const endY = targetRect.top + targetRect.height / 2;

  clone.style.left = startX + 'px';
  clone.style.top = startY + 'px';
  clone.style.transform = 'translate(-50%, -50%) scale(1)';
  clone.style.opacity = '1';
  clone.getBoundingClientRect();

  const dx = endX - startX;
  const dy = endY - startY;

  requestAnimationFrame(() => {
    clone.style.transition = 'transform 700ms cubic-bezier(0.2,0.8,0.2,1), opacity 700ms';
    clone.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%) scale(0.6)`;
    clone.style.opacity = '0';
  });

  clone.addEventListener('transitionend', () => {
    clone.remove();
    target.classList.add('like-pop');
    setTimeout(() => target.classList.remove('like-pop'), 160);
  }, { once: true });
}

likesBtn.addEventListener("click", () => {
  const likedFlats = getAllData().filter(f =>
    getLiked().includes(String(f.id))
  );

  renderFlats(likedListings, likedFlats);

  likesSidebar.classList.add("active");
  likesOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
});

const addListingBtn = document.querySelector('.add-listing-btn');
const addOverlay = document.getElementById('addOverlay');
const addListingSidebar = document.getElementById('addListingSidebar');
const closeAddSidebar = document.getElementById('closeAddSidebar');
const cancelListingBtn = document.getElementById('cancelListingBtn');
const saveListingBtn = document.getElementById('saveListingBtn');
const addListingForm = document.getElementById('addListingForm');
const usdPriceInput = document.getElementById('fld_price_usd');
const uahPriceInput = document.getElementById('fld_price_hrn');
const usdPricePerM2Input = document.getElementById('fld_price_per_m2_usd');
const uahPricePerM2Input = document.getElementById('fld_price_per_m2_hrn');

const EXCHANGE_RATE = 40;

function convertPrices() {
  const usdPrice = parseFloat(usdPriceInput.value) || 0;
  const usdPricePerM2 = parseFloat(usdPricePerM2Input.value) || 0;

  uahPriceInput.value = usdPrice > 0 ? (usdPrice * EXCHANGE_RATE).toLocaleString('uk-UA') : '';
  uahPricePerM2Input.value = usdPricePerM2 > 0 ? (usdPricePerM2 * EXCHANGE_RATE).toLocaleString('uk-UA') : '';
}

usdPriceInput.addEventListener('input', convertPrices);
usdPricePerM2Input.addEventListener('input', convertPrices);

const previewBtn = document.getElementById('previewBtn');
const previewSidebar = document.getElementById('previewSidebar');
const previewOverlay = document.getElementById('previewOverlay');
const closePreviewSidebar = document.getElementById('closePreviewSidebar');
const previewContent = document.getElementById('previewContent');

previewBtn.addEventListener('click', () => {
  const get = id => (document.getElementById(id) && document.getElementById(id).value) || '';
  const getChecked = id => document.getElementById(id) && document.getElementById(id).checked;

  const previewItem = {
    property_type: get('fld_property_type') || 'Квартира',
    price_usd: get('fld_price_usd'),
    price_uah: get('fld_price_hrn'),
    price_per_m2_usd: get('fld_price_per_m2_usd'),
    price_per_m2_uah: get('fld_price_per_m2_hrn'),
    address: get('fld_address'),
    district: get('fld_district'),
    city: get('fld_city') || 'Тернопіль',
    complex: get('fld_complex'),
    rooms: Number(get('fld_rooms')) || 1,
    total_area: get('fld_total_area'),
    living_area: get('fld_living_area'),
    kitchen_area: get('fld_kitchen_area'),
    floor: get('fld_floor'),
    total_floors: Number(get('fld_total_floors')) || 1,
    seller_type: get('fld_seller_type'),
    building_type: get('fld_building_type'),
    build_year: get('fld_build_year'),
    walls: get('fld_walls'),
    ceiling_height: get('fld_ceiling_height'),
    condition: get('fld_condition'),
    heating: get('fld_heating'),
    water_heating: get('fld_water_heating'),
    bathroom: get('fld_bathroom'),
    meters: get('fld_meters'),
    utilities: get('fld_utilities'),
    entrance: get('fld_entrance'),
    furniture: get('fld_furniture'),
    yard_type: get('fld_yard_type'),
    balcony: getChecked('fld_balcony'),
    internal_finish: get('fld_internal_finish'),
    external_finish: get('fld_external_finish'),
    insulation: get('fld_insulation'),
    ceilings_finish: get('fld_ceilings_finish'),
    floor_finish: get('fld_floor_finish'),
    benefits: get('fld_benefits'),
    commission: get('fld_commission'),
    description: get('fld_description'),
    full_description: get('fld_full_description'),
    verified: getChecked('fld_verified'),
    verified_date: get('fld_verified_date'),
    passport_provided: getChecked('fld_passport_provided'),
    phones: get('fld_phones'),
    uploadedImages: document.getElementById('fld_images_upload') ? document.getElementById('fld_images_upload').files.length : 0,
    urlImages: get('fld_images_url') ? get('fld_images_url').split(',').map(s => s.trim()).filter(Boolean) : [],
    created: new Date().toLocaleDateString('uk-UA', { day: '2-digit', month: 'short', year: 'numeric' })
  };

  let detailedDescription = '';
  if (previewItem.description) detailedDescription += previewItem.description;
  if (previewItem.full_description) detailedDescription += (detailedDescription ? '\n\n' : '') + previewItem.full_description;

  const techDetails = [];
  if (previewItem.building_type) techDetails.push(`Тип будівлі: ${previewItem.building_type}`);
  if (previewItem.build_year) techDetails.push(`Рік будівництва: ${previewItem.build_year}`);
  if (previewItem.walls) techDetails.push(`Стіни: ${previewItem.walls}`);
  if (previewItem.ceiling_height) techDetails.push(`Висота стель: ${previewItem.ceiling_height}`);
  if (previewItem.condition) techDetails.push(`Стан: ${previewItem.condition}`);
  if (previewItem.heating) techDetails.push(`Опалення: ${previewItem.heating}`);
  if (previewItem.water_heating) techDetails.push(`Підігрів води: ${previewItem.water_heating}`);
  if (previewItem.bathroom) techDetails.push(`Санвузол: ${previewItem.bathroom}`);
  if (previewItem.meters) techDetails.push(`Лічильники: ${previewItem.meters}`);
  if (previewItem.utilities) techDetails.push(`Комунікації: ${previewItem.utilities}`);
  if (previewItem.entrance) techDetails.push(`Двері: ${previewItem.entrance}`);
  if (previewItem.furniture) techDetails.push(`Меблі: ${previewItem.furniture}`);
  if (previewItem.yard_type) techDetails.push(`Тип двору: ${previewItem.yard_type}`);
  if (previewItem.balcony) techDetails.push(`Балкон: є`);
  if (previewItem.internal_finish) techDetails.push(`Внутрішня обробка: ${previewItem.internal_finish}`);
  if (previewItem.external_finish) techDetails.push(`Зовнішня обробка: ${previewItem.external_finish}`);
  if (previewItem.insulation) techDetails.push(`Утеплення: ${previewItem.insulation}`);
  if (previewItem.ceilings_finish) techDetails.push(`Обробка стель: ${previewItem.ceilings_finish}`);
  if (previewItem.floor_finish) techDetails.push(`Обробка підлоги: ${previewItem.floor_finish}`);
  if (previewItem.benefits) techDetails.push(`Переваги: ${previewItem.benefits}`);
  if (previewItem.commission) techDetails.push(`Комісія: ${previewItem.commission}`);
  if (previewItem.seller_type) techDetails.push(`Тип продавця: ${previewItem.seller_type}`);
  if (previewItem.passport_provided) techDetails.push(`Паспорт надано: так`);
  if (previewItem.phones) techDetails.push(`Контакти: ${previewItem.phones}`);
  const totalImages = previewItem.uploadedImages + previewItem.urlImages.length;
  if (totalImages > 0) techDetails.push(`Зображень: ${totalImages}`);

  if (techDetails.length > 0) {
    detailedDescription += (detailedDescription ? '\n\n' : '') + 'Технічні характеристики:\n' + techDetails.join('\n');
  }

  let imageGallery = '';
  if (totalImages > 0) {
    imageGallery = '<section class="details-photos mt-4 d-flex"><div class="details-carousel position-relative col-lg-9">';
    imageGallery += '<div class="carousel-track details-carousel-track d-flex">';

    previewItem.urlImages.forEach((url, index) => {
      imageGallery += `<img src="${url}" alt="Фото ${index + 1}" class="carousel-slide" style="width: 100%; height: 400px; object-fit: cover;">`;
    });

    if (previewItem.uploadedImages > 0) {
      for (let i = 0; i < previewItem.uploadedImages; i++) {
        imageGallery += `<div class="carousel-slide" style="width: 100%; height: 400px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; color: #666;">Завантажене зображення ${i + 1}</div>`;
      }
    }

    imageGallery += '</div></div></section>';
  }

  previewContent.innerHTML = `
    <main class="container">
      ${imageGallery}
      
      <section class="d-flex-custom">
        <div class="col-lg-9 col-md-12 col-sm-12">
          <div>
            <p class="bold">Продаж ${previewItem.property_type || 'Квартири'} ${previewItem.total_area ? previewItem.total_area + ' кв. м' : ''} ${previewItem.address ? 'на ' + previewItem.address : ''} • ID ${Math.floor(Math.random() * 90000000) + 10000000}</p>

            <div class="d-flex">
              <p class="px-3 fs-19">${previewItem.address || ''}</p>
              <p class="px-3 fs-19">${previewItem.city || 'Тернопіль'}</p>
              ${previewItem.district ? `<p class="px-3 fs-19">${previewItem.district}</p>` : ''}
            </div>

            <div class="d-flex align-items-stretch">
              ${previewItem.price_usd ? `<p class="px-3 d-flex align-items-center fs-20"><span class="bold">${parseFloat(previewItem.price_usd).toLocaleString('uk-UA')} $</span> за об'єкт</p>` : ''}
              ${previewItem.price_uah ? `<p class="px-3 d-flex align-items-center fs-20">${previewItem.price_uah} грн</p>` : ''}
              ${previewItem.price_per_m2_uah ? `<p class="px-3 d-flex align-items-center fs-20">${previewItem.price_per_m2_uah} грн за м²</p>` : ''}
            </div>
          </div>
          
          ${previewItem.verified ? `
          <div class="verify-div">
            <div class="d-flex p-3">
              <p class="text-center checked-flat">
                <i class="fa-solid fa-house-circle-check mx-2"></i>ПЕРЕВІРЕНА КВАРТИРА
              </p>
              ${previewItem.passport_provided ? `<p class="text-center checked-flat"><i class="fa-solid fa-check mx-2"></i>ПРОДАВЕЦЬ НАДАВ ТЕХПАСПОРТ</p>` : ''}
            </div>
            ${previewItem.verified_date ? `
            <div>
              <p class="py-0 m-0 px-3 verify-title">Перевірено по техпаспорту</p>
              <p class="py-0 m-0 px-3 verify-date">Дата останьої перевірки ${previewItem.verified_date}</p>
            </div>` : ''}
            <div class="p-3">
              ${previewItem.property_type ? `<p class="align-items-center d-flex property-item"><i class="fa-regular fa-circle-check property-icon"></i>${previewItem.property_type}</p>` : ''}
              <p class="align-items-center d-flex property-item"><i class="fa-regular fa-circle-check property-icon"></i>${previewItem.rooms} кімнати</p>
              ${previewItem.floor && previewItem.total_floors ? `<p class="align-items-center d-flex property-item"><i class="fa-regular fa-circle-check property-icon"></i>${previewItem.floor} поверх з ${previewItem.total_floors}</p>` : ''}
              ${previewItem.seller_type ? `<p class="align-items-center d-flex property-item"><i class="fa-regular fa-circle-check property-icon"></i>Пропозиція від ${previewItem.seller_type}</p>` : ''}
            </div>
          </div>` : ''}
        </div>
        
        <div class="realtor-card col-lg-3 mx-3 col-md-12 col-sm-12">
          <div class="d-flex m-2">
            <div class="realtor-avatar">
              <img class="realtor-img" src="./src/img/img1.webp" alt="">
              <div class="realtor-online"></div>
            </div>
            <div class="px-2">
              <p class="m-0 bg-light realtor-badge">
                <i class="fa-regular fa-circle-check"></i> ПЕРЕВІРЕНИЙ РІЄЛТОР
              </p>
              <p class="m-0 realtor-name">Оксана Михайлівна</p>
              <p class="realtor-status">Онлайн</p>
            </div>
          </div>
          <div class="text-center">
            <button class="realtor-btn phone-btn">
              ${previewItem.phones ? previewItem.phones.split(',')[0] : '(067) XXX XX XX'}
            </button>
            <button class="realtor-btn chat-btn">
              Написати в чат
            </button>
          </div>
                      <div class="m-3 d-flex">
              <div class="col-3 text-center">
                <p class="realtor-rating">10</p>
              </div>
              <div class="col-8">
                <p class="realtor-rating-text">Максимальний рейтинг рієлтора</p>
              </div>
              <div class="col-1 d-flex justify-content-center align-items-center">
                <i class="fa-solid fa-arrow-right"></i>
              </div>
            </div>
            <div>
              <p class="realtor-info"><i class="fa-solid fa-check mx-2"></i>Працює з DimRіa 2 роки</p>
              <p class="realtor-info"><i class="fa-solid fa-check mx-2"></i>Продає 33 об'єкти нерухомості</p>
            </div>
          </div>
        </div>
        
        ${detailedDescription ? `
        <section class="my-3">
          <p class="section-title">Опис від продавця</p>
          ${techDetails.map(detail => `<p class="property-detail"><i class="fa-solid fa-check check-icon"></i>${detail}</p>`).join('')}
          <div class="d-flex">
            ${previewItem.benefits ? previewItem.benefits.split(',').map(benefit => `<p class="property-tag">${benefit.trim()}</p>`).join('') : ''}
          </div>
          <div class="mx-2">
            <p class="property-description">${detailedDescription.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div class="feedback-notice col-lg-9">
            <p class="feedback-title">Оголошення неактуальне чи інформація неточна?</p>
            <button class="feedback-btn">Написати відгук <i class="fa-solid fa-arrow-right"></i></button>
          </div>
          
          <div class="ad-info col-lg-9 my-3">
            <p class="ad-info-item">Оголошення створенно ${previewItem.created}</p>
            <p class="ad-info-item">ID ${Math.floor(Math.random() * 90000000) + 10000000}</p>
            <p class="ad-info-item">Переглядів 0</p>
            <p class="ad-info-item">Збереженнь в обране 0</p>
          </div>
        </section>` : ''}
      </main>
    `;

  previewSidebar.classList.add('active');
  previewOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  document.body.classList.add('modal-open');

  let previewModalCloseListener = null;
  if (previewModalCloseListener) document.removeEventListener('click', previewModalCloseListener);
  previewModalCloseListener = (e) => {
    if (previewSidebar.classList.contains('active') && !previewSidebar.contains(e.target)) {
      closePreviewModal();
    }
  };
  setTimeout(() => {
    document.addEventListener('click', previewModalCloseListener);
  }, 0);
});

closePreviewSidebar.addEventListener('click', () => {
  previewSidebar.classList.remove('active');
  previewOverlay.classList.remove('active');
  document.body.style.overflow = '';
  document.body.classList.remove('modal-open');
  let previewModalCloseListener = null;
  if (previewModalCloseListener) {
    document.removeEventListener('click', previewModalCloseListener);
    previewModalCloseListener = null;
  }
});

previewOverlay.addEventListener('click', () => {
  previewSidebar.classList.remove('active');
  previewOverlay.classList.remove('active');
  document.body.style.overflow = '';
  document.body.classList.remove('modal-open');
  let previewModalCloseListener = null;
  if (previewModalCloseListener) {
    document.removeEventListener('click', previewModalCloseListener);
    previewModalCloseListener = null;
  }
});

if (saveListingBtn) {
  saveListingBtn.addEventListener('click', async () => {
    if (!addListingForm) return;
    const get = id => (document.getElementById(id) && document.getElementById(id).value) || '';
    const getChecked = id => document.getElementById(id) && document.getElementById(id).checked;
    const getTextarea = id => (document.getElementById(id) && document.getElementById(id).value) || '';

    const usdPrice = parseFloat(get('fld_price_usd')) || 0;
    const usdPricePerM2 = parseFloat(get('fld_price_per_m2_usd')) || 0;

    const newItem = {};


    newItem.price = usdPrice ? `${usdPrice.toLocaleString('uk-UA')} $` : '';
    newItem.price_hrn = usdPrice ? (usdPrice * EXCHANGE_RATE).toLocaleString('uk-UA') : '';
    newItem.price_per_m2 = usdPricePerM2 ? `${usdPricePerM2.toLocaleString('uk-UA')} $ за м²` : '';
    newItem.price_per_m2_hrn = usdPricePerM2 ? `${(usdPricePerM2 * EXCHANGE_RATE).toLocaleString('uk-UA')} за м²` : '';
    newItem.address = get('fld_address');
    newItem.city = get('fld_city') || 'Тернопіль';
    newItem.district = get('fld_district');
    newItem.complex = get('fld_complex');
    newItem.rooms = Number(get('fld_rooms')) || 1;
    newItem.total_area = get('fld_total_area');
    newItem.living_area = get('fld_living_area');
    newItem.kitchen_area = get('fld_kitchen_area');
    newItem.floor = get('fld_floor');
    newItem.total_floors = Number(get('fld_total_floors')) || 1;
    newItem.property_type = get('fld_property_type') || 'Квартира';
    newItem.seller_type = get('fld_seller_type');
    newItem.building_type = get('fld_building_type');
    newItem.build_year = get('fld_build_year');
    newItem.walls = get('fld_walls');
    newItem.ceiling_height = get('fld_ceiling_height');
    newItem.condition = get('fld_condition');
    newItem.heating = get('fld_heating');
    newItem.water_heating = get('fld_water_heating');
    newItem.bathroom = get('fld_bathroom');
    newItem.meters = get('fld_meters') ? get('fld_meters').split(',').map(s => s.trim()).filter(Boolean) : [];
    newItem.utilities = get('fld_utilities') ? get('fld_utilities').split(',').map(s => s.trim()).filter(Boolean) : [];
    newItem.entrance = get('fld_entrance');
    newItem.furniture = get('fld_furniture');
    newItem.yard_type = get('fld_yard_type');
    newItem.balcony = getChecked('fld_balcony');
    newItem.internal_finish = get('fld_internal_finish');
    newItem.external_finish = get('fld_external_finish');
    newItem.insulation = get('fld_insulation');
    newItem.ceilings_finish = get('fld_ceilings_finish');
    newItem.floor_finish = get('fld_floor_finish');
    newItem.benefits = get('fld_benefits') ? get('fld_benefits').split(',').map(s => s.trim()).filter(Boolean) : [];
    newItem.commission = get('fld_commission');
    newItem.description = get('fld_description');
    newItem.full_description = get('fld_full_description') || newItem.description;
    newItem.verified = getChecked('fld_verified');
    newItem.verified_date = get('fld_verified_date');
    newItem.passport_provided = getChecked('fld_passport_provided');


    newItem.district_rating = {
      overall: parseFloat(get('fld_district_rating')) || 0,
      transport: parseFloat(get('fld_rating_transport')) || 0,
      safety: parseFloat(get('fld_rating_safety')) || 0,
      ecology: parseFloat(get('fld_rating_ecology')) || 0,
      infrastructure: parseFloat(get('fld_rating_infrastructure')) || 0,
      comfort: parseFloat(get('fld_rating_comfort')) || 0
    };


    newItem.infrastructure = {
      education: parseInfrastructureText(getTextarea('fld_education')),
      kindergartens: parseInfrastructureText(getTextarea('fld_kindergartens')),
      schools: parseInfrastructureText(getTextarea('fld_schools')),
      shops: parseInfrastructureText(getTextarea('fld_shops')),
      hospitals: parseInfrastructureText(getTextarea('fld_hospitals')),
      parks: parseInfrastructureText(getTextarea('fld_parks')),
      transport: parseInfrastructureText(getTextarea('fld_transport')),
      parking: parseInfrastructureText(getTextarea('fld_parking'))
    };

    newItem.amenities = [];
    if (getChecked('fld_amenity_green')) newItem.amenities.push('Озеленення');
    if (getChecked('fld_amenity_parking')) newItem.amenities.push('Місця для паркінгу');
    if (getChecked('fld_amenity_sport')) newItem.amenities.push('Спортивний майданчик');
    if (getChecked('fld_amenity_playground')) newItem.amenities.push('Дитячий майданчик');

    function parseInfrastructureText(text) {
      if (!text) return [];
      return text.split('\n')
        .map(line => line.trim())
        .filter(line => line)
        .map(line => {
          const parts = line.split('-');
          if (parts.length >= 2) {
            return {
              name: parts[0].trim(),
              walk_time: parts[1].trim()
            };
          }
          return { name: line.trim(), walk_time: '' };
        });
    }


    newItem.images = [];

    const urlImages = get('fld_images_url') ? get('fld_images_url').split(',').map(s => s.trim()).filter(Boolean) : [];
    newItem.images.push(...urlImages);

    const imageInput = document.getElementById('fld_images_upload');
    if (imageInput && imageInput.files && imageInput.files.length > 0) {
      for (let file of imageInput.files) {
        if (file.type.startsWith('image/')) {
          const dataUrl = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(file);
          });
          newItem.images.push(dataUrl);
        }
      }
    }

    const phones = get('fld_phones') ? get('fld_phones').split(',').map(s => s.trim()).filter(Boolean) : [];
    newItem.contacts = { phones };
    const lat = parseFloat(get('fld_lat')) || null; const lng = parseFloat(get('fld_lng')) || null;
    newItem.coordinates = { lat, lng };

    const all = getAllData();
    const maxId = all.reduce((m, it) => Math.max(m, Number(it.id || 0)), 0);
    const newId = maxId + 1;
    newItem.id = newId;
    newItem.created = new Date().toLocaleDateString('uk-UA', { day: '2-digit', month: 'short', year: 'numeric' });
    newItem.views = 0;
    newItem.saved = 0;
    newItem.listing_id = 'ID ' + (Math.floor(Math.random() * 90000000) + 10000000);

    const users = loadUserListings();
    users.push(newItem);
    saveUserListings(users);

    closeAddListingModal();
    applyFilters();
    alert('Оголошення збережено локально');
  });
}




function getInfrastructureTitle(key) {
  const titles = {
    education: 'Навчальні заклади',
    kindergartens: 'Дитячі садки',
    schools: 'Школи',
    shops: 'Магазини/ТЦ',
    hospitals: 'Лікарні',
    parks: 'Парки',
    transport: 'Транспорт',
    parking: 'Паркінг'
  };
  return titles[key] || key;
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const modal = document.getElementById('addListingModal');
    if (modal && modal.style.display === 'flex') closeAddListingModal();
  }
});

function closeSidebar() {
  likesSidebar.classList.remove("active");
  likesOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

closeLikes.addEventListener("click", closeSidebar);
likesOverlay.addEventListener("click", closeSidebar);

likesSidebar.addEventListener("click", function (e) {
  e.stopPropagation();
});



function openChatsSidebar() {
  const chatsSidebar = document.getElementById('chatsSidebar');
  const chatsOverlay = document.getElementById('chatsOverlay');
  
  if (chatsSidebar && chatsOverlay) {

    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    if (!isLoggedIn) {
      alert('Будь ласка, увійдіть в акаунт для перегляду чатів.');
      handleLogin();
      return;
    }
    
    chatsSidebar.classList.add('active');
    chatsOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');

    const chatsListContainer = document.getElementById('chatsListContainer');
    if (chatsListContainer) {
      loadChatsIntoSidebar(chatsListContainer);
    }

    chatsOverlay.addEventListener('click', function overlayClickHandler(e) {
      if (e.target === chatsOverlay) {
        closeChatsSidebar();
        chatsOverlay.removeEventListener('click', overlayClickHandler);
      }
    });
  }
}


function closeChatsSidebar() {
  const chatsSidebar = document.getElementById('chatsSidebar');
  const chatsOverlay = document.getElementById('chatsOverlay');
  
  if (chatsSidebar && chatsOverlay) {
    chatsSidebar.classList.remove('active');
    chatsOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}


function loadChatsIntoSidebar(container) {
  const chats = getChatsList();
  
  if (chats.length === 0) {
    container.innerHTML = `
      <div class="chat-empty text-center py-5">
        <div class="empty-icon mb-3">
          <i class="fa-regular fa-comments fa-3x text-muted"></i>
        </div>
        <p class="mb-2" style="font-size: 16px; color: #666;">Ще немає активних чатів</p>
        <p class="mb-4" style="font-size: 14px; color: #999;">Чати з'являться після спілкування з риєлторами</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = chats.map(chat => {

    const lastMessage = chat.messages && chat.messages.length > 0 
      ? chat.messages[chat.messages.length - 1] 
      : null;
    
    let lastMessageText = 'Немає повідомлень';
    if (lastMessage && lastMessage.text) {
      const text = lastMessage.text || '';
      lastMessageText = text.length > 30 ? text.substring(0, 30) + '...' : text;
    }
    

    const realtorAvatar = chat.realtorAvatar || './src/img/img1.webp';
    

    let messageStyle = '';
    if (lastMessage) {
      if (lastMessage.sender === 'user') {
        messageStyle = 'font-weight: 500;';
      } else if (lastMessage.sender === 'realtor') {
        messageStyle = 'color: #007bff;';
      }
    }
    
    return `
      <div class="chat-item" data-chat-id="${chat.id}" style="
        display: flex;
        align-items: center;
        padding: 12px 15px;
        margin-bottom: 8px;
        border-radius: 10px;
        cursor: pointer;
        transition: background-color 0.2s;
        border: 1px solid #f0f0f0;
        background: white;
      ">
        <div class="chat-avatar" style="
          width: 45px;
          height: 45px;
          border-radius: 50%;
          overflow: hidden;
          margin-right: 12px;
          flex-shrink: 0;
          position: relative;
        ">
          <img src="${realtorAvatar}" 
               alt="${chat.realtorName}" 
               style="width: 100%; height: 100%; object-fit: cover;">
          <div style="
            position: absolute;
            bottom: 0;
            right: 0;
            width: 12px;
            height: 12px;
            background: #28a745;
            border-radius: 50%;
            border: 2px solid white;
          "></div>
        </div>
        <div class="chat-info" style="flex: 1; min-width: 0;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <p class="chat-name" style="
              margin: 0;
              font-weight: 600;
              font-size: 14px;
              color: #333;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            ">
              ${chat.realtorName}
            </p>
            <span class="chat-time" style="
              font-size: 11px;
              color: #999;
              flex-shrink: 0;
              margin-left: 8px;
            ">
              ${formatTime(chat.lastMessageTime || chat.createdAt)}
            </span>
          </div>
          <p class="chat-last-message" style="
            margin: 0;
            font-size: 13px;
            color: #666;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            ${messageStyle}
          ">
            ${lastMessage && lastMessage.sender === 'user' ? '<i class="fa-solid fa-check" style="font-size: 10px; margin-right: 4px; color: #28a745;"></i>' : ''}
            ${lastMessageText}
          </p>
        </div>
        ${chat.unread > 0 ? `
          <div class="chat-unread" style="
            background: #dc3545;
            color: white;
            font-size: 12px;
            font-weight: 600;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 8px;
            flex-shrink: 0;
          ">
            ${chat.unread > 9 ? '9+' : chat.unread}
          </div>
        ` : ''}
      </div>
    `;
  }).join('');

  container.querySelectorAll('.chat-item').forEach(item => {
    item.addEventListener('click', () => {
      const chatId = item.dataset.chatId;
      closeChatsSidebar();
      setTimeout(() => {
        openChatWindow(chatId);
      }, 300);
    });
  });
}

document.addEventListener('click', function (e) {
  const element = e.target;
  const tagName = element.tagName.toLowerCase();
  const classes = element.className || '';

  if (tagName === 'i' && classes.includes('fa-bell')) {
    console.log('=== BELL CLICK DETECTED ===');
    e.preventDefault();
    e.stopPropagation();
    openChatsSidebar();
    return;
  }

  const bellElement = element.closest('.fa-bell') || element.closest('.fa-regular.fa-bell');
  if (bellElement) {
    console.log('=== BELL CLICK DETECTED (closest) ===');
    e.preventDefault();
    e.stopPropagation();
    openChatsSidebar();
    return;
  }
}, true);


function initChatsSidebar() {
  const closeChatsSidebarBtn = document.getElementById('closeChatsSidebar');
  const chatsOverlay = document.getElementById('chatsOverlay');
  const newChatBtn = document.getElementById('newChatBtn');
  
  if (closeChatsSidebarBtn) {
    closeChatsSidebarBtn.addEventListener('click', closeChatsSidebar);
  }
  
  if (chatsOverlay) {
    chatsOverlay.addEventListener('click', closeChatsSidebar);
  }
  
  if (newChatBtn) {
    newChatBtn.addEventListener('click', () => {
      closeChatsSidebar();
      setTimeout(() => {
        createNewChat();
      }, 300);
    });
  }
  

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeChatsSidebar();
    }
  });
}


document.addEventListener('DOMContentLoaded', () => {

  initChatsSidebar();
});


function formatTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffHours = diffMs / (1000 * 60 * 60);
  
  if (diffHours < 24) {
    return date.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
  } else if (diffHours < 48) {
    return 'Вчора';
  } else {
    return date.toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit' });
  }
}


function loadAllChatsFromStorage() {
  try {

    const chats = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key && key.startsWith('chat')) {
        try {
          const chatData = JSON.parse(localStorage.getItem(key));
          if (Array.isArray(chatData) && chatData.length > 0) {

            chats[key] = {
              id: key,
              realtorId: 1, 
              realtorName: 'Риєлтор', 
              realtorAvatar: './src/img/img1.webp',
              messages: chatData.map(msg => ({
                id: msg.timestamp || Date.now(),
                text: msg.text || '',
                sender: msg.sender === 'user' ? 'user' : 'realtor',
                time: msg.time || new Date(msg.timestamp).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }),
                timestamp: msg.timestamp,
                read: true
              })),
              
              lastMessage: chatData.length > 0 ? (chatData[chatData.length - 1].text || '') : '',
              lastMessageTime: chatData.length > 0 ? (chatData[chatData.length - 1].time || new Date(chatData[chatData.length - 1].timestamp).toISOString()) : new Date().toISOString(),
              unread: 0,
              createdAt: chatData.length > 0 ? new Date(chatData[0].timestamp).toISOString() : new Date().toISOString(),

              realtorName: getRealtorNameFromChat(chatData)
            };
          }
        } catch (e) {
          console.error(`Ошибка парсинга чата ${key}:`, e);
        }
      }
    }
    
    return Object.values(chats);
  } catch (err) {
    console.error('Ошибка загрузки чатов из localStorage:', err);
    return [];
  }
}


function getRealtorNameFromChat(messages) {

  const realtorMessage = messages.find(msg => msg.sender === 'realtor');
  if (realtorMessage && realtorMessage.text) {

    const text = realtorMessage.text;
    

    if (text.includes('Оксана')) return 'Оксана Михайлівна';
    if (text.includes('Андрій')) return 'Андрій Петрович';
    if (text.includes('Марія')) return 'Марія Іванівна';
    if (text.includes('Сергій')) return 'Сергій Олександрович';

    const nameMatch = text.match(/я\s+([А-ЯІЇЄҐ][а-яіїєґ']+\s+[А-ЯІЇЄҐ][а-яіїєґ']+)/i);
    if (nameMatch) return nameMatch[1];

    if (text.includes('ваш риєлтор')) {
      const nameMatch2 = text.match(/Я\s+([^,]+)/);
      if (nameMatch2) return nameMatch2[1].trim();
    }
  }
  

  return 'Риєлтор';
}

function getChatsList() {
  const chats = loadAllChatsFromStorage();
  

  return chats.sort((a, b) => {
    const timeA = new Date(a.lastMessageTime || a.createdAt || 0);
    const timeB = new Date(b.lastMessageTime || b.createdAt || 0);
    return timeB - timeA;
  });

}
