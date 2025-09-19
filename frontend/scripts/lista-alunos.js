const botoesNotas = document.querySelectorAll('.button-notas')
const botoesPresenca = document.querySelectorAll('.button-presenca')

botoesNotas.forEach((botao) => {
  botao.addEventListener('click', () => {
    window.location.href = '/frontend/pages/professor/notas.html'
  })
})

botoesPresenca.forEach((botao) => {
  botao.addEventListener('click', () => {
    window.location.href = '/frontend/pages/professor/presenca.html'
  })
})