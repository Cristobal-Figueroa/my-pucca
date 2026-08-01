<?php
require_once 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $partner_code = isset($_GET['partner_code']) ? $_GET['partner_code'] : '';
    
    if (empty($partner_code)) {
        echo json_encode(['success' => false, 'message' => 'Código de pareja requerido']);
        exit;
    }
    
    $conn = getDBConnection();
    if (!$conn) {
        echo json_encode(['success' => false, 'message' => 'Error de conexión a la base de datos']);
        exit;
    }
    
    // Usar prepared statement con mysqli
    $stmt = $conn->prepare("SELECT user_id, name, cycle_length, period_length, last_period_start, gender FROM users WHERE partner_code = ? AND gender = 'woman' LIMIT 1");
    $stmt->bind_param("s", $partner_code);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $partner = $result->fetch_assoc();
        echo json_encode(['success' => true, 'profile' => $partner]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Código de pareja no encontrado']);
    }
    
    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
}
?>
