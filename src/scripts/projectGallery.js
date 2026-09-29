const track = document.querySelector(".projects__track");
const gallery = document.querySelector(".project-gallery");

if (track && gallery) {
  const galleryImage = gallery.querySelector(".project-gallery__image");
  const galleryClose = gallery.querySelector(".project-gallery__close");
  const galleryOverlay = gallery.querySelector(".project-gallery__overlay");

  const galleryPrev = gallery.querySelector(
    ".project-gallery__arrow--prev"
  );

  const galleryNext = gallery.querySelector(
    ".project-gallery__arrow--next"
  );

  const thumbnailsContainer = gallery.querySelector(
    ".project-gallery__thumbnails"
  );

  let currentImages = [];
  let currentIndex = 0;

  // --------------------------------
  // Показ фотографии
  // --------------------------------

  function showImage(index) {
    if (!currentImages.length || !galleryImage) {
      return;
    }

    if (index < 0) {
      currentIndex = currentImages.length - 1;
    } else if (index >= currentImages.length) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }

    galleryImage.src = currentImages[currentIndex].src;
    galleryImage.alt = currentImages[currentIndex].alt;

    const thumbnails =
      thumbnailsContainer?.querySelectorAll(
        ".project-gallery__thumbnail"
      );

    thumbnails?.forEach((thumbnail, index) => {
      thumbnail.classList.toggle(
        "active",
        index === currentIndex
      );
    });
  }

  // --------------------------------
  // Миниатюры
  // --------------------------------

  function createThumbnails() {
    if (!thumbnailsContainer) {
      return;
    }

    thumbnailsContainer.innerHTML = "";

    currentImages.forEach((imageData, index) => {
      const button = document.createElement("button");

      button.type = "button";
      button.className = "project-gallery__thumbnail";

      const image = document.createElement("img");

      image.src = imageData.src;
      image.alt = imageData.alt;

      button.appendChild(image);

      button.addEventListener("click", () => {
        showImage(index);
      });

      thumbnailsContainer.appendChild(button);
    });
  }

  // --------------------------------
  // Открытие
  // --------------------------------

  function openGallery(card) {
    const images = card.querySelectorAll(
      ".projects__gallery img"
    );

    currentImages = Array.from(images).map((image) => ({
      src: image.src,
      alt: image.alt,
    }));

    if (!currentImages.length) {
      return;
    }

    currentIndex = 0;

    createThumbnails();
    showImage(0);

    gallery.hidden = false;
    gallery.classList.add("active");

    document.body.classList.add("gallery-open");
  }

  // --------------------------------
  // Закрытие
  // --------------------------------

  function closeGallery() {
    gallery.classList.remove("active");
    gallery.hidden = true;

    document.body.classList.remove("gallery-open");
  }

  // --------------------------------
  // Открытие по кнопке проекта
  // --------------------------------

  track.addEventListener("click", (event) => {
    const openButton = event.target.closest(
      ".projects__open-gallery"
    );

    if (!openButton) {
      return;
    }

    const card = openButton.closest(".projects__card");

    if (!card) {
      return;
    }

    openGallery(card);
  });

  // --------------------------------
  // Следующее фото
  // --------------------------------

  galleryNext?.addEventListener("click", () => {
    showImage(currentIndex + 1);
  });

  // --------------------------------
  // Предыдущее фото
  // --------------------------------

  galleryPrev?.addEventListener("click", () => {
    showImage(currentIndex - 1);
  });

  // --------------------------------
  // Закрытие крестиком
  // --------------------------------

  galleryClose?.addEventListener("click", closeGallery);

  // --------------------------------
  // Закрытие по overlay
  // --------------------------------

  galleryOverlay?.addEventListener("click", closeGallery);

  // --------------------------------
  // Управление клавиатурой
  // --------------------------------

  document.addEventListener("keydown", (event) => {
    if (gallery.hidden) {
      return;
    }

    if (event.key === "Escape") {
      closeGallery();
    }

    if (event.key === "ArrowRight") {
      showImage(currentIndex + 1);
    }

    if (event.key === "ArrowLeft") {
      showImage(currentIndex - 1);
    }
  });
}