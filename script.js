// Banco de dados completo com os 37 vendedores
const vendedores = [
    { id: 1, nome: "Daniela", cidade: "Encanto / RN", fone: "5584981269839", img: "V1.jpg" },
    { id: 2, nome: "Rita de Cássia", cidade: "Encanto / RN", fone: "5584981905683", img: "V2.jpg" },
    { id: 3, nome: "Danilo", cidade: "Encanto / RN", fone: "5584981701317", img: "V3.jpg" },
    { id: 4, nome: "Andressa Maria", cidade: "Sítio Juazeiro, Marcelino Vieira / RN", fone: "5584999455946", img: "V4.jpg" },
    { id: 5, nome: "Mônica", cidade: "Marcelino Vieira / RN", fone: "5584996827404", img: "V5.jpg" },
    
    { id: 37, nome: "Gilkelia", cidade: "Rafael Fernandes / RN", fone: "5584996334567", img: "V37.jpg" }
];

const containerVendedores = document.getElementById('containerVendedores');
const searchInput = document.getElementById('searchInput');
let autoScrollInterval;

// Função para iniciar a rolagem automática
function startAutoScroll() {
    stopAutoScroll(); // Garante que não tenha múltiplos intervalos rodando
    autoScrollInterval = setInterval(() => {
        if (containerVendedores.className === 'carousel-vendedores') {
            containerVendedores.scrollLeft += 1.5; // Velocidade da rolagem
            
            // Se chegou no final, volta para o início suavemente
            if (containerVendedores.scrollLeft >= (containerVendedores.scrollWidth - containerVendedores.clientWidth - 2)) {
                containerVendedores.scrollLeft = 0;
            }
        }
    }, 25);
}

// Função para pausar a rolagem
function stopAutoScroll() {
    clearInterval(autoScrollInterval);
}

// Pausa o carrossel se o usuário passar o mouse ou tocar na tela
containerVendedores.addEventListener('mouseenter', stopAutoScroll);
containerVendedores.addEventListener('mouseleave', () => {
    if(searchInput.value.trim() === '') startAutoScroll();
});
containerVendedores.addEventListener('touchstart', stopAutoScroll);
containerVendedores.addEventListener('touchend', () => {
    if(searchInput.value.trim() === '') startAutoScroll();
});

// Renderização dos cards
function renderizarVendedores(lista, isBuscando = false) {
    containerVendedores.innerHTML = '';
    
    if(isBuscando) {
        containerVendedores.className = 'grid-vendedores';
        stopAutoScroll(); // Para de rodar se estiver filtrando
    } else {
        containerVendedores.className = 'carousel-vendedores';
        startAutoScroll(); // Volta a rodar se estiver na lista completa
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

// Inicializa a página com todos os vendedores
renderizarVendedores(vendedores, false);

// Evento de busca em tempo real
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