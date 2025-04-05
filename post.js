document.addEventListener("DOMContentLoaded", () => {
    // Obtener el título de la publicación desde la URL
    const params = new URLSearchParams(window.location.search);
    const postTitle = params.get("title");

    if (postTitle) {
        fetch("posts.json")
            .then(response => response.json())
            .then(posts => {
                const post = posts.find(p => p.title === postTitle);
                if (post) {
                    fetch(post.content)
                        .then(response => response.text())
                        .then(text => {
                            const tagsLinks = post.tags
                                .map(tag => `<a href="tags.html?tag=${encodeURIComponent(tag)}" class="tag">${tag}</a>`);

                            // Agregar imagen principal si existe
                            const imageHTML = post.imagep 
  ? `<img src="${post.imagep}" alt="${post.title}" class="post-image"
          onerror="this.onerror=null;this.src='image/placeholder.webp';">`
  : `<img src="image/placeholder.webp" alt="Imagen no disponible" class="post-image">`;

                            document.getElementById("post-content").innerHTML = `
                                <h1>${escapeHTML(post.title)}</h1>
                                <p><strong>Fecha:</strong> ${escapeHTML(post.date)}</p>
                                <p><strong>Tags:</strong> ${tagsLinks}</p>
                                ${imageHTML}
                                <p>${text}</p>
                            `;
                        })
                        .catch(error => {
                            console.error("Error al cargar el contenido del post:", error);
                            document.getElementById("post-content").innerHTML = "<p>Error al cargar la publicación.</p>";
                        });
                } else {
                    document.getElementById("post-content").innerHTML = "<p>Publicación no encontrada.</p>";
                }
            })
            .catch(error => {
                console.error("Error al cargar los posts:", error);
                document.getElementById("post-content").innerHTML = "<p>Error al cargar las publicaciones.</p>";
            });
    } else {
        document.getElementById("post-content").innerHTML = "<p>No se especificó una publicación.</p>";
    }
});
