document.addEventListener("DOMContentLoaded", () => {
    // Obtener el tag desde la URL
    const params = new URLSearchParams(window.location.search);
    const selectedTag = params.get("tag");
    const tagNameElement = document.getElementById("tag-name");
    const postsContainer = document.getElementById("tagged-posts");

    if (selectedTag) {
        tagNameElement.textContent = selectedTag;

        fetch("posts.json")
            .then(response => response.json())
            .then(posts => {
                // Filtrar las publicaciones por el tag seleccionado
                const filteredPosts = posts.filter(post => post.tags.includes(selectedTag));

                if (filteredPosts.length === 0) {
                    postsContainer.innerHTML = "<p>No hay publicaciones con este tag.</p>";
                    return;
                }

                // Mostrar las publicaciones filtradas
                filteredPosts.forEach(post => {
                    const tagsLinks = post.tags
                        .map(tag => `<a href="tags.html?tag=${encodeURIComponent(tag)}" class="tag">${tag}</a>`);

                    const card = document.createElement("a");
                    card.href = `post.html?title=${encodeURIComponent(post.title)}`;
                    card.classList.add("post-card");
                    card.innerHTML = `
                        <h3>${post.title}</h3>
                        <p><strong>Fecha:</strong> ${post.date}</p>
                        <p><strong>Tags:</strong> ${tagsLinks}</p>
                    `;
                    postsContainer.appendChild(card);
                });
            })
            .catch(error => {
                console.error("Error al cargar publicaciones:", error);
                postsContainer.innerHTML = "<p>Error al cargar las publicaciones.</p>";
            });
    } else {
        tagNameElement.textContent = "Desconocido";
        postsContainer.innerHTML = "<p>No se ha seleccionado un tag.</p>";
    }
});
