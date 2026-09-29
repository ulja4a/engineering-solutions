const track = document.querySelector(".projects__track");
const viewport = document.querySelector(".projects__viewport");
const prevBtn = document.querySelector(".projects__arrow--prev");
const nextBtn = document.querySelector(".projects__arrow--next");

if (track && viewport && prevBtn && nextBtn) {
  const originalCards = Array.from(
    track.querySelectorAll(".projects__card")
  );

  if (originalCards.length > 0) {
    let cardsPerView = getCardsPerView();
    let currentIndex = cardsPerView;
    let isMoving = false;

    function getCardsPerView() {
      if (window.innerWidth >= 1024) {
        return 3;
      }

      if (window.innerWidth >= 600) {
        return 2;
      }

      return 1;
    }

    function getGap() {
      const styles = window.getComputedStyle(track);
      return parseFloat(styles.gap) || 0;
    }

    function createClones() {
      track
        .querySelectorAll("[data-clone]")
        .forEach((clone) => clone.remove());

      cardsPerView = getCardsPerView();

      const cards = Array.from(
        track.querySelectorAll(".projects__card")
      );

      const firstCards = cards.slice(0, cardsPerView);
      const lastCards = cards.slice(-cardsPerView);

      lastCards.forEach((card) => {
        const clone = card.cloneNode(true);
        clone.dataset.clone = "true";
        track.prepend(clone);
      });

      firstCards.forEach((card) => {
        const clone = card.cloneNode(true);
        clone.dataset.clone = "true";
        track.append(clone);
      });

      currentIndex = cardsPerView;
    }

    function getStep() {
      const card = track.querySelector(".projects__card");

      if (!card) {
        return 0;
      }

      return card.getBoundingClientRect().width + getGap();
    }

    function moveSlider(animate = true) {
      const step = getStep();

      track.style.transition = animate
        ? "transform 0.5s ease"
        : "none";

      track.style.transform =
        `translateX(-${currentIndex * step}px)`;
    }

    function resetPosition() {
      const totalOriginal = originalCards.length;

      if (currentIndex >= totalOriginal + cardsPerView) {
        currentIndex = cardsPerView;
        moveSlider(false);
      }

      if (currentIndex < cardsPerView) {
        currentIndex = totalOriginal + cardsPerView - 1;
        moveSlider(false);
      }

      isMoving = false;
    }

    nextBtn.addEventListener("click", () => {
      if (isMoving) {
        return;
      }

      isMoving = true;
      currentIndex++;

      moveSlider();
    });

    prevBtn.addEventListener("click", () => {
      if (isMoving) {
        return;
      }

      isMoving = true;
      currentIndex--;

      moveSlider();
    });

    track.addEventListener("transitionend", resetPosition);

    window.addEventListener("resize", () => {
      createClones();
      moveSlider(false);
    });

    createClones();
    moveSlider(false);
  }
}