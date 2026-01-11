<?php
include_once __DIR__ . '/../../utils/JWT.php';

class AuthMiddleware {
    public static function authenticate() {
        $headers = getallheaders();
        $token = null;

        if (isset($headers['Authorization'])) {
            $token = str_replace('Bearer ', '', $headers['Authorization']);
        }

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
