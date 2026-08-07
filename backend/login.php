<?php
require_once 'config.php';

$conn = getDBConnection();
if (!$conn) {
    sendError('Error de conexión a la base de datos', 500);
}

$data = getRequestData();

$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

if (empty($email) || empty($password)) {
    sendError('Correo y contraseña son requeridos');
}

// Buscar usuario por email
$stmt = $conn->prepare("SELECT user_id, name, email, password, cycle_length, period_length, last_period_start, gender, partner_code FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    sendError('No se encontró una cuenta con ese correo', 404);
}

$user = $result->fetch_assoc();

// Verificar contraseña
if (!password_verify($password, $user['password'])) {
    sendError('Contraseña incorrecta', 401);
}

// Retornar datos del usuario (sin contraseña)
unset($user['password']);

sendResponse([
    'success' => true,
    'message' => 'Login exitoso',
    'user' => $user
]);

$stmt->close();
$conn->close();
?>
