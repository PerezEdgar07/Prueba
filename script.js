
// ARREGLO PRINCIPAL
const estudiantes = [];

// OBTENER ELEMENTOS DEL HTML
const formulario = document.getElementById("formulario");
const tabla = document.getElementById("tablaEstudiantes");
const mensaje = document.getElementById("mensaje");
const buscar = document.getElementById("buscar");
const filtroCurso = document.getElementById("filtroCurso");

// EVENTO PARA REGISTRAR UN ESTUDIANTE
formulario.addEventListener("submit", function(evento) {

    // EVITAR QUE LA PÁGINA SE RECARGUE
    evento.preventDefault();

    // OBTENER LOS DATOS
    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const telefono = document.getElementById("telefono").value;
    const edad = Number(document.getElementById("edad").value);
    const fecha = document.getElementById("fecha").value;
    const curso = document.getElementById("curso").value;
    const horario = document.getElementById("horario").value;
    const institucion = document.getElementById("institucion").value;
    const observaciones = document.getElementById("observaciones").value;

    // OBTENER EL RADIO SELECCIONADO
    const nivelSeleccionado = document.querySelector(
        'input[name="nivel"]:checked'
    );

    // OBTENER LOS CHECKBOX SELECCIONADOS
    const modalidades = document.querySelectorAll(
        'input[name="modalidad"]:checked'
    );

    const modalidad = [];

    modalidades.forEach(function(opcion) {
        modalidad.push(opcion.value);
    });

    // VALIDAR DATOS
    if (nombre === "" || correo === "" || !nivelSeleccionado) {
        mostrarMensaje("Complete los campos obligatorios.", "error");
        return;
    }

    if (modalidad.length === 0) {
        mostrarMensaje("Seleccione al menos una modalidad.", "error");
        return;
    }

    // CREAR OBJETO
    const estudiante = {
        id: Date.now(),
        nombre: nombre,
        correo: correo,
        telefono: telefono,
        edad: edad,
        fecha: fecha,
        curso: curso,
        horario: horario,
        nivel: nivelSeleccionado.value,
        modalidad: modalidad,
        institucion: institucion,
        observaciones: observaciones
    };

    // AGREGAR AL ARREGLO
    estudiantes.push(estudiante);

    // ACTUALIZAR LA TABLA
    mostrarEstudiantes(estudiantes);

    // ACTUALIZAR RESUMEN
    actualizarResumen();

    // LIMPIAR FORMULARIO
    formulario.reset();

    mostrarMensaje("Estudiante registrado correctamente.", "exito");
});


// FUNCIÓN PARA MOSTRAR ESTUDIANTES
function mostrarEstudiantes(lista) {

    // LIMPIAR TABLA
    tabla.innerHTML = "";

    // COMPROBAR SI EXISTEN REGISTROS
    if (lista.length === 0) {

        const fila = document.createElement("tr");

        const celda = document.createElement("td");

        celda.colSpan = 6;
        celda.textContent = "No existen estudiantes registrados.";

        fila.appendChild(celda);
        tabla.appendChild(fila);

        return;
    }

    // RECORRER EL ARREGLO
    lista.forEach(function(estudiante) {

        const fila = document.createElement("tr");

        const celdaNombre = document.createElement("td");
        celdaNombre.textContent = estudiante.nombre;

        const celdaCorreo = document.createElement("td");
        celdaCorreo.textContent = estudiante.correo;

        const celdaCurso = document.createElement("td");
        celdaCurso.textContent = estudiante.curso;

        const celdaHorario = document.createElement("td");
        celdaHorario.textContent = estudiante.horario;

        const celdaNivel = document.createElement("td");
        celdaNivel.textContent = estudiante.nivel;

        // CREAR BOTÓN ELIMINAR
        const celdaAccion = document.createElement("td");

        const boton = document.createElement("button");

        boton.textContent = "Eliminar";
        boton.className = "eliminar";
        boton.type = "button";

        boton.addEventListener("click", function() {
            eliminarEstudiante(estudiante.id);
        });

        celdaAccion.appendChild(boton);

        // AGREGAR CELDAS A LA FILA
        fila.append(
            celdaNombre,
            celdaCorreo,
            celdaCurso,
            celdaHorario,
            celdaNivel,
            celdaAccion
        );

        tabla.appendChild(fila);
    });
}


// FUNCIÓN PARA ELIMINAR
function eliminarEstudiante(id) {

    // BUSCAR POSICIÓN
    const posicion = estudiantes.findIndex(function(estudiante) {
        return estudiante.id === id;
    });

    // COMPROBAR SI EXISTE
    if (posicion !== -1) {

        estudiantes.splice(posicion, 1);

        aplicarFiltros();
        actualizarResumen();

        mostrarMensaje("Estudiante eliminado.", "exito");
    }
}


// FUNCIÓN PARA BUSCAR Y FILTRAR
function aplicarFiltros() {

    const texto = buscar.value.toLowerCase();
    const curso = filtroCurso.value;

    // FILTRAR POR NOMBRE
    let resultado = estudiantes.filter(function(estudiante) {
        return estudiante.nombre.toLowerCase().includes(texto);
    });

    // FILTRAR POR CURSO
    if (curso !== "Todos") {

        resultado = resultado.filter(function(estudiante) {
            return estudiante.curso === curso;
        });
    }

    mostrarEstudiantes(resultado);
}


// EVENTO PARA BUSCAR
buscar.addEventListener("input", function() {
    aplicarFiltros();
});


// EVENTO PARA FILTRAR POR CURSO
filtroCurso.addEventListener("change", function() {
    aplicarFiltros();
});


// BOTÓN PARA MOSTRAR TODOS
document.getElementById("mostrarTodos").addEventListener("click", function() {

    buscar.value = "";
    filtroCurso.value = "Todos";

    mostrarEstudiantes(estudiantes);
});


// FUNCIÓN PARA ACTUALIZAR EL RESUMEN
function actualizarResumen() {

    // TOTAL DE ESTUDIANTES
    const total = estudiantes.length;

    // TOTAL DE INSCRIPCIONES EN JAVASCRIPT
    const totalJS = estudiantes.filter(function(estudiante) {
        return estudiante.curso === "JavaScript";
    }).length;

    document.getElementById("totalEstudiantes").textContent = total;

    document.getElementById("totalJavaScript").textContent = totalJS;
}


// FUNCIÓN PARA MOSTRAR MENSAJES
function mostrarMensaje(texto, tipo) {

    mensaje.textContent = texto;

    mensaje.style.color = tipo === "exito" ? "green" : "red";
}


// MOSTRAR ESTADO INICIAL
mostrarEstudiantes(estudiantes);
actualizarResumen();
