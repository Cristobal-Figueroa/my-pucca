<?php
require_once 'config.php';

$conn = getDBConnection();
if (!$conn) {
    die('Error de conexión a la base de datos');
}

// Obtener el user_id correcto del hombre
$stmt = $conn->prepare("SELECT user_id FROM users WHERE email = 'cristobalfigueroa92@gmail.com' AND gender = 'man'");
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $man = $result->fetch_assoc();
    $man_user_id = $man['user_id'];
    
    // Actualizar el connected_partner_code de la mujer con el user_id completo del hombre
    $stmt = $conn->prepare("UPDATE users SET connected_partner_code = ? WHERE email = 'cristobalfigueroa921@gmail.com' AND gender = 'woman'");
    $stmt->bind_param("s", $man_user_id);
    
    if ($stmt->execute()) {
        echo "Sincronización corregida exitosamente. connected_partner_code de la mujer actualizado a: " . $man_user_id;
    } else {
        echo "Error al actualizar: " . $conn->error;
    }
} else {
    echo "No se encontró al usuario hombre con ese email";
}

$stmt->close();
$conn->close();
?>
