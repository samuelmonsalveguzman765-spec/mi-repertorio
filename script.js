// script.js - Validación y manejo del formulario
document.addEventListener('DOMContentLoaded', function(){
  const form = document.getElementById('serviceForm');
  const summary = document.getElementById('summary');
  const otroCb = document.getElementById('servicio_otro_cb');
  const otroWrap = document.getElementById('servicio_otro_wrap');
  const otroText = document.getElementById('servicio_otro_text');

  // Mostrar/ocultar campo "otro"
  otroCb.addEventListener('change', ()=>{
    if(otroCb.checked){
      otroWrap.classList.remove('hidden');
      otroText.setAttribute('required', 'required');
      otroText.focus();
    } else {
      otroWrap.classList.add('hidden');
      otroText.removeAttribute('required');
      otroText.value = '';
    }
  });

  function getSelectedServices(){
    const checks = Array.from(document.querySelectorAll('input[name="servicios"]'));
    return checks.filter(c => c.checked).map(c => c.value === 'Otro' ? (document.getElementById('servicio_otro_text').value || 'Otro (no especificado)') : c.value);
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    summary.classList.add('hidden');
    summary.innerHTML = '';

    // Validación nativa para campos obligatorios (nombre, email): reportValidity
    if(!form.reportValidity()){
      // reportValidity will show browser built-in messages
      return;
    }

    const servicios = getSelectedServices();
    if(servicios.length === 0){
      // Crear un mensaje visible para el usuario
      const msg = document.createElement('div');
      msg.className = 'error';
      msg.style.color = 'var(--accent)';
      msg.textContent = 'Debe seleccionar al menos un servicio antes de enviar la solicitud.';
      summary.appendChild(msg);
      summary.classList.remove('hidden');
      summary.scrollIntoView({behavior:'smooth'});
      return;
    }

    // Construir objeto con los datos
    const data = {
      nombre: document.getElementById('nombre').value.trim(),
      apellido: document.getElementById('apellido').value.trim(),
      email: document.getElementById('email').value.trim(),
      telefono: document.getElementById('telefono').value.trim(),
      empresa: document.getElementById('empresa').value.trim(),
      comentarios: document.getElementById('comentarios').value.trim(),
      servicios: servicios
    };

    // Mostrar resumen al usuario
    const h = document.createElement('h3');
    h.textContent = 'Resumen de la solicitud';
    const ul = document.createElement('ul');
    ul.style.marginTop = '8px';

    function addItem(label, value){
      const li = document.createElement('li');
      li.textContent = `${label}: ${value || '-'} `;
      ul.appendChild(li);
    }

    addItem('Nombre', data.nombre + (data.apellido ? (' ' + data.apellido) : ''));
    addItem('Email', data.email);
    addItem('Teléfono', data.telefono);
    addItem('Empresa', data.empresa);
    addItem('Servicios', data.servicios.join(', '));
    addItem('Comentarios', data.comentarios);

    summary.appendChild(h);
    summary.appendChild(ul);

    const note = document.createElement('p');
    note.textContent = 'Gracias. Esta página simula el envío. Integre un endpoint en el servidor para guardar o procesar la solicitud.';
    note.style.marginTop = '8px';
    summary.appendChild(note);

    summary.classList.remove('hidden');
    summary.scrollIntoView({behavior:'smooth'});

    // Aquí podría enviarse con fetch a un endpoint real, por ejemplo:
    // fetch('/api/solicitudes', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)})
    //  .then(r=>r.json()).then(resp=>console.log(resp));

    // Opcional: limpiar formulario tras envío (descomentar si se desea)
    // form.reset();
  });
});
