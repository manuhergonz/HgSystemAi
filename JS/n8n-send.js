
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
                console.log("¡Éxito! n8n recibió los datos.");
                alert('🚀 ¡Datos enviados con éxito! Nos pondremos en contacto pronto.');
                formulario.reset();
            } else {
                console.error("Error en el servidor n8n:", respuesta.status);
                alert('El servidor respondió con un error. Revisa n8n.');
            }
        } catch (error) {
            console.error("Error crítico de conexión:", error);
            alert('No se pudo conectar con n8n. Revisa tu conexión o el CORS.');
        } finally {
            // 4. Restaurar botón
            boton.innerText = textoOriginal;
            boton.disabled = false;
        }
    
    });
});