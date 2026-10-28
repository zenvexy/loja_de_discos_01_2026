const usuarioSalvo = sessionStorage.getItem('usuarioLoja');

if (!usuarioSalvo) {
    window.location.replace('./login.html');
} else {
    try {
        const usuario = JSON.parse(usuarioSalvo);
        const campoNome = document.getElementById('nome-usuario');
        if (campoNome) campoNome.textContent = `Olá, ${usuario.nome}`;
    } catch {
        sessionStorage.removeItem('usuarioLoja');
        window.location.replace('./login.html');
    }
}

function sair() {
    sessionStorage.removeItem('usuarioLoja');
    window.location.href = './login.html';
}
