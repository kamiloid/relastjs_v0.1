<?php


$host = $mochi_db["host"];
$user = $mochi_db["user"];
$pw = $mochi_db["pw"];
$strdb = $mochi_db["strdb"];

$php_v = phpversion();
$php_v = explode(".", $php_v);

$mysqli = intval($php_v[0]) >= 7 ? true : false;


$db = $mysqli ? new mysqli($host, $user, $pw, $strdb) : mysql_connect($host, $user, $pw);



function select($data)
{
	/*
	data:
		- debug (return query form) bool
		- t (table) string[ table name ]
		- f (fields) string[ fields list ]
		- w (where) string[ condition query ]
		- g (grouṕ by) string[ group fields ]
		- o (order by) string[ order field ]
		- l (limit) int[ limit number ]
		- j (join) Array[ type: INNER|LEFT|RIGHT|FULL OUTER, t: table, on: field1 = field2  ]
	*/
	global $db, $mysqli;

	$array = array();

	$join = $joinc = "";
	if(isset($data["j"]))
	{
		foreach ($data["j"] as $key => $value) 
		{
			$join .= $joinc.( strtoupper( $value["type"]))." JOIN `".$value["t"]."` ".$value["as"]." on ".$value["on"];
			$joinc = " ";
		}
	}


	$q = "SELECT ".( isset($data["f"]) ? ($data["f"] != NULL ? $data["f"] : "*") : "*" )." FROM `".$data["t"]."` ".( isset($data["as"]) ? ($data["as"] != NULL ? "as `".$data["as"]."`" : "") : "" )." ".$join." ".( isset($data["w"]) ? ($data["w"] != NULL ? "WHERE ".$data["w"] : "") : "" )." ".(isset($data["g"]) ? ( $data["g"] != NULL ? "GROUP BY ".$data["g"] : "" ) : "" )." ORDER BY ".(isset($data["o"]) ? ( $data["o"] != NULL ? $data["o"] : " ".( isset($data["as"]) ? ($data["as"] != NULL ? " `".$data["as"]."`." : "") : "" )."`id` ASC" ) : " ".( isset($data["as"]) ? ($data["as"] != NULL ? " `".$data["as"]."`." : "") : "" )."`id` ASC" )." ".(isset($data["l"]) ? ( $data["l"] != NULL ? "LIMIT ".$data["l"] : "" ) : "" ).";";
//echo $q."<br><br>";
	if(isset($data["debug"]))
		if($data["debug"])
			array_push($array, $q);

	$q = $mysqli ? $db->query($q) : mysql_query($q);
	$fields = $mysqli ? $q->fetch_fields() : mysql_fields($q);

	while($r = $mysqli ? $q->fetch_array() : mysql_fetch_array($q))
	{
		$row = array();
		foreach ($fields as $key => $value)
		{
			$row[$value->{"name"}] = $r[$value->{"name"}];
		}
		array_push($array, $row);
	}

	if($mysqli)
		$q->close();

	return $array;
}


function table_exist($data)
{
	global $db, $mysqli, $strdb;

	$q = "SELECT * 
			FROM information_schema.tables
			WHERE table_schema = '".$strdb."'
			    AND table_name = '".$data['t']."'
			LIMIT 1;";

	$q = $mysqli ? $db->query($q) : mysql_query($q);
	return intval($q->{"num_rows"}) > 0 ? true : false;
}



function insert($data)
{
	/*
	data:
		- debug (return query form) bool
		- t (table) string[ table name ]
		- f (fields) array[ "field"=>"value" ]
	*/
	global $db, $mysqli;

	$f = $coma = $v = "";
	foreach ($data["f"] as $key => $value) 
	{
		$f .= $coma."`".$key."`";
		$v .= $coma."'".$value."'";
		$coma = ",";
	}

	$qstr = "INSERT INTO `".$data["t"]."` (".$f.") VALUES (".$v.");";

	$q = $mysqli ? $db->query($qstr) : mysql_query($qstr);
	$id = $mysqli ? $db->insert_id : mysql_insert_id();

	$resp = array("id"=>$id);
	if(isset($data["debug"]))
		if($data["debug"])
			$resp["query"] = $qstr;

	return $resp;
}

function insert2($data)
{
	global $db, $mysqli;

	$q = "INSERT INTO `".$data["t"]."` (".$data["f"].") VALUES (".$data["v"].");";
	$q = $mysqli ? $db->query($q) : mysql_query($q);
	$id = $mysqli ? $db->insert_id : mysql_insert_id();

	return $id;
}



function update($data)
{
	global $db, $mysqli;

	$f = $coma = $v = "";
	foreach ($data["f"] as $key => $value) 
	{
		$f .= $coma."`".$key."` = '".$value."'";
		$coma = ",";
	}

	$q = "UPDATE `".$data["t"]."` SET ".$f." WHERE ".$data["w"].";";
	$q = $mysqli ? $db->query($q) : mysql_query($q);

	return $q;
}








?>