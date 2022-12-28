document.addEventListener("click", (e) => {
    if (e.target.dataset.short) {
        const shortUrl = `${location.origin}/${e.target.dataset.short}`;

        navigator.clipboard
            .writeText(shortUrl)
            .then(() => console.log("Copiado"))
            .catch(() => console.log(e));
    }
});
