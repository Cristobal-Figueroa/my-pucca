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

if (empty($name)) {
    sendError('El nombre es requerido');
}

// La fecha del último periodo solo es requerida para mujeres
if ($gender === 'woman' && empty($last_period_start)) {
    sendError('La fecha del último periodo es requerida para mujeres');
}

// Si no hay user_id, generar uno nuevo
if (!$user_id) {
    $user_id = uniqid('user_', true);
}

// Verificar si el usuario ya existe
$stmt = $conn->prepare("SELECT id FROM users WHERE user_id = ?");
$stmt->bind_param("s", $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Actualizar perfil existente
    $stmt = $conn->prepare("UPDATE users SET name = ?, cycle_length = ?, period_length = ?, last_period_start = ?, gender = ?, partner_code = ? WHERE user_id = ?");
    $stmt->bind_param("siissss", $name, $cycle_length, $period_length, $last_period_start, $gender, $partner_code, $user_id);
    
    if ($stmt->execute()) {
        sendResponse([
            'success' => true,
            'message' => 'Perfil actualizado exitosamente',
            'user_id' => $user_id
        ]);
    } else {
        sendError('Error al actualizar el perfil');
    }
} else {
    // Crear nuevo perfil
    $stmt = $conn->prepare("INSERT INTO users (user_id, name, cycle_length, period_length, last_period_start, gender, partner_code, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())");
    $stmt->bind_param("ssissss", $user_id, $name, $cycle_length, $period_length, $last_period_start, $gender, $partner_code);
    
    if ($stmt->execute()) {
        sendResponse([
            'success' => true,
            'message' => 'Perfil creado exitosamente',
            'user_id' => $user_id
        ]);
    } else {
        sendError('Error al crear el perfil');
    }
}

$stmt->close();
$conn->close();
?>
