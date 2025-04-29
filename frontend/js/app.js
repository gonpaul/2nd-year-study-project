const { MatrixController } = require("./controllers/MatrixController.js");
const { MatrixModel } = require("./models/MatrixModel.js");
const { MatrixView } = require("./views/MatrixView.js");
// Wait for the DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the application with MVC components
    const app = new MatrixController(
        new MatrixModel(),
        new MatrixView()
    );
}); 