const seoArticleBtn = document.querySelector(
  ".seo-article__read-more"
);

const seoArticleContent = document.querySelector(
  ".seo-article__hidden"
);

if (seoArticleBtn && seoArticleContent) {
  seoArticleBtn.addEventListener("click", () => {
    const isOpen =
      seoArticleContent.classList.toggle("active");

    seoArticleBtn.textContent =
      isOpen ? "Згорнути" : "Читати далі";

    seoArticleBtn.setAttribute(
      "aria-expanded",
      String(isOpen)
    );
  });
}