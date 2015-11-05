<?php

include_once('Database.php');

class Business {
    
    public function Login($user) {
        $sql = ' SELECT  * ' .
                ' FROM sysuser U ' .
                ' WHERE U.username = "' . $user["user"] . '" and U.password = "' . $user["password"] . '"';
        $db = new Database();
        $result = $db->RunSQL($sql);
        
        // NOT LOGGED IN
        if (count($result) != 1) {
            return JSONHelper::GetJSON($result, 'user');
        }
        
        $tables = array('user', 'menu', 'properties', 'fields', 'configurations', 'resources');
        $tablesValues = array($result);
        //menu
        $sql = 'SELECT EV.*, E.name as entityname,  SP.name as menuname, P.permissionid as menugroupid '
                . ' FROM sysentityview EV '
                //. ' LEFT JOIN sysfileresource F ON EV.fileresourceid = F.fileresourceid '
                . ' left JOIN syspermissionview PV ON PV.entityviewid = EV.entityviewid '
                . ' left JOIN syspermission SP ON SP.permissionid = PV.permissionid '
                . ' LEFT JOIN sysentity E ON EV.entityid = E.entityid '
                . ' LEFT JOIN (SELECT P.permissionid   '
                . '     FROM sysuserrole UR '
                . '         INNER JOIN sysrole R ON UR.roleid = R.roleid'
                . '         INNER JOIN sysrolepermission RP ON RP.roleid = R.roleid '
                . '         INNER JOIN syspermission P ON RP.permissionid = P.permissionid '
                . '     WHERE UR.userid = "'.$result[0]['userid'].'" AND P.type = "menu"'
                . '     GROUP BY P.permissionid) P on P.permissionid = SP.permissionid'
                . ' ORDER BY SP.name,  EV.name asc';
                
         //echo $sql;       
        $result = $db->RunSQL($sql);
        array_push($tablesValues, $result);
        //relationships proprieties
        $sql = 'SELECT R.*,PC.name as childname, P.name as parentname, E.name as entityname '
                . ' FROM sysentityrelationship R '
                . ' INNER JOIN sysentity E ON R.parententityid = E.EntityID'
                . ' INNER JOIN sysproperty P ON R.parentpropertyid = P.propertyid'
                . ' INNER JOIN sysproperty PC ON R.childpropertyid = PC.propertyid';
        $result = $db->RunSQL($sql);
        array_push($tablesValues, $result);
        //fields
        $sql = 'SELECT * FROM sysproperty P ORDER BY priority ASC';
        $result = $db->RunSQL($sql);
        array_push($tablesValues, $result);
        
        //fields
        $sql = 'SELECT * FROM sysconfiguration';
        $result = $db->RunSQL($sql);
        array_push($tablesValues, $result);
        
        //fields
        $sql = 'SELECT * FROM sysresource';
        $result = $db->RunSQL($sql);
        array_push($tablesValues, $result);
        
        $ret = JSONHelper::GetJsonFromTables($tablesValues, $tables);
        return $ret;
    }
    
    public function GetCustomFields($bo) {
        $sql = ' SELECT  * FROM CustomField WHERE Archive = 0'.
                ($bo["filter"] != null ? ' AND Name LIKE "%'.$bo["filter"].'%"' : ""); 
                
        $db = new Database();
        $result = $db->RunSQL($sql);
        $ret = JSONHelper::GetJSON($result, 'records');
        return $ret;
    }
    
    public function SaveCustomFields($customFields){
        $fields  = "Name,TableName,Description,Type,Config";
        $sql = "";
        
        
        for ( $i=0; $i < count($customFields);$i++) {
            
            $field = $customFields[$i];
            if ($field["sysrowstate"] == "0") {
                $values = SqlHelper::GetValues(explode(",", $fields), $field);
                $sql .= 'ALTER TABLE '.$field["TableName"].' ADD CF_'.$field["Name"].' VARCHAR( 255 );';
                $sql .= 'INSERT INTO CustomField('.$fields.') VALUES('.$values.');';
            }
            elseif ($field["sysrowstate"] == "1") {
                $sql .= 'UPDATE CustomField SET Description = "'.$field["Description"]
                        .'",Config = "'.$field["Config"]
                        .'" WHERE CFId = '.$field["CFId"].';';
            }
            elseif($field["sysrowstate"] == "2") {
                $sql .= 'UPDATE CustomField SET Archive = 1 WHERE CFId = '.$field["CFId"].';';
            }
            //$sql = str_replace("#".$i, $param, $sql);
        }
        $db = new Database();
        $result = $db->ExecuteSQL($sql);
        
        return JSONHelper::GetJSON(array(), 'records');
    }
}

?>
