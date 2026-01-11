<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

// Simple Token Verification (Mock)
$headers = getallheaders();
$user_id = null;

if(isset($headers['Authorization'])) {
    // In real app, decode JWT. Here we just assume the token is base64 encoded json with id
    try {
        $token = str_replace('Bearer ', '', $headers['Authorization']);
        $decoded = json_decode(base64_decode($token), true);
        if(isset($decoded['id'])) {
            $user_id = $decoded['id'];
        }
    } catch (Exception $e) {
        // error
    }
}

if (!$user_id) {
    http_response_code(401);
    echo json_encode(array("message" => "Unauthorized."));
    exit();
}

switch($method) {
    case 'GET':
        $query = "SELECT * FROM tasks WHERE user_id = :user_id ORDER BY created_at DESC";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();
        $tasks = array();
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
            array_push($tasks, $row);
        }
        echo json_encode($tasks);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        if(!empty($data->title) && !empty($data->status)) {
            $query = "INSERT INTO tasks SET title=:title, description=:description, status=:status, user_id=:user_id, created_at=NOW()";
            $stmt = $db->prepare($query);
            $stmt->bindParam(":title", $data->title);
            $stmt->bindParam(":description", $data->description);
            $stmt->bindParam(":status", $data->status);
            $stmt->bindParam(":user_id", $user_id);
            
            if($stmt->execute()) {
                http_response_code(201);
                echo json_encode(array("message" => "Task created."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to create task."));
            }
        }
        break;
        
    case 'PUT':
        // Get ID from URL?? Or Body? 
        // For simplicity assuming ID is passed in body for this demo, or we parse the URI
        // Let's assume body for simplicity in this raw PHP script or check param
        $data = json_decode(file_get_contents("php://input"));
        
        // If ID is in query param ?id=X
        $id = isset($_GET['id']) ? $_GET['id'] : (isset($data->id) ? $data->id : null);

        if($id && !empty($data->title)) {
            $query = "UPDATE tasks SET title = :title, description = :description, status = :status WHERE id = :id AND user_id = :user_id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(":title", $data->title);
            $stmt->bindParam(":description", $data->description);
            $stmt->bindParam(":status", $data->status);
            $stmt->bindParam(":id", $id);
            $stmt->bindParam(":user_id", $user_id);
            
            if($stmt->execute()) {
                http_response_code(200);
                echo json_encode(array("message" => "Task updated."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to update task."));
            }
        }
        break;
}
?>
