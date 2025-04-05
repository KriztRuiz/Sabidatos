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

document.addEventListener("DOMContentLoaded", function () {
    function loadComponent(containerId, filePath, callback) {
        fetch(filePath)
            .then(response => response.text())
            .then(data => {
                document.getElementById(containerId).innerHTML = data;
                if (callback) callback(); // Ejecutar código adicional después de cargar
            })
            .catch(error => console.error(`Error al cargar ${filePath}:`, error));
    }

    // Cargar header y footer dinámicamente
    loadComponent("header-container", "header.html", setupNavbar);
    loadComponent("footer-container", "footer.html");
    
    function setupNavbar() {
        const menuBtn = document.querySelector("#menu-btn");
        const navbar = document.querySelector("#navbar");

        if (!menuBtn || !navbar) {
            console.error("No se encontraron elementos del menú.");
            return;
        }

        menuBtn.addEventListener("click", function (event) {
            event.stopPropagation();
            navbar.classList.toggle("open");
            const isOpen = navbar.classList.contains("open");
            menuBtn.setAttribute("aria-expanded", isOpen);
        });

        document.addEventListener("click", function (event) {
            if (!menuBtn.contains(event.target) && !navbar.contains(event.target)) {
                navbar.classList.remove("open");
            }
        });
    }

    // Función para cargar las 6 publicaciones más recientes
    function loadRecentPosts() {
        fetch("posts.json")
            .then(response => response.json())
            .then(posts => {
                const container = document.getElementById("recent-posts");
                if (!container) return;

                container.innerHTML = "";

                // Tomamos las 6 publicaciones más recientes
                const recentPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);

                recentPosts.forEach(post => {
                    fetch(post.content)
                        .then(response => response.text())
                        .then(content => {
                            const card = document.createElement("a");
                            card.href = `post.html?title=${encodeURIComponent(post.title)}`;
                            card.classList.add("post-card");

                            const tags = post.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join(" ");

                            // Usar imagep directamente del posts.json o default.jpg si no existe
                            const imageSrc = post.imagep ? post.imagep : "images/default.jpg";

                            card.innerHTML = `
    <div class="post-content">
        <h3>${escapeHTML(post.title)}</h3>
    </div>
    <div class="post-image">
        <img 
          src="${escapeHTML(imageSrc)}" 
          alt="${escapeHTML(post.title)}" 
          onerror="this.onerror=null;this.src='image/placeholder.webp';"
        >
    </div>
    <div class="tags">${tags}</div>
    <div>
        <p>${escapeHTML(post.description)}</p>
    </div>
`;

                            container.appendChild(card);
                        })
                        .catch(error => console.error(`Error al cargar el contenido de ${post.content}:`, error));
                });
            })
            .catch(error => console.error("Error al cargar publicaciones:", error));
    }

    loadRecentPosts();
});

