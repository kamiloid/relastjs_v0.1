<?php

include("conf/conf.php");
include("conf/db/mysql_conn.php");


include("queries/user_queries.php");

$query = get_users_list();
var_dump($query);



?>

<table id="aaa"></table>

<script type="text/javascript" src="../js/vendor/jquery-3.4.1.min.js"></script>
<script type="text/javascript" src="../js/vendor/mootools_core.js"></script>
<script type="text/javascript" src="../js/vendor/mochi_test.js"></script>
<script type="text/javascript" src="../js/vendor/datatables.min.js"></script>
<script type="text/javascript">
	window.onload = function()
	{
		var data = JSON.parse(`<?php echo json_encode($query);?>`);
		$("#aaa").DataTable({
			data: data,
			columns: [
				{data: "name"}
			]
		});
	}
</script>