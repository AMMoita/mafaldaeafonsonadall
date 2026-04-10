document.addEventListener('DOMContentLoaded', () => {
  const revealItems = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const header = document.querySelector('.site-header');
  const progressBar = document.querySelector('.scroll-progress');
  const heroBg = document.querySelector('.hero-bg');
  const scrollHint = document.querySelector('.scroll-hint');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.16,
    rootMargin: '0px 0px -8% 0px'
  });

  revealItems.forEach(item => revealObserver.observe(item));

  const updateScrollUi = () => {
    const y = window.scrollY || window.pageYOffset;

    if (header) {
      header.classList.toggle('is-scrolled', y > 24);
    }

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (y / docHeight) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = progress + '%';
    }

    if (heroBg) {
      const offset = Math.min(y * 0.12, 60);
      heroBg.style.setProperty('--hero-parallax', `${offset}px`);
    }

    if (scrollHint) {
      const hasScroll = document.documentElement.scrollHeight > window.innerHeight + 20;

      if (!hasScroll) {
        scrollHint.style.display = 'none';
      } else {
        scrollHint.style.display = '';
        scrollHint.classList.toggle('is-hidden', y > 60);
      }
    }
  };

  updateScrollUi();

  window.addEventListener('scroll', updateScrollUi, { passive: true });
  window.addEventListener('resize', updateScrollUi);
  window.addEventListener('load', updateScrollUi);
  window.addEventListener('pageshow', updateScrollUi);
});

function copyIBAN(button) {
  const ibanEl = button.parentElement.querySelector('.iban');
  const iban = ibanEl.dataset.iban;

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(iban);
  } else {
    const textarea = document.createElement('textarea');
    textarea.value = iban;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  const originalText = button.textContent;
  button.textContent = 'Copiado';
  button.disabled = true;

  setTimeout(() => {
    button.textContent = originalText;
    button.disabled = false;
  }, 1800);
}

function loadFooter(options = {}) {
  const {
    names = "Maria e João",
    date = "10 de maio de 2025",
    creditName = "António Moita",
    creditLink = ""
  } = options;

  const footerHTML = `
    <footer class="site-footer">
      <div class="footer-main serif">${names}</div>
      <div class="footer-date">${date}</div>
      <div class="footer-divider"></div>
      <div class="footer-credit">
        criado com carinho por ${
          creditLink
            ? `<a href="${creditLink}" target="_blank" rel="noopener noreferrer">${creditName}</a>`
            : creditName
        }
      </div>
      <div class="footer-license">
        © 2026 António Moita — Template protegido por licença.<br>
        Utilização não autorizada é proibida.
      </div>
    </footer>
  `;

  document.body.insertAdjacentHTML("beforeend", footerHTML);
}

document.addEventListener("DOMContentLoaded", () => {
  const backToTop = document.getElementById("backToTop");

  if (!backToTop) {
    return;
  }

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
});