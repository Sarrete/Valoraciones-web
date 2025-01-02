const fs = require("fs");
const path = require("path");

exports.handler = async () => {
  try {
    const filePath = path.join(__dirname, "reviews.json");
    const data = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "[]";
    const reviews = JSON.parse(data);

    return {
      statusCode: 200,
      body: JSON.stringify(reviews),
    };
  } catch (error) {
    console.error("Error al leer las valoraciones:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error al leer las valoraciones" }),
    };
  }
};
