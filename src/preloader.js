const preloader = document.querySelector('.preloader');

const preloaderInit = () => {
    window.addEventListener('load', () => {
    
        // fade effect
        const timerId = setInterval(() => {
            if (!preloader.style.opacity) {
                preloader.style.opacity = 1;
            }
            if (preloader.style.opacity > 0) {
                preloader.style.opacity -= 0.1;
            } else {
                preloader.classList.add('loaded');
                clearInterval(timerId);
            }
        }, 100);
    });
}

preloaderInit()