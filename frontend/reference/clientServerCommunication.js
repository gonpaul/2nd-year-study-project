/**
 * Client-Server Communication Examples
 * 
 * This file contains examples of server requests used in our client application.
 * It demonstrates various API endpoints, request formats, and response handling
 * patterns that are implemented throughout the application.
 * 
 * These examples serve as reference documentation for developers working on
 * the client-side implementation of server communication.
 */

const apiUrl = process.env.API_URL || 'http://localhost:3000';

/**
 * Register User Request
 * 
 * Sends a request to create a new user account in the system.
 * 
 * @function registerUser
 * @param {string} username - The desired username for the new account
 * @param {string} email - The email address associated with the account
 * @param {string} password - The user's password (will be hashed server-side)
 * @returns {Promise<Object>} A promise that resolves to the server response
 * 
 * @example
 * // Usage
 * registerUser('newuser', 'user@example.com', 'securepassword')
 *   .then(data => console.log(data))
 *   .catch(error => console.error(error));
 * 
 * // Response format (success)
 * // Status: 201 Created
 * {
 *   "message": "User successfully registered",
 *   "userId": "12345"
 * }
 * 
 * // Response format (error)
 * // Status: 400 Bad Request
 * {
 *   "message": "A user with this email already exists or an error has occurred"
 * }
 */
async function registerUser(username, email, password) {
    const response = await fetch(apiUrl + '/api/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
    });
    return await response.json();
}
  

/**
 * Login User Request
 * 
 * Sends a request to authenticate a user and create a session.
 * 
 * @function loginUser
 * @param {string} email - The email address associated with the account
 * @param {string} password - The user's password for authentication
 * @returns {Promise<Object>} A promise that resolves to the server response
 * 
 * @example
 * // Usage
 * loginUser('user@example.com', 'securepassword')
 *   .then(data => console.log(data))
 *   .catch(error => console.error(error));
 * 
 * // Response format (success)
 * // Status: 200 OK
 * {
 *   "message": "Successful entry",
 *   "userId": "12345",
 *   // "token": "jwt-token-string"
 * }
 * 
 * // Response format (error)
 * // Status: 401 Unauthorized
 * {
 *   "message": "Invalid email or password"
 * }
 */
async function loginUser(email, password) {
    const response = await fetch(apiUrl + '/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });
    return await response.json();
}


async function changeUserPassword(email, currentPassword, newPassword) {
    const response = await fetch(apiUrl + '/api/users/change-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, currentPassword, newPassword })
    });
    return await response.json();
}


/**
 * Adds a calculation to the user's history in the database
 * 
 * @function addCalculationToHistory
 * @param {number} userId - The ID of the user who performed the calculation
 * @param {number} operationId - The ID of the operation performed (from OperationsTable)
 * @param {Array<Array<number>>} matrixA - The first matrix used in the calculation
 * @param {Array<Array<number>>|null} matrixB - The second matrix used in binary operations, null for unary operations
 * @param {number|null} scalarValue - The scalar value used in operations like multiplyByScalar, null for other operations
 * @param {Array<Array<number>>} resultMatrix - The resulting matrix from the calculation
 * @returns {Promise<Object>} A promise that resolves to the server response
 * 
 * @example
 * // Usage
 * addCalculationToHistory(1, 1, [[1,2],[3,4]], null, null, [[1,3],[2,4]])
 *   .then(data => console.log(data))
 *   .catch(error => console.error(error));
 * 
 * // Response format (success)
 * // Status: 201 CREATED 
 * {
 *   "message": "Calculation added to history successfully",
 *   "historyId": "67890"
 * }
 * 
 * // Response format (error)
 * // Status: 400 Bad Request
 * {
 *   "error": "Failed to add calculation to history"
 * }
 */
async function addCalculationToHistory(userId, operationId, matrixA, matrixB, scalarValue, resultMatrix) {
    const response = await fetch(apiUrl + '/api/calculation-history/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, operationId, matrixA, matrixB, scalarValue, resultMatrix })
    });
    return await response.json();
}


async function getCaclHistoryByUser(userId, limit = 10) {
    const response = await fetch(`${apiUrl}/api/calculation-history/${userId}?limit=${limit}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return await response.json();
}

// message if success, otherwise returns an error
async function deleteCaclHistoryForUser(userId) {
    const response = await fetch(`${apiUrl}/api/calculation-history/user/${userId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return await response.json();
}

module.exports = { addCalculationToHistory, getCaclHistoryByUser, deleteCaclHistoryForUser };