<?php    
    include __DIR__ . "/../utils/config.php";
    session_start();
    
    $conn = @new mysqli($servername, $username, $password, $database);
    //check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data)) {
        $login_username = $data['username'];
        $login_password = $data['password'];
    
        # Check student login
        $stmt = $conn->prepare("SELECT * FROM STUDENT WHERE STUDENT_ID = ? AND STUDENT_PASSWORD = ?");
        $stmt->bind_param('ss', $login_username, $login_password);
    
        $stmt->execute();
        $result = $stmt->get_result();
    
        if ($result->num_rows == 1) {
            # STUDENT LOGIN SUCCESSFULLY
            echo "STUDENT LOGIN SUCCESSFULLY";
            setcookie("username", $login_username, time() + 60 * 60 * 24 * 5); # 5 days
            setcookie("password", $login_password, time() + 60 * 60 * 24 * 5);
            $_SESSION["username"] = $login_username;
            $row = $result->fetch_assoc();
            $_SESSION["name"] = $row["STUDENT_NAME"];
            $_SESSION["type"] = "student_login";
        }
        else {
            # Check instructor login
            $stmt = $conn->prepare("SELECT * FROM INSTRUCTOR WHERE INSTRUCTOR_ID = ? AND INSTRUCTOR_PASSWORD = ?");
            $stmt->bind_param('ss', $login_username, $login_password);
    
            $stmt->execute();
            $result = $stmt->get_result();
    
            if ($result->num_rows == 1) {
                # INSTRUCTOR LOGIN SUCCESSFULLY
                echo "INSTRUCTOR LOGIN SUCCESSFULLY";
                setcookie("username", $login_username, time() + 60 * 60 * 24 * 5); # 5 days
                setcookie("password", $login_password, time() + 60 * 60 * 24 * 5);
                $_SESSION["username"] = $login_username;
                $row = $result->fetch_assoc();
                $_SESSION["name"] = $row["INSTRUCTOR_NAME"];
                $_SESSION["type"] = "instructor_login";
            }
            else {
                # LOGIN FAILED
                echo "LOGIN FAILED";
            }
        }
    }
    
    $conn->close();
?>