document.addEventListener('DOMContentLoaded', function() {
  // Check if IntersectionObserver is supported
  if ('IntersectionObserver' in window) {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    
    statNumbers.forEach((stat) => {
      observer.observe(stat);
    });
  } else {
    // Fallback for browsers without IntersectionObserver
    // Just add the animation class to all stat elements
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach((stat) => {
      stat.classList.add('animated');
    });
  }
}); 