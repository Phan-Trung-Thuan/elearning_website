<?php    
    header('Content-type: application/json; charset=utf-8');

    require __DIR__ . "/../utils/config.php";  
    $student_id = isset($_REQUEST["student_id"]) ? $_REQUEST["student_id"] : null;
    
    $conn = @new mysqli($servername, $username, $password, $database) or die 
    ('connection failed: ' . $conn->connect_error);   
    mysqli_set_charset($conn,"utf8mb4");
    
    $filter = "";
    if ($student_id != null) {
        $filter = "inner join enrollment on class.class_id = enrollment.class_id where student_id = $student_id";
    }

    $sql = "SELECT class_id, class_name FROM class" . " " . $filter;
    $result = $conn->query($sql);   
    $data = array();    
    
    while ($row = $result->fetch_assoc()) { 
        $class_info = array("class_id" => $row["class_id"], "class_name" => $row["class_name"]);

        array_push($data, $class_info);
    }  
    
    // $data = array(1,2,3);
    echo json_encode($data);   
    $conn->close();
