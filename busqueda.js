document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q');
    const tag = params.get('tag');

    document.getElementById('search-query').textContent = escapeHTML(query || tag || '');

    fetch('posts.json')
        .then(res => res.json())
        .then(posts => {
            if (tag) {
                // Búsqueda por tag exacto
                const taggedPosts = posts.filter(post => post.tags.includes(tag));
                displayResults(taggedPosts);
            } else if (query) {
                // Búsqueda en título, descripción, tags y contenido
                searchInPosts(posts, query.toLowerCase());
            } else {
                document.getElementById('search-results').innerHTML = '<p>No especificaste búsqueda.</p>';
            }
        })
        .catch(() => {
            document.getElementById('search-results').innerHTML = '<p>Error al cargar las publicaciones.</p>';
        });
});

function searchInPosts(posts, query) {
    const promises = posts.map(post => {
        return fetch(post.content)
            .then(res => res.text())
            .then(content => {
                if (
                    post.title.toLowerCase().includes(query) ||
                    post.description.toLowerCase().includes(query) ||
                    post.tags.some(tag => tag.toLowerCase().includes(query)) ||
                    content.toLowerCase().includes(query)
                ) {
                    return post;
                } else {
                    return null;
                }
            });
    });

    Promise.all(promises).then(results => {
        const filteredResults = results.filter(post => post !== null);
        displayResults(filteredResults);
    });
}

function displayResults(posts) {
    const container = document.getElementById('search-results');
    container.innerHTML = '';

    if (posts.length === 0) {
        container.innerHTML = '<p>No se encontraron resultados.</p>';
        return;
    }

    posts.forEach(post => {
        const card = document.createElement('a');
        card.href = `post.html?title=${encodeURIComponent(post.title)}`;
        card.classList.add('post-card');

        const tags = post.tags.slice(0, 3).map(tag => `<span class="tag">${escapeHTML(tag)}</span>`).join(" ");
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

// Seguridad (ya tienes esta función definida previamente)
function escapeHTML(str) {
    return str.replace(/[&<>"']/g, function(match) {
        const escapeChars = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return escapeChars[match];
    });
}
