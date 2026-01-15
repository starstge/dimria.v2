import db from "../db.json";

export function populatePropertyDetails(item) {
  const detailsTrack = document.querySelector(".details-carousel-track");
  if (detailsTrack && item.images && item.images.length > 0) {
    detailsTrack.innerHTML = item.images.map(img => `
      <div class="details-carousel-slide" style="min-width:100%">
        <img src="${img}" alt="Квартира" style="width:100%; height:500px; object-fit:cover; border-radius:5px;">
      </div>
    `).join("");
  }

  const previewImg = document.querySelector('.photos-preview-img');
  if (previewImg && item.images && item.images.length > 0) {
    previewImg.src = item.images[0];
  }

  const titleElements = document.querySelectorAll('section.d-flex-custom .bold');
  if (titleElements.length > 0) {
    const titleElement = titleElements[0];
    titleElement.textContent = `Продаж ${item.rooms}к квартири ${item.total_area} на ${item.address} • ${item.listing_id}`;
  }

  const addressElements = document.querySelectorAll('section.d-flex-custom .fs-19');
  if (addressElements.length >= 2) {
    addressElements[0].textContent = item.address;
    addressElements[1].textContent = item.city;
  }

  const priceElements = document.querySelectorAll('section.d-flex-custom .fs-20');
  if (priceElements.length >= 3) {
    const firstPriceElement = priceElements[0];
    const boldSpan = firstPriceElement.querySelector('.bold');
    if (boldSpan) {
      boldSpan.textContent = item.price;
    }

    priceElements[1].textContent = item.price_hrn || '';
    priceElements[2].textContent = item.price_per_m2 || '';
  }

  const verifyDiv = document.querySelector('.verify-div');
  if (verifyDiv) {
    const checkedFlatElements = verifyDiv.querySelectorAll('.checked-flat');
    if (checkedFlatElements.length >= 2) {
      checkedFlatElements[0].style.display = item.verified ? 'block' : 'none';
      checkedFlatElements[1].style.display = item.passport_provided ? 'block' : 'none';
    }

    const verifyDate = verifyDiv.querySelector('.verify-date');
    if (verifyDate && item.verified_date) {
      verifyDate.textContent = `Дата останьої перевірки ${item.verified_date}`;
    }

    const propertyItems = verifyDiv.querySelectorAll('.property-item');
    if (propertyItems.length >= 4) {
      propertyItems[0].innerHTML = `<i class="fa-regular fa-circle-check property-icon"></i>${item.property_type}`;
      propertyItems[1].innerHTML = `<i class="fa-regular fa-circle-check property-icon"></i>${item.rooms} кімнати`;
      propertyItems[2].innerHTML = `<i class="fa-regular fa-circle-check property-icon"></i>${item.floor}`;
      propertyItems[3].innerHTML = `<i class="fa-regular fa-circle-check property-icon"></i>${item.seller_type}`;
    }
  }

  const realtorCard = document.querySelector('.realtor-card');
  if (realtorCard) {
    const realtorImg = realtorCard.querySelector('.realtor-img');
    if (realtorImg && item.realtor && item.realtor.avatar) {
      realtorImg.src = item.realtor.avatar;
    }

    const realtorOnline = realtorCard.querySelector('.realtor-online');
    if (realtorOnline) {
      realtorOnline.style.display = item.realtor && item.realtor.online ? 'block' : 'none';
    }

    const realtorBadge = realtorCard.querySelector('.realtor-badge');
    if (realtorBadge) {
      if (item.realtor && item.realtor.verified) {
        realtorBadge.style.display = 'block';
      } else {
        realtorBadge.style.display = 'none';
      }
    }

    const realtorName = realtorCard.querySelector('.realtor-name');
    if (realtorName && item.realtor && item.realtor.name) {
      realtorName.textContent = item.realtor.name;
    }

    const realtorStatus = realtorCard.querySelector('.realtor-status');
    if (realtorStatus) {
      if (item.realtor && item.realtor.online) {
        realtorStatus.textContent = 'Онлайн';
      } else if (item.realtor && item.realtor.last_seen) {
        realtorStatus.textContent = item.realtor.last_seen;
      } else {
        realtorStatus.textContent = 'Не в мережі';
      }
    }

    const phoneButtons = realtorCard.querySelectorAll('.phone-btn');
    if (phoneButtons.length > 0 && item.contacts && item.contacts.phones) {
      phoneButtons.forEach((btn, index) => {
        if (index < item.contacts.phones.length) {
          btn.textContent = item.contacts.phones[index];
          btn.style.display = '';
        } else {
          btn.style.display = 'none';
        }
      });
    }

    const chatBtn = realtorCard.querySelector('.chat-btn');

    const realtorRating = realtorCard.querySelector('.realtor-rating');
    if (realtorRating) {
      if (item.realtor && item.realtor.rating) {
        realtorRating.textContent = item.realtor.rating;
      } else {
        const ratingContainer = realtorRating.closest('.d-flex');
        if (ratingContainer) {
          ratingContainer.style.display = 'none';
        }
      }
    }

    const realtorInfoElements = realtorCard.querySelectorAll('.realtor-info');
    if (realtorInfoElements.length >= 2) {
      if (item.realtor && item.realtor.experience_years) {
        realtorInfoElements[0].innerHTML = `<i class="fa-solid fa-check mx-2"></i>Працює ${item.realtor.experience_years} років`;
      } else {
        realtorInfoElements[0].style.display = 'none';
      }

      if (item.realtor && item.realtor.listings_sold) {
        realtorInfoElements[1].innerHTML = `<i class="fa-solid fa-check mx-2"></i>Продає ${item.realtor.listings_sold} об'єкти нерухомості`;
      } else {
        realtorInfoElements[1].style.display = 'none';
      }
    }

    if (chatBtn) {
      chatBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openChatModal(item);
      });
    }
  }

  const propertyDetails = document.querySelectorAll('.property-detail');
  if (propertyDetails.length >= 4) {
    propertyDetails[0].innerHTML = `<i class="fa-solid fa-check check-icon"></i>Загальна площа ${item.total_area}, житлова ${item.living_area}, кухня ${item.kitchen_area}`;
    propertyDetails[1].innerHTML = `<i class="fa-solid fa-check check-icon"></i>Стіни з ${item.walls}`;
    propertyDetails[2].innerHTML = `<i class="fa-solid fa-check check-icon"></i>Побудовано ${item.build_year}`;
    propertyDetails[3].innerHTML = `<i class="fa-solid fa-check check-icon"></i>${item.commission}`;
  }

  const tagsContainer = document.querySelector('section.my-3 .d-flex');
  if (tagsContainer && item.benefits && item.benefits.length > 0) {
    tagsContainer.innerHTML = '';
    item.benefits.forEach(benefit => {
      const tag = document.createElement('p');
      tag.className = 'property-tag';
      tag.textContent = benefit;
      tagsContainer.appendChild(tag);
    });
  }

  const propertyDescription = document.querySelector('.property-description');
  if (propertyDescription && item.description) {
    propertyDescription.textContent = item.description;
  }

  const fullDesc = document.getElementById('fullDesc');
  if (fullDesc && item.full_description) {
    fullDesc.innerHTML = `<p>${item.full_description}</p>`;
  }

  const adInfoItems = document.querySelectorAll('.ad-info-item');
  if (adInfoItems.length >= 4) {
    adInfoItems[0].textContent = `Оголошення створенно ${item.created}`;
    adInfoItems[1].textContent = item.listing_id;
    adInfoItems[2].textContent = `Переглядів ${item.views ? item.views.toLocaleString() : '0'}`;
    adInfoItems[3].textContent = `Збереженнь в обране ${item.saved || '0'}`;
  }

  const contactSection = document.querySelector('.contact-section');
  if (contactSection) {
    const contactRealtorImg = contactSection.querySelector('.realtor-img');
    if (contactRealtorImg && item.realtor && item.realtor.avatar) {
      contactRealtorImg.src = item.realtor.avatar;
    }

    const contactRealtorOnline = contactSection.querySelector('.realtor-online');
    if (contactRealtorOnline) {
      contactRealtorOnline.style.display = item.realtor && item.realtor.online ? 'block' : 'none';
    }

    const contactRealtorBadge = contactSection.querySelector('.realtor-badge');
    if (contactRealtorBadge) {
      contactRealtorBadge.style.display = item.realtor && item.realtor.verified ? 'block' : 'none';
    }

    const contactRealtorName = contactSection.querySelector('.realtor-name');
    if (contactRealtorName && item.realtor && item.realtor.name) {
      contactRealtorName.textContent = item.realtor.name;
    }

    const contactRealtorStatus = contactSection.querySelector('.realtor-status');
    if (contactRealtorStatus) {
      contactRealtorStatus.textContent = item.realtor && item.realtor.online ? 'Онлайн' : 'Не в мережі';
    }

    const contactPhoneBtns = contactSection.querySelectorAll('.contact-phone-btn');
    if (contactPhoneBtns.length > 0 && item.contacts && item.contacts.phones) {
      contactPhoneBtns.forEach((btn, index) => {
        if (index < item.contacts.phones.length) {
          btn.textContent = item.contacts.phones[index];
          btn.style.display = '';
        } else {
          btn.style.display = 'none';
        }
      });
    }

    const contactChatBtn = contactSection.querySelector('.contact-chat-btn');
    if (contactChatBtn) {
      contactChatBtn.style.display = item.contacts && item.contacts.chat_available ? 'block' : 'none';
      
      contactChatBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openChatModal(item);
      });
    }
  }

  const buildingAddress = document.querySelector('.building-address');
  if (buildingAddress) {
    buildingAddress.textContent = item.building_info && item.building_info.address ? item.building_info.address : item.address;
  }

  const buildingInfoContainer = document.querySelector('.building-info .p-3');

  if (buildingInfoContainer) {
    buildingInfoContainer.querySelectorAll('.info-item').forEach(item => item.remove());

    const buildingItems = [
      `Збудований у ${item.building_info?.build_year_range ?? item.build_year}`,
      `${item.building_info?.external_walls ?? item.walls}`,
      ...(item.building_info?.entrances ? [`${item.building_info.entrances} під'їзди`] : []),
      `${item.insulation}`
    ];

    const yardItems = [
      `${item.yard_type}`,
      `оздоблений двір`
    ];

    const amenitiesItems = [
      ...(item.building_info?.amenities ?? [])
    ];

    const subtitles = buildingInfoContainer.querySelectorAll('.info-subtitle');

    function appendAfterSubtitle(subtitleText, items) {
      const subtitle = Array.from(subtitles).find(el => el.textContent.trim() === subtitleText);
      if (subtitle) {
        items.forEach(text => {
          const p = document.createElement('p');
          p.className = 'info-item';
          p.innerHTML = `<i class="fa-solid fa-check check-icon"></i>${text}`;
          subtitle.insertAdjacentElement('afterend', p);
        });
      }
    }

    appendAfterSubtitle('Будинок', buildingItems);
    appendAfterSubtitle('Двір', yardItems);
    appendAfterSubtitle('Додаткові зручності', amenitiesItems);
  }

  if (document.getElementById('map') && item.coordinates && item.coordinates.lat && item.coordinates.lng) {
    initPropertyMap(item);
  }
}

export function populateInfrastructure(item) {
  if (!item.infrastructure) {
    return;
  }

  const infrastructureCategories = [
    { key: 'education', title: 'Навчальні заклади', icon: 'fa-school' },
    { key: 'kindergartens', title: 'Дитячий садок', icon: 'fa-rocket' },
    { key: 'schools', title: 'Школа', icon: 'fa-school' },
    { key: 'shops', title: 'ТЦ, ринок, магазини', icon: 'fa-cart-shopping' },
    { key: 'hospitals', title: 'Лікарня', icon: 'fa-star-of-life' },
    { key: 'parks', title: 'Паркові зони', icon: 'fa-tree' },
    { key: 'transport', title: "Транспортна розв'язка", icon: 'fa-bus' },
    { key: 'parking', title: 'Наземний паркінг', icon: 'fa-square-parking' }
  ];

  const infrastructureContainers = document.querySelectorAll('.row.g-4 > div');

  infrastructureCategories.forEach((category, index) => {
    if (index >= infrastructureContainers.length) return;

    const container = infrastructureContainers[index];
    const items = item.infrastructure[category.key];

    if (items && items.length > 0) {
      const categoryTitle = container.querySelector('.infrastructure-category');
      if (categoryTitle) {
        categoryTitle.innerHTML = `
          <span class="category-icon">
            <i class="fa-solid ${category.icon}"></i>
          </span>
          ${category.title}
        `;
      }

      const infrastructureItems = container.querySelectorAll('.infrastructure-item');
      items.slice(0, 3).forEach((place, itemIndex) => {
        if (infrastructureItems[itemIndex]) {
          const walkTimeSpan = infrastructureItems[itemIndex].querySelector('.walk-time span');
          const textDiv = infrastructureItems[itemIndex].querySelector('div:last-child');

          if (walkTimeSpan) walkTimeSpan.textContent = place.walk_time;
          if (textDiv) textDiv.textContent = place.name;
        }
      });
    }
  });
}

export function populateDistrictRating(item) {
  if (!item.district_rating) return;

  const sectionTitle = document.querySelector('section:last-child .section-title');
  if (sectionTitle) {
    sectionTitle.textContent = `Рейтинг району ${item.district}`;
  }

  const ratingValues = [
    item.district_rating.overall,
    item.district_rating.transport,
    item.district_rating.safety,
    item.district_rating.ecology,
    item.district_rating.infrastructure,
    item.district_rating.comfort
  ];

  const circleInners = document.querySelectorAll('.circle-inner');
  ratingValues.forEach((value, index) => {
    if (circleInners[index] && value !== undefined) {
      circleInners[index].textContent = value;
      const ratingCircle = circleInners[index].closest('.rating-circle');
      if (ratingCircle) {
        ratingCircle.setAttribute('data-value', value);
      }
    }
  });

  const reviewTextElements = document.querySelectorAll('.review-text');
  if (reviewTextElements.length >= 2 && item.district_rating.reviews_count) {
    reviewTextElements[0].textContent = `Читати всі ${item.district_rating.reviews_count} відгуків про район ${item.district}`;
  }
}

export function initPropertyMap(item) {
  const mapContainer = document.getElementById('map');
  if (mapContainer) {
    mapContainer.innerHTML = '';
  }

  const map = L.map('map').setView([item.coordinates.lat, item.coordinates.lng], 15);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  L.marker([item.coordinates.lat, item.coordinates.lng])
    .addTo(map)
    .bindPopup(`
      <b>${item.address}</b><br>
      ${item.rooms} кімнати<br>
      ${item.total_area}<br>
      <b>${item.price}</b>
    `)
    .openPopup();
}

export function initCarousel() {
  const detailsTrack = document.querySelector(".details-carousel-track");
  if (!detailsTrack) return;

  const slides = detailsTrack.querySelectorAll(".details-carousel-slide");
  if (slides.length === 0) return;

  let currentSlide = 0;

  const updateCarousel = () => {
    detailsTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    detailsTrack.style.transition = "transform 0.5s ease";
  };

  const nextBtn = document.querySelector(".details-next");
  const prevBtn = document.querySelector(".details-prev");

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      currentSlide = (currentSlide + 1) % slides.length;
      updateCarousel();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      updateCarousel();
    });
  }

  updateCarousel();
}

export function openPhotosModal(currentItem) {
  if (!currentItem) return;

  const photos = currentItem.images || [];
  if (photos.length === 0) return;

  if (document.querySelector('.photos-modal')) return;

  let currentIndex = 0;

  const modalHTML = `
    <div class="photos-modal" style="
      position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
      background: rgba(0,0,0,0.9); z-index: 9999; display: flex; 
      align-items: center; justify-content: center;">
      
      <button class="modal-close" style="
        position: absolute; top: 20px; right: 20px; background: none; 
        border: none; color: white; font-size: 30px; cursor: pointer;
        z-index: 10000;">
        &times;
      </button>
      
      <button class="modal-prev" style="
        position: absolute; left: 20px; top: 50%; transform: translateY(-50%);
        background: rgba(255,255,255,0.2); 
        border: none; color: white; width: 50px; height: 50px; border-radius: 50%; 
        cursor: pointer; font-size: 20px; z-index: 10000;">
        ‹
      </button>
      
      <div class="modal-content" style="max-width: 90%; max-height: 90%;">
        <img id="modal-img" loading="lazy" src="${photos[0]}" alt="Фото" style="
          width: 100%; height: auto; max-height: 80vh; object-fit: contain;">
      </div>
      
      <button class="modal-next" style="
        position: absolute; right: 20px; top: 50%; transform: translateY(-50%);
        background: rgba(255,255,255,0.2); 
        border: none; color: white; width: 50px; height: 50px; border-radius: 50%; 
        cursor: pointer; font-size: 20px; z-index: 10000;">
        ›
      </button>
      
      <div class="photo-counter" style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); 
        color: white; font-size: 16px; z-index: 10000;">
        ${currentIndex + 1} / ${photos.length}
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  const modal = document.querySelector('.photos-modal');
  const modalImg = document.getElementById('modal-img');
  const counter = modal.querySelector('.photo-counter');

  function updateModal() {
    if (modalImg) modalImg.src = photos[currentIndex];
    if (counter) counter.textContent = `${currentIndex + 1} / ${photos.length}`;
  }

  const nextBtn = modal.querySelector('.modal-next');
  const prevBtn = modal.querySelector('.modal-prev');
  const closeBtn = modal.querySelector('.modal-close');

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex + 1) % photos.length;
      updateModal();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex - 1 + photos.length) % photos.length;
      updateModal();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      document.body.removeChild(modal);
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });

  document.addEventListener('keydown', function closeOnEscape(e) {
    if (e.key === 'Escape' && modal.parentNode) {
      document.body.removeChild(modal);
      document.removeEventListener('keydown', closeOnEscape);
    }
  });
}

export function openChatModal(item) {
  let chatModal = document.getElementById('chatModal');
  let chatOverlay = document.getElementById('chatOverlay');
  
  if (chatModal && chatModal.style.display === 'flex') {
    closeChatModal();
    return;
  }
  
  if (!chatModal) {
    const chatKey = `chat_${item.id}`;
    const savedMessages = JSON.parse(localStorage.getItem(chatKey)) || [];
    
    let messagesHTML = '';
    savedMessages.forEach(msg => {
      const isUser = msg.sender === 'user';
      messagesHTML += `
        <div class="chat-message ${isUser ? 'user-message' : 'realtor-message'}" 
             style="
               align-self: ${isUser ? 'flex-end' : 'flex-start'}; 
               max-width: 80%; 
               margin-bottom: 12px;
             ">
          <div style="
            background: ${isUser ? '#007bff' : 'white'}; 
            color: ${isUser ? 'white' : '#333'};
            padding: 10px 15px; 
            border-radius: ${isUser ? '15px 15px 5px 15px' : '15px 15px 15px 5px'}; 
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            word-wrap: break-word;
          ">
            <p style="margin: 0; font-size: 14px; line-height: 1.4;">${msg.text}</p>
            <p style="
              margin: 5px 0 0 0; 
              font-size: 11px; 
              color: ${isUser ? 'rgba(255,255,255,0.8)' : '#999'}; 
              text-align: right;
            ">
              ${msg.time}
            </p>
          </div>
        </div>
      `;
    });
    
    const chatHTML = `
      <div id="chatOverlay" class="chat-overlay" style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 9999;
        display: none;
        cursor: pointer;
      "></div>
      
      <div id="chatModal" class="chat-modal" style="
        position: fixed;
        top: 0;
        right: 0;
        width: 100%;
        max-width: 450px;
        height: 100%;
        background: white;
        z-index: 10000;
        display: none;
        flex-direction: column;
        box-shadow: -5px 0 15px rgba(0,0,0,0.2);
      ">
        <div class="chat-header" style="
          padding: 16px 20px;
          border-bottom: 1px solid #e0e0e0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f8f9fa;
          flex-shrink: 0;
        ">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 44px; height: 44px; border-radius: 50%; overflow: hidden; flex-shrink: 0;">
              <img src="${item.realtor?.avatar || './src/img/img1.webp'}" alt="Аватар" 
                   style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div style="min-width: 0;">
              <h4 style="
                margin: 0; 
                font-weight: 600; 
                font-size: 16px;
                color: #333;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              ">
                ${item.realtor?.name || 'Рієлтор'}
              </h4>
              <p style="
                margin: 4px 0 0 0; 
                font-size: 12px; 
                color: ${item.realtor?.online ? '#28a745' : '#666'};
                display: flex;
                align-items: center;
                gap: 4px;
              ">
                <span style="
                  display: inline-block; 
                  width: 8px; 
                  height: 8px; 
                  background: ${item.realtor?.online ? '#28a745' : '#ccc'}; 
                  border-radius: 50%;
                "></span>
                ${item.realtor?.online ? 'Онлайн' : 'Не в мережі'}
              </p>
            </div>
          </div>
          <button id="closeChat" style="
            background: none; 
            border: none; 
            font-size: 28px; 
            cursor: pointer; 
            color: #666;
            padding: 0;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            transition: background-color 0.2s;
          ">
            &times;
          </button>
        </div>
        
        <div class="chat-body" style="
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          background: linear-gradient(180deg, #f5f5f5 0%, #f0f0f0 100%);
          display: flex;
          flex-direction: column;
          scroll-behavior: smooth;
        ">
          ${savedMessages.length === 0 ? `
            <div style="
              background: #e3f2fd;
              padding: 15px;
              border-radius: 12px;
              margin-bottom: 20px;
              text-align: center;
              border: 1px solid #bbdefb;
            ">
              <p style="
                margin: 0 0 6px 0; 
                font-weight: 600; 
                font-size: 14px;
                color: #1565c0;
              ">
                🏠 Початок діалогу
              </p>
              <p style="
                margin: 0; 
                font-size: 13px; 
                color: #333;
                line-height: 1.4;
              ">
                ${item.address || 'Адреса не вказана'}
              </p>
              <p style="
                margin: 6px 0 0 0; 
                font-size: 12px; 
                color: #666;
              ">
                ${item.price || ''} • ${item.rooms || ''} кімнати
              </p>
            </div>
          ` : ''}
          
          ${messagesHTML}
          
          ${savedMessages.length === 0 ? `
            <div class="chat-tips" style="
              margin-top: auto;
              padding-top: 20px;
              border-top: 1px dashed #ddd;
            ">
              <p style="
                margin: 0 0 8px 0;
                font-size: 12px;
                color: #666;
                text-align: center;
              ">
                💡 Поради для спілкування:
              </p>
              <div style="
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
                justify-content: center;
              ">
                <button class="quick-message" data-message="Чи доступна ще ця квартира?" style="
                  background: white;
                  border: 1px solid #ddd;
                  border-radius: 15px;
                  padding: 6px 12px;
                  font-size: 12px;
                  color: #333;
                  cursor: pointer;
                  transition: all 0.2s;
                ">
                  Чи доступна ще ця квартира?
                </button>
                <button class="quick-message" data-message="Коли можна подивитися?" style="
                  background: white;
                  border: 1px solid #ddd;
                  border-radius: 15px;
                  padding: 6px 12px;
                  font-size: 12px;
                  color: #333;
                  cursor: pointer;
                  transition: all 0.2s;
                ">
                  Коли можна подивитися?
                </button>
                <button class="quick-message" data-message="Яка комісія?" style="
                  background: white;
                  border: 1px solid #ddd;
                  border-radius: 15px;
                  padding: 6px 12px;
                  font-size: 12px;
                  color: #333;
                  cursor: pointer;
                  transition: all 0.2s;
                ">
                  Яка комісія?
                </button>
              </div>
            </div>
          ` : ''}
        </div>
        
        <div class="chat-input" style="
          padding: 16px 20px;
          border-top: 1px solid #e0e0e0;
          background: white;
          flex-shrink: 0;
        ">
          <div style="display: flex; gap: 10px; align-items: center;">
            <input type="text" 
                   id="chatMessage" 
                   placeholder="Напишіть повідомлення..." 
                   style="
                     flex: 1;
                     padding: 12px 16px;
                     border: 1px solid #ddd;
                     border-radius: 24px;
                     outline: none;
                     font-size: 14px;
                     transition: border-color 0.2s;
                     background: #f9f9f9;
                   "
                   autocomplete="off">
            <button id="sendMessage" style="
              background: #007bff;
              color: white;
              border: none;
              border-radius: 50%;
              width: 44px;
              height: 44px;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-shrink: 0;
              transition: background-color 0.2s;
            ">
              <i class="fa-solid fa-paper-plane" style="font-size: 16px;"></i>
            </button>
          </div>
          <p style="
            margin: 8px 0 0 0; 
            font-size: 11px; 
            color: #999; 
            text-align: center;
          ">
            Повідомлення зберігаються локально
          </p>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', chatHTML);
    
    chatModal = document.getElementById('chatModal');
    chatOverlay = document.getElementById('chatOverlay');
    const closeBtn = document.getElementById('closeChat');
    const sendBtn = document.getElementById('sendMessage');
    const messageInput = document.getElementById('chatMessage');
    const chatBody = document.querySelector('.chat-body');
    
    closeBtn.addEventListener('click', closeChatModal);
    closeBtn.addEventListener('mouseenter', () => {
      closeBtn.style.backgroundColor = '#f0f0f0';
    });
    closeBtn.addEventListener('mouseleave', () => {
      closeBtn.style.backgroundColor = 'transparent';
    });
    
    chatOverlay.addEventListener('click', closeChatModal);
    
    sendBtn.addEventListener('click', () => {
      sendMessage(item);
    });
    
    sendBtn.addEventListener('mouseenter', () => {
      sendBtn.style.backgroundColor = '#0056b3';
    });
    sendBtn.addEventListener('mouseleave', () => {
      sendBtn.style.backgroundColor = '#007bff';
    });
    
    messageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage(item);
      }
    });
    
    messageInput.addEventListener('focus', () => {
      messageInput.style.borderColor = '#007bff';
      messageInput.style.backgroundColor = 'white';
    });
    
    messageInput.addEventListener('blur', () => {
      messageInput.style.borderColor = '#ddd';
      messageInput.style.backgroundColor = '#f9f9f9';
    });
    
    document.querySelectorAll('.quick-message').forEach(btn => {
      btn.addEventListener('click', () => {
        messageInput.value = btn.dataset.message;
        messageInput.focus();
      });
      
      btn.addEventListener('mouseenter', () => {
        btn.style.backgroundColor = '#f0f0f0';
        btn.style.borderColor = '#007bff';
      });
      
      btn.addEventListener('mouseleave', () => {
        btn.style.backgroundColor = 'white';
        btn.style.borderColor = '#ddd';
      });
    });
    
    setTimeout(() => {
      chatBody.scrollTop = chatBody.scrollHeight;
    }, 100);
  } else {
    const chatBody = document.querySelector('.chat-body');
    setTimeout(() => {
      chatBody.scrollTop = chatBody.scrollHeight;
    }, 100);
  }
  
  chatModal.style.display = 'flex';
  chatOverlay.style.display = 'block';
  document.body.style.overflow = 'hidden';
  
  setTimeout(() => {
    const input = document.getElementById('chatMessage');
    if (input) {
      input.focus();
    }
  }, 100);
  
  document.addEventListener('keydown', function escapeHandler(e) {
    if (e.key === 'Escape' && chatModal.style.display === 'flex') {
      closeChatModal();
      document.removeEventListener('keydown', escapeHandler);
    }
  });
}

function saveMessageToLocalStorage(itemId, message) {
  const chatKey = `chat_${itemId}`;
  const messages = JSON.parse(localStorage.getItem(chatKey)) || [];
  messages.push(message);
  localStorage.setItem(chatKey, JSON.stringify(messages));
  return messages;
}

function sendMessage(item) {
  const input = document.getElementById('chatMessage');
  const message = input.value.trim();
  
  if (!message) {
    showNotification('Введіть повідомлення', 'error');
    return;
  }
  
  const chatBody = document.querySelector('.chat-body');
  const now = new Date();
  const time = now.getHours().toString().padStart(2, '0') + ':' + 
              now.getMinutes().toString().padStart(2, '0');
  
  const userMessage = {
    sender: 'user',
    text: message,
    time: time,
    timestamp: now.getTime()
  };
  
  saveMessageToLocalStorage(item.id, userMessage);
  
  const messageHTML = `
    <div class="chat-message user-message" style="
      align-self: flex-end; 
      max-width: 80%; 
      margin-bottom: 12px;
    ">
      <div style="
        background: #007bff; 
        color: white; 
        padding: 10px 15px; 
        border-radius: 15px 15px 5px 15px; 
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        word-wrap: break-word;
      ">
        <p style="margin: 0; font-size: 14px; line-height: 1.4;">${message}</p>
        <p style="
          margin: 5px 0 0 0; 
          font-size: 11px; 
          text-align: right; 
          color: rgba(255,255,255,0.8);
        ">
          ${time}
        </p>
      </div>
    </div>
  `;
  
  chatBody.insertAdjacentHTML('beforeend', messageHTML);
  input.value = '';
  
  chatBody.scrollTop = chatBody.scrollHeight;
  
  showNotification('Повідомлення надіслано', 'success');
  
  const tipsSection = document.querySelector('.chat-tips');
  if (tipsSection) {
    tipsSection.style.display = 'none';
  }
  
  const responseTime = 1000 + Math.random() * 2000;
  
  setTimeout(() => {
    const responses = [
      "Дякую за повідомлення! Я відповім вам найближчим часом.",
      "Добре, я перевірю доступність та повідомлю вам.",
      "Можете розповісти більше про ваші потреби?",
      "Запропоную декілька варіантів для перегляду.",
      "Квартира ще доступна. Можемо домовитися про перегляд.",
      "Так, звісно. Яка дата вам підходить для перегляду?",
      "Комісія становить 3% від вартості об'єкта.",
      "Можу надати додаткові фото та відео квартири.",
      "Чи потрібна вам допомога з іпотекою?",
      "Готовий відповісти на всі ваші запитання."
    ];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    const responseTimeStr = new Date().getHours().toString().padStart(2, '0') + ':' + 
                          (new Date().getMinutes() + 1).toString().padStart(2, '0');
    
    const realtorMessage = {
      sender: 'realtor',
      text: randomResponse,
      time: responseTimeStr,
      timestamp: new Date().getTime()
    };
    
    saveMessageToLocalStorage(item.id, realtorMessage);
    
    const responseHTML = `
      <div class="chat-message realtor-message" style="
        align-self: flex-start; 
        max-width: 80%; 
        margin-bottom: 12px;
      ">
        <div style="
          background: white; 
          color: #333; 
          padding: 10px 15px; 
          border-radius: 15px 15px 15px 5px; 
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          word-wrap: break-word;
        ">
          <p style="margin: 0; font-size: 14px; line-height: 1.4;">${randomResponse}</p>
          <p style="
            margin: 5px 0 0 0; 
            font-size: 11px; 
            color: #999; 
            text-align: right;
          ">
            ${responseTimeStr}
          </p>
        </div>
      </div>
    `;
    
    chatBody.insertAdjacentHTML('beforeend', responseHTML);
    chatBody.scrollTop = chatBody.scrollHeight;
  }, responseTime);
}

function showNotification(message, type = 'success') {
  const oldNotification = document.getElementById('temp-notification');
  if (oldNotification) {
    oldNotification.remove();
  }
  
  const notification = document.createElement('div');
  const bgColor = type === 'success' ? '#28a745' : '#dc3545';
  
  notification.style.cssText = `
    position: fixed;
    top: 24px;
    right: 24px;
    background: ${bgColor};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    z-index: 10001;
    font-size: 14px;
    animation: fadeInOut 3s ease-in-out;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    display: flex;
    align-items: center;
    gap: 8px;
    max-width: 320px;
  `;
  notification.id = 'temp-notification';
  
  const icon = type === 'success' ? '✓' : '!';
  notification.innerHTML = `
    <span style="font-size: 16px; font-weight: bold;">${icon}</span>
    <span>${message}</span>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'fadeOut 0.3s ease-in-out';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }
  }, 2700);
}

const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInOut {
    0% { 
      opacity: 0; 
      transform: translateY(-20px) translateX(10px); 
    }
    10% { 
      opacity: 1; 
      transform: translateY(0) translateX(0); 
    }
    90% { 
      opacity: 1; 
      transform: translateY(0) translateX(0); 
    }
    100% { 
      opacity: 0; 
      transform: translateY(-20px) translateX(10px); 
    }
  }
  
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
  
  @keyframes slideIn {
    from { 
      transform: translateX(100%); 
      opacity: 0.5;
    }
    to { 
      transform: translateX(0); 
      opacity: 1;
    }
  }
  
  @keyframes messageAppear {
    from { 
      opacity: 0; 
      transform: translateY(10px); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }
  
  .chat-modal {
    animation: slideIn 0.3s ease-out;
  }
  
  .chat-message {
    animation: messageAppear 0.3s ease-out;
  }
  
  .chat-body::-webkit-scrollbar {
    width: 6px;
  }
  
  .chat-body::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  .chat-body::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }
  
  .chat-body::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
  
  #closeChat:hover {
    background-color: #f0f0f0 !important;
  }
  
  #sendMessage:hover {
    background-color: #0056b3 !important;
    transform: scale(1.05);
    transition: transform 0.2s;
  }
  
  #chatMessage:focus {
    box-shadow: 0 0 0 2px rgba(0,123,255,0.25) !important;
  }
  
  .quick-message:hover {
    background-color: #f0f0f0 !important;
    border-color: #007bff !important;
    transform: translateY(-1px);
    transition: all 0.2s;
  }
  
  @media (max-width: 768px) {
    .chat-modal {
      max-width: 100% !important;
    }
    
    .chat-message {
      max-width: 85% !important;
    }
  }
`;
document.head.appendChild(style);

function closeChatModal() {
  const chatModal = document.getElementById('chatModal');
  const chatOverlay = document.getElementById('chatOverlay');

  if (chatModal) chatModal.style.display = 'none';
  if (chatOverlay) chatOverlay.style.display = 'none';
  document.body.style.overflow = '';
}