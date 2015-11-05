<?php

include_once('Database.php');

class BusinessEntity {
    
    public function GetEntityView($param) {
        $db = new Database();
        $filters = isset($param["filter"]) ? $param["filter"] : '';
        $result = $db->RunSP($param["entityViewID"], $filters);
        $ret = JSONHelper::GetJSON($result, 'records');
        return $ret;
    }
    
    public function Delete($bo){
        $db = new Database();

        $sql = 'DELETE FROM '.$bo['EntityName'].' WHERE '.str_replace("sys", "", $bo["EntityName"]).'id = "'.$bo["ID"].'"';
        $result = $db->ExecuteSQL($sql);
//echo $sql;
        $entity = array(
            "entityViewID" => $bo["RefreshEntityViewID"]
        );
        return $this->GetEntityView($entity);
    }
    
    public function EditEntity($bo){
        $db = new Database();
        $newID = UUID::newID();
        $propertyID = UUID::newID();
        
        $ID = str_replace("sys", "", $bo["entityname"])."id";
        $ID_Field = str_replace("sys", "", $bo["name"])."id";
        
        //$sql = "START TRANSACTION;";
        if ($bo[$ID] != null) {
            $values = SqlHelper::GetUpdates(explode(",", $bo["EntityFields"]), $bo);;
            $sql .= 'UPDATE '.$bo["entityname"].' SET '.$values.' WHERE '.$ID.' = "'.$bo[$ID].'"';
			//echo $sql;
        }  else {
            //
            $fields = str_replace(",".$ID.",", ",", ",".$bo["EntityFields"].","); 
            $fields = substr($fields, 1, $fields.length - 1);
            $values = SqlHelper::GetValues(explode(",", $fields), $bo);;
            $sql .= 'INSERT INTO '.$bo["entityname"].'('.$ID.','.$fields
                    .') VALUES("'.$newID.'",'.$values.')';
            //echo $sql;
            //table
            if($bo["entityname"] == 'sysentity')
            {
                $sql .= ';INSERT INTO sysproperty(propertyid, entityid, name) VALUES("'.$propertyID.'","'.$newID.'", "'.$ID_Field.'")';
                $table = ';CREATE TABLE IF NOT EXISTS '.$bo["name"]
                        .'('.$ID_Field.' VARCHAR(100) NOT NULL, '
                        . ' createddate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, '
                        . 'PRIMARY KEY ('.$ID_Field.'))ENGINE = InnoDB';
                $sql .= $table;
                //echo $sql;
            }
            if($bo["entityname"] == 'sysproperty' && !$bo["isonlyview"])
            {
                $columnType = ' VARCHAR(255) NULL';
                if($bo["xtype"] == "numberfield"){
                    $columnType = ' INT NULL';
                } else if($bo["xtype"] == "datefield"){
                    $columnType = ' DATETIME NULL';
                } else if($bo["xtype"] == "textareafield"){
                    $columnType = ' TEXT NULL';
                } else if($bo["xtype"] == "checkboxfield"){
                    $columnType = ' BOOL NULL';
                }else if($bo["xtype"] == "htmleditor"){
                    $columnType = ' TEXT NULL';
                }
                $result = $db->RunSQL('SELECT name FROM sysentity WHERE entityid = "'.$bo["entityid"].'"');
                $table = ';ALTER TABLE '.$result[0]['name'].' ADD COLUMN '.$bo["name"].' '.$columnType;
                $sql .= $table;
            }
            
        }
        
        //$sql .= ';COMMIT;';
        //echo $sql;
        $entity = array(
            "entityViewID" => $bo["RefreshEntityViewID"]
        );
        $result = $db->ExecuteSQL($sql);
        return $this->GetEntityView($entity);
    }
    
    
}
?>