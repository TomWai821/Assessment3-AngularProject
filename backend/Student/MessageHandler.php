<?php
    function message($status, $errorCode, $message)
    {
        $output = array();
        $output['status'] = $status;

        if($errorCode != null && $message != null)
        {
            $output['errorCode'] = $errorCode;
            $output['errorMessage'] = $message;
			$output['messageReturn'] = array();
        }
        else
        {
            $output['messageReturn'] = $message;
        }

		echo json_encode($output);
		exit;
    }
?>