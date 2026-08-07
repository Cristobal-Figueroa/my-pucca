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
    $partner_user_id = $partner['user_id'];
    
    // Verificar que no sea el mismo usuario
    if ($partner_user_id === $user_id) {
        sendError('No puedes sincronizarte contigo mismo', 400);
    }
    
    // Actualizar el perfil del hombre con el código de su pareja en connected_partner_code
    $stmt = $conn->prepare("UPDATE users SET connected_partner_code = ? WHERE user_id = ?");
    $stmt->bind_param("ss", $partner_code, $user_id);
    $stmt->execute();
    
    // Generar un código para el hombre si no tiene uno
    $stmt = $conn->prepare("SELECT partner_code FROM users WHERE user_id = ?");
    $stmt->bind_param("s", $user_id);
    $stmt->execute();
    $man_result = $stmt->get_result();
    $man_data = $man_result->fetch_assoc();
    
    $man_partner_code = $man_data['partner_code'] ?? null;
    
    if (empty($man_partner_code)) {
        // Generar código único para el hombre
        $man_partner_code = strtoupper(substr(md5(uniqid($user_id, true)), 0, 6));
        
        // Actualizar el código del hombre
        $stmt = $conn->prepare("UPDATE users SET partner_code = ? WHERE user_id = ?");
        $stmt->bind_param("ss", $man_partner_code, $user_id);
        $stmt->execute();
    }
    
    // Guardar el código del hombre en el connected_partner_code de la mujer para sincronización bidireccional
    $stmt = $conn->prepare("UPDATE users SET connected_partner_code = ? WHERE user_id = ?");
    $stmt->bind_param("ss", $man_partner_code, $partner_user_id);
    $stmt->execute();
    
    sendResponse([
        'success' => true,
        'message' => 'Sincronización exitosa',
        'partner' => $partner,
        'man_partner_code' => $man_partner_code
    ]);
} else {
    sendError('Código de pareja no válido', 404);
}

$stmt->close();
$conn->close();
?>
