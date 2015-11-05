<?php
class Database {
    
    public function PrepareDB(){
        try {
            $options = array(
                PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8',
            ); 
            
            $db = new PDO('mysql:host=bystorm.com.au;dbname=bystorm_timeman', 'bystorm_timeman','T1m3M4n@123!', $options);
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
}
?>