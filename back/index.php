<?php


include_once("conf/conf.php");
include_once("conf/db/mysql_conn.php");
include_once("conf/tools.php");

$args = $_POST;

$o = array();
$o["error"] = false;
if(isset($args["addon"]) && isset($args["cmd"]))
{

	$cmd = $args["cmd"];
	$i = $args["i"];
	$i = json_decode($i, true);

	include_once("addons/".$args["addon"].".php");

	$o["message"] = "1";
}else if(isset($args["cmd"]))
{
	$o["error"] = true;
	$o["message"] = "0";
}


echo json_encode($o);
die();


?>