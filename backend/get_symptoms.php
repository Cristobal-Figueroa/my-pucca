<?php
require_once 'config.php';

$conn = getDBConnection();
if (!$conn) {
    sendError('Error de conexión a la base de datos', 500);
}

$user_id = $_GET['user_id'] ?? null;
$date = $_GET['date'] ?? null;

if (!$user_id) {
    sendError('user_id es requerido');
}

if ($date) {
    // Obtener síntomas de una fecha específica
    $stmt = $conn->prepare("SELECT * FROM symptoms WHERE user_id = ? AND date = ? ORDER BY created_at DESC LIMIT 1");
    $stmt->bind_param("ss", $user_id, $date);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $symptom = $result->fetch_assoc();
        sendResponse([
            'success' => true,
            'symptom' => $symptom
        ]);
    } else {
        sendResponse([
            'success' => true,
            'symptom' => null
        ]);
    }
} else {
    // Obtener todos los síntomas del usuario
    $stmt = $conn->prepare("SELECT * FROM symptoms WHERE user_id = ? ORDER BY date DESC");
    $stmt->bind_param("s", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $symptoms = [];
    while ($row = $result->fetch_assoc()) {
        $symptoms[] = $row;
    }

    sendResponse([
        'success' => true,
        'symptoms' => $symptoms
    ]);
}

$stmt->close();
$conn->close();
?>
