<?php
require_once 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $partner_code = isset($_GET['partner_code']) ? $_GET['partner_code'] : '';
    $date = isset($_GET['date']) ? $_GET['date'] : '';
    
    if (empty($partner_code)) {
        echo json_encode(['success' => false, 'message' => 'Código de pareja requerido']);
        exit;
    }
    
    $conn = getDBConnection();
    if (!$conn) {
        echo json_encode(['success' => false, 'message' => 'Error de conexión a la base de datos']);
        exit;
    }
    
    // Primero obtener el user_id de la pareja usando el código
    $stmt = $conn->prepare("SELECT user_id FROM users WHERE partner_code = ? AND gender = 'woman' LIMIT 1");
    $stmt->bind_param("s", $partner_code);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Código de pareja no encontrado']);
        $stmt->close();
        $conn->close();
        exit;
    }
    
    $partner = $result->fetch_assoc();
    $partner_user_id = $partner['user_id'];
    $stmt->close();
    
    // Obtener síntomas de la pareja para la fecha específica
    if (!empty($date)) {
        $stmt = $conn->prepare("SELECT * FROM symptoms WHERE user_id = ? AND date = ? ORDER BY created_at DESC LIMIT 1");
        $stmt->bind_param("ss", $partner_user_id, $date);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $symptom = $result->fetch_assoc();
            echo json_encode(['success' => true, 'symptom' => $symptom]);
        } else {
            echo json_encode(['success' => true, 'symptom' => null]);
        }
        $stmt->close();
    } else {
        // Obtener todos los síntomas de la pareja
        $stmt = $conn->prepare("SELECT * FROM symptoms WHERE user_id = ? ORDER BY date DESC, created_at DESC");
        $stmt->bind_param("s", $partner_user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $symptoms = [];
        while ($row = $result->fetch_assoc()) {
            $symptoms[] = $row;
        }
        
        echo json_encode(['success' => true, 'symptoms' => $symptoms]);
        $stmt->close();
    }
    
    $conn->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
}
?>
