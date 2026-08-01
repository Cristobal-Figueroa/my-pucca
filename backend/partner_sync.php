<?php
require_once 'config.php';

$conn = getDBConnection();
if (!$conn) {
    sendError('Error de conexión a la base de datos', 500);
}

$data = getRequestData();

$user_id = $data['user_id'] ?? null;
$partner_code = $data['partner_code'] ?? null;

if (!$user_id || empty($partner_code)) {
    sendError('user_id y partner_code son requeridos');
}

// Buscar usuario con ese código de pareja
$stmt = $conn->prepare("SELECT user_id, name, cycle_length, period_length, last_period_start FROM users WHERE partner_code = ? AND gender = 'woman'");
$stmt->bind_param("s", $partner_code);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $partner = $result->fetch_assoc();
    
    // Actualizar el perfil del hombre con el código de su pareja
    $stmt = $conn->prepare("UPDATE users SET partner_code = ? WHERE user_id = ?");
    $stmt->bind_param("ss", $partner_code, $user_id);
    $stmt->execute();
    
    sendResponse([
        'success' => true,
        'message' => 'Sincronización exitosa',
        'partner' => $partner
    ]);
} else {
    sendError('Código de pareja no válido', 404);
}

$stmt->close();
$conn->close();
?>
