const burgerMenu = document.querySelector(".menu__list");
const burgerBtn = document.querySelector(".menu__btn");

const callbackBtns = document.querySelectorAll(
  ".menu__callback-link"
);

const callbackOverlay = document.querySelector(
  ".callback-popup-overlay"
);

const callbackClose = document.querySelector(
  ".callback-popup__close"
);

const callbackSource = callbackOverlay?.querySelector(
  'input[name="source"]'
);

if (
  callbackBtns.length &&
  callbackOverlay &&
  callbackClose
) {
  callbackBtns.forEach((callbackBtn) => {
    callbackBtn.addEventListener("click", (event) => {
      event.stopPropagation();

      // Определяем, откуда открыли popup
      const source =
        callbackBtn.dataset.source || "header-callback";

      // Передаём источник в форму popup
      if (callbackSource) {
        callbackSource.value = source;
      }

      // Закрываем burger menu
      if (burgerMenu && burgerBtn) {
        burgerMenu.classList.remove("active");
        burgerBtn.classList.remove("active");
      }

      // Очищаем старое сообщение формы
    const callbackMessage = callbackOverlay.querySelector(
      ".callback-form__message"
    );

    if (callbackMessage) {
      callbackMessage.textContent = "";
    }


      // Открываем popup
      callbackOverlay.classList.add("active");
      document.body.classList.add("popup-open");
    });
  });

  callbackClose.addEventListener("click", () => {
    callbackOverlay.classList.remove("active");
    document.body.classList.remove("popup-open");
  });

  callbackOverlay.addEventListener("click", (event) => {
    if (event.target !== callbackOverlay) {
      return;
    }

    callbackOverlay.classList.remove("active");
    document.body.classList.remove("popup-open");
  });
}