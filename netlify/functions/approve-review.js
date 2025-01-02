const fs = require("fs");
const path = require("path");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Método no permitido" };
  }

  try {
    const { index } = JSON.parse(event.body);
    const filePath = path.join(__dirname, "reviews.json");

    const data = fs.readFileSync(filePath, "utf8");
    const reviews = JSON.parse(data);

    // Aprobar la valoración
    if (reviews[index]) {
      reviews[index].approved = true;
      fs.writeFileSync(filePath, JSON.stringify(reviews, null, 2));
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Valoración aprobada" }),
    };
  } catch (error) {
    console.error("Error al aprobar la valoración:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error al aprobar la valoración" }),
    };
  }
};
