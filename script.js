
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
    "https://www.chicago.gov/content/dam/city/sites/invest_sw/rfp/11339-43_s_michigan_appraisal.pdf",
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

    fetch("https://rdestroyer1.github.io/Real-estate-database/database.json")
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

        let html = `<h2 style="margin-top:0">Search Results</h2><ul>`;
        if (results.length) {
          results.forEach((p) => {
            const locName = locations.find((l) => l.id === p.locationId)?.name || "";
            html += `<li><strong>${p.title}</strong> - $${p.price} - ${locName}</li>`;
          });
        } else {
          html += `<li>No properties found for "${query}"</li>`;
        }
        html += `</ul><br><button id="closeModal">Close</button>`;

        // Modal
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

        modal.addEventListener("click", (e) => {
          if (e.target === modal) modal.remove();
        });
        card.querySelector("#closeModal").addEventListener("click", () => modal.remove());
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
