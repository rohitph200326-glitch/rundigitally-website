document.addEventListener('DOMContentLoaded', () => {
  // 1. Set Dynamic Copyright Year
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Mobile Navigation Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', String(!isExpanded));
      navLinks.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 3. Contact Form Handler (Supports Web3Forms API + Direct Mailto Fallback)
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const accessKeyInput = contactForm.querySelector('input[name="access_key"]');
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const company = document.getElementById('company').value.trim();
      const service = document.getElementById('service').value;
      const message = document.getElementById('message').value.trim();

      // If Web3Forms key hasn't been added yet, open pre-filled email client smoothly
      if (!accessKeyInput || accessKeyInput.value === 'YOUR_WEB3FORMS_ACCESS_KEY') {
        const subject = encodeURIComponent(`SAP Consultation Inquiry: ${service} (${name})`);
        const body = encodeURIComponent(
          `Name: ${name}\nEmail: ${email}\nCompany: ${company || 'N/A'}\nService: ${service}\n\nProject Overview:\n${message}`
        );
        formStatus.textContent = 'Opening your email client to send inquiry to info@rundigitally.com...';
        window.location.href = `mailto:info@rundigitally.com?subject=${subject}&body=${body}`;
        return;
      }

      // Otherwise submit seamlessly via Web3Forms AJAX
      formStatus.textContent = 'Sending your inquiry...';
      try {
        const formData = new FormData(contactForm);
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });
        const result = await response.json();

        if (result.success) {
          formStatus.textContent = 'Thank you! Your inquiry has been sent to info@rundigitally.com.';
          contactForm.reset();
        } else {
          formStatus.textContent = 'Something went wrong. Please email info@rundigitally.com directly.';
        }
      } catch (err) {
        formStatus.textContent = 'Network error. Please email info@rundigitally.com directly.';
      }
    });
  }
});