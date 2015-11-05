<?php
	include_once('php/Helpers.php');    
    
    $helper = new AJAXHelper();
    $returnJSON =  $helper->getResponse();
    
	 if(substr_count($_SERVER['HTTP_ACCEPT_ENCODING'],'gzip')) 
		 ob_start('ob_gzhandler');
	else
		ob_start(); 
	
	echo $returnJSON;
?>
