<?php
include_once __DIR__ . '/../../utils/JWT.php';

class AuthMiddleware {
    public static function authenticate() {
        // Try multiple methods to get headers
        $headers = function_exists('getallheaders') ? getallheaders() : [];
        $token = null;

        // Debug: Log all headers
        error_log("=== AUTH MIDDLEWARE DEBUG ===");
        error_log("All headers: " . json_encode($headers));
        error_log("HTTP_AUTHORIZATION: " . ($_SERVER['HTTP_AUTHORIZATION'] ?? 'NOT SET'));
        
        // Try to get Authorization header (case-insensitive)
        if (isset($headers['Authorization'])) {
            $token = str_replace('Bearer ', '', $headers['Authorization']);
        } elseif (isset($headers['authorization'])) {
            $token = str_replace('Bearer ', '', $headers['authorization']);
        } elseif (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $token = str_replace('Bearer ', '', $_SERVER['HTTP_AUTHORIZATION']);
        }
        
        error_log("Token extracted: " . ($token ? substr($token, 0, 20) . '...' : 'NULL'));

        if (!$token) {
            http_response_code(401);
            echo json_encode(array("message" => "Unauthorized. No token provided."));
            exit();
        }

        $decoded = JWT::decode($token);
        if (!$decoded) {
            http_response_code(401);
            echo json_encode(array("message" => "Unauthorized. Invalid token."));
            exit();
        }

        return $decoded;
    }
}
?>
