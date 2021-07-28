<!doctype html>
<html class="no-js" lang="">

    <head>
        <meta charset="utf-8">
        <title></title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link rel="manifest" href="site.webmanifest">
        <link rel="apple-touch-icon" href="icon.png">
        <!-- Place favicon.ico in the root directory -->

        <link rel="stylesheet" href="css/normalize.css">
        <link rel="stylesheet" href="css/main.css">
        <link rel="stylesheet" type="text/css" href="js/vendor/datatables.min.css">

        <meta name="theme-color" content="#fafafa">

    </head>

    <body>

        <div id="root"></div>

        <script src="js/vendor/modernizr-3.8.0.min.js"></script>
        <script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
        <script>window.jQuery || document.write('<script src="js/vendor/jquery-3.4.1.min.js"><\/script>')</script>
        <script type="text/javascript" src="js/vendor/mootools_core.js"></script>
        <script type="text/javascript" src="js/vendor/datatables.min.js"></script>
        <script type="text/javascript" src="js/themes/colors.js"></script>
        <script type="text/javascript" src="js/vendor/relast.js?<?php echo rand(); ?>"></script>
        <script src="js/plugins.js"></script>
        <script src="js/main.js?<?php echo rand(); ?>"></script>

        <script type="text/javascript">
            var app = Rapp.create_app("CMS", {
                name: "cms_app",
                bbox: "root"
            });
        </script>

    </body>

</html>
