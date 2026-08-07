<?php
require_once 'config.php';

$conn = getDBConnection();
if (!$conn) {
    sendError('Error de conexión a la base de datos', 500);
}

$data = getRequestData();

$user_id = $data['user_id'] ?? null;
$name = $data['name'] ?? '';
$cycle_length = $data['cycle_length'] ?? 28;
$period_length = $data['period_length'] ?? 5;
$last_period_start = $data['last_period_start'] ?? '';
$gender = $data['gender'] ?? 'woman';
$partner_code = $data['partner_code'] ?? null;
$connected_partner_code = $data['connected_partner_code'] ?? null;

if (empty($name)) {
    sendError('El nombre es requerido');
}

// Si no hay user_id, generar uno nuevo
if (!$user_id) {
    $user_id = uniqid('user_', true);
}

// Buscar si el usuario ya existe
$stmt = $conn->prepare("SELECT id, user_id, name, email, cycle_length, period_length, last_period_start, gender, partner_code, connected_partner_code FROM users WHERE user_id = ?");
$stmt->bind_param("s", $user_id);
$stmt->execute();
$result = $stmt->get_result();

// La fecha del último periodo solo es requerida para mujeres al crear perfil
if ($gender === 'woman' && empty($last_period_start) && $result->num_rows === 0) {
    sendError('La fecha del último periodo es requerida para mujeres al crear perfil');
}

// Si es hombre, partner_code debe ser null (los hombres no tienen partner_code)
if ($gender === 'man') {
    $partner_code = null;
}

// Generar código de pareja para mujeres si no tiene uno
if ($gender === 'woman' && empty($partner_code)) {
    $partner_code = strtoupper(substr(md5(uniqid($user_id . $name . $last_period_start, true)), 0, 6));
}

if ($result->num_rows > 0) {
    // Actualizar perfil existente
    $stmt = $conn->prepare("UPDATE users SET name = ?, cycle_length = ?, period_length = ?, last_period_start = ?, gender = ?, partner_code = ?, connected_partner_code = ? WHERE user_id = ?");
    $stmt->bind_param("siisssss", $name, $cycle_length, $period_length, $last_period_start, $gender, $partner_code, $connected_partner_code, $user_id);
    
    if ($stmt->execute()) {
        sendResponse([
            'success' => true,
            'message' => 'Perfil actualizado exitosamente',
            'user_id' => $user_id,
            'partner_code' => $partner_code,
            'connected_partner_code' => $connected_partner_code
        ]);
    } else {
        sendError('Error al actualizar el perfil');
    }
} else {
    // Crear nuevo perfil
    $stmt = $conn->prepare("INSERT INTO users (user_id, name, cycle_length, period_length, last_period_start, gender, partner_code, connected_partner_code, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())");
    $stmt->bind_param("ssisssss", $user_id, $name, $cycle_length, $period_length, $last_period_start, $gender, $partner_code, $connected_partner_code);
    
    if ($stmt->execute()) {
        sendResponse([
            'success' => true,
            'message' => 'Perfil creado exitosamente',
            'user_id' => $user_id,
            'partner_code' => $partner_code,
            'connected_partner_code' => $connected_partner_code
        ]);
    } else {
        sendError('Error al crear el perfil');
    }
}

$stmt->close();
$conn->close();
?>
