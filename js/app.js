// Campos del formulario:
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

let editando;

// UI
const formulario = document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas');

// Clases:
class Citas {
    constructor(){
        this.citas = [];
    }

    agregarCita(cita){
        this.citas = [...this.citas, cita];
    }

    eliminarCita(id){
        this.citas = this.citas.filter( cita => cita.id !== id);
    }

    editarCita(citaActualizada){
        //Este código va a iterar en cada una de las citas, comprobará si la cita y la cita actualizada tienen el mismo ID. 
        // En caso de que se cumpla la condición, reescribimos el objeto. De lo contrario se mantiene la información anterior. 
        this.citas = this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita);
    }
}

class UI {
    imprimirAlerta(mensaje, tipo){
        //Creamos un div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');

        // Agregar clase en base al tipo de mensaje:
        if( tipo === 'error'){
            divMensaje.classList.add('alert-danger');
        } else{
            divMensaje.classList.add('alert-success');
        }

        // Insertamos le mensaje:
        divMensaje.textContent = mensaje;

        //Agregar al DOM
        document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'));

        //Quitar mensaje despues de 3 segundos:
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }

    imprimirCitas({citas}) //Hacemos el destructuring directamente desde donde van los parametros:
    {
        this.limpiarHTML();

        citas.forEach(cita => {
            //Por cada cita en el array hará lo siguiente:
            const { mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;
            const divCita = document.createElement('div');
            divCita.classList.add('cita', 'p-2');
            divCita.dataset.id = id;

            // Scripting de los elementos de la cita:
            const mascotaParrafo = document.createElement('h3');
            mascotaParrafo.classList.add('card-title', 'font-weight-bolder');
            mascotaParrafo.textContent = mascota;

            const propietarioParrafo = document.createElement('p');
            propietarioParrafo.innerHTML = `
            <span class="font-weight-bolder">Propietario:</span> ${propietario}
            `;

            const telefonoParrafo = document.createElement('p');
            telefonoParrafo.innerHTML = `
            <span class="font-weight-bolder">Teléfono:</span> ${telefono}
            `;
            const fechayhoraParrafo = document.createElement('p');
            fechayhoraParrafo.innerHTML = `
            <span class="font-weight-bolder">Fecha:</span> ${fecha} |
            <span class="font-weight-bolder">Hora:</span> ${hora}
            `;
            const sintomasParrafo = document.createElement('p');
            sintomasParrafo.innerHTML = `
            <span class="font-weight-bolder">Síntomas:</span> ${sintomas}
            `;

            // Botón para eliminar la cita:
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
            btnEliminar.innerHTML = 'Eliminar <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" ></path></svg>';
            btnEliminar.onclick = () => eliminarCita(id);

            //Botón para editar las citas:
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn', 'btn-info');
            btnEditar.innerHTML = 'Editar <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>';
            btnEditar.onclick = () => cargarEdicion(cita);

            //Agregar a divCita
            divCita.appendChild(mascotaParrafo);
            divCita.appendChild(propietarioParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechayhoraParrafo);
            divCita.appendChild(sintomasParrafo);
            divCita.appendChild(btnEliminar);
            divCita.appendChild(btnEditar);

            //Agregamos divCita al HTML:
            contenedorCitas.appendChild(divCita);
        });
    }

    limpiarHTML(){
        while(contenedorCitas.firstChild){
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
    }
}

const ui = new UI();
const administrarCitas = new Citas();

//Eventos
eventListeners();
function eventListeners(){
    mascotaInput.addEventListener('change', datosCita);
    propietarioInput.addEventListener('change', datosCita);
    telefonoInput.addEventListener('change', datosCita);
    fechaInput.addEventListener('change', datosCita);
    horaInput.addEventListener('change', datosCita);
    sintomasInput.addEventListener('change', datosCita);

    formulario.addEventListener('submit', nuevaCita);
}

//Objeto que representa la cita:
const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''
}

// Esta función toma los datos de cada input y los agrega al objeto:
// (El 'name' del input debe coincidir con el nombre de la propiedad del objeto)
function datosCita(e){
citaObj[e.target.name] = e.target.value;
}

// Agregar nueva cita a la clase.
function nuevaCita(e){
    e.preventDefault();

    // Extrar info de citaObj:
    const { mascota, propietario, telefono, fecha, hora, sintomas} = citaObj;

    // Validar
    if( mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === '' ){
        ui.imprimirAlerta('Todos los campos son obligatorios.', 'error');
        return;
    }

    if(editando){
        ui.imprimirAlerta('Editado correctamente.');

        // Pasar el objeto de la cita a edición:
        administrarCitas.editarCita({...citaObj});

        //Regresar el boton a su valor original:
        formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';

        // Desactivar el modo edición:
        editando = false;
    } else{
        // Generar un id --> Para poder editar y eliminar la cita:
        citaObj.id = Date.now();

        // Crear nueva cita:
        administrarCitas.agregarCita({...citaObj});
    }

    // Reiniciar el objeto para la validación:
    reiniciarObjeto();

    //Reinicio Formulario:
    formulario.reset();

    //Mostrar el HTML con los datos de la cita:
    ui.imprimirCitas(administrarCitas);
}

function reiniciarObjeto(){
    citaObj.mascota = '',
    citaObj.propietario = '',
    citaObj.telefono = '',
    citaObj.fecha = '',
    citaObj.hora = '',
    citaObj.sintomas = ''
}

function eliminarCita(id){
    // Eliminar la cita
    administrarCitas.eliminarCita(id);
    
    // Mostrar mensaje
    ui.imprimirAlerta('La cita se eliminó correctamente');

    // Refrescar las citas
    ui.imprimirCitas(administrarCitas);
};

function cargarEdicion(cita){
    const { mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;
    
    // Llenar los inputs:
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    // Llenar el objeto:
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    // Cambiar el texto del botón:
    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';

    editando = true;
}