<?php
	
    include_once('php/Helpers.php');    
    
    $helper = new AJAXHelper();
    $returnJSON =  $helper->getResponse();
    echo $returnJSON;
?>
