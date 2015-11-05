<?php
include_once('php/Helpers.php');   


$response = new stdClass();
$fileValues = reset($_FILES);

if ($fileValues['error'] !== UPLOAD_ERR_OK) {
    $response->success = false;
    $response->message = '';
}
else if(isset($_FILES))
{
    $file_name = $fileValues['name'];
    $temp_file_name = $fileValues['tmp_name'];
    
    //Find file extention
    $ext = explode ('.', $file_name);
    $ext = $ext [count ($ext) - 1];

    //Validate extension
    $isValidExtension = ($ext == 'jpg' || $ext == 'jpeg' || $ext == 'png' || $ext == 'gif');     
    if (!$isValidExtension) {
        $response->success = false;
        $response->message = '';
    }
    else
    {
        //Move file to app
        $uid = uniqid("", true).".".$ext;
        if (move_uploaded_file ($temp_file_name, "..//common//images//uploaded//".$uid)) {
            //create thumb
            $filename = "..//common//images//uploaded//".$uid;            
            $thumb = "..//common//images//uploaded//thumb_".$uid;
            list($width, $height) = getimagesize($filename);
            
            $new_width = $width > 60 ? 60 : $width;
            $new_height = $height > 50 ? 50 : $height;

            $image_p = imagecreatetruecolor($new_width, $new_height);
            $image = imagecreatefromjpeg($filename);
            imagecopyresampled($image_p, $image, 0, 0, 0, 0, $new_width, $new_height, $width, $height);
            imagejpeg($image_p, $thumb, 100);
            //end thumb
            $response->success = true;
            $response->uid = $uid;
         } else {
            $response->success = false;
            $response->message = '';
        }
    }
}
echo JSONHelper::GetJSON($response,'results');

?>
