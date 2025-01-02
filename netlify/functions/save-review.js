const fs = require('fs');
const path = require('path');
const formidable = require('formidable');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: "Método no permitido",
    };
  }

  const form = new formidable.IncomingForm();

  // Procesar el formulario y los archivos
  return new Promise((resolve, reject) => {
    form.parse(event, (err, fields, files) => {
      if (err) {
        console.error("Error al procesar el formulario:", err);
        resolve({
          statusCode: 500,
          body: JSON.stringify({ error: "Error al procesar el formulario" }),
        });
        return;
      }

      // Obtener los datos del formulario
      const { name, rating, comment } = fields;

      // Manejar el archivo de la foto (si existe)
      const photo = files.photo;
      let photoUrl = null;

      if (photo) {
        const uploadDir = path.join(__dirname, '../uploads'); // Carpeta para guardar las fotos
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir);
        }

        const photoPath = path.join(uploadDir, photo.originalFilename);
        fs.renameSync(photo.filepath, photoPath);

        // Guardar la URL relativa de la foto
        photoUrl = `/uploads/${photo.originalFilename}`;
      }

      // Crear un objeto con la valoración
      const newReview = {
        name,
        rating,
        comment,
        photoUrl, // URL de la foto si existe
        approved: false,
      };

      // Guardar la valoración en un archivo JSON
      const reviewsPath = path.join(__dirname, 'reviews.json');
      const reviews = fs.existsSync(reviewsPath)
        ? JSON.parse(fs.readFileSync(reviewsPath, 'utf-8'))
        : [];

      reviews.push(newReview);

      fs.writeFileSync(reviewsPath, JSON.stringify(reviews, null, 2));

      resolve({
        statusCode: 200,
        body: JSON.stringify({ message: "Valoración guardada con éxito" }),
      });
    });
  });
};
