const vendedores = [
    { id: 1, nome: "Daniela", cidade: "Encanto / RN", fone: "5584981269839", img: "V1.jpg" },
    { id: 2, nome: "Rita de Cássia", cidade: "Encanto / RN", fone: "5584981905683", img: "V2.jpg" },
    { id: 3, nome: "Danilo", cidade: "Encanto / RN", fone: "5584981701317", img: "V3.jpg" },
    { id: 4, nome: "Andressa Maria", cidade: "Sítio Juazeiro, Marcelino Vieira / RN", fone: "5584999455946", img: "V4.jpg" },
    { id: 5, nome: "Mônica", cidade: "Marcelino Vieira / RN", fone: "5584996827404", img: "V5.jpg" },
    
];

const containerVendedores = document.getElementById('containerVendedores');
const searchInput = document.getElementById('searchInput');
let autoScrollInterval;

// =========================================
// MENU HAMBÚRGUER (MOBILE)
// =========================================
const menuToggle = document.getElementById('mobile-menu');
const navLinks = document.getElementById('nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    // Troca o ícone de hambúrguer para um "X" quando aberto
    const icon = menuToggle.querySelector('i');
    if(navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Fecha o menu ao clicar em algum link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
    });
});

// =========================================
// ANIMAÇÃO DE ROLAGEM (SCROLL REVEAL)
// =========================================
const observerOptions = {
    threshold: 0.15 // Dispara quando 15% do elemento estiver visível
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Opcional: Descomente a linha abaixo se quiser que a animação aconteça apenas 1 vez
            // observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Pega todos os elementos com a classe fade-up e aplica o observador
document.querySelectorAll('.fade-up').forEach((el) => {
    observer.observe(el);
});

// =========================================
// CARROSSEL E RENDERIZAÇÃO
// =========================================
function startAutoScroll() {
    stopAutoScroll(); 
    autoScrollInterval = setInterval(() => {
        if (containerVendedores.className === 'carousel-vendedores') {
            containerVendedores.scrollLeft += 1.5; 
            
            if (containerVendedores.scrollLeft >= (containerVendedores.scrollWidth - containerVendedores.clientWidth - 2)) {
                containerVendedores.scrollLeft = 0;
            }
        }
    }, 25);
}

function stopAutoScroll() {
    clearInterval(autoScrollInterval);
}

containerVendedores.addEventListener('mouseenter', stopAutoScroll);
containerVendedores.addEventListener('mouseleave', () => {
    if(searchInput.value.trim() === '') startAutoScroll();
});
containerVendedores.addEventListener('touchstart', stopAutoScroll);
containerVendedores.addEventListener('touchend', () => {
    if(searchInput.value.trim() === '') startAutoScroll();
});

function renderizarVendedores(lista, isBuscando = false) {
    containerVendedores.innerHTML = '';
    
    if(isBuscando) {
        containerVendedores.className = 'grid-vendedores';
        stopAutoScroll(); 
    } else {
        containerVendedores.className = 'carousel-vendedores';
        startAutoScroll(); 
    }
    
    if(lista.length === 0) {
        containerVendedores.className = 'grid-vendedores'; 
        containerVendedores.innerHTML = '<p style="grid-column: 1/-1; color: #6b7280; text-align: center; font-size: 1.1rem; padding: 40px;">Nenhum vendedor encontrado com essa busca.</p>';
        return;
    }

    lista.forEach(vendedor => {
        const mensagem = encodeURIComponent(`Olá ${vendedor.nome}! Quero comprar um bilhete do Vieirinha da Sorte com você.`);
        const linkWhats = `https://wa.me/${vendedor.fone}?text=${mensagem}`;

        const card = document.createElement('div');
        card.className = 'card-vendedor';
        
        card.innerHTML = `
            <div class="foto-vendedor-wrapper">
                <img src="${vendedor.img}" alt="Vendedor ${vendedor.nome}" loading="lazy">
            </div>
            <div class="card-info">
                <h3>${vendedor.nome}</h3>
                <p><i class="fas fa-map-marker-alt"></i> ${vendedor.cidade}</p>
                <a href="${linkWhats}" target="_blank" class="btn-whatsapp">
                    <i class="fab fa-whatsapp"></i> Compre Comigo
                </a>
            </div>
        `;
        containerVendedores.appendChild(card);
    });
}

renderizarVendedores(vendedores, false);

searchInput.addEventListener('input', (e) => {
    const termoBusca = e.target.value.toLowerCase().trim();
    
    if(termoBusca === '') {
        renderizarVendedores(vendedores, false);
    } else {
        const vendedoresFiltrados = vendedores.filter(vendedor => {
            return vendedor.nome.toLowerCase().includes(termoBusca) || 
                   vendedor.cidade.toLowerCase().includes(termoBusca);
        });
        renderizarVendedores(vendedoresFiltrados, true);
    }
});
