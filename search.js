document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById('search-input');

    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const query = this.value.toLowerCase();
            fetch('posts.json')
                .then(res => res.json())
                .then(posts => {
                    const filtered = posts.filter(post => 
                        post.title.toLowerCase().includes(query) || 
                        post.description.toLowerCase().includes(query) ||
                        post.tags.some(tag => tag.toLowerCase().includes(query))
                    );
                    displaySearchResults(filtered);
                });
        });
    }
});

function displaySearchResults(posts) {
    const container = document.getElementById('recent-posts');
    container.innerHTML = ''; // limpiar resultados actuales

    if (posts.length === 0) {
        container.innerHTML = '<p>No se encontraron resultados.</p>';
        return;
    }

    posts.forEach(post => {
        const card = document.createElement("a");
        card.href = `post.html?title=${encodeURIComponent(post.title)}`;
        card.classList.add("post-card");

        const tags = post.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join(" ");

        const imageSrc = post.imagep ? post.imagep : "images/default.jpg";

        card.innerHTML = `
            <div class="post-content">
                <h3>${escapeHTML(post.title)}</h3>
            </div>
            <div class="post-image">
                <img src="${imageSrc}" alt="${escapeHTML(post.title)}" onerror="this.onerror=null;this.src='images/placeholder.jpg';">
            </div>
            <div class="tags">${tags}</div>
            <div>
                <p>${escapeHTML(post.description)}</p>
            </div>
        `;

        container.appendChild(card);
    });
}
