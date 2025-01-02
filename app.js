document.getElementById("submit-review").addEventListener("submit", function (e) {
  e.preventDefault();

  // Crear el objeto FormData para enviar el formulario y el archivo
  const formData = new FormData();
  formData.append("name", document.getElementById("name").value);
  formData.append("rating", document.getElementById("rating").value);
  formData.append("comment", document.getElementById("comment").value);

  // Agregar la foto si el usuario subió una
  const photo = document.getElementById("photo").files[0];
  if (photo) {
    formData.append("photo", photo);
  }

  // Enviar la solicitud al servidor
  fetch('/netlify/functions/save-review.js', {
    method: 'POST',
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al guardar la valoración");
      }
      return response.json();
    })
    .then((data) => {
      alert("¡Valoración enviada para revisión!");
      document.getElementById("submit-review").reset();
      loadPendingReviews(); // Recargar valoraciones pendientes
    })
    .catch((error) => {
      console.error("Error al guardar la valoración:", error);
    });
});

