document.addEventListener('DOMContentLoaded', () => {
    const media = document.querySelectorAll('.media')

    media.forEach(notas => {
        const text = notas.textContent.trim().toUpperCase()

        if (text === 'PD') {
            notas.style.color = 'black'
            notas.style.backgroundColor = '#008000'
        } else if (text === 'ED') {
            notas.style.color = 'black'
            notas.style.backgroundColor = 'yellow'
        } else if (text === 'ND') {
            notas.style.color = 'black'
            notas.style.backgroundColor = '#FF0000'
        }
    });
})