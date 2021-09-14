// Campos del formulario:
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

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


            //Agregar a divCita
            divCita.appendChild(mascotaParrafo);
            divCita.appendChild(propietarioParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechayhoraParrafo);
            divCita.appendChild(sintomasParrafo);

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

    // Generar un id --> Para poder editar y eliminar la cita:
    citaObj.id = Date.now();

    // Crear nueva cita:
    administrarCitas.agregarCita({...citaObj});

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