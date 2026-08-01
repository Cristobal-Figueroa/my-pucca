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

$stmt = $conn->prepare("SELECT * FROM periods WHERE user_id = ? ORDER BY date DESC");
$stmt->bind_param("s", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$periods = [];
while ($row = $result->fetch_assoc()) {
    $periods[] = $row;
}

sendResponse([
    'success' => true,
    'periods' => $periods
]);

$stmt->close();
$conn->close();
?>
