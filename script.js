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

    /* =========================================
       CHATBOT LOGIC (Oak-Bot)
       ========================================= */
    const chatbotToggleBtn = document.getElementById('chatbot-toggle-btn');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotCloseBtn = document.getElementById('chatbot-close-btn');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSendBtn = document.getElementById('chatbot-send-btn');
    const chatbotMessages = document.getElementById('chatbot-messages');

    // DATOS CHATBOT (OAK-BOT) REFINADOS, CORTOS Y PRECISOS
    const chatData = [
        {
            keywords: ['spa', 'pagina', 'web', 'tecnologia', 'hecha'],
            responses: [
                "Esta web es una SPA (Single Page Application) creada con HTML5, CSS3 y Vanilla JavaScript puro.",
                "Usamos JavaScript puro, HTML5 y CSS3 sin librerías pesadas para hacer esta landing page de Pokémon.",
                "¡Como la vieja escuela! Todo está hecho a mano en HTML, CSS y JS, sin frameworks."
            ]
        },
        {
            keywords: ['header', 'navegacion', 'menu', 'arriba', 'logo'],
            responses: [
                "El menú de arriba (Header) se queda fijo mientras navegas por Kanto para que nunca te pierdas.",
                "El Header tiene navegación suave (smooth scroll) que te lleva directo a los iniciales, misiones o mapa.",
                "Arriba tienes la PokéGuía con 3 enlaces útiles que te llevan rápido a cualquier zona."
            ]
        },
        {
            keywords: ['hero', 'inicio', 'titulo', 'fondo', 'empezar'],
            responses: [
                "La sección de inicio estilo retro tiene el botón 'Explorar Kanto'. ¡Púlsalo para empezar tu aventura!",
                "La sección principal destaca el título del juego con una increíble fuente pixelada nostálgica.",
                "Esa gran sección oscura (el Hero) está diseñada para sumergirte de inmediato en el mundo GBA."
            ]
        },
        {
            keywords: ['compañero', 'estadisticas', 'stats', 'barras', 'animacion', 'hover', 'tarjetas', 'pokemon', 'iniciales'],
            responses: [
                "Las estadísticas de los 3 iniciales usan un IntersectionObserver: ¡las barras crecen solas justo cuando bajas la pantalla!",
                "Si pasas el cursor sobre los iniciales, verás cómo brillan con el color de su tipo.",
                "¡Con JS animamos las barras de salud, ataque y defensa! Pruébalo bajando por la pantalla."
            ]
        },
        {
            keywords: ['bulbasaur', 'planta'],
            responses: [
                "Bulbasaur es el Pokémon #001 de Kanto, de tipo Planta/Veneno. En esta página puedes ver que tiene 45 HP, 49 de Ataque y 49 de Defensa.",
                "Si eliges a Bulbasaur, los primeros gimnasios (Roca y Agua) serán muy fáciles para ti. Tiene buenas estadísticas defensivas."
            ]
        },
        {
            keywords: ['charmander', 'fuego'],
            responses: [
                "Charmander es el inicial de Fuego (#004). Sus estadísticas base aquí muestran: 39 HP, 52 de Ataque y 43 de Defensa.",
                "Elegir a Charmander es el modo 'difícil' al inicio, ¡pero al final tendrás un poderoso Charizard!"
            ]
        },
        {
            keywords: ['squirtle', 'agua'],
            responses: [
                "Squirtle es el inicial de Agua (#007). Destaca por su Defensa de 65, además tiene 44 HP y 48 de Ataque.",
                "Squirtle es una opción muy equilibrada para empezar tu viaje; el gimnasio de Brock no será un problema."
            ]
        },
        {
            keywords: ['mapa', 'kanto', 'simulador', 'gameboy', 'game', 'boy', 'escribir', 'letras', 'rutas'],
            responses: [
                "El mapa simula una Game Boy Advance reales. Cuando haces clic en una ruta, el texto aparece letra por letra mágicamente.",
                "Para la Game Boy que ves en pantalla, usé la función setInterval de JS para que el texto imite la máquina de escribir clásica."
            ]
        },
        {
            keywords: ['pueblo', 'paleta'],
            responses: [
                "Pueblo Paleta es el primer lugar en el Mapa (Rutas Principales). Es el inicio de tu aventura.",
                "En el simulador del mapa, Pueblo Paleta te advierte: '¡No salgas a la hierba alta sin tu Pokémon!'."
            ]
        },
        {
            keywords: ['ciudad', 'verde'],
            responses: [
                "Sobre Ciudad Verde, el mapa dice: 'Primera ciudad real. Aquí entregarás el correo al Prof. Oak.'",
                "Ciudad Verde es el segundo destino de las Rutas Principales. Es donde entregas un paquete importante para mí, el Prof. Oak."
            ]
        },
        {
            keywords: ['ciudad', 'plateada'],
            responses: [
                "En el mapa, Ciudad Plateada dice: 'El gimnasio Roca te espera. Brock será un desafío duro'.",
                "Ciudad Plateada es la tercera ruta principal en el mapa de Kanto. ¡Prepárate para la batalla contra Brock!"
            ]
        },
        {
            keywords: ['ciudad', 'azulona'],
            responses: [
                "Según el simulador del mapa, Ciudad Azulona es enorme: 'El Casino y el escondite del Team Rocket están aquí'.",
                "La cuarta ruta principal simulada es Ciudad Azulona, ¡el destino perfecto si quieres desafiar al Team Rocket!"
            ]
        },
        {
            keywords: ['meseta', 'añil', 'liga', 'alto', 'mando'],
            responses: [
                "Es el final del mapa. La frase dice: 'La Liga Pokémon. Sólo para los verdaderos Maestros'.",
                "La meseta Añil es la última ruta en el simulador GBA. Para llegar ahí, primero ve a la Calle Victoria como dice la Misión 4."
            ]
        },
        {
            keywords: ['misiones', 'guia', 'acordeon', 'desplegable'],
            responses: [
                "Las Misiones Clave funcionan como un acordeón inteligente. ¡Si abres una, las demás se cierran solas!",
                "La guía te muestra 4 misiones principales en una interfaz tipo 'Accordion' que se despliega al instante."
            ]
        },
        {
            keywords: ['mision', '1', 'elegir'],
            responses: [
                "La misión 1 trata sobre Elegir al Pokémon Inicial. Tu rival siempre elegirá al Pokémon con ventaja sobre el tuyo.",
                "En la misión 1 de la guía, debes ir al laboratorio del Prof. Oak en Pueblo Paleta y prepararte para tu primera batalla."
            ]
        },
        {
            keywords: ['mision', '2', 'derrotar', 'brock', 'roca'],
            responses: [
                "La misión 2 de la guía trata de Brock. Usa Pokémon tipo Roca (Geodude lvl 12, Onix lvl 14).",
                "Si elegiste Charmander, la guía de Misiones menciona que debes atrapar un Mankey para ayudar a derrotar a Brock en la Misión 2."
            ]
        },
        {
            keywords: ['mision', '3', 'conseguir', 'corte', 'mo', 'barco', 'anne'],
            responses: [
                "La misión 3 trata sobre la MO Corte. Según la guía, debes subir al S.S. Anne en Ciudad Carmín y ayudar al Capitán mareado frotándole la espalda.",
                "En la Misión 3 aprenderás a usar la MO Corte. Recuerda que necesitas la Medalla Trueno para usarla fuera de combate."
            ]
        },
        {
            keywords: ['mision', '4', 'giovanni', 'victoria', 'equipo'],
            responses: [
                "La última misión (la 4) es la Liga Pokémon. Dirígete a la Calle Victoria con revivir, hiperpociones y un equipo al nivel 55-60.",
                "Derrotar a Giovanni y la Liga Pokémon es el clímax de la guía. ¡Asegúrate de llevar un equipo balanceado muy bien formado!"
            ]
        },
        {
            keywords: ['estilo', 'colores', 'diseño', 'fuentes', 'visual', 'retro'],
            responses: [
                "Usamos el estilo 'Modern-Retro'. Rojos oscuros intensos y fuentes pixeladas de Google Fonts para dar nostalgia.",
                "Toda la página está bañada en la paleta de Pokémon Rojo Fuego: rojo primario, gris Game Boy y blanco puro."
            ]
        },
        {
            keywords: ['hola', 'oak', 'profesor', 'ayuda'],
            responses: [
                "¡Hola, soy el Profesor Oak! Pregúntame sobre cualquier ciudad como Ciudad Verde, los Pokémon iniciales o la estructura de la web.",
                "¡Bienvenido a mi laboratorio! Dime, ¿necesitas ayuda con tus misiones o quieres saber cómo se programó esta página?"
            ]
        }
    ];

    chatbotToggleBtn.addEventListener('click', () => {
        chatbotWindow.classList.remove('hidden');
        chatbotToggleBtn.style.display = 'none';
        chatbotInput.focus();
    });

    chatbotCloseBtn.addEventListener('click', () => {
        chatbotWindow.classList.add('hidden');
        chatbotToggleBtn.style.display = 'flex';
    });

    const addMessage = (text, sender) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}-message`;
        msgDiv.innerHTML = text.replace(/\n/g, '<br>');
        chatbotMessages.appendChild(msgDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    };

    const handleUserMessage = () => {
        const text = chatbotInput.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        chatbotInput.value = '';

        const query = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Quitar tildes

        let bestMatch = null;
        let maxHits = 0;

        // Buscar coincidencia en las palabras clave del nuevo JSON
        chatData.forEach(item => {
            let hits = 0;
            item.keywords.forEach(kw => {
                if (query.includes(kw)) {
                    hits++;
                }
            });

            if (hits > maxHits) {
                maxHits = hits;
                bestMatch = item;
            }
        });

        let responseFound = "";

        if (bestMatch && maxHits > 0) {
            // Seleccionar respuesta ALEATORIA de la categoría ganadora
            const randomIndex = Math.floor(Math.random() * bestMatch.responses.length);
            responseFound = bestMatch.responses[randomIndex];
        } else {
            // Fallbacks aleatorios
            const fallbacks = [
                "Hmm... mi Pokédex no tiene datos exactos sobre eso. ¿Por qué no me preguntas sobre Pueblo Paleta o Ciudad Verde?",
                "Esa no me la sé. ¿Has probado a preguntarme por Bulbasaur, Charmander, Squirtle o la MO Corte?",
                "¿Acaso olvidaste consultarlo en el mapa de Kanto? Pregúntame por las misiones o las rutas."
            ];
            responseFound = fallbacks[Math.floor(Math.random() * fallbacks.length)];
        }

        setTimeout(() => {
            addMessage(responseFound, 'bot');
        }, 600);
    };

    chatbotSendBtn.addEventListener('click', handleUserMessage);
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleUserMessage();
    });

});
