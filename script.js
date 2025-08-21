if (window.Typed) {
  new Typed('#element', {
    strings: ['Discover', 'Invest', 'Thrive'],
    typeSpeed: 50,
    backSpeed: 30,
    loop: true
  });
}

// External PDF button
document.getElementById("githubBtn")?.addEventListener("click", function () {
  window.open(
    "https://www.choosechicago.com/uploads/mp360/mpsouth/",
    "_blank"
  );
});

// Smooth scroll: "Search Property" button -> second section
document.getElementById("analysisBtn")?.addEventListener("click", function () {
  document.querySelector(".secondsection")?.scrollIntoView({ behavior: "smooth" });
});

// Hide floating CTA when footer is visible
const searchBar = document.querySelector(".search-container");
const footer = document.querySelector("footer");

if (searchBar && footer && "IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        searchBar.classList.add("hidden");
      } else {
        searchBar.classList.remove("hidden");
      }
    },
    {
      root: null,
      threshold: 0,
      rootMargin: "0px 0px -10% 0px",
    }
  );
  io.observe(footer);
} else if (searchBar && footer) {
  // Fallback: simple scroll handler
  document.addEventListener("scroll", function () {
    const rect = footer.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      searchBar.classList.add("hidden");
    } else {
      searchBar.classList.remove("hidden");
    }
  });
}

// Property search modal
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("propertySearch");
  const searchBtn = document.getElementById("searchBtn");

  function doSearch() {
    const query = (input?.value || "").toLowerCase().trim();

    fetch("fetch("https://rdestroyer1.github.io/Real-estate-database-by-Rishabh-Dhoundiyal/database.json")
      .then((r) => r.json())
      .then((data) => {
        const locations = data.locations || [];
        const props = data.properties || [];

        const results = props.filter((p) => {
          const locName = (locations.find((l) => l.id === p.locationId)?.name || "").toLowerCase();
          const title = (p.title || "").toLowerCase();
          const type = (p.type || "").toLowerCase();
          const amenities = (p.amenities || []).join(" ").toLowerCase();
          return query
            ? title.includes(query) ||
                locName.includes(query) ||
                type.includes(query) ||
                amenities.includes(query)
            : true;
        });

        let html = `<h2 style="margin-top:0">Search Results</h2>`;
        if (results.length) {
          results.forEach((p, i) => {
            const locName = locations.find((l) => l.id === p.locationId)?.name || "";
            const amenities = (p.amenities || []).join(", ");
            html += `
              <div style="border:1px solid #ccc; border-radius:8px; padding:12px; margin:12px 0; background:#fafafa;">
                <img src="${p.image || 'https://via.placeholder.com/400x250?text=No+Image'}" 
                     alt="${p.title}" 
                     class="property-img"
                     data-index="${i}"
                     data-title="${p.title}"
                     data-price="${p.price}"
                     style="width:100%; max-height:250px; object-fit:cover; border-radius:6px; margin-bottom:8px; cursor:pointer;">
                <h3 style="margin:4px 0;">${p.title}</h3>
                <p><strong>Price:</strong> $${p.price}</p>
                <p><strong>Location:</strong> ${locName}</p>
                <p><strong>Type:</strong> ${p.type}</p>
                <p><strong>Amenities:</strong> ${amenities || "N/A"}</p>
              </div>`;
          });
        } else {
          html += `<p>No properties found for "<em>${query}</em>"</p>`;
        }
        html += `<br><button id="closeModal">Close</button>`;

        // --- create modal wrapper ---
        const modal = document.createElement("div");
        Object.assign(modal.style, {
          position: "fixed",
          inset: "0",
          background: "rgba(0,0,0,0.5)",
          zIndex: "9999",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
        });

        const card = document.createElement("div");
        Object.assign(card.style, {
          background: "rgba(255,255,255,0.97)",
          padding: "20px",
          border: "2px solid #000",
          maxHeight: "70vh",
          overflowY: "auto",
          width: "min(700px, 90vw)",
        });
        card.innerHTML = html;
        modal.appendChild(card);
        document.body.appendChild(modal);

        // close handlers
        modal.addEventListener("click", (e) => {
          if (e.target === modal) modal.remove();
        });
        card.querySelector("#closeModal").addEventListener("click", () => modal.remove());

        // --- image preview gallery with captions ---
        const imgs = Array.from(card.querySelectorAll(".property-img"));
        let currentIndex = 0;

        function openGallery(index) {
          currentIndex = index;
          const preview = document.createElement("div");
          preview.id = "previewModal";
          Object.assign(preview.style, {
            position: "fixed",
            inset: "0",
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: "10000",
            flexDirection: "column",
            color: "white",
          });
          preview.innerHTML = `
            <button id="prevBtn" style="position:absolute;left:20px;font-size:2rem;color:white;background:none;border:none;cursor:pointer;">&#10094;</button>
            <img id="previewImg" src="${imgs[currentIndex].src}" alt="Preview" style="max-width:90%; max-height:80%; border-radius:8px; box-shadow:0 0 20px #000;">
            <p id="previewCaption" style="margin-top:12px;font-size:1.2rem;text-align:center;">
              ${imgs[currentIndex].dataset.title} - $${imgs[currentIndex].dataset.price}
            </p>
            <button id="nextBtn" style="position:absolute;right:20px;font-size:2rem;color:white;background:none;border:none;cursor:pointer;">&#10095;</button>
          `;
          document.body.appendChild(preview);

          function showImage(i) {
            if (i < 0) i = imgs.length - 1;
            if (i >= imgs.length) i = 0;
            currentIndex = i;
            document.getElementById("previewImg").src = imgs[currentIndex].src;
            document.getElementById("previewCaption").textContent =
              `${imgs[currentIndex].dataset.title} - $${imgs[currentIndex].dataset.price}`;
          }

          document.getElementById("prevBtn").onclick = (e) => {
            e.stopPropagation();
            showImage(currentIndex - 1);
          };
          document.getElementById("nextBtn").onclick = (e) => {
            e.stopPropagation();
            showImage(currentIndex + 1);
          };

          preview.addEventListener("click", (e) => {
            if (e.target === preview) preview.remove();
          });

          // keyboard navigation
          document.addEventListener("keydown", function handler(e) {
            if (!document.getElementById("previewModal")) {
              document.removeEventListener("keydown", handler);
              return;
            }
            if (e.key === "ArrowLeft") showImage(currentIndex - 1);
            if (e.key === "ArrowRight") showImage(currentIndex + 1);
            if (e.key === "Escape") preview.remove();
          });
        }

        imgs.forEach((img, i) => {
          img.addEventListener("click", () => openGallery(i));
        });
      })
      .catch((err) => {
        console.error("Error fetching database:", err);
        alert("Unable to load property data.");
      });
  }

  // Trigger search
  searchBtn?.addEventListener("click", doSearch);
  input?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") doSearch();
  });
});



