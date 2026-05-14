
document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('contactForm');

    if (!formulario) {
        console.error("Error: No se encontró el formulario con ID 'contactForm'");
        return;
    }

    formulario.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Recolectar datos
        const datos = {
            nombre: document.getElementById('form-name').value,
            email: document.getElementById('form-email').value,
            telefono: document.getElementById('form-phone').value,
            sector: document.getElementById('form-business').value
        };

        // 2. Feedback visual en el botón
        const boton = formulario.querySelector('button[type="submit"]');
        const textoOriginal = boton.innerText;
        boton.innerText = "Enviando...";
        boton.disabled = true;

        console.log("Intentando enviar a n8n:", datos);

        try {
            // 3. Envío real a n8n
            const respuesta = await fetch('https://n8n.hgsystemai.com/webhook/contacto-web', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            });
if (respuesta.ok) {
  formulario.reset();
  window.location.href = 'gracias.html';
} else {
  console.error("Error en el servidor n8n:", respuesta.status);
  mostrarError('Algo salió mal en el servidor. Inténtalo de nuevo.');
}

} catch (error) {
  console.error("Error crítico:", error);
  mostrarError('No se pudo conectar. Revisa tu conexión e inténtalo de nuevo.');
} finally {
  boton.innerText = textoOriginal;
  boton.disabled = false;
}

// ← AQUÍ, fuera del addEventListener pero dentro del DOMContentLoaded
function mostrarError(mensaje) {
  const anterior = document.getElementById('error-msg');
  if (anterior) anterior.remove();

  const div = document.createElement('div');
  div.id = 'error-msg';
  div.textContent = mensaje;
  div.style.cssText = `
    margin-top: 12px;
    padding: 12px 16px;
    background: rgba(231, 76, 60, 0.1);
    border: 1px solid rgba(231, 76, 60, 0.3);
    border-radius: 10px;
    color: #e74c3c;
    font-size: 14px;
    text-align: center;
  `;
  boton.insertAdjacentElement('afterend', div);
  setTimeout(() => div.remove(), 5000);
}


    });
});