<?php


$_datetime = date("Y-m-d H:i:s");
$_date = date("Y-m-d");



function uid($l=49)
{
	return strtoupper(substr(md5(time()), 0, $l));
}


?>