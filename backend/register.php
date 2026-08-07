<?php
require_once 'config.php';

$conn = getDBConnection();
if (!$conn) {
    sendError('Error de conexión a la base de datos', 500);
}

$data = getRequestData();

$name = $data['name'] ?? '';
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';
$gender = $data['gender'] ?? 'woman';
$cycle_length = $data['cycle_length'] ?? 28;
$period_length = $data['period_length'] ?? 5;
$last_period_start = $data['last_period_start'] ?? '';
$partner_code = $data['partner_code'] ?? null;

if (empty($name) || empty($email) || empty($password)) {
    sendError('Nombre, correo y contraseña son requeridos');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendError('Correo electrónico inválido');
}

if (strlen($password) < 6) {
    sendError('La contraseña debe tener al menos 6 caracteres');
}

// Verificar si el correo ya existe
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    sendError('Ya existe una cuenta con ese correo electrónico', 409);
}

// Generar user_id
$user_id = uniqid('user_', true);

// Hashear la contraseña
$password_hash = password_hash($password, PASSWORD_DEFAULT);

// Generar código de pareja para mujeres si no tiene uno
if ($gender === 'woman' && empty($partner_code)) {
    $partner_code = strtoupper(substr(md5(uniqid($user_id . $name . $last_period_start, true)), 0, 6));
}

// Si es hombre y tiene partner_code, guardarlo en connected_partner_code
$connected_partner_code = null;
if ($gender === 'man' && !empty($partner_code)) {
    $connected_partner_code = $partner_code;
    $partner_code = null; // Los hombres no tienen partner_code
}

// Insertar nuevo usuario
$stmt = $conn->prepare("INSERT INTO users (user_id, name, email, password, cycle_length, period_length, last_period_start, gender, partner_code, connected_partner_code, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())");
$stmt->bind_param("ssssisssss", $user_id, $name, $email, $password_hash, $cycle_length, $period_length, $last_period_start, $gender, $partner_code, $connected_partner_code);

if ($stmt->execute()) {
    // Si el usuario es hombre y ingresó código de pareja, hacer la sincronización automáticamente
    if ($gender === 'man' && !empty($connected_partner_code)) {
        // Buscar a la mujer con ese código
        $stmt = $conn->prepare("SELECT user_id, gender FROM users WHERE partner_code = ? AND gender = 'woman'");
        $stmt->bind_param("s", $connected_partner_code);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $partner = $result->fetch_assoc();
            $partner_user_id = $partner['user_id'];
            
            // Verificar que no sea el mismo usuario
            if ($partner_user_id !== $user_id) {
                // Hombre: guardar código de la mujer en connected_partner_code (ya está)
                // Guardar user_id del hombre en connected_partner_code de la mujer
                $stmt = $conn->prepare("UPDATE users SET connected_partner_code = ? WHERE user_id = ?");
                $stmt->bind_param("ss", $user_id, $partner_user_id);
                $stmt->execute();
            }
        }
    }
    
    sendResponse([
        'success' => true,
        'message' => 'Registro exitoso',
        'user_id' => $user_id,
        'partner_code' => $partner_code,
        'connected_partner_code' => $connected_partner_code
    ]);
} else {
    sendError('Error al crear el usuario');
}

$stmt->close();
$conn->close();
?>
