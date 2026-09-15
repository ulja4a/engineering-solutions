document.addEventListener("DOMContentLoaded", function () {

  // =========================================================
  // БУРГЕР-МЕНЮ
  // =========================================================

  const burgerMenu = document.querySelector(".menu__list");
  const burgerBtn = document.querySelector(".menu__btn");
  const burgerItems = document.querySelectorAll(".menu__list-link");

  if (burgerMenu && burgerBtn) {

    burgerBtn.addEventListener("click", function (event) {
      event.stopPropagation();

      burgerMenu.classList.toggle("active");
      burgerBtn.classList.toggle("active");
    });

    document.addEventListener("click", function (event) {
      if (
        !burgerMenu.contains(event.target) &&
        !burgerBtn.contains(event.target)
      ) {
        burgerMenu.classList.remove("active");
        burgerBtn.classList.remove("active");
      }
    });

    burgerItems.forEach(function (item) {
      item.addEventListener("click", function () {
        burgerMenu.classList.remove("active");
        burgerBtn.classList.remove("active");
      });
    });

  }


  // =========================================================
  // POPUP
  // =========================================================

  const callbackBtns =
    document.querySelectorAll(".menu__callback-link");

  const callbackPopup =
    document.querySelector(".callback-popup");

  const callbackClose =
    document.querySelector(".callback-popup__close");

  const callbackForm =
    document.querySelector("#callbackForm");


  if (
    callbackBtns.length &&
    callbackPopup &&
    callbackClose
  ) {

    callbackBtns.forEach(function (callbackBtn) {

      callbackBtn.addEventListener("click", function (event) {
        event.stopPropagation();

        if (burgerMenu && burgerBtn) {
          burgerMenu.classList.remove("active");
          burgerBtn.classList.remove("active");
        }


        // Определяем, откуда открыли popup
        const source =
          callbackBtn.dataset.source ||
          "Popup — Замовити дзвінок";


        // Записываем источник в форму
        if (callbackForm) {
          callbackForm.dataset.form = source;
        }


        callbackPopup.classList.add("active");
        document.body.classList.add("popup-open");
      });

    });


    callbackClose.addEventListener("click", function () {

      callbackPopup.classList.remove("active");
      document.body.classList.remove("popup-open");

    });


    callbackPopup.addEventListener("click", function (event) {

      if (event.target === callbackPopup) {

        callbackPopup.classList.remove("active");
        document.body.classList.remove("popup-open");

      }

    });

  }


  // =========================================================
  // INTL-TEL-INPUT — POPUP
  // =========================================================

  const phoneInput =
    document.querySelector("#phone");

  let iti = null;


  if (phoneInput && window.intlTelInput) {

    iti = window.intlTelInput(phoneInput, {

      initialCountry: "ua",

      countrySelectorMode: "DROPDOWN",

      separateDialCode: true,

      loadUtils: () =>
        import(
          "https://cdn.jsdelivr.net/npm/intl-tel-input@29.2.3/dist/js/utils.js"
        ),

    });

  }


  // =========================================================
  // УНИВЕРСАЛЬНАЯ ФУНКЦИЯ ОТПРАВКИ ФОРМЫ
  // =========================================================

  async function sendForm({
    form,
    nameInput,
    phonePlugin,
    phoneElement,
    submitButton,
    messageElement,
    successText,
    defaultButtonText,
    onSuccess
  }) {

    const name =
      nameInput.value.trim();


    // ---------------------------------------------------------
    // ПРОВЕРКА ИМЕНИ
    // ---------------------------------------------------------

    if (name.length < 2) {

      messageElement.textContent =
        "Введіть, будь ласка, ваше ім'я.";

      messageElement.classList.add("active");
      messageElement.classList.remove("success");

      nameInput.focus();

      return;
    }


    // ---------------------------------------------------------
    // ПРОВЕРКА ТЕЛЕФОНА
    // ---------------------------------------------------------

    if (
      !phonePlugin ||
      !phonePlugin.isValidNumber()
    ) {

      messageElement.textContent =
        "Введіть коректний номер телефону.";

      messageElement.classList.add("active");
      messageElement.classList.remove("success");

      phoneElement.focus();

      return;
    }


    const phone =
      phonePlugin.getNumber();


    // ---------------------------------------------------------
    // ОПРЕДЕЛЯЕМ ИСТОЧНИК ЗАЯВКИ
    // ---------------------------------------------------------

    const formSource =
      form.dataset.form ||
      "Форма сайту";

    const pageTitle =
      document.title;

    const pageUrl =
      window.location.href;

    const pagePath =
      window.location.pathname;


    // ---------------------------------------------------------
    // БЛОКИРУЕМ КНОПКУ
    // ---------------------------------------------------------

    submitButton.disabled = true;

    submitButton.textContent =
      "Відправлення...";

    messageElement.textContent = "";

    messageElement.classList.remove("active");
    messageElement.classList.remove("success");


    // ---------------------------------------------------------
    // СОБИРАЕМ ДАННЫЕ
    // ---------------------------------------------------------

    const formData =
      new FormData();

    formData.append(
      "name",
      name
    );

    formData.append(
      "phone",
      phone
    );

    formData.append(
      "form_source",
      formSource
    );

    formData.append(
      "page_title",
      pageTitle
    );

    formData.append(
      "page_url",
      pageUrl
    );

    formData.append(
      "page_path",
      pagePath
    );


    // ---------------------------------------------------------
    // ОТПРАВКА
    // ---------------------------------------------------------

    try {

      const response =
        await fetch("send.php", {

          method: "POST",

          body: formData

        });


      if (!response.ok) {

        throw new Error(
          `HTTP error: ${response.status}`
        );

      }


      const result =
        await response.json();


      if (result.success) {

        messageElement.textContent =
          successText;

        messageElement.classList.add("active");
        messageElement.classList.add("success");


        form.reset();



        if (typeof onSuccess === "function") {
          onSuccess();
        }


      } else {

        messageElement.textContent =
          result.message ||
          "Не вдалося відправити заявку.";

        messageElement.classList.add("active");
        messageElement.classList.remove("success");

      }


    } catch (error) {

      console.error(
        "Помилка відправки:",
        error
      );

      messageElement.textContent =
        "Сталася помилка. Спробуйте ще раз.";

      messageElement.classList.add("active");
      messageElement.classList.remove("success");


    } finally {

      submitButton.disabled = false;

      submitButton.textContent =
        defaultButtonText;

    }

  }


  // =========================================================
  // POPUP FORM
  // =========================================================

  if (callbackForm) {

    const callbackName =
      callbackForm.querySelector(
        'input[name="name"]'
      );

    const callbackSubmit =
      callbackForm.querySelector(
        ".callback-form__btn"
      );

    const callbackMessage =
      callbackForm.querySelector(
        ".callback-form__message"
      );


    callbackForm.addEventListener(
      "submit",
      async function (event) {

        event.preventDefault();


        await sendForm({

          form: callbackForm,

          nameInput: callbackName,

          phonePlugin: iti,

          phoneElement: phoneInput,

          submitButton: callbackSubmit,

          messageElement: callbackMessage,

          successText:
            "Дякуємо! Ми перетелефонуємо вам якнайшвидше.",

          defaultButtonText:
            "Передзвоніть мені",

          onSuccess: function () {

            setTimeout(function () {

              if (callbackPopup) {
                callbackPopup.classList.remove("active");
              }


              document.body.classList.remove(
                "popup-open"
              );


              callbackMessage.textContent = "";

              callbackMessage.classList.remove(
                "active"
              );

              callbackMessage.classList.remove(
                "success"
              );

            }, 2000);

          }

        });

      }
    );

  }


  // =========================================================
  // CONSULTATION FORMS
  // =========================================================

  const consultationForms =
    document.querySelectorAll(
      ".consultation__form"
    );


  consultationForms.forEach(
    function (consultationForm) {

      const consultationName =
        consultationForm.querySelector(
          'input[name="name"]'
        );

      const consultationPhone =
        consultationForm.querySelector(
          ".consultation__phone"
        );

      const consultationSubmit =
        consultationForm.querySelector(
          ".consultation__btn"
        );

      const consultationMessage =
        consultationForm.querySelector(
          ".consultation__message"
        );


      // ---------------------------------------------------------
      // INTL-TEL-INPUT ДЛЯ КАЖДОЙ ФОРМЫ
      // ---------------------------------------------------------

      let consultationIti = null;


      if (
        consultationPhone &&
        window.intlTelInput
      ) {

        consultationIti =
          window.intlTelInput(
            consultationPhone,
            {

              initialCountry: "ua",

              countrySelectorMode:
                "DROPDOWN",

              separateDialCode: true,

              loadUtils: () =>
                import(
                  "https://cdn.jsdelivr.net/npm/intl-tel-input@29.2.3/dist/js/utils.js"
                ),

            }
          );

      }


      // ---------------------------------------------------------
      // SUBMIT
      // ---------------------------------------------------------

      consultationForm.addEventListener(
        "submit",
        async function (event) {

          event.preventDefault();


          await sendForm({

            form:
              consultationForm,

            nameInput:
              consultationName,

            phonePlugin:
              consultationIti,

            phoneElement:
              consultationPhone,

            submitButton:
              consultationSubmit,

            messageElement:
              consultationMessage,

            successText:
              "Дякуємо! Заявку успішно відправлено.",

            defaultButtonText:
              "Замовити дзвінок",

            onSuccess:
              function () {

                setTimeout(
                  function () {

                    consultationMessage.textContent =
                      "";

                    consultationMessage.classList.remove(
                      "active"
                    );

                    consultationMessage.classList.remove(
                      "success"
                    );

                  },
                  3000
                );

              }

          });

        }
      );

    }
  );


  // =========================================================
  // HEADER SLIDER
  // =========================================================

  const headerSlides =
    document.querySelectorAll(
      ".header__slide"
    );

  let currentSlide = 0;


  function showSlide(index) {

    headerSlides.forEach(
      function (slide) {

        slide.classList.remove(
          "active"
        );

      }
    );


    headerSlides[index].classList.add(
      "active"
    );

    currentSlide = index;

  }


  if (headerSlides.length > 1) {

    setInterval(function () {

      let nextSlide =
        currentSlide + 1;


      if (
        nextSlide >=
        headerSlides.length
      ) {

        nextSlide = 0;

      }


      showSlide(nextSlide);

    }, 5000);

  }


  // =========================================================
  // PROJECTS SLIDER
  // =========================================================

  const projectsTrack =
    document.querySelector(
      ".projects__track"
    );

  const projectCards =
    document.querySelectorAll(
      ".projects__card"
    );

  const projectPrev =
    document.querySelector(
      ".projects__arrow--prev"
    );

  const projectNext =
    document.querySelector(
      ".projects__arrow--next"
    );


  let projectIndex = 0;


  function getProjectsPerView() {

    if (window.innerWidth >= 1024) {
      return 3;
    }

    if (window.innerWidth >= 600) {
      return 2;
    }

    return 1;

  }


  function updateProjectsSlider() {

    if (!projectsTrack) {
      return;
    }


    const perView =
      getProjectsPerView();

    const maxIndex =
      Math.max(
        0,
        projectCards.length - perView
      );


    if (projectIndex > maxIndex) {
      projectIndex = maxIndex;
    }


    const cardWidth =
      100 / perView;


    projectsTrack.style.transform =
      `translateX(-${projectIndex * cardWidth}%)`;

  }


  if (
    projectsTrack &&
    projectPrev &&
    projectNext
  ) {

    projectNext.addEventListener(
      "click",
      function () {

        const perView =
          getProjectsPerView();

        const maxIndex =
          Math.max(
            0,
            projectCards.length -
            perView
          );


        if (
          projectIndex <
          maxIndex
        ) {

          projectIndex++;

        } else {

          projectIndex = 0;

        }


        updateProjectsSlider();

      }
    );


    projectPrev.addEventListener(
      "click",
      function () {

        const perView =
          getProjectsPerView();

        const maxIndex =
          Math.max(
            0,
            projectCards.length -
            perView
          );


        if (projectIndex > 0) {

          projectIndex--;

        } else {

          projectIndex =
            maxIndex;

        }


        updateProjectsSlider();

      }
    );


    window.addEventListener(
      "resize",
      function () {

        updateProjectsSlider();

      }
    );


    updateProjectsSlider();

  }


  // =========================================================
  // READ MORE
  // =========================================================

  const readMoreBtn =
    document.querySelector(
      ".main__read-more"
    );

  const textWrapper =
    document.querySelector(
      ".main__text-wrapper"
    );


  if (
    readMoreBtn &&
    textWrapper
  ) {

    readMoreBtn.addEventListener(
      "click",
      function () {

        const isOpen =
          textWrapper.classList.toggle(
            "active"
          );


        if (isOpen) {

          readMoreBtn.textContent =
            "Згорнути";

          readMoreBtn.setAttribute(
            "aria-expanded",
            "true"
          );


        } else {

          readMoreBtn.textContent =
            "... Читати далі";

          readMoreBtn.setAttribute(
            "aria-expanded",
            "false"
          );

        }

      }
    );

  }

});