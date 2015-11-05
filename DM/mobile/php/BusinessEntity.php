<?php

include_once('Database.php');

class BusinessEntity {
    
    public function GetEntityView($param, $table) {
        $db = new Database();
        $result = $db->RunSP($param["entityViewID"],$param["filters"]);
        
        if($table){
            $tables = array('records', 'row');
            $tablesValues = array($result);
            array_push($tablesValues, $table);
            $ret = JSONHelper::GetJsonFromTables($tablesValues, $tables);
        }
        else{
            $ret = JSONHelper::GetJSON($result, 'records');
        }
        return $ret;
    }
    
    public function Delete($bo){
               
    }
    
    public function EditEntity($bo){
        $db = new Database();
        $newID = UUID::newID();
        $ID = str_replace("sys", "", $bo["EntityName"])."id";
        if ($bo[$ID] != null) {
            $values = SqlHelper::GetUpdates(explode(",", $bo["EntityFields"]), $bo);;
            $sql = 'UPDATE '.$bo["EntityName"].' SET '.$values.' WHERE '.$ID.' = "'.$bo[$ID].'"';
        }  else {
            //
            $fields = str_replace($ID.",", "", $bo["EntityFields"]); 
            $values = SqlHelper::GetValues(explode(",", $fields), $bo);
            $sql = 'INSERT INTO '.$bo["EntityName"].'('.$ID.','.$fields.')'
                    . ' VALUES("'.$newID.'",'.$values.')';
            
            //table
            if($bo["EntityName"] == 'sysentity')
            {
                $table = ';CREATE TABLE IF NOT EXISTS '.$bo["Name"].'('.$bo["Name"]
                        .'ID INT NOT NULL AUTO_INCREMENT, PRIMARY KEY ('.$bo["Name"].'ID))ENGINE = InnoDB';
                $sql .= $table;
            }
            if($bo["EntityName"] == 'sysproperty')
            {
                $result = $db->RunSQL('SELECT Name FROM SysEntity WHERE EntityID = '.$bo["EntityID"]);
                $table = ';ALTER TABLE '.$result[0]['Name'].' ADD COLUMN '.$bo["Name"].' VARCHAR(45) NULL ';
                $sql .= $table;
            }
            
        }
        
        
        $result = $db->ExecuteSQL($sql);
        
        return $this->GetEntityView($bo["RefreshEntityViewID"], array("id" => $newID));
    }
    
    
}
?>