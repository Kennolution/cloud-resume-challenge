(function () {

  function setProfilePicture(src) {
    const img = document.getElementById('profile-pic');
    const placeholder = document.getElementById('avatar-placeholder');

    if (img) {
      img.src = src;
      img.style.display = 'block';
    }

    if (placeholder) {
      placeholder.style.display = 'none';
    }
  }

  // Update sidebar visitor count
  function updateSidebarCount(n) {
    const el = document.getElementById('sidebar-visitor-count');
    if (el) el.textContent = n.toLocaleString();
  }

  function setLoading() {
    updateSidebarCount("...");

    const heroEl = document.getElementById('visitor-count');
    if (heroEl) heroEl.textContent = "...";
  }

  const API_ENDPOINT = 'https://6xf9audx0k.execute-api.us-east-1.amazonaws.com/Prod/visit/';

  async function updateVisitorCount() {
    setLoading();

    try {
      const res = await fetch(API_ENDPOINT);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      const count = Number(data.count || data.visits || 0);

      updateSidebarCount(count);

      const heroEl = document.getElementById('visitor-count');
      if (heroEl) {
        heroEl.textContent = count.toLocaleString();
      }

    } catch (err) {
      console.warn('Visitor count unavailable:', err);
      updateSidebarCount("N/A");

      const heroEl = document.getElementById('visitor-count');
      if (heroEl) heroEl.textContent = "N/A";
    }
  }

  // Run on load
  updateVisitorCount();

})();
