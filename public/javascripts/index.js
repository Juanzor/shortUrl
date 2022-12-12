
document.addEventListener("click", (e) => {
    const shortUrl = `http://localhost:3000/${e.target.dataset.short}`;

    navigator.clipboard
        .writeText(shortUrl)
        .then(() => console.log("Copiado"))
        .catch(() => console.log(e));
});
