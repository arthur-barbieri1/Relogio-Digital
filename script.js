// ========== RELÓGIO DIGITAL ==========
const elHours = document.getElementById('hours');
const elMinutes = document.getElementById('minutes');
const elSeconds = document.getElementById('seconds');
const elAMPM = document.getElementById('ampm');
const elDate = document.getElementById('date');
const elProgress = document.getElementById('progress');

// Configura o círculo
const R = 40;
const circumference = 2 * Math.PI * R;
elProgress.style.stroke = 'url(#grad)';
elProgress.style.strokeDasharray = circumference;

let use24 = true;
let currentTimezone = null;

function two(n) {
    return String(n).padStart(2, '0');
}

// 🎨 GRADIENTES MELHORADOS COM EMOJIS (sua função melhorada!)
function getGradientForHour(hour) {
    // Array de cores com descrições para cada período
    const gradients = [
        { hour: 0, colors: ['#0a0f0f', '#1a2f3f'], name: '🌙 Madrugada' },
        { hour: 1, colors: ['#0b1a2a', '#1c3a4a'], name: '🌙 1h' },
        { hour: 2, colors: ['#0c1f2f', '#1e3f4f'], name: '🌙 2h' },
        { hour: 3, colors: ['#0e2434', '#204454'], name: '🌙 3h' },
        { hour: 4, colors: ['#102939', '#224959'], name: '🌙 4h' },
        { hour: 5, colors: ['#2a4b5c', '#3d5e73'], name: '🌅 Amanhecer' },
        { hour: 6, colors: ['#ffb56b', '#ff8a5c'], name: '🌅 Nascer do Sol' },
        { hour: 7, colors: ['#ffd966', '#ffaa5e'], name: '☀️ Manhã Dourada' },
        { hour: 8, colors: ['#2aa198', '#0a2f6b'], name: '☀️ Manhã' },
        { hour: 9, colors: ['#3498db', '#2980b9'], name: '☀️ Meio da Manhã' },
        { hour: 10, colors: ['#5dade2', '#2e86c1'], name: '☀️ Fim da Manhã' },
        { hour: 11, colors: ['#f7dc6f', '#f1c40f'], name: '⛅ Quase Meio-dia' },
        { hour: 12, colors: ['#ffd166', '#ef476f'], name: '☀️ Meio-dia' },
        { hour: 13, colors: ['#ffb347', '#ff8c42'], name: '☀️ Primeira Tarde' },
        { hour: 14, colors: ['#ff9a3d', '#ff6b4a'], name: '☀️ Tarde' },
        { hour: 15, colors: ['#ff8c69', '#ff6b6b'], name: '☀️ Tarde Quente' },
        { hour: 16, colors: ['#ff7e5f', '#feb47b'], name: '🌆 Fim de Tarde' },
        { hour: 17, colors: ['#f12711', '#f5af19'], name: '🌇 Pôr do Sol' },
        { hour: 18, colors: ['#2b5876', '#4e4376'], name: '🌆 Crepúsculo' },
        { hour: 19, colors: ['#1e3c72', '#2a5298'], name: '🌃 Anoitecer' },
        { hour: 20, colors: ['#0f2027', '#203a43'], name: '🌃 Noite' },
        { hour: 21, colors: ['#0b1c24', '#1a333e'], name: '🌃 Noite Alta' },
        { hour: 22, colors: ['#08141c', '#122b34'], name: '🌃 Noite Avançada' },
        { hour: 23, colors: ['#050f15', '#0a232b'], name: '🌃 Final da Noite' }
    ];
    
    // Encontra o gradiente da hora atual
    const gradient = gradients.find(g => g.hour === hour) || gradients[21]; // fallback para 21h
    
    // Log bonitinho no console (opcional)
    console.log(`🕐 ${gradient.name} - ${gradient.colors[0]} → ${gradient.colors[1]}`);
    
    return gradient.colors;
}

// ✨ EFEITO DE DIGITAÇÃO NO TÍTULO (NOVO!)
function typeWriterEffect() {
    const title = document.querySelector('title');
    const originalTitle = title.textContent;
    const phrases = ['🕐 Relógio Digital', '✨ Hora atual', '🌍 Horário Mundial', '🎵 Com Player'];
    let phraseIndex = 0;
    
    setInterval(() => {
        phraseIndex = (phraseIndex + 1) % phrases.length;
        title.textContent = phrases[phraseIndex];
    }, 3000);
}

// 🎯 FUNÇÃO PARA ANIMAÇÃO SUAVE DOS NÚMEROS (NOVO!)
function animateNumberChange(element, oldValue, newValue) {
    if (oldValue !== newValue) {
        element.style.transform = 'scale(1.1)';
        element.style.transition = 'transform 0.2s ease';
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 200);
    }
}

let lastSeconds = 0;
let lastMinutes = 0;
let lastHours = 0;

function updateClock() {
    const now = currentTimezone ?
        new Date(new Date().toLocaleString("en-US", { timeZone: currentTimezone.timezone })) :
        new Date();

    let h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();

    // Animar mudanças
    if (lastSeconds !== s) {
        animateNumberChange(elSeconds, lastSeconds, s);
    }
    if (lastMinutes !== m) {
        animateNumberChange(elMinutes, lastMinutes, m);
    }
    if (lastHours !== h) {
        animateNumberChange(elHours, lastHours, h);
    }
    
    lastSeconds = s;
    lastMinutes = m;
    lastHours = h;

    const ampm = h >= 12 ? 'PM' : 'AM';
    if (!use24) {
        h = h % 12 || 12;
        elAMPM.textContent = ampm;
        elAMPM.style.color = '#ffd166';
    } else {
        elAMPM.textContent = '24h';
        elAMPM.style.color = 'rgba(255,255,255,0.9)';
    }

    elHours.textContent = two(h);
    elMinutes.textContent = two(m);
    elSeconds.textContent = two(s);

    // Formatação da data mais bonita
    const fmt = new Intl.DateTimeFormat('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
    // Capitaliza a primeira letra do dia da semana
    let dateStr = fmt.format(now);
    dateStr = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
    elDate.textContent = dateStr;

    // Atualiza gradiente
    const [bg1, bg2] = getGradientForHour(now.getHours());
    document.documentElement.style.setProperty('--bg1', bg1);
    document.documentElement.style.setProperty('--bg2', bg2);

    // Progresso suave do círculo (inclui milissegundos)
    const progress = (s + now.getMilliseconds() / 1000) / 60;
    const offset = circumference * (1 - progress);
    elProgress.style.strokeDashoffset = offset;
}

// ⚡ Atualização mais suave (60fps)
setInterval(updateClock, 16); // ~60fps
updateClock();

// Evento do clique no relógio com feedback visual
document.getElementById('clock').addEventListener('click', () => {
    use24 = !use24;
    
    // Feedback visual do clique
    const clock = document.getElementById('clock');
    clock.style.transform = 'scale(0.98)';
    setTimeout(() => {
        clock.style.transform = 'scale(1)';
    }, 200);
    
    updateClock();
});

// ========== PLAYER DE MÚSICA MELHORADO ==========
const playlist = [
    { name: "🎵 Música 1 - Relax", src: "audios/musica1.mp3" },
    { name: "🎵 Música 2 - Foco", src: "audios/musica2.mp3" },
    { name: "🎵 Música 3 - Estudo", src: "audios/musica3.mp3" },
    { name: "🎵 Música 4 - Calma", src: "audios/musica4.mp3" },
    { name: "🎵 Música 5 - Energia", src: "audios/musica5.mp3" }
];

const player = document.getElementById("player");
const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const trackName = document.getElementById("trackName");
const volumeBar = document.getElementById("volumeBar");

let currentTrack = 0;
let isPlaying = false;

function loadTrack(index) {
    currentTrack = index;
    player.src = playlist[index].src;
    trackName.textContent = playlist[index].name;
    
    // Animação quando troca de música
    trackName.style.animation = 'none';
    trackName.offsetHeight; // reflow
    trackName.style.animation = 'fadeIn 0.5s ease';
    
    if (isPlaying) player.play();
}

// Adiciona animação CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-5px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

playBtn.addEventListener("click", () => {
    if (!isPlaying) {
        player.play();
        playBtn.textContent = "⏸";
        playBtn.style.backgroundColor = 'rgba(255, 209, 102, 0.3)';
    } else {
        player.pause();
        playBtn.textContent = "▶";
        playBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    }
    isPlaying = !isPlaying;
});

nextBtn.addEventListener("click", () => {
    let nextIndex = (currentTrack + 1) % playlist.length;
    loadTrack(nextIndex);
    // Feedback visual
    nextBtn.style.transform = 'scale(0.9)';
    setTimeout(() => nextBtn.style.transform = 'scale(1)', 200);
});

prevBtn.addEventListener("click", () => {
    let prevIndex = (currentTrack - 1 + playlist.length) % playlist.length;
    loadTrack(prevIndex);
    // Feedback visual
    prevBtn.style.transform = 'scale(0.9)';
    setTimeout(() => prevBtn.style.transform = 'scale(1)', 200);
});

volumeBar.addEventListener("input", () => {
    player.volume = volumeBar.value;
    
    // Muda cor da barra conforme volume
    const percentage = volumeBar.value * 100;
    volumeBar.style.background = `linear-gradient(90deg, #ffd166 ${percentage}%, rgba(255,255,255,0.3) ${percentage}%)`;
});

player.addEventListener("ended", () => {
    let nextIndex = (currentTrack + 1) % playlist.length;
    loadTrack(nextIndex);
});

loadTrack(currentTrack);

// ========== BARRA DE PESQUISA MELHORADA ==========
const timezoneMapping = {
    'brasil': { timezone: 'America/Sao_Paulo', country: 'BR', name: '🇧🇷 Brasil' },
    'brazil': { timezone: 'America/Sao_Paulo', country: 'BR', name: '🇧🇷 Brazil' },
    'são paulo': { timezone: 'America/Sao_Paulo', country: 'BR', name: '🇧🇷 São Paulo' },
    'sao paulo': { timezone: 'America/Sao_Paulo', country: 'BR', name: '🇧🇷 São Paulo' },
    'rio': { timezone: 'America/Sao_Paulo', country: 'BR', name: '🇧🇷 Rio de Janeiro' },
    'eua': { timezone: 'America/New_York', country: 'US', name: '🇺🇸 EUA' },
    'usa': { timezone: 'America/New_York', country: 'US', name: '🇺🇸 USA' },
    'nova york': { timezone: 'America/New_York', country: 'US', name: '🗽 Nova York' },
    'new york': { timezone: 'America/New_York', country: 'US', name: '🗽 New York' },
    'londres': { timezone: 'Europe/London', country: 'GB', name: '🇬🇧 Londres' },
    'london': { timezone: 'Europe/London', country: 'GB', name: '🇬🇧 London' },
    'paris': { timezone: 'Europe/Paris', country: 'FR', name: '🇫🇷 Paris' },
    'frança': { timezone: 'Europe/Paris', country: 'FR', name: '🇫🇷 França' },
    'japão': { timezone: 'Asia/Tokyo', country: 'JP', name: '🇯🇵 Japão' },
    'japao': { timezone: 'Asia/Tokyo', country: 'JP', name: '🇯🇵 Japão' },
    'toquio': { timezone: 'Asia/Tokyo', country: 'JP', name: '🇯🇵 Tóquio' },
    'tokyo': { timezone: 'Asia/Tokyo', country: 'JP', name: '🇯🇵 Tokyo' },
    'alemanha': { timezone: 'Europe/Berlin', country: 'DE', name: '🇩🇪 Alemanha' },
    'berlim': { timezone: 'Europe/Berlin', country: 'DE', name: '🇩🇪 Berlim' },
    'italia': { timezone: 'Europe/Rome', country: 'IT', name: '🇮🇹 Itália' },
    'roma': { timezone: 'Europe/Rome', country: 'IT', name: '🇮🇹 Roma' },
    'portugal': { timezone: 'Europe/Lisbon', country: 'PT', name: '🇵🇹 Portugal' },
    'lisboa': { timezone: 'Europe/Lisbon', country: 'PT', name: '🇵🇹 Lisboa' }
};

function searchWorldTime() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase().trim();
    const flagElement = document.getElementById('clockFlag');
    const locationElement = document.getElementById('clockLocation');

    if (!searchInput) {
        showNotification('❌ Digite o nome de um país ou cidade!', 'error');
        return;
    }

    const locationData = timezoneMapping[searchInput];

    if (!locationData) {
        showNotification('🌍 Local não encontrado! Tente: Brasil, EUA, Londres, Paris...', 'warning');
        return;
    }

    currentTimezone = locationData;

    flagElement.src = `https://flagcdn.com/w40/${locationData.country.toLowerCase()}.png`;
    flagElement.alt = `Bandeira ${locationData.country}`;
    flagElement.style.display = 'block';

    locationElement.textContent = locationData.name;
    locationElement.style.display = 'block';

    document.getElementById('resetBtn').style.display = 'inline';
    
    showNotification(`✅ Mostrando horário de ${locationData.name}`, 'success');
}

function resetToLocalTime() {
    currentTimezone = null;
    const flagElement = document.getElementById('clockFlag');
    const locationElement = document.getElementById('clockLocation');

    flagElement.style.display = 'none';
    locationElement.style.display = 'none';
    document.getElementById('resetBtn').style.display = 'none';
    
    showNotification('🔄 Voltando ao horário local', 'info');
}

// 📢 FUNÇÃO DE NOTIFICAÇÃO (NOVA!)
function showNotification(message, type = 'info') {
    // Remove notificação anterior se existir
    const oldNotif = document.querySelector('.notification');
    if (oldNotif) oldNotif.remove();
    
    // Cria nova notificação
    const notif = document.createElement('div');
    notif.className = `notification ${type}`;
    notif.textContent = message;
    notif.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'rgba(6, 214, 160, 0.9)' : 
                     type === 'error' ? 'rgba(239, 71, 111, 0.9)' : 
                     type === 'warning' ? 'rgba(255, 209, 102, 0.9)' : 
                     'rgba(107, 187, 255, 0.9)'};
        color: white;
        padding: 12px 24px;
        border-radius: 50px;
        font-weight: 600;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.2);
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notif);
    
    // Remove após 3 segundos
    setTimeout(() => {
        notif.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

// Animações para notificação
const notifStyle = document.createElement('style');
notifStyle.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100px); opacity: 0; }
    }
`;
document.head.appendChild(notifStyle);

// Event listeners
document.getElementById('searchBtn').addEventListener('click', searchWorldTime);
document.getElementById('resetBtn').addEventListener('click', resetToLocalTime);

document.getElementById('searchInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        searchWorldTime();
    }
});

// Inicializa efeitos
typeWriterEffect();

// Responsividade
window.addEventListener('resize', function () {
    const body = document.body;
    if (window.innerWidth < 768) {
        body.style.padding = '20px';
    } else {
        body.style.padding = '0';
    }
});

document.addEventListener('DOMContentLoaded', function () {
    window.dispatchEvent(new Event('resize'));
});

console.log('✅ Sistema carregado com sucesso! 🚀');