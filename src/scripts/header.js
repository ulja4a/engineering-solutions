const burgerMenu = document.querySelector(".menu__list");
const burgerBtn = document.querySelector(".menu__btn");
const burgerItems = document.querySelectorAll(".menu__list-link");

if (burgerMenu && burgerBtn) {
  burgerBtn.addEventListener("click", (event) => {
    event.stopPropagation();

    burgerMenu.classList.toggle("active");
    burgerBtn.classList.toggle("active");
  });

  document.addEventListener("click", (event) => {
    if (
      !burgerMenu.contains(event.target) &&
      !burgerBtn.contains(event.target)
    ) {
      burgerMenu.classList.remove("active");
      burgerBtn.classList.remove("active");
    }
  });

  burgerItems.forEach((item) => {
    item.addEventListener("click", () => {
      burgerMenu.classList.remove("active");
      burgerBtn.classList.remove("active");
    });
  });
}