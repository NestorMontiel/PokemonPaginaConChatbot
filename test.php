<?php
if (function_exists('curl_init')) {
    echo "¡cURL está funcionando correctamente!";
} else {
    echo "cURL NO está cargado. Revisa tus logs de error.";
}
?>