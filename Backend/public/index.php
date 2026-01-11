<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../utils/DotEnv.php';
require_once __DIR__ . '/../app/Config/Database.php';
require_once __DIR__ . '/../app/Controllers/AuthController.php';
require_once __DIR__ . '/../app/Controllers/TaskController.php';

// Load Env
$env = new DotEnv(__DIR__ . '/../.env');
$env->load();

// Connect DB
$database = new Database();
$db = $database->getConnection();

// Simple Router
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/', $uri);
// Assuming /TaskManager/Backend/public/index.php/login or /api/login
// Adjust based on your server path. If standard XAMPP:
// http://localhost/TaskManager/Backend/public/login

$endpoint = end($uri);
$method = $_SERVER["REQUEST_METHOD"];

switch ($endpoint) {
    case 'login':
        $auth = new AuthController($db);
        if ($method === 'POST') $auth->login();
        else { http_response_code(405); echo json_encode(["message" => "Method Not Allowed"]); }
        break;
        
    case 'tasks':
        $task = new TaskController($db);
        switch ($method) {
            case 'GET': $task->index(); break;
            case 'POST': $task->store(); break;
            case 'PUT': $task->update(); break;
            case 'DELETE': $task->destroy(); break;
            default: http_response_code(405); echo json_encode(["message" => "Method Not Allowed"]); break;
        }
        break;

    default:
        http_response_code(404);
        echo json_encode(["message" => "Endpoint not found: " . $endpoint]);
        break;
}
?>
