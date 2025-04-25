import { MatrixController } from "./controllers/MatrixController.js";
import { MatrixModel } from "./models/MatrixModel.js";
import { MatrixView } from "./views/MatrixView.js"
// Wait for the DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the application with MVC components
    const app = new MatrixController(
        new MatrixModel(),
        new MatrixView()
    );
}); 