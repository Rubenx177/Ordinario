// ==========================
// GENERAR FOLIO
// ==========================
function generarFolio() {
  return "VAL-" + Date.now();
}

// ==========================
// INICIO
// ==========================
document.addEventListener("DOMContentLoaded", () => {

  // Selección de carrera (cards)
  const cards = document.querySelectorAll(".carrera-card");
  if (cards.length > 0) {
    cards.forEach(card => {
      card.addEventListener("click", () => {
        cards.forEach(c => c.classList.remove("on"));
        card.classList.add("on");
        document.getElementById("carreraSeleccionada").value = card.dataset.val;
      });
    });
  }

  // Render tabla si estás en panel
  renderTabla();
});


// ==========================
// ENVIAR FORMULARIO
// ==========================
function enviarSolicitud() {
  let datos = JSON.parse(localStorage.getItem("alumnos")) || [];

  let alumno = {
    folio: generarFolio(),

    nombre: (
      (document.getElementById("nombres")?.value || "") + " " +
      (document.getElementById("apPat")?.value || "") + " " +
      (document.getElementById("apMat")?.value || "")
    ).trim() || "Sin nombre",

    email: document.getElementById("email")?.value || "No especificado",

    carrera: document.getElementById("carreraSeleccionada")?.value || "No especificado",

    turno: document.getElementById("turno")?.value || "No especificado",

    beca: document.getElementById("beca")?.value || "No especificado",

    fecha: new Date().toLocaleString()
  };

  datos.push(alumno);
  localStorage.setItem("alumnos", JSON.stringify(datos));

  // Confirmación
  if (document.getElementById("folioFinal")) {
    document.getElementById("folioFinal").innerText = alumno.folio;
    document.getElementById("confirmMsg").style.display = "block";
  }
}


// ==========================
// LIMPIAR FORMULARIO
// ==========================
function limpiarForm() {
  document.querySelectorAll("input, select, textarea").forEach(el => el.value = "");
  document.querySelectorAll(".carrera-card").forEach(c => c.classList.remove("on"));
}


// ==========================
// RENDER TABLA
// ==========================
function renderTabla() {
  const tabla = document.getElementById("cuerpoTabla");
  if (!tabla) return; // evita error si no estás en panel

  const buscar = document.getElementById("buscar")?.value.toLowerCase() || "";
  let datos = JSON.parse(localStorage.getItem("alumnos")) || [];

  tabla.innerHTML = "";

  datos.forEach((alumno, index) => {

    let texto = (alumno.nombre + alumno.email + alumno.folio).toLowerCase();
    if (!texto.includes(buscar)) return;

    let fila = `
      <tr>
        <td>${index + 1}</td>
        <td>${alumno.folio}</td>
        <td>${alumno.nombre}</td>
        <td>${alumno.email}</td>
        <td>${alumno.carrera}</td>
        <td>${alumno.turno}</td>
        <td>${alumno.beca}</td>
        <td>${alumno.fecha}</td>
        <td><button onclick="verAlumno(${index})">Ver</button></td>
      </tr>
    `;

    tabla.innerHTML += fila;
  });
}


// ==========================
// VER DETALLE (MODAL)
// ==========================
function verAlumno(index) {
  let datos = JSON.parse(localStorage.getItem("alumnos")) || [];
  let alumno = datos[index];

  document.getElementById("modalNombre").innerText = alumno.nombre;

  document.getElementById("modalGrid").innerHTML = `
    <p><b>Folio:</b> ${alumno.folio}</p>
    <p><b>Nombre:</b> ${alumno.nombre}</p>
    <p><b>Correo:</b> ${alumno.email}</p>
    <p><b>Carrera:</b> ${alumno.carrera}</p>
    <p><b>Turno:</b> ${alumno.turno}</p>
    <p><b>Beca:</b> ${alumno.beca}</p>
    <p><b>Fecha:</b> ${alumno.fecha}</p>
  `;

  document.getElementById("overlay").classList.add("show");
}


// ==========================
// CERRAR MODAL
// ==========================
function cerrarModal(e) {
  if (e.target.id === "overlay") {
    document.getElementById("overlay").classList.remove("show");
  }
}


// ==========================
// EXPORTAR A EXCEL
// ==========================
function exportarExcel() {
  let datos = JSON.parse(localStorage.getItem("alumnos")) || [];

  let datosLimpios = datos.map(a => ({
    Folio: a.folio || "",
    Nombre: a.nombre || "",
    Correo: a.email || "",
    Carrera: a.carrera || "",
    Turno: a.turno || "",
    Beca: a.beca || "",
    Fecha: a.fecha || ""
  }));

  let hoja = XLSX.utils.json_to_sheet(datosLimpios);
  let libro = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(libro, hoja, "Alumnos");
  XLSX.writeFile(libro, "alumnos.xlsx");
}


// ==========================
// LIMPIAR TODO
// ==========================
function limpiarTodo() {
  if (confirm("¿Seguro que quieres borrar todo?")) {
    localStorage.removeItem("alumnos");
    renderTabla();
  }
}