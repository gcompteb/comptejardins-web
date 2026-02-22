document.addEventListener('DOMContentLoaded', function() {
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    const slider = document.getElementById('slider');
    const slides = slider ? slider.querySelectorAll('.slide') : [];
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    const dotsContainer = document.getElementById('sliderDots');
    let currentSlide = 0;
    let autoSlideInterval;

    if (slider && slides.length > 0) {
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('slider-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        function updateSlider() {
            slides.forEach((slide, index) => {
                slide.style.transform = `translateX(-${currentSlide * 100}%)`;
            });
            document.querySelectorAll('.slider-dot').forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }

        function goToSlide(index) {
            currentSlide = index;
            updateSlider();
            resetAutoSlide();
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            updateSlider();
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            updateSlider();
        }

        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(nextSlide, 5000);
        }

        prevBtn.addEventListener('click', () => { prevSlide(); resetAutoSlide(); });
        nextBtn.addEventListener('click', () => { nextSlide(); resetAutoSlide(); });

        autoSlideInterval = setInterval(nextSlide, 5000);

        let touchStartX = 0;
        slider.addEventListener('touchstart', e => touchStartX = e.touches[0].clientX);
        slider.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) { nextSlide(); } else { prevSlide(); }
                resetAutoSlide();
            }
        });
    }

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    menuToggle.addEventListener('click', function() {
        menuToggle.classList.toggle('open');
        nav.classList.toggle('open');
        document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('open');
            nav.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Enviant...';
            submitBtn.disabled = true;
            
            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    contactForm.style.display = 'none';
                    formSuccess.classList.add('show');
                } else {
                    throw new Error('Error en enviar');
                }
            } catch (error) {
                alert('Hi ha hagut un error. Si us plau, prova amb WhatsApp o trucant directament.');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.servei-card, .feature, .gallery-item').forEach(el => {
        observer.observe(el);
    });

    function updateScrollDots(container, dots) {
        const items = container.children;
        const containerRect = container.getBoundingClientRect();
        const containerCenter = containerRect.left + containerRect.width / 2;
        
        let closestIndex = 0;
        let closestDistance = Infinity;
        
        Array.from(items).forEach((item, index) => {
            const itemRect = item.getBoundingClientRect();
            const itemCenter = itemRect.left + itemRect.width / 2;
            const distance = Math.abs(containerCenter - itemCenter);
            
            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = index;
            }
        });
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === closestIndex);
        });
    }

    document.querySelectorAll('.features-grid, .serveis-grid, .zones-grid').forEach(container => {
        const dotsContainer = container.parentElement.querySelector('.scroll-dots');
        if (dotsContainer) {
            const dots = dotsContainer.querySelectorAll('.scroll-dot');
            updateScrollDots(container, dots);
            container.addEventListener('scroll', () => updateScrollDots(container, dots));
        }
    });

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');

    document.querySelectorAll('.slide img').forEach(img => {
        img.addEventListener('click', () => {
            const slide = img.closest('.slide');
            const caption = slide.querySelector('.slide-caption h3');
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightboxCaption.textContent = caption ? caption.textContent : '';
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
    });

    document.querySelectorAll('.comparador').forEach(comparador => {
        const slider = comparador.querySelector('.slider-handle');
        const imgDespres = comparador.querySelector('.img-despres');
        const etiquetaAbans = comparador.querySelector('.etiqueta-abans');
        const etiquetaDespres = comparador.querySelector('.etiqueta-despres');

        const divider = document.createElement('div');
        divider.className = 'comparador-divider';
        divider.innerHTML = '<div class="comparador-handle-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l-6-6 6-6"/><path d="M15 6l6 6-6 6"/></svg></div>';
        comparador.appendChild(divider);

        const hint = document.createElement('div');
        hint.className = 'comparador-hint';
        hint.textContent = '↔ Arrossega per comparar';
        comparador.appendChild(hint);

        function updateComparador(value) {
            imgDespres.style.clipPath = `inset(0 ${100 - value}% 0 0)`;
            divider.style.left = `${value}%`;
            etiquetaAbans.style.opacity = value > 60 ? '0' : '1';
            etiquetaDespres.style.opacity = value < 40 ? '0' : '1';
        }

        function markInteracted() {
            comparador.classList.add('interacted');
        }

        updateComparador(50);

        slider.addEventListener('input', (e) => {
            updateComparador(e.target.value);
            markInteracted();
        });

        comparador.addEventListener('mousemove', (e) => {
            const rect = comparador.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = (x / rect.width) * 100;
            slider.value = Math.max(0, Math.min(100, percentage));
            updateComparador(slider.value);
            markInteracted();
        });

        comparador.addEventListener('touchmove', (e) => {
            const rect = comparador.getBoundingClientRect();
            const x = e.touches[0].clientX - rect.left;
            const percentage = (x / rect.width) * 100;
            slider.value = Math.max(0, Math.min(100, percentage));
            updateComparador(slider.value);
            markInteracted();
        });
    });
});