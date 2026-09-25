const forms = document.querySelectorAll(
  ".callback-form, .consultation__form"
);

forms.forEach((form) => {
  const phoneInput = form.querySelector('input[type="tel"]');
  const nameInput = form.querySelector('input[name="name"]');
  const sourceInput = form.querySelector('input[name="source"]');

  const message = form.querySelector(
    ".callback-form__message, .consultation__message"
  );

  if (!phoneInput || !nameInput) {
    return;
  }

  // -----------------------------
  // Intl Tel Input
  // -----------------------------

  let iti = null;

  if (window.intlTelInput) {
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

  // -----------------------------
  // Отправка формы
  // -----------------------------

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (message) {
      message.textContent = "";
    }

    const name = nameInput.value.trim();
    const source = sourceInput?.value || "unknown";

    // Проверяем имя
    if (name.length < 2 || name.length > 30) {
      if (message) {
        message.textContent =
          "Будь ласка, введіть коректне ім'я.";
      }

      return;
    }

    // Проверяем телефон
    if (iti && !iti.isValidNumber()) {
      if (message) {
        message.textContent =
          "Будь ласка, введіть коректний номер телефону.";
      }

      return;
    }

    // Получаем полный номер вместе с кодом страны
    const phone = iti
      ? iti.getNumber()
      : phoneInput.value.trim();

    const formData = new FormData();

    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("source", source);

    try {
      const response = await fetch("/send.php", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Помилка відправки форми");
      }

      if (message) {
        message.textContent =
          "Дякуємо! Ваша заявка успішно відправлена.";
      }

      nameInput.value = "";
      phoneInput.value = "";
      
    } catch (error) {
      console.error(error);

      if (message) {
        message.textContent =
          "Не вдалося відправити заявку. Спробуйте ще раз.";
      }
    }
  });
});