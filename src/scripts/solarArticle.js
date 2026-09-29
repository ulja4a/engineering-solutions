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

    const moreText =
      seoArticleBtn.dataset.moreText || "Читати далі";

    const lessText =
      seoArticleBtn.dataset.lessText || "Згорнути";
    
      seoArticleBtn.textContent =
        isOpen ? lessText : moreText;

    seoArticleBtn.setAttribute(
      "aria-expanded",
      String(isOpen)
    );
  });
}