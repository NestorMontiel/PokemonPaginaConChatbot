document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       ANIMACIÓN DE BARRAS DE PROGRESO (STATS)
       ========================================= */
    // Configuramos un IntersectionObserver para que las barras
    // se llenen cuando la sección "Iniciales" sea visible
    const observerOptions = {
        threshold: 0.3
    };

    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressFills = entry.target.querySelectorAll('.progress-fill');
                progressFills.forEach(fill => {
                    const width = fill.getAttribute('data-width');
                    // Retraso ligero para efecto escalonado visualmente (opcional, lo dejamos directo por fluidez)
                    requestAnimationFrame(() => {
                        fill.style.width = width + '%';
                    });
                });
                // Dejamos de observar una vez animados
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const statsSection = document.getElementById('iniciales');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    /* =========================================
       MAPA DE KANTO (INTERACTIVIDAD)
       ========================================= */
    const routeItems = document.querySelectorAll('.route-item');
    const displayScreen = document.getElementById('map-description');

    // Muestra por defecto la primera ruta (typing effect simulado rapido)
    if (routeItems.length > 0 && displayScreen) {
        const text = routeItems[0].getAttribute('data-desc');
        typeText(displayScreen, text);
    }

    routeItems.forEach(item => {
        item.addEventListener('click', function () {
            // Remover activos
            routeItems.forEach(r => r.classList.remove('active'));
            // Añadir activo
            this.classList.add('active');

            // Actualizar displayGBA a lo bestia (y simple)
            const textToDisplay = this.getAttribute('data-desc');
            typeText(displayScreen, textToDisplay);
        });
    });

    // Función simple tipo "Máquina de escribir" que recuerda al Pokedex original
    function typeText(element, text) {
        element.innerHTML = '';
        let i = 0;
        // Limpiamos intervalos previos si existieran en este elemento
        if (element.typewriterInterval) clearInterval(element.typewriterInterval);

        element.typewriterInterval = setInterval(() => {
            element.textContent += text.charAt(i);
            i++;
            if (i > text.length - 1) {
                clearInterval(element.typewriterInterval);
            }
        }, 30); // Velocidad ms
    }


    /* =========================================
       ACORDEÓN - GUÍA DE MISIONES
       ========================================= */
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', function () {
            const content = this.nextElementSibling;

            // Si quieres que al abrirse uno se cierren los demás
            accordionHeaders.forEach(h => {
                if (h !== this && h.classList.contains('active')) {
                    h.classList.remove('active');
                    h.querySelector('.accordion-icon').innerText = '+';
                    h.nextElementSibling.style.maxHeight = null;
                }
            });

            // Toggle la clase activa
            this.classList.toggle('active');

            if (this.classList.contains('active')) {
                this.querySelector('.accordion-icon').innerText = '-';
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                this.querySelector('.accordion-icon').innerText = '+';
                content.style.maxHeight = null;
            }
        });
    });

    /* /* =========================================
   CHATBOT LOGIC (Oak-Bot) con IA (Hugging Face)
   ========================================= */
const chatbotToggleBtn = document.getElementById('chatbot-toggle-btn');
const chatbotWindow = document.getElementById('chatbot-window');
const chatbotCloseBtn = document.getElementById('chatbot-close-btn');
const chatbotInput = document.getElementById('chatbot-input');
const chatbotSendBtn = document.getElementById('chatbot-send-btn');
const chatbotMessages = document.getElementById('chatbot-messages');

const HF_API_KEY = "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";
// Cambiamos el modelo a uno más ligero y compatible
const MODEL_URL = "https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-1B-Instruct";

async function askOakIA(userInput) {
    try {
        const response = await fetch('oak_proxy.php', {
            method: "POST",
            headers: { 
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userInput: userInput }),
        });

        const result = await response.json();

        // Manejo de errores de la API
        if (result.error) {
            return "Error en el laboratorio: " + (result.error.message || result.error);
        }

        // Estructura de respuesta de Groq
        const oakResponse = result.choices?.[0]?.message?.content;
        
        return oakResponse ? oakResponse.trim() : "¡Qué curioso! No encuentro eso en mi Pokédex.";

    } catch (error) {
        console.error("Error de Red:", error);
        return "El Team Rocket ha bloqueado la señal. Revisa tu conexión local.";
    }
}

// 3. Manejo de Interfaz (Mensajes)
const addMessage = (text, sender) => {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}-message`;
    msgDiv.innerHTML = text.replace(/\n/g, '<br>');
    chatbotMessages.appendChild(msgDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
};

const handleUserMessage = async () => {
    const text = chatbotInput.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    chatbotInput.value = '';

    // Mostrar indicador de carga
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message bot-message';
    loadingDiv.innerText = 'Oak está pensando...';
    chatbotMessages.appendChild(loadingDiv);

    const aiResponse = await askOakIA(text);
    
    // Quitar indicador y poner respuesta real
    chatbotMessages.removeChild(loadingDiv);
    addMessage(aiResponse, 'bot');
};

// Eventos de botones
chatbotToggleBtn.addEventListener('click', () => {
    chatbotWindow.classList.remove('hidden');
    chatbotToggleBtn.style.display = 'none';
    chatbotInput.focus();
});

chatbotCloseBtn.addEventListener('click', () => {
    chatbotWindow.classList.add('hidden');
    chatbotToggleBtn.style.display = 'flex';
});

chatbotSendBtn.addEventListener('click', handleUserMessage);
chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleUserMessage();
});

});
