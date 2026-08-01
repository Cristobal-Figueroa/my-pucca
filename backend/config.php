<?php
// Configuración de la base de datos
define('DB_HOST', 'localhost');
define('DB_USER', 'codecla1_my-pucca_user');
define('DB_PASS', 'N6edyUQLFx85#@jq');
define('DB_NAME', 'codecla1_mypuca_db');

// URL base del backend
define('BASE_URL', 'https://al.codeclandresell.com/backend/');

// Habilitar CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Conexión a la base de datos
function getDBConnection() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    if ($conn->connect_error) {
        return null;
    }
    
    $conn->set_charset("utf8mb4");
    return $conn;
}

// Respuesta JSON estándar
function sendResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit();
}

// Respuesta de error
function sendError($message, $statusCode = 400) {
    sendResponse([
        'success' => false,
        'error' => $message
    ], $statusCode);
}

// Obtener datos del request
function getRequestData() {
    $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
    
    if (strpos($contentType, 'application/json') !== false) {
        $data = json_decode(file_get_contents('php://input'), true);
        return $data ?? [];
    }
    
    return $_POST;
}
?>
