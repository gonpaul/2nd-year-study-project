# Matrix Calculator

A vanilla JavaScript matrix calculator application built using the MVC (Model-View-Controller) architectural pattern.

## Features

- Display and edit two 3x3 matrices (A and B)
- Matrix operations:
  - Clear
  - Transpose
  - Multiply by scalar
  - Calculate determinant
  - Raise to power
  - Calculate rank
  - Calculate inverse
- Operations between matrices:
  - Swap matrices
  - Add matrices (A + B)
  - Subtract matrices (A - B)
  - Multiply matrices (A * B)
- Operation history display

## Project Structure

The application follows the MVC (Model-View-Controller) architectural pattern:

```
project/
│
├── index.html            # Main HTML file
├── css/
│   └── style.css         # Styles for the application
│
└── js/
    ├── app.js            # Application initialization
    ├── models/
    │   └── MatrixModel.js  # Data and matrix operations
    ├── views/
    │   └── MatrixView.js   # UI rendering and user interaction
    └── controllers/
        └── MatrixController.js  # Connects model and view
```

## MVC Pattern

### Model (MatrixModel.js)
- Manages the matrix data and operations
- Handles all matrix calculations (determinant, inverse, etc.)
- Maintains operation history

### View (MatrixView.js)
- Renders the matrix UI
- Handles user inputs
- Displays operation history

### Controller (MatrixController.js)
- Acts as an interface between Model and View
- Processes user inputs from the View
- Updates the Model and ensures View reflects the current state

## How to Run

Simply open the `index.html` file in any modern web browser.

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript (ES6+) 