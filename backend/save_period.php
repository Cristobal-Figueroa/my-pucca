<?php
require_once 'config.php';

$conn = getDBConnection();
if (!$conn) {
    sendError('Error de conexión a la base de datos', 500);
}

$data = getRequestData();

$user_id = $data['user_id'] ?? null;
$date = $data['date'] ?? '';
$notes = $data['notes'] ?? '';

if (!$user_id || empty($date)) {
    sendError('user_id y date son requeridos');
}

// Verificar si ya existe un periodo para esa fecha
$stmt = $conn->prepare("SELECT id FROM periods WHERE user_id = ? AND date = ?");
$stmt->bind_param("ss", $user_id, $date);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Actualizar periodo existente
    $stmt = $conn->prepare("UPDATE periods SET notes = ? WHERE user_id = ? AND date = ?");
    $stmt->bind_param("sss", $notes, $user_id, $date);
    
    if ($stmt->execute()) {
        sendResponse([
            'success' => true,
            'message' => 'Periodo actualizado exitosamente'
        ]);
    } else {
        sendError('Error al actualizar el periodo');
    }
} else {
    // Crear nuevo periodo
    $stmt = $conn->prepare("INSERT INTO periods (user_id, date, notes, created_at) VALUES (?, ?, ?, NOW())");
    $stmt->bind_param("sss", $user_id, $date, $notes);
    
    if ($stmt->execute()) {
        sendResponse([
            'success' => true,
            'message' => 'Periodo guardado exitosamente'
        ]);
    } else {
        sendError('Error al guardar el periodo');
    }
}

$stmt->close();
$conn->close();
?>
