const readMoreBtn = document.querySelector(".main__read-more");
const textWrapper = document.querySelector(".main__text-wrapper");

if (readMoreBtn && textWrapper) {
  readMoreBtn.addEventListener("click", () => {
    const isOpen = textWrapper.classList.toggle("active");

    readMoreBtn.textContent = isOpen
      ? "Згорнути"
      : "... Читати далі";

    readMoreBtn.setAttribute(
      "aria-expanded",
      String(isOpen)
    );
  });
}