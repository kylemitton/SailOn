<?php
class Database {
    
    public function PrepareDB(){
        try {
            $options = array(
                PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8',
            ); 
            //$db = new PDO('mysql:host=bystorm.com.au;dbname=bystorm_dm1', 'bystorm_dm','bystorm_dm', $options);
            $db = new PDO('mysql:host=127.0.0.1;dbname=sail', 'root','', $options);
        } catch (Exception $e) {
            echo $e;
            return null;
        }
        return $db;  
    }
    
    public function RunSQL($sql){
        $db = $this->PrepareDB();
        $result = $db->query($sql)->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }
    
    public function ExecuteSQL($sql){
        $db = $this->PrepareDB();
        $stmt = $db->prepare($sql);
        $stmt->execute();
    }
    
    public function RunSP($param, $filters){
        return $this->CallSP('ExecuteSQL', $param, $filters);
    }
	
	public function CallSP($name, $param, $filters){
        $db = $this->PrepareDB();
        
        $stmt = $db->prepare('CALL '.$name.'(:Text, :Filters)');
        $stmt->bindParam('Text', $param, PDO::PARAM_STR);
        $stmt->bindParam('Filters', $filters, PDO::PARAM_STR);
        $stmt->execute();
        $result = $stmt->fetchAll();
        
        //$stmt->closeCursor();
        
        return $result;
        
    }
}
?>