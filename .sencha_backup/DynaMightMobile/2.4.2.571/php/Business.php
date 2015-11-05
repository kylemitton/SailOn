<?php

include_once('Database.php');

class Business {
    
    public function Login($user) {
        $sql = ' SELECT  * ' .
                ' FROM sysuser U ' .
                ' WHERE U.username = "' . $user["user"] . '" and U.password = md5("' . $user["password"] . '")';
        $db = new Database();
        $result = $db->RunSQL($sql);
        
        // NOT LOGGED IN
        if (count($result) != 1) {
            return JSONHelper::GetJSON($result, 'user');
        }
        
        $tables = array('user', 'menu', 'properties', 'fields','configurations','entities');
        $tablesValues = array($result);
        
        //entity view
        $sql = 'SELECT EV.*, E.name as entityname,PP.name as parentpropertyname, CP.name as childpropertyname'
                . ', INSTR(P.views, Concat(REPLACE(EV.name," ",""),","))  as permission'
                . ' FROM sysentityview EV '
                . ' LEFT JOIN sysentity E ON EV.entityid = E.entityid '
                . ' LEFT JOIN sysentityview EVL ON EVL.childentityviewid = EV.entityviewid '
                . ' LEFT JOIN sysentityrelationship R ON R.parententityid = EVL.entityid AND R.childentityid = EV.entityid'
                . ' LEFT JOIN sysproperty PP ON PP.propertyid = R.parentpropertyid'                
                . ' LEFT JOIN sysproperty CP ON CP.propertyid = R.childpropertyid,'
                . ' (   SELECT GROUP_CONCAT(REPLACE(script, " ", ""), ",") as views'
                . '     FROM sysuserrole UR '
                . '         INNER JOIN sysrole R ON UR.roleid = R.roleid'
                . '         INNER JOIN sysrolepermission RP ON RP.roleid = R.roleid '
                . '         INNER JOIN syspermission P ON RP.permissionid = P.permissionid '
                . '     WHERE UR.userid = "'.$result[0]['userid'].'" AND P.type = "menu") P'
                . ' ORDER BY COALESCE(EV.priority,1000) ASC';
        //echo $sql;
        $result = $db->RunSQL($sql);
        array_push($tablesValues, $result);
        
        //relationship
        $sql = 'SELECT R.*,PC.name as childname, P.name as parentname, E.name as entityname '
                . ' FROM sysentityrelationship R '
                . ' INNER JOIN sysentity E ON R.parententityid = E.entityid'
                . ' INNER JOIN sysproperty P ON R.parentpropertyid = P.propertyid'
                . ' INNER JOIN sysproperty PC ON R.childpropertyid = PC.propertyid';
        $result = $db->RunSQL($sql);
        array_push($tablesValues, $result);
        
        //properties
        $sql = 'SELECT * FROM sysproperty P ';
        $result = $db->RunSQL($sql);
        array_push($tablesValues, $result);
        
        //configurations
        $sql = 'SELECT * FROM sysconfiguration';
        $result = $db->RunSQL($sql);
        array_push($tablesValues, $result);
        
        //entities
        $sql = 'SELECT * FROM sysentity';
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
    
    public function SaveRaceSeries($bo){
        $id = UUID::newID();
        $rsId = UUID::newID();
        
        $allFields = $bo['fields'];
        
        $series = $bo['series'];
        $divisions = $bo['divisions'];
        $races = $bo['races'];
        $raceSeriesDivisions = $bo['raceSeriesDivisions'];

        
        $sql = 'START TRANSACTION;';
        
        $series["raceseriesid"] = $id;
        $series["raceseriessponsorid"] = $rsId;
        
        $values = SqlHelper::GetValues(explode(",", $allFields[0]), $series);
        $sql .= 'INSERT INTO raceseries('.$allFields[0].') VALUES('.$values.');';
        //$sql .= SqlHelper::GetSqlFromRows($allFields[1], $races, 'Division');
        $sql .= SqlHelper::GetSqlFromRows($allFields[2], $races, 'race', 'raceseriesid', $id, 'raceid');
        $sql .= SqlHelper::GetSqlFromRows($allFields[3], $raceSeriesDivisions, 'raceseriesdivision', 'raceseriesid', $id, 'raceseriesdivisionid');
        $values = SqlHelper::GetValues(explode(",", $allFields[4]), $series);
        $sql .= 'INSERT INTO raceseriessponsor('.$allFields[4].') VALUES('.$values.');';
        
        $sql .= 'COMMIT;';
        //echo $sql;
        
        $db = new Database();
        $db->ExecuteSQL($sql);
        
        return JSONHelper::GetJSON(array(), 'result');
    }
    
    public function BoatLogin($boat) {
        $db = new Database();
        $tables = array('boat', 'races');
        
        $sql = ' SELECT  B.*, C.ya ' .
                ' FROM boat B '
                . ' LEFT JOIN crewmember C on C.crewmemberboatid = B.boatid'
                .' WHERE B.hullnumber = "' . $boat["name"] . '" and B.password = "' . $boat["password"] . '"';
        
        $result = $db->RunSQL($sql);
        $tablesValues = array($result);
        
        //races
        $sql =  'select * from race order by startdate asc';
        $result = $db->RunSQL($sql);
        array_push($tablesValues, $result);
        
        $ret = JSONHelper::GetJsonFromTables($tablesValues, $tables);
        return $ret;
        
    }
    
    public function BoatSeries($boatId) {
        $db = new Database();
        
        $tables = array('boatentries', 'availableseries', 'registeredraces');
        
        //boat entries
        $sql =  'select rsb.*, rs.name as raceseriesname,rs.earlieststarttime,'
                . ' b.name as boatname, rs.entrycost, rs.raceentrycost,fr.path, rs.description'
                . ' from raceseriesboat rsb'
                . ' inner join raceseries rs on rs.raceseriesid = rsb.raceseriesid'
                . ' left join sysfileresource fr on rs.fileresourceid = fr.fileresourceid'
                . ' inner join boat b on b.boatid = rsb.boatid'
                . ' where rsb.boatid = "'.$boatId.'"';
        $result = $db->RunSQL($sql);
        $tablesValues = array($result);

        //series not applied for
        $sql =  'select rs.*,fr.path from raceseries rs '
                . ' left join sysfileresource fr on rs.fileresourceid = fr.fileresourceid'
                . ' where rs.raceseriesid not in (select raceseriesid from raceseriesboat where boatid = "'.$boatId.'")';
        $result = $db->RunSQL($sql);
        array_push($tablesValues, $result);
        
         //races
        $sql =  'select rb.*, r.raceseriesid, r.name as rname'
                . ' from raceboat rb'
                . ' inner join race r on r.raceid = rb.raceid'
                . ' where rb.boatid = "'.$boatId.'" order by r.startdate asc';
        $result = $db->RunSQL($sql);
        array_push($tablesValues, $result);
       
         
        $ret = JSONHelper::GetJsonFromTables($tablesValues, $tables);
        return $ret;
        
    }
    
    public function SaveBoatSeries($bo) {
        $db = new Database();
        
        //races
        $id = UUID::newID();
        $bo['raceseriesboatid'] = $id;
        $bo['status'] = 'New';
                
        $sql =  SqlHelper::PrepareSQL($bo, 'insert into raceseriesboat(raceseriesboatid, raceseriesid, boatid, status, type)'
                . ' values("{raceseriesboatid}", "{raceseriesid}", "{boatid}", "{status}", "{type}")');
        $db->RunSQL($sql);
        
        $ret = JSONHelper::GetJSON(array("raceseriesboatid" => $id), 'result');
        return $ret;
        
    }
    
    public function SaveBoatRaces($bo){
        $races = $bo['boatraces'];
        $divisions = $bo['divisions'];
        
        $fields = 'raceboatid,raceid,boatid,divisionid,crewmemberid';
        
        $sql = 'START TRANSACTION;';
        $sql .= 'DELETE FROM raceboat'
                . ' WHERE boatid = "'.$bo['boatid'].'" and raceid in'
                . '      (select raceid from race where raceseriesid = "'.$bo['raceseriesid'].'");';
        
         for ( $i=0; $i < count($divisions);$i++) {
            $d = $divisions[$i];
            $sql .= SqlHelper::GetSqlFromRows($fields, $races, 'raceboat', 'divisionid', $d['divisionid'], 'raceboatid');
        }
        
       
        $sql .= 'COMMIT;';
        //echo $sql;
        
        $db = new Database();
        $db->ExecuteSQL($sql);
        
        return JSONHelper::GetJSON(array(), 'result');
    }
    
    public function UpdateSkipper($bo){
        $id = UUID::newID();
        
        if($bo['crewmemberid']){
            $sql =  SqlHelper::PrepareSQL($bo, 'update crewmember '
                . ' set firstname="{firstname}",surname="{surname}",'
                . 'email="{email}",mobilenumber="{mobilenumber}"'
                . ' where crewmemberid = "{crewmemberid}"');
        }
        else{
            $sql =  SqlHelper::PrepareSQL($bo, 'insert into crewmember (crewmemberid, ya, firstname,surname,email,mobilenumber, crewmemberboatid)'
                . ' values ("'.$id.'", "{ya}","{firstname}","{surname}","{email}","{mobilenumber}","{raceseriesboatid}")');
        }
        //echo $sql;
        
        $db = new Database();
        $db->ExecuteSQL($sql);
        
        return JSONHelper::GetJSON(array(), 'result');
    }
    
    public function SaveBoat($bo){
        $bo['boatid'] = UUID::newID();;
        
        $fields = $bo["EntityFields"]; 
        $values = SqlHelper::GetValues(explode(",", $fields), $bo);
        $sql = 'INSERT INTO boat('.$fields.')'
                . ' VALUES('.$values.')';
           
        
        $db = new Database();
        $db->ExecuteSQL($sql);
        
        return JSONHelper::GetJSON(array('boatid' => $bo['boatid']), 'result');
    }
    
    public function SignOnOff($bo){
        $id = UUID::newID();;
        if($bo['type'] == 'on') {
            $sql = 'UPDATE  raceboat'
                    . ' SET firstname = "'.$bo['firstname'].'", lastname = "'.$bo['lastname'].'", signondate = '.($bo['type'] == 'on' ? 'now()' : 'null')
                    . ' WHERE boatid = "'.$bo['boatid'].'" and raceid  = "'.$bo['raceid'].'";';
         }  
         elseif($bo['type'] == 'off') {
            $sql = 'UPDATE  raceboat'
                . ' SET signofffirstname = "'.$bo['firstname'].'", signofflastname = "'.$bo['lastname'].'",signondate = null, signoffdate = now(), signoffproppercourse = "'.$bo['propper'].'", signoffcode = "'.$bo['code'].'", retired = "'.$bo['retired']
                . '" WHERE boatid = "'.$bo['boatid'].'" and raceid  = "'.$bo['raceid'].'";';
         }
        $db = new Database();
        $db->ExecuteSQL($sql);
        
        return JSONHelper::GetJSON(array(), 'result');
    }

    public function UndoSignOff($bo){
        $id = UUID::newID();
        $sql = 'UPDATE  raceboat'
                . ' SET signofffirstname = "'.$bo['firstname'].'", signofflastname = "'.$bo['lastname'].'",signondate = null, signoffdate = null, signoffproppercourse = "'.$bo['propper'].'", signoffcode = "'.$bo['code'].'", retired = "'.$bo['retired']
                . '" WHERE boatid = "'.$bo['boatid'].'" and raceid  = "'.$bo['raceid'].'";';
         
        $db = new Database();
        $db->ExecuteSQL($sql);
        
        return JSONHelper::GetJSON(array(), 'result');
    }
	
	public function SignOffUndoSignOff($bo){
        $id = UUID::newID();;
        
        $sql = 'UPDATE  raceboat'
                . ' SET boatstatusid = '.($bo['type'] == 'off' ? '"'.$bo["boatstatusid"].'"' : 'null')
                . ' WHERE boatid = "'.$bo['boatid'].'" and raceid  = "'.$bo['raceid'].'";';
         
        $db = new Database();
        $db->ExecuteSQL($sql);
        
        return JSONHelper::GetJSON(array(), 'result');
    }

    
    public function SaveDivision($bo){
        $id = UUID::newID();
        //$fields = 'name,group,handicaptype,handicapvalue'; 
        //$values = SqlHelper::GetValues(explode(",", $fields), $bo);
        
        if($bo['divisionid'] != null){
            $sql = 'update division set description = "'.$bo['description'].'", name = "'.$bo['name'].'", groupname = "'.$bo['group'].'", handicaptype = "'.$bo['handicaptype'].'", handicapvalue = "'.$bo['handicapvalue'].'" where divisionid = "'.$bo['divisionid'].'"';
        }
        else{
            $sql = 'insert into division(divisionid, name, groupname, handicaptype, handicapvalue) VALUES("'.$id.'","'.$bo['name'].'","'.$bo['group'].'","'.$bo['handicaptype'].'","'.$bo['handicapvalue'].'")';
        }
           
        
        $db = new Database();
        $db->ExecuteSQL($sql);
        
        return JSONHelper::GetJSON(array(), 'result');
    }
    
    public function SaveStart($bo){
        $id = UUID::newID();
        
        for ( $i=0; $i < count($bo);$i++) {
            $b = $bo[$i];
            $sql .= SqlHelper::PrepareSQL($b, 
                'update raceseriesdivision set starttime = "{starttime}" '
                . 'where raceseriesid = "{raceseriesid}" and divisionid = "{divisionid}" and raceid = "{raceid}";');
        }
        
        
        //echo $sql;
        $db = new Database();
        $db->ExecuteSQL($sql);
        
        return JSONHelper::GetJSON($id, 'result');
    }
    
    public function SaveFinish($bo){
        $db = new Database();
		
		$boatraces = $bo['raceboat'];
        
        $races = $bo['races'];
         
        $sql = 'START TRANSACTION;';
        
        for ( $i=0; $i < count($boatraces);$i++) {
            $br = $boatraces[$i];
			$sql .= 'UPDATE  raceboat'
               . ' SET boatstatusid = '.($br['boatstatusid'] != null ? '"'.$br['boatstatusid'].'"' : 'null')
               .', endtime  = '.($br['boatstatusid'] == null ? '"'.$br['endtime'].'"' : 'null')
               . ' WHERE boatid = "'.$br['boatid'].'" and raceid  = "'.$br['raceid'].'";';
        }
        
        for ( $i=0; $i < count($races);$i++) {
            $r = $races[$i];
            $sql .= 'UPDATE  race'
                . ' SET status = "'.$r['status'].'" WHERE raceid  = "'.$r['raceid'].'";' ;
				// .' DELETE rr FROM raceresult rr inner join raceboat rb on rr.raceboatid = rb.raceboatid WHERE rb.raceid  = "'.$r['raceid'].'";';
        }
        
        $sql .= 'COMMIT;';
        $db->ExecuteSQL($sql);
		
		for ( $i=0; $i < count($boatraces);$i++) {
            $br = $boatraces[$i];
			
        }
		
		return JSONHelper::GetJSON(array(), 'result');
    }
    
    public function SaveHandicap($bo){
        $sql = '';
        
        for ($i = 0; $i < count($bo['raceboats']);$i++) {
            $b = $bo['raceboats'][$i];
            
            foreach($b as $key => $value) {
                $sql .= 'UPDATE  raceboat'
                    . ' SET handicap = "'. $b[$key]
                . '" WHERE boatid = "'.$b['boatid'].'" and raceid  = "'.$key.'";';
            }
        }
        
        $db = new Database();
        $result = $db->ExecuteSQL($sql);
        
        return JSONHelper::GetJSON(array(), 'result');
    }
	
    public function SetRaceBoatCrewMemberId($bo){
        $sql = '';
        
        for ($i = 0; $i < count($bo);$i++) {
            $b = $bo[$i];
            
             $sql .= ' UPDATE  raceboat'
                . ' SET crewmemberid = "'. $b['crewmemberid']
            . '" WHERE  boatid = "'.$b['boatid'].'" and raceid  = "'.$b['raceid'].'";';
            
        }
        
        $db = new Database();
        $result = $db->ExecuteSQL($sql);
        
        return JSONHelper::GetJSON(array(), 'result');
    }
	
    public function SetRaceMessage($bo){
        $sql = '';
        
        for ($i = 0; $i < count($bo);$i++) {
            $b = $bo[$i];
            $newID = UUID::newID();
            $sql .= 'INSERT INTO racemessage(`racemessageid`,`createddate`,`message`,`priority`,`raceid`)'
                . ' values("'.$newID.'", now(), "'.$b['message'].'", "1", "'.$b['raceid'].'");';
     
        }
        
        $db = new Database();
        $result = $db->ExecuteSQL($sql);
        
        return JSONHelper::GetJSON(array(), 'result');
    }
	
    public function SetRaceCrewDuty($bo){
        $sql = '';
        
        for ($i = 0; $i < count($bo);$i++) {
            $b = $bo[$i];
            $newID = UUID::newID();
            $sql .= 'INSERT INTO raceduty(`racedutyid`,`createddate`,`dutytypeid`,`crewmemberid`,`raceid`)'
                . ' values("'.$newID.'", now(), "'.$b['dutytypeid'].'", "'.$b['crewmemberid'].'", "'.$b['raceid'].'");';
     
        }
        
        $db = new Database();
        $result = $db->ExecuteSQL($sql);
        
        return JSONHelper::GetJSON(array(), 'result');
    }
	
    public function SyncRaceStartLS($bo){
        $sql = '';
        
        for ($i = 0; $i < count($bo['raceseriesdivision']);$i++) {
            $b = $bo['raceseriesdivision'][$i];
            
            $sql .= ' UPDATE  raceseriesdivision'
                . ' SET starttime = "'. $b['starttime']
            . '" WHERE raceseriesdivisionid = "'.$b['raceseriesdivisionid'].'";';
            
        }
        
        $db = new Database();
        $result = $db->ExecuteSQL($sql);
        
        return JSONHelper::GetJSON(array(), 'result');
    }
    
	public function SaveResult($bo){
		$db = new Database();
        if($bo['status'] != null)
			$sql = 'update raceboat rb set boatstatusid = "'.$bo['status'].'", handicap = "'.$bo['handicap'].'", endtime = null where raceboatid = "'.$bo['raceboatid'].'";';
        else
			$sql = 'update raceboat rb set boatstatusid = null, endtime = "'.$bo['endtime'].'", handicap = "'.$bo['handicap'].'" where raceboatid = "'.$bo['raceboatid'].'";';
        /*
		if($bo['raceresultid'] == null){
			$sql.= 'insert into raceresult(raceresultid, raceboatid) values(uuid(), "'.$bo['raceboatid'].'");';
		}
        */
        //echo $sql;
        $result = $db->ExecuteSQL($sql);
        
        return $this->CalculateResults($bo);
    }
	
	public function CalculateResults($bo){
		$db = new Database();
        
		$db->CallSP('RunSQL', 'RR_Fill', ' WHERE (rb.endtime is not null or rb.boatstatusid is not null) and r.raceid  = "'.$bo['raceid'].'"');        
		
		$db->CallSP('RunSQL', 'RR_Update', ' WHERE rb.raceid = "'.$bo['raceid'].'"');
		
		$db->CallSP('RunSQL', 'RR_UpdateScore', ' WHERE raceid = "'.$bo['raceid'].'"');

        $this->UpdateDNFCode($bo['raceid']);
		
		return JSONHelper::GetJSON(array(), 'result');
    }
    
    function startsWith($haystack, $needle){
         $length = strlen($needle);
         return (substr($haystack, 0, $length) === $needle);
    }
	
	public function AddResult($bo){
		$db = new Database();
        
		if($bo['raceresultid'] == null){
			$sql.= 'insert into raceresult(raceresultid, raceboatid) values(uuid(), "'.$bo['raceboatid']
			.'");update raceboat set endtime = now() where raceboatid = "'.$bo['raceboatid'].'"';
		}
        
        //echo $sql;
        $result = $db->ExecuteSQL($sql);
        
        return $this->CalculateResults($bo);
    }

    public function UpdateDNFCode($bo){
        
        $sql =  'SELECT rb.raceboatid, bs.formula as formula, rb.divisionid FROM raceboat rb INNER JOIN boatstatus bs ON bs.boatstatusid = rb.boatstatusid WHERE length(rb.boatstatusid) > 0 AND raceid = "'.$bo.'"';
        $db = new Database();
        $result = $db->RunSQL($sql);

        foreach ($result as $boat) {
            if(strpos($boat['formula'], 'CountS') !== false) {
                $sql = 'SELECT COUNT(*) as c FROM raceboat WHERE signondate is not null AND raceid = "'.$bo.'" and divisionid = "'.$boat['divisionid'].'"';
                $result2 = $db->RunSQL($sql);
                $f = str_replace("CountS",$result2[0]['c'], $boat['formula']);
                $sql2 = 'UPDATE raceresult SET score = '.$f.' where raceboatid = "'.$boat['raceboatid'].'"';
                $result2 = $db->RunSQL($sql2);
            }
            if(strpos($boat['formula'], 'CountR') !== false) {
                $sql = 'SELECT COUNT(*) as c FROM raceboat WHERE signondate is not null AND raceid = "'.$bo.'" and divisionid = "'.$boat['divisionid'].'"';
                $result2 = $db->RunSQL($sql);
                $f = str_replace("CountR",$result2[0]['c'], $boat['formula']);
                $sql2 = 'UPDATE raceresult SET score = '.$f.' where raceboatid = "'.$boat['raceboatid'].'"';
                $result2 = $db->RunSQL($sql2);               
            }
            if(strpos($boat['formula'], 'CountFEx') !== false) {
                $sql = 'SELECT COUNT(*) as c FROM raceboat WHERE signondate is not null AND raceid = "'.$bo.'" and divisionid = "'.$boat['divisionid'].'"';
                $result2 = $db->RunSQL($sql);
                $f = str_replace("CountFex",$result2[0]['c'], $boat['formula']);
                $sql2 = 'UPDATE raceresult SET score = '.$f.' where raceboatid = "'.$boat['raceboatid'].'"';
                $result2 = $db->RunSQL($sql2);                
            }
            if(strpos($boat['formula'], 'CountFInc') !== false) {
                $sql = 'SELECT COUNT(*) as c FROM raceboat WHERE signondate is not null AND raceid = "'.$bo.'" and divisionid = "'.$boat['divisionid'].'"';
                $result2 = $db->RunSQL($sql);
                $f = str_replace("CountFInc",$result2[0]['c'], $boat['formula']);
                $sql2 = 'UPDATE raceresult SET score = '.$f.' where raceboatid = "'.$boat['raceboatid'].'"';
                $result2 = $db->RunSQL($sql2);               
            }
        }
        $ret = JSONHelper::GetJSON($result, 'records');
        return $ret;
    }

}
?>
