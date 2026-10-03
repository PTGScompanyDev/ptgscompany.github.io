/* ==========================================================================
   Логика для сайта PTGScompany (Обновленная версия)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // Плавная прокрутка меню
    initSmoothScroll();

    // Обработка формы отправки на Gmail
    initFeedbackFormHandler();

});

/**
 * Обеспечивает мягкий и плавный скролл к секциям сайта
 */
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.main-nav a, .hero-content .btn-primary');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId && targetId.startsWith('#')) {
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
            }
        });
    });
}

/**
 * Перехватывает отправку формы, собирает текст и открывает клиент Gmail с готовым письмом
 */
function initFeedbackFormHandler() {
    const form = document.getElementById('gmail-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); // Запрещаем перезагрузку страницы

            // Получаем данные из полей ввода
            const name = document.getElementById('user-name').value.trim();
            const subjectSelection = document.getElementById('form-subject').value;
            const messageText = document.getElementById('user-message').value.trim();
            
            // Наш целевой ящик
            const emailTo = 'ptgscompanyyt@gmail.com';
            
            // Формируем тему письма (например: [Форма сайта] Вопрос по SWORD N` FOREST)
            const emailSubject = encodeURIComponent(`[Сайт PTGS] ${subjectSelection}`);
            
            // Формируем красивое тело письма с переносами строк
            const emailBody = encodeURIComponent(
                `Отправитель: ${name}\n` +
                `Категория: ${subjectSelection}\n` +
                `--------------------------------------------------\n\n` +
                `${messageText}`
            );
            
            // Строим специальную mailto-ссылку
            const mailtoUrl = `mailto:${emailTo}?subject=${emailSubject}&body=${emailBody}`;
            
            // Запускаем открытие почтового клиента
            window.location.href = mailtoUrl;
            
            // Сбрасываем поля формы после успешного действия
            form.reset();
        });
    }
}
