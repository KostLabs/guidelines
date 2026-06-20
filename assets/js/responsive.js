document.addEventListener("DOMContentLoaded", function() {
  // Elements
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  const hamburgerMenu = document.getElementById('hamburger-menu');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
  const closeMenuButton = document.getElementById('close-mobile-menu');
  const mobileMenuContent = document.getElementById('mobile-menu-content');
  const body = document.body;
  
  // Toggle sidebar with toggle button (for tablet view)
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', function() {
      sidebar.classList.toggle('hidden');
    });
  }
  
  // Clone TOC for mobile menu
  function cloneTOCForMobile() {
    if (sidebar && mobileMenuContent) {
      // Clear previous content first
      mobileMenuContent.innerHTML = '';
      // Clone the sidebar content
      const sidebarClone = sidebar.cloneNode(true);
      // Move all the sidebar children to mobile menu
      while (sidebarClone.firstChild) {
        mobileMenuContent.appendChild(sidebarClone.firstChild);
      }
    }
  }
  
  // Toggle mobile menu
  function toggleMobileMenu() {
    mobileMenu.classList.toggle('open');
    mobileMenuOverlay.style.display = mobileMenu.classList.contains('open') ? 'block' : 'none';
    body.classList.toggle('mobile-menu-open');
    
    // Clone TOC when opening
    if (mobileMenu.classList.contains('open')) {
      cloneTOCForMobile();
    }
  }
  
  // Mobile menu handlers
  if (hamburgerMenu && mobileMenu && mobileMenuOverlay && closeMenuButton) {
    hamburgerMenu.addEventListener('click', toggleMobileMenu);
    closeMenuButton.addEventListener('click', toggleMobileMenu);
    mobileMenuOverlay.addEventListener('click', toggleMobileMenu);
    
    // Handle clicks on links in the mobile menu
    mobileMenuContent.addEventListener('click', function(e) {
      if (e.target.tagName.toLowerCase() === 'a') {
        toggleMobileMenu(); // Close the menu when clicking a link
      }
    });
  }
  
  // Handle window resize
  window.addEventListener('resize', function() {
    if (window.innerWidth >= 768) { // md breakpoint in Tailwind
      sidebar.classList.remove('hidden');
      
      // Close mobile menu if open
      if (mobileMenu.classList.contains('open')) {
        toggleMobileMenu();
      }
    }
  });
  
  // Initialize mobile menu content on page load
  cloneTOCForMobile();
});