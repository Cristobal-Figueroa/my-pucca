<?php
require_once 'config.php';

$conn = getDBConnection();
if (!$conn) {
    sendError('Error de conexión a la base de datos', 500);
}

$user_id = $_GET['user_id'] ?? null;

if (!$user_id) {
    sendError('user_id es requerido');
}

$stmt = $conn->prepare("SELECT user_id, name, email, cycle_length, period_length, last_period_start, gender, partner_code, connected_partner_code FROM users WHERE user_id = ?");
$stmt->bind_param("s", $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $profile = $result->fetch_assoc();
    sendResponse([
        'success' => true,
        'profile' => $profile
    ]);
} else {
    sendError('Perfil no encontrado', 404);
}

$stmt->close();
$conn->close();
?>
