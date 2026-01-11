<?php
include_once __DIR__ . '/../Models/Task.php';
include_once __DIR__ . '/../Middleware/AuthMiddleware.php';

class TaskController {
    private $db;
    private $task;
    private $user_data;

    public function __construct($db) {
        $this->db = $db;
        $this->task = new Task($db);
        // Protect all task routes
        $decoded = AuthMiddleware::authenticate();
        $this->user_data = $decoded['data'];
    }

    public function index() {
        $this->task->user_id = $this->user_data['id'];
        $stmt = $this->task->read();
        $tasks = array();
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
            array_push($tasks, $row);
        }
        echo json_encode($tasks);
    }

    public function store() {
        $data = json_decode(file_get_contents("php://input"));
        if(!empty($data->title) && !empty($data->status)) {
            $this->task->title = $data->title;
            $this->task->description = $data->description;
            $this->task->status = $data->status;
            $this->task->user_id = $this->user_data['id'];

            if($this->task->create()) {
                http_response_code(201);
                echo json_encode(array("message" => "Task created."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to create task."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Incomplete data."));
        }
    }

    public function update() {
        $data = json_decode(file_get_contents("php://input"));
        // Assuming ID is passed in body for simplicity
        if(!empty($data->id) && !empty($data->title)) {
            $this->task->id = $data->id;
            $this->task->title = $data->title;
            $this->task->description = $data->description;
            $this->task->status = $data->status;
            $this->task->user_id = $this->user_data['id'];

            if($this->task->update()) {
                http_response_code(200);
                echo json_encode(array("message" => "Task updated."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to update task."));
            }
        }
    }
    public function destroy() {
        $data = json_decode(file_get_contents("php://input"));
        // For DELETE, body usage depends on client/server setup, usually works.
        if(!empty($data->id)) {
            $this->task->id = $data->id;
            $this->task->user_id = $this->user_data['id'];

            if($this->task->delete()) {
                http_response_code(200);
                echo json_encode(array("message" => "Task deleted."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to delete task."));
            }
        } else {
             http_response_code(400);
             echo json_encode(array("message" => "Incomplete data."));
        }
    }
}
?>
