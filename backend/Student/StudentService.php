<?php
	header('Content-Type: application/json; charset=utf-8');
	header("Access-Control-Allow-Origin: http://localhost:4200");
	header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
	header("Access-Control-Allow-Headers: Content-Type, Authorization");
	header("Access-Control-Allow-Credentials: true");

    include_once("MessageHandler.php");

    class StudentService
    {
        function __construct()
        {

        }

        function GET($parameters)
        {
            $apiType = array_shift($parameters);
            $data = array_shift($parameters);

            include_once("connectToDB.php");
			$sql_query = "SELECT * FROM student";

            switch($apiType)
            {
                case "StudentID":
                    if(strlen($data) < 8)
                    {
                        message('error', '101', "Invalid StudentID $data! (It required At least 8 characters)");
                    }
                    $sql_query .= " WHERE student_id = '$data'";
                    break;

                case "StudentName":
					if(empty($data))
					{
						message('error', '100', "Missing $apiType data in URL");
					}
                    $sql_query .= " WHERE student_name LIKE '%$data%'";
                    break;
				
				default:
					if(!empty($apiType))
					{
						message('error', '102', 'Please Input valid column name(StudentID/StudentName)!');
					}
					break;
            }

            $result = $connect->query($sql_query);
            $output = array();

            try
			{
				while($row = $result->fetch_assoc())
				{
					$output[] = $row;
				}

				
				if($output == null)
				{
					$output = message('success','','Do not have this record here');
					exit;
				}
				$record = message('success','', $output);	
			}
			catch(Exception $e)
			{
				errorMessage('error', '200', 'SQL failure during get data');
			}
        }

        function POST($parameters)
        {
            $body = file_get_contents("php://input");
			$dataArray = json_decode($body, true);
			$studentID = $dataArray['student_id'];
			$studentName = $dataArray['student_name'];
			$email = $dataArray['email'] ?? null;

			if(!isset($studentID)|| empty($studentID))
			{
				message('error', '104', 'Missing Student ID Data in JSON file');
			}

			if(!isset($studentName) || empty($studentName))
			{
				message('error', '104', 'Missing Student Name Data in JSON file');
			}
			
			include("connectToDB.php");

			try
			{
				// Check if the record already exists 
				$stmt = $connect->prepare("SELECT * FROM student WHERE student_id = '$studentID'"); 
				$stmt->execute(); 
				$resultForDuplicate = $stmt->get_result();
				
				if($resultForDuplicate->num_rows > 0)
				{ 
					message('error', '105', "Record already exists");
				}
				
				 $sql_query = "INSERT INTO student (student_id, student_name, email) VALUES ('$studentID', '$studentName', '$email')";
				$result = $connect->query($sql_query);
				message('success', '', "Student with '$studentName' insert successfully");
			}
			catch(Exception $e)
			{
				message('error' ,'201', 'SQL failure during insertion');
			}
        }

        function PUT($parameters)
        {
            $body = file_get_contents("php://input");
			$dataArray = json_decode($body, true);
			$studentID = $dataArray['student_id'];
			$studentName = $dataArray['student_name'] ?? null;
			$email = $dataArray['email'] ?? null;
			
			include("connectToDB.php");
			
			$sql_query = "UPDATE student SET ";
			
			if(!isset($studentID))
			{			
				message('error', '104', 'Missing student_id in JSON file');
			}
			
			if(isset($studentName))
			{			
				$sql_query .= "student_name = '$studentName' ";
			}
			
			if(isset($email))
			{
				if(!isset($studentName))
				{
					$sql_query = "email = '$email' ";
				}
				else
				{
					$sql_query .= ",email = '$email' ";
				}
			}
			
			$sql_query .= "WHERE student_id = '$studentID'";
			
			try
			{
				$result = $connect->query($sql_query);
				message('success', '', "Student with Student ID:'$studentID' update successfully");
			}
			catch(Exception $e)
			{
				message('error', '202', 'SQL failure during update data:'.$e);
			}
        }

        function DELETE($parameters)
        {
            $apiType = array_shift($parameters);
            $data = array_shift($parameters);

            if(!isset($data))
            {
                message('error', '100', "Missing $apiType data in URL");
            }

            include_once("connectToDB.php");

			$sql_query = "DELETE FROM student WHERE";

            switch($apiType)
            {
                case "StudentID":
                    $sql_query .= " student_id = '$data'";
                    break;

                case "StudentName":
                    $sql_query .= " student_name LIKE '%$data%'";
                    break;

                case "Email":
                    $sql_query .= " email = '$data'";
                    break;
            }

            try
			{
				$result = $connect->query($sql_query);
				
				if($connect -> affected_rows == 1)
				{
					message('success', '','Student delete successfully');
				}
				else if($connect -> affected_rows == 0)
				{
					message('error', '102', "$apiType $data does not exist!");
				}
				else
				{
					message('error', '103','Delete more than 1 record');
				}
			}
			catch(Exception $e)
			{
				message('error', '203', 'SQL failure during deletion');
			}
        }
    }
?>