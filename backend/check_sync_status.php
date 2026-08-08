<?php
require_once 'config.php';

$conn = getDBConnection();
if (!$conn) {
    die('Error de conexión a la base de datos');
}

echo "<h2>Estado de Sincronización</h2>";

// Obtener datos del hombre
$stmt = $conn->prepare("SELECT user_id, name, email, connected_partner_code FROM users WHERE email = 'cristobalfigueroa92@gmail.com' AND gender = 'man'");
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $man = $result->fetch_assoc();
    echo "<h3>Datos del Hombre:</h3>";
    echo "<p>user_id: " . $man['user_id'] . "</p>";
    echo "<p>name: " . $man['name'] . "</p>";
    echo "<p>connected_partner_code: " . ($man['connected_partner_code'] ?? 'NULL') . "</p>";
    
    // Obtener datos de la mujer usando el connected_partner_code
    if ($man['connected_partner_code']) {
        $stmt = $conn->prepare("SELECT user_id, name, partner_code FROM users WHERE partner_code = ?");
        $stmt->bind_param("s", $man['connected_partner_code']);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $woman = $result->fetch_assoc();
            echo "<h3>Datos de la Mujer (encontrada por connected_partner_code):</h3>";
            echo "<p>user_id: " . $woman['user_id'] . "</p>";
            echo "<p>name: " . $woman['name'] . "</p>";
            echo "<p>partner_code: " . $woman['partner_code'] . "</p>";
            
            // Verificar si el connected_partner_code de la mujer apunta al hombre
            $stmt = $conn->prepare("SELECT connected_partner_code FROM users WHERE user_id = ?");
            $stmt->bind_param("s", $woman['user_id']);
            $stmt->execute();
            $result = $stmt->get_result();
            $womanData = $result->fetch_assoc();
            
            echo "<p>connected_partner_code de la mujer: " . ($womanData['connected_partner_code'] ?? 'NULL') . "</p>";
            
            if ($womanData['connected_partner_code'] === $man['user_id']) {
                echo "<p style='color: green'>✓ Sincronización correcta (bidireccional)</p>";
            } else {
                echo "<p style='color: red'>✗ Sincronización incorrecta</p>";
            }
        } else {
            echo "<p style='color: red'>✗ No se encontró mujer con el código: " . $man['connected_partner_code'] . "</p>";
        }
    } else {
        echo "<p style='color: red'>✗ El hombre no tiene connected_partner_code</p>";
    }
} else {
    echo "<p style='color: red'>✗ No se encontró al usuario hombre</p>";
}

// Obtener datos de la mujer
$stmt = $conn->prepare("SELECT user_id, name, email, partner_code, connected_partner_code FROM users WHERE email = 'cristobalfigueroa921@gmail.com' AND gender = 'woman'");
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $woman = $result->fetch_assoc();
    echo "<h3>Datos de la Mujer:</h3>";
    echo "<p>user_id: " . $woman['user_id'] . "</p>";
    echo "<p>name: " . $woman['name'] . "</p>";
    echo "<p>partner_code: " . $woman['partner_code'] . "</p>";
    echo "<p>connected_partner_code: " . ($woman['connected_partner_code'] ?? 'NULL') . "</p>";
    
    // Obtener síntomas de la mujer
    $stmt = $conn->prepare("SELECT date, mood FROM symptoms WHERE user_id = ? ORDER BY date DESC LIMIT 5");
    $stmt->bind_param("s", $woman['user_id']);
    $stmt->execute();
    $result = $stmt->get_result();
    
    echo "<h3>Últimos síntomas de la mujer:</h3>";
    while ($row = $result->fetch_assoc()) {
        echo "<p>Fecha: " . $row['date'] . ", Mood: " . $row['mood'] . "</p>";
    }
}

$conn->close();
?>
