<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'database.php';

$partner_code = $_GET['partner_code'] ?? '';

if (empty($partner_code)) {
    echo json_encode(['success' => false, 'error' => 'Código de pareja requerido']);
    exit;
}

try {
    // Obtener user_id de la pareja usando el partner_code
    $stmt = $pdo->prepare("SELECT user_id FROM users WHERE partner_code = ?");
    $stmt->execute([$partner_code]);
    $partner = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$partner) {
        echo json_encode(['success' => false, 'error' => 'Pareja no encontrada']);
        exit;
    }

    // Obtener todos los síntomas de la pareja
    $stmt = $pdo->prepare("SELECT * FROM symptoms WHERE user_id = ? ORDER BY date DESC");
    $stmt->execute([$partner['user_id']]);
    $symptoms = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'symptoms' => $symptoms]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
