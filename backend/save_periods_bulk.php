<?php
require_once 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = getRequestData();
    $user_id = $data['user_id'] ?? null;
    $periods = $data['periods'] ?? [];
    
    if (empty($user_id)) {
        sendError('user_id es requerido');
    }
    
    if (empty($periods)) {
        sendResponse(['success' => true, 'message' => 'No hay periodos para guardar']);
    }
    
    $conn = getDBConnection();
    if (!$conn) {
        sendError('Error de conexión a la base de datos', 500);
    }
    
    $success_count = 0;
    $error_count = 0;
    
    foreach ($periods as $period) {
        $date = $period['date'] ?? '';
        $notes = $period['notes'] ?? '';
        
        if (empty($date)) {
            $error_count++;
            continue;
        }
        
        // Verificar si ya existe
        $stmt = $conn->prepare("SELECT id FROM periods WHERE user_id = ? AND date = ?");
        $stmt->bind_param("ss", $user_id, $date);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            // Actualizar
            $stmt = $conn->prepare("UPDATE periods SET notes = ? WHERE user_id = ? AND date = ?");
            $stmt->bind_param("sss", $notes, $user_id, $date);
            if ($stmt->execute()) {
                $success_count++;
            } else {
                $error_count++;
            }
        } else {
            // Insertar
            $stmt = $conn->prepare("INSERT INTO periods (user_id, date, notes, created_at) VALUES (?, ?, ?, NOW())");
            $stmt->bind_param("sss", $user_id, $date, $notes);
            if ($stmt->execute()) {
                $success_count++;
            } else {
                $error_count++;
            }
        }
        $stmt->close();
    }
    
    $conn->close();
    
    sendResponse([
        'success' => true,
        'message' => "Guardados: $success_count, Errores: $error_count"
    ]);
} else {
    sendError('Método no permitido');
}
?>
