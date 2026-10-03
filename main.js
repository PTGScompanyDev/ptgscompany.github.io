/* ==========================================================================
   Логика сайта PTGScompany (Фоновая отправка форм и Анимация пикселей)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    initSmoothScroll();
    initForestPixels(); // Запуск эффекта падающей чащи
    initAjaxFeedbackForm(); // Запуск фоновой отправки на Gmail

});

/**
 * Плавный скролл к секциям
 */
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.main-nav a[href^="#"], .hero-content .btn-primary');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            e.preventDefault();
            
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const headerOffset = 70; 
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Генератор анимации зеленых пикселей (эффект леса для SWORD N` FOREST)
 */
function initForestPixels() {
    const container = document.querySelector('.pixel-animation-container');
    if (!container) return;

    const maxPixels = 20; // Количество одновременно падающих частиц

    for (let i = 0; i < maxPixels; i++) {
        createPixel(container);
    }
}

function createPixel(container) {
    const pixel = document.createElement('div');
    pixel.className = 'forest-pixel';
    
    // Случайные параметры для естественности эффекта
    pixel.style.left = Math.random() * 100 + '%';
    pixel.style.animationDelay = Math.random() * 5 + 's';
    pixel.style.animationDuration = (Math.random() * 3 + 4) + 's'; // от 4 до 7 секунд
    
    // Разные оттенки зеленого цвета леса
    const greenShades = ['#2ea44f', '#238636', '#3fb950', '#1f672e'];
    pixel.style.backgroundColor = greenShades[Math.floor(Math.random() * greenShades.length)];

    container.appendChild(pixel);
}

/**
 * Асинхронная отправка формы на почту через API Web3Forms (Без перезагрузки)
 */
function initAjaxFeedbackForm() {
    const form = document.getElementById('ajax-feedback-form');
    const submitBtn = document.getElementById('submit-btn');

    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Проверяем, заменен ли дефолтный ключ авторизации
        const keyInput = document.getElementById('web3forms-key').value;
        if (keyInput === 'YOUR_ACCESS_KEY_HERE') {
            alert('Ошибка конфигурации: Не установлен API-ключ для отправки писем. Пожалуйста, прочитайте инструкцию разработчика.');
            return;
        }

        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;

        const formData = new FormData(form);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        // Отправляем асинхронный POST-запрос на шлюз Web3Forms
        fetch('https://web3forms.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
        .then(async (response) => {
            let res = await response.json();
            if (response.status == 200) {
                // Если шлюз принял, выводим сообщение об успехе
                showCustomToast('Успешно! Ваше сообщение отправлено на почту PTGScompany.', true);
                form.reset();
            } else {
                showCustomToast('Ошибка сервера: ' + res.message, false);
            }
        })
        .catch(error => {
            showCustomToast('Не удалось отправить сообщение. Проверьте интернет-соединение.', false);
        })
        .then(() => {
            // Возвращаем кнопку в исходное состояние
            submitBtn.textContent = 'Отправить сообщение';
            submitBtn.disabled = false;
        });
    });
}

/**
 * Всплывающее уведомление
 */
function showCustomToast(message, isSuccess) {
    const oldToast = document.querySelector('.form-toast');
    if (oldToast) oldToast.remove();

    const toast = document.createElement('div');
    toast.className = 'form-toast';
    toast.innerText = message;

    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#161b22',
        color: '#ffffff',
        padding: '15px 25px',
        borderRadius: '6px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
        border: isSuccess ? '1px solid #2ea44f' : '1px solid #f85149',
        zIndex: '3000',
        transition: 'all 0.4s ease',
        opacity: '0',
        transform: 'translateY(20px)'
    });

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 100);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}
