document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);


    // 3. GSAP Register
    gsap.registerPlugin(ScrollTrigger);

    // 4. Preloader
    window.addEventListener('load', () => {
        const tl = gsap.timeline();
        tl.to('.loader-bar', { width: '100%', duration: 1 })
          .to('.preloader', { 
            clipPath: 'circle(0% at 50% 50%)', 
            duration: 1.2, 
            ease: 'expo.inOut',
            onComplete: () => {
                document.querySelector('.preloader').style.display = 'none';
                initAnimations();
            }
          });
    });

    function initAnimations() {
        // Hero Content Reveal
        const heroTl = gsap.timeline();
        heroTl.from('.hero-title', { y: 100, opacity: 0, duration: 1.2, ease: 'power4.out' })
              .from('.hero-subtitle', { y: 30, opacity: 0, duration: 1, ease: 'power4.out' }, '-=0.8')
              .from('.hero-arch-box', { scaleY: 0, opacity: 0, transformOrigin: 'bottom', duration: 1.5, ease: 'expo.out' }, '-=1')
              .from('.side-links-left, .side-links-right', { x: (i) => i === 0 ? -50 : 50, opacity: 0, duration: 1 }, '-=1');

        // Scroll Reveal Sections
        const revealItems = document.querySelectorAll('.kinetic-header, .arch-card, .chef-arch, .testi-wrap, .stat, .marquee-section, .private-dining, .gallery-item');
        revealItems.forEach(item => {
            gsap.from(item, {
                y: 60,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // Kinetic Text Inline Image Animation
        gsap.from('.inline-img', {
            scale: 0,
            rotation: 15,
            stagger: 0.2,
            duration: 1,
            ease: 'back.out(1.7)',
            scrollTrigger: {
                trigger: '.kinetic-header',
                start: 'top 80%'
            }
        });

        // Image Parallax for Arched Boxes
        gsap.utils.toArray('.hero-arch-box img, .arch-img img, .chef-arch img, .gallery-item img').forEach(img => {
            gsap.to(img, {
                yPercent: 15,
                ease: 'none',
                scrollTrigger: {
                    trigger: img.parentElement,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });
        });

        // Split Text Reveal Effect (Logic Simulation)
        document.querySelectorAll('.hero-title').forEach(el => {
            const text = el.innerText;
            el.innerHTML = text.split('').map(char => `<span style="display:inline-block">${char === ' ' ? '&nbsp;' : char}</span>`).join('');
            gsap.from(el.querySelectorAll('span'), {
                y: 50,
                opacity: 0,
                stagger: 0.03,
                duration: 1,
                ease: 'power3.out'
            });
        });
    }

    // Navbar Scrolled
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('.navbar');
        if (window.scrollY > 100) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
    });

    // Hover effects for inline images
    document.querySelectorAll('.inline-img').forEach(img => {
        img.addEventListener('mouseenter', () => {
            gsap.to(img, { scale: 1.2, rotation: 5, duration: 0.3 });
        });
        img.addEventListener('mouseleave', () => {
            gsap.to(img, { scale: 1, rotation: 0, duration: 0.3 });
        });
    });

    // Mobile Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Smooth Scroll for Anchors
    document.querySelectorAll('.nav-link').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetHref = this.getAttribute('href');
            
            // Only hijacking links that are purely internal anchors (start with #)
            if (targetHref && targetHref.startsWith('#')) {
                e.preventDefault();
                
                // Close mobile menu if open
                if (navLinks && navLinks.classList.contains('active')) {
                    mobileToggle.classList.remove('active');
                    navLinks.classList.remove('active');
                    
                    // Reset hamburger icon animation
                    document.querySelectorAll('.mobile-toggle span').forEach(span => {
                        span.style = '';
                    });
                }
                
                lenis.scrollTo(targetHref);
            }
        });
    });

    // Testimonial Carousel
    const slider = document.querySelector('.testi-slider');
    const dots = document.querySelectorAll('.testi-dots .dot');
    let currentSlide = 0;

    if (slider && dots.length > 0) {
        function updateSlider() {
            slider.style.transform = `translateX(-${currentSlide * 100}%)`;
            dots.forEach((dot, index) => {
                if (index === currentSlide) {
                    dot.classList.add('active');
                    dot.style.opacity = '1';
                } else {
                    dot.classList.remove('active');
                    dot.style.opacity = '0.3';
                }
            });
        }

        setInterval(() => {
            currentSlide = (currentSlide + 1) % dots.length;
            updateSlider();
        }, 4000);

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                updateSlider();
            });
        });
    }
});
