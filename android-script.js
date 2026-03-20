// Restaurar tema guardado
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.getElementById('themeIcon').className = savedTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// === RELOJ & FECHA ===
function updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;

    document.getElementById('clock').textContent = timeString;
    document.getElementById('widget-clock').textContent = timeString;

    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    document.getElementById('widget-date').textContent = now.toLocaleDateString('es-ES', options);
}
setInterval(updateTime, 1000);
updateTime();

// === GESTIÓN DE TEMAS (DARK/LIGHT) ===
function toggleTheme() {
    const html = document.documentElement;
    const themeIcon = document.getElementById('themeIcon');
    const isDark = html.getAttribute('data-theme') === 'dark';

    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    themeIcon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
}

// === NOTIFICACIÓN (Ajustada para Accesibilidad) ===
setTimeout(() => {
    // Solo se muestra si NO estamos en modo neurodivergente
    if (document.documentElement.getAttribute('data-accesibilidad') !== 'neuro') {
        const notif = document.getElementById('notification');
        notif.classList.add('show');
        setTimeout(() => hideNotification(), 3000);
    }
}, 2000);

function hideNotification() {
    document.getElementById('notification').classList.remove('show');
}

// === NAVEGACIÓN Y SEGURIDAD ===
let isDeveloper = false; // Estado global

function openApp(id) {
    // Si intentan abrir la terminal sin ser desarrollador, los bloqueamos
    if (id === 'terminal' && !isDeveloper) {
        mostrarNotificacionSistema("Acceso Denegado", "Se requieren permisos de desarrollador para usar la Terminal.");
        return;
    }
    
    document.getElementById(id + '-app').classList.add('active');
    hideNotification();
}

function closeApp(id) {
    document.getElementById(id + '-app').classList.remove('active');
}

// === MODO DESARROLLADOR (EASTER EGG ANDROID NATIVO) ===
let devClickCount = 0;

function unlockDevMode() {
    // Si ya es desarrollador, le avisamos como hace Android
    if (isDeveloper) {
        mostrarNotificacionSistema("Sistema", "No es necesario, ya eres un desarrollador.");
        return;
    }

    devClickCount++;

    if (devClickCount === 5) {
        isDeveloper = true;
        
        // 1. Mostrar mensaje de éxito
        mostrarNotificacionSistema("{ DEV_MODE }", "¡Felicidades! Se ha desbloqueado la Terminal.", true);
        
        // 2. Efecto Matrix de 3 segundos para celebrar
        document.documentElement.style.setProperty('--primary', '#00FF00');
        document.documentElement.style.setProperty('--text', '#00FF00');
        
        setTimeout(() => {
            document.documentElement.style.removeProperty('--primary');
            document.documentElement.style.removeProperty('--text');
        }, 3000);
        
    } else if (devClickCount >= 2) {
        // Empezar a avisar desde el segundo toque
        mostrarNotificacionSistema("Sistema", `Estás a ${5 - devClickCount} pasos de ser un desarrollador.`);
    }
}

// Función auxiliar para reutilizar tu popup de notificaciones fácilmente
function mostrarNotificacionSistema(titulo, mensaje, esExito = false) {
    const notif = document.getElementById('notification');
    const title = notif.querySelector('h4');
    const text = notif.querySelector('.notif-content p');
    const img = notif.querySelector('img');

    title.textContent = titulo;
    text.textContent = mensaje;

    if (esExito) {
        img.src = "assets/icono_dark.png"; 
        title.style.color = "#00FF00";
    } else {
        img.src = "assets/foto.png"; // Tu foto normal
        title.style.color = "var(--text)";
    }

    notif.classList.add('show');
    
    // Ocultar después de 2.5 segundos
    setTimeout(() => {
        hideNotification();
        // Restaurar los textos originales por si acaso
        setTimeout(() => {
            title.textContent = "Yerko Osorio";
            title.style.color = "var(--text)";
            text.textContent = "¡Hola! 👋 Echa un vistazo a mi último proyecto.";
        }, 500);
    }, 2500);
}


// === TERMINAL LOGIC ===
function handleCommand(e) {
    if (e.key === 'Enter') {
        const input = document.getElementById('term-input');
        const output = document.getElementById('terminal-output');
        const cmd = input.value.toLowerCase().trim();

        // 1. Renderizar el comando del usuario
        // Usamos div para asegurar salto de línea limpio
        output.innerHTML += `
    <div style="margin-top: 8px;">
        <span style="color: #00FF00;">➜</span> 
        <span style="color: #fff;">~</span> 
        <span style="color: #ccc;">${input.value}</span>
    </div>`;

        // 2. Procesar comando
        let response = "";
        switch (cmd) {
            case 'help':
                response = "Available commands: <span style='color:#fff'>about, skills, contact, clear, exit</span>";
                break;
            case 'about':
                response = "Yerko Osorio | Android Developer<br>Building native experiences with Kotlin & Compose.";
                break;
            case 'skills':
                response = "• Kotlin, Compose, Android SDK<br>• Clean Arch, Coroutines, Hilt<br>• Java, Spring Boot, Firebase<br>• Git, UX/UI Design, IA";
                break;
            case 'contact':
                // Mostramos el correo en texto por si falla la apertura automática
                response = "📧 Email: <span style='color:#fff; text-decoration:underline;'>ycosorio.dev@gmail.com</span><br><span style='font-size:12px; opacity:0.7;'>Opening mail client...</span>";
                // Usamos un timeout pequeño para no bloquear la UI
                setTimeout(() => {
                    window.location.href = 'mailto:ycosorio.dev@gmail.com';
                }, 800);
                break;
            case 'clear':
                output.innerHTML = "";
                response = null;
                break;
            case 'exit':
                response = "Closing session...";
                setTimeout(() => closeApp('terminal'), 800);
                break;
            default:
                if (cmd !== "") {
                    response = `zsh: command not found: <span style='color:#FF5252'>${cmd}</span>`;
                }
        }

        // 3. Renderizar respuesta
        if (response) {
            output.innerHTML += `<div style="color: #aaa; margin-bottom: 10px; line-height: 1.5; margin-left: 14px;">${response}</div>`;
        }

        // 4. Limpieza y Scroll
        input.value = "";
        const content = document.querySelector('#terminal-app .app-content');
        // Forzamos el scroll al final
        setTimeout(() => {
            content.scrollTop = content.scrollHeight;
        }, 10);
    }
}

// --- Modo Accesibilidad (Neurodivergente) ---
const rootHtml = document.documentElement;

// Mantener preferencia al recargar o cambiar de Web a Android
if (localStorage.getItem('neuroMode') === 'true') {
    rootHtml.setAttribute('data-accesibilidad', 'neuro');
}

// Nueva función llamada desde el menú de Ajustes
function toggleNeuroMode() {
    const isNeuro = rootHtml.getAttribute('data-accesibilidad') === 'neuro';
    if (isNeuro) {
        rootHtml.removeAttribute('data-accesibilidad');
        localStorage.setItem('neuroMode', 'false');
    } else {
        rootHtml.setAttribute('data-accesibilidad', 'neuro');
        localStorage.setItem('neuroMode', 'true');
    }
}
