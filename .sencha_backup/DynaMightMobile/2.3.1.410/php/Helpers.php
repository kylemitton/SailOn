<?php

include_once('Business.php');
include_once('BusinessEntity.php');


class AJAXHelper {
    //put your code here
    public function getResponse(){
        $authUserToken ;
        $responseJson = "";
        $cmd = "";
        $objType = "";
        $objMethod = "";
        $objParams = "";
        $objSecurity = "";

        
        $cmd = $_REQUEST["command"];
        
        $cmd = str_replace('\\', '', $cmd);
        $test  = json_decode($cmd, true);
        $objType = $test["object"];
        $objMethod = $test["method"];
        $objParams = $test["params"];
        $objSecurity = $test["security"];
        //$authUserToken = $objSecurity["userToken"];
        
        //Instantiate the reflection object
        $objType = explode(".", $objType);
        $objType = $objType[0];
        //include_once($objType);
        $reflector = new ReflectionClass($objType);
        $reflectionMethod = new ReflectionMethod($objType, $objMethod);
        $response = $reflectionMethod->invoke($reflector->newInstance(), $objParams,'');

        return $response;
    }
}

class JSONHelper {
    
    public static function GetJson($table, $tablename){
        $str = "{ \"success\":  true , \"message\": true";
        return $str.", \"".$tablename."\": ".json_encode($table)."}";
    }
    
    public static function GetJsonFromTables($tablevalues, $tables){
        $str = "{ \"success\":  true , \"message\": true";
        $ret = $str;
        for($i = 0; $i < count($tables); ++$i) {
            $table = $tables[$i]; 
            $tablevalue = $tablevalues[$i];
            $ret = $ret.", \"".$table."\": ".json_encode($tablevalue);
        }
        return $ret."}";
    }
}

class SqlHelper {
    public static function GetValues($arr, $bo){
        $ret = '';
        for($i = 0; $i < count($arr); ++$i) {
            $field = $arr[$i]; 
            $ret = $ret.($bo[$field] != null ? '"'.$bo[$field].'"' : 'null');
            $ret = $ret.($i + 1 == count($arr) ? "" : ",");
        }
        return $ret;
    }
    
    public static function GetUpdates($arr, $bo){
        $ret = '';
        for($i = 0; $i < count($arr); ++$i) {
            $field = $arr[$i]; 
            $ret = $ret.$field.' = '.($bo[$field] != null ? '"'.$bo[$field].'"' : 'null');
            $ret = $ret.($i + 1 == count($arr) ? "" : ",");
        }
        return $ret;
    }
    
    public static function GetFilters($arr, $val){
        $ret = '1=0';
        for($i = 0; $i < count($arr); ++$i) {
            $field = $arr[$i]; 
            $ret = $ret.' OR '.$field.' LIKE "%'.$val.'%"';
        }
        return $ret;
    }
    
    public static function CreateFilters($filter, $field, $fields){
        return $filter != null ?
                    ($field != null && $field != "All" ? 
                        ' AND '.$field.' LIKE "%'.$filter.'%"' :
                        " AND (".SqlHelper::GetFilters(explode(",", $fields), $filter).")"
                    ) 
                    : "";
    }
    
    public static function GetSqlFromRows($fields, $rows, $table, $fk, $fkVal, $idField){
        $sql = ''; $values = '';
        for($i = 0; $i < count($rows); ++$i) {
            $row = $rows[$i]; 
            if($fk){
                $row[$fk] = $fkVal;
            }
            if($idField){
                $row[$idField] = UUID::newID();
            }
            $values = SqlHelper::GetValues(explode(",", $fields), $row);;
            $sql .= 'INSERT INTO '.$table.'('.$fields.') VALUES('.$values.');';
        
        }
        return $sql;
    }
    
    public static function PrepareSQL($values, $sql){
        
        for($i = 0; $i < count($values); ++$i) {
            $a = array_keys($values);
            $field = $a[$i];
            
            if(strrpos($sql, $field) >= 0){
                $sql = str_replace('{'.$field.'}', $values[$field], $sql);
            }        
        }
        return $sql;
    }
}


class UUID {
  public static function newID($namespace = '') {     
    static $guid = '';
    $uid = uniqid("", true);
    $data = $namespace;
    $data .= $_SERVER['REQUEST_TIME'];
    $data .= $_SERVER['HTTP_USER_AGENT'];
    $data .= $_SERVER['LOCAL_ADDR'];
    $data .= $_SERVER['LOCAL_PORT'];
    $data .= $_SERVER['REMOTE_ADDR'];
    $data .= $_SERVER['REMOTE_PORT'];
    $hash = strtoupper(hash('ripemd128', $uid . $guid . md5($data)));
    $guid = '{' .   
            substr($hash,  0,  8) . 
            '-' .
            substr($hash,  8,  4) .
            '-' .
            substr($hash, 12,  4) .
            '-' .
            substr($hash, 16,  4) .
            '-' .
            substr($hash, 20, 12) .
            '}';
    return $guid;
  }
}


?>
