const API_URL = 'http://localhost:3000';

const formulario = document.getElementById('form-login');

formulario?.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;
    const mensagem = document.getElementById('mensagem-login');
    const botao = formulario.querySelector('button[type="submit"]');

    mensagem.textContent = '';
    botao.disabled = true;
    botao.textContent = 'Entrando...';

    try {
        const resposta = await fetch(`${API_URL}/usuario/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.erro || 'Não foi possível realizar o login.');
        }

        sessionStorage.setItem('usuarioLoja', JSON.stringify(resultado));
        window.location.href = './home.html';
    } catch (erro) {
        mensagem.textContent = erro.message.includes('Failed to fetch')
            ? 'Não foi possível conectar à API. Verifique se o backend está iniciado.'
            : erro.message;
    } finally {
        botao.disabled = false;
        botao.textContent = 'Entrar';
    }
});
