<?php
require_once 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = getRequestData();
    $user_id = $data['user_id'] ?? null;
    $symptoms = $data['symptoms'] ?? [];
    
    if (empty($user_id)) {
        sendError('user_id es requerido');
    }
    
    if (empty($symptoms)) {
        sendResponse(['success' => true, 'message' => 'No hay síntomas para guardar']);
    }
    
    $conn = getDBConnection();
    if (!$conn) {
        sendError('Error de conexión a la base de datos', 500);
    }
    
    $success_count = 0;
    $error_count = 0;
    
    foreach ($symptoms as $symptom) {
        $date = $symptom['date'] ?? '';
        $mood = $symptom['mood'] ?? null;
        $libido = $symptom['libido'] ?? null;
        $cravings = $symptom['cravings'] ?? null;
        $energy = $symptom['energy'] ?? null;
        $sleep = $symptom['sleep'] ?? null;
        $pain = $symptom['pain'] ?? null;
        $skin = $symptom['skin'] ?? null;
        $digestion = $symptom['digestion'] ?? null;
        $headache = $symptom['headache'] ?? null;
        $notes = $symptom['notes'] ?? '';
        
        if (empty($date)) {
            $error_count++;
            continue;
        }
        
        // Verificar si ya existe
        $stmt = $conn->prepare("SELECT id FROM symptoms WHERE user_id = ? AND date = ?");
        $stmt->bind_param("ss", $user_id, $date);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            // Actualizar
            $stmt = $conn->prepare("UPDATE symptoms SET mood = ?, libido = ?, cravings = ?, energy = ?, sleep = ?, pain = ?, skin = ?, digestion = ?, headache = ?, notes = ? WHERE user_id = ? AND date = ?");
            $stmt->bind_param("sssssssssss", $mood, $libido, $cravings, $energy, $sleep, $pain, $skin, $digestion, $headache, $notes, $user_id, $date);
            if ($stmt->execute()) {
                $success_count++;
            } else {
                $error_count++;
            }
        } else {
            // Insertar
            $stmt = $conn->prepare("INSERT INTO symptoms (user_id, date, mood, libido, cravings, energy, sleep, pain, skin, digestion, headache, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())");
            $stmt->bind_param("sssssssssss", $user_id, $date, $mood, $libido, $cravings, $energy, $sleep, $pain, $skin, $digestion, $headache, $notes);
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
