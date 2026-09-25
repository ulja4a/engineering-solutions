const slides = document.querySelectorAll(".header__slide");

if (slides.length > 0) {
  let currentSlide = 0;

  function showNextSlide() {
    slides[currentSlide].classList.remove("active");

    currentSlide = (currentSlide + 1) % slides.length;

    slides[currentSlide].classList.add("active");
  }

  setInterval(showNextSlide, 5000);
}