/* ============================================
   Formulario de contacto — envío al webhook de n8n
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const formulario = document.getElementById('contactForm');
  if (!formulario) return;

  const boton = formulario.querySelector('button[type="submit"]');

  function mostrarError(mensaje) {
    const anterior = document.getElementById('error-msg');
    if (anterior) anterior.remove();

    const div = document.createElement('div');
    div.id = 'error-msg';
    div.setAttribute('role', 'alert');
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

  formulario.addEventListener('submit', async (e) => {
    e.preventDefault();

    const datos = {
      nombre: document.getElementById('form-name').value.trim(),
      email: document.getElementById('form-email').value.trim(),
      telefono: document.getElementById('form-phone').value.trim(),
      sector: document.getElementById('form-business').value
    };

    // Feedback visual en el botón mientras se envía
    const textoOriginal = boton.innerHTML;
    boton.innerText = 'Enviando...';
    boton.disabled = true;

    try {
      const respuesta = await fetch('https://n8n.hgsystemai.com/webhook/contacto-web', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
        signal: AbortSignal.timeout(15000) // no dejar el botón colgado si el servidor no responde
      });

      if (respuesta.ok) {
        formulario.reset();
        window.location.href = 'gracias.html';
        return; // no restaurar el botón: estamos redirigiendo
      }

      console.error('Error en el servidor n8n:', respuesta.status);
      mostrarError('Algo salió mal en el servidor. Inténtalo de nuevo.');
    } catch (error) {
      console.error('Error de conexión:', error);
      mostrarError('No se pudo conectar. Revisa tu conexión e inténtalo de nuevo.');
    }

    boton.innerHTML = textoOriginal;
    boton.disabled = false;
  });
});
