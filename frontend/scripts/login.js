const API_URL = "http://localhost:3000";

const formLogin = document.querySelector('.form-login')

formLogin.addEventListener('submit', async (e) => {
    e.preventDefault()

    const email = document.getElementById('email').value
    const senha = document.getElementById('senha').value

    const response = await fetch('http://localhost:3000/usuario/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
    })

    const result = await response.json()

    if(result.success) {
        alert('Login bem-sucedido!')

        localStorage.setItem('token', result.token)
        localStorage.setItem('papel', result.data.papel)

        switch(result.data.papel) {
            case 'aluno':
                window.location.href = '/frontend/pages/aluno/index.html'
                break
            case 'professor':
                window.location.href = '/frontend/pages/professor/index.html'
                break
            case 'pedagogo':
                window.location.href = '/frontend/pages/pedagogo/index.html'
                break
            default:
                alert('Papel não reconhecido!')
        }
    } else {
        alert('Login não concluído')
    }

})