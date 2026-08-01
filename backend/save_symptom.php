<?php
require_once 'config.php';

$conn = getDBConnection();
if (!$conn) {
    sendError('Error de conexión a la base de datos', 500);
}

$data = getRequestData();

$user_id = $data['user_id'] ?? null;
$date = $data['date'] ?? '';
$mood = $data['mood'] ?? null;
$libido = $data['libido'] ?? null;
$cravings = $data['cravings'] ?? null;
$energy = $data['energy'] ?? null;
$sleep = $data['sleep'] ?? null;
$pain = $data['pain'] ?? null;
$skin = $data['skin'] ?? null;
$digestion = $data['digestion'] ?? null;
$headache = $data['headache'] ?? null;
$notes = $data['notes'] ?? '';

if (!$user_id || empty($date)) {
    sendError('user_id y date son requeridos');
}

// Verificar si ya existe un síntoma para esa fecha
$stmt = $conn->prepare("SELECT id FROM symptoms WHERE user_id = ? AND date = ?");
$stmt->bind_param("ss", $user_id, $date);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Actualizar síntoma existente
    $stmt = $conn->prepare("UPDATE symptoms SET mood = ?, libido = ?, cravings = ?, energy = ?, sleep = ?, pain = ?, skin = ?, digestion = ?, headache = ?, notes = ? WHERE user_id = ? AND date = ?");
    $stmt->bind_param("sssssssssss", $mood, $libido, $cravings, $energy, $sleep, $pain, $skin, $digestion, $headache, $notes, $user_id, $date);
    
    if ($stmt->execute()) {
        sendResponse([
            'success' => true,
            'message' => 'Síntoma actualizado exitosamente'
        ]);
    } else {
        sendError('Error al actualizar el síntoma');
    }
} else {
    // Crear nuevo síntoma
    $stmt = $conn->prepare("INSERT INTO symptoms (user_id, date, mood, libido, cravings, energy, sleep, pain, skin, digestion, headache, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())");
    $stmt->bind_param("ssssssssssss", $user_id, $date, $mood, $libido, $cravings, $energy, $sleep, $pain, $skin, $digestion, $headache, $notes);
    
    if ($stmt->execute()) {
        sendResponse([
            'success' => true,
            'message' => 'Síntoma guardado exitosamente'
        ]);
    } else {
        sendError('Error al guardar el síntoma');
    }
}

$stmt->close();
$conn->close();
?>
