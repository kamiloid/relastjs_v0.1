<?php


if($cmd == "get_form_data")
{
	include("queries/user_queries.php");

	$types = get_types();
	$scopes = get_scopes();
	$doc_types = get_document_types();

	$o["form_data"] = array("types"=>$types, "scopes"=>$scopes, "doc_types"=>$doc_types);

}


else 



if($cmd == "save_userform")
{
	include("queries/user_queries.php");

	$i["last_name"] = $i["lastname"];
	unset($i["lastname"]);
	$i["doc_type"] = $i["doctype"];
	unset($i["doctype"]);
	$i["add_phones"] = $i["phone2"];
	unset($i["phone2"]);
	$i["date_crea"] = $_datetime;
	$i["who_crea"] = $session["token"];
	$resp = insert_user($i);
	$o["id"] = $resp["id"];
	$o["error"] = $o["id"] == 0 ? true : false;
}


else 



if($cmd == "get_users")
{
	include("queries/user_queries.php");

	$o["users"] = get_users_list();
}






?>