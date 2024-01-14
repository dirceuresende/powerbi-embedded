<?php

// Habilita o CORS do navegador
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");


// Importa o arquivo com as credenciais do Power BI
require_once("Credentials.php");
$credentials = new Credentials();


// Obtém as credenciais do Power BI a partir do arquivo Credentials.php
$tenant_name = $credentials->getTenantName();
$client_id = $credentials->getClient_Id();
$client_secret = $credentials->getClient_Secret();


// Monta o corpo da requisição
$body = array(
  'client_id' => $client_id,
  'grant_type' => 'client_credentials',
  'resource' => 'https://analysis.windows.net/powerbi/api',
  'client_secret' => $client_secret
);


// Inicializa o cURL
$curl = curl_init();


// Configura o cURL
curl_setopt_array($curl, array(
  CURLOPT_URL => "https://login.microsoftonline.com/$tenant_name/oauth2/token",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'POST',
  CURLOPT_POSTFIELDS => $body,
));


// Executa o cURL
$response = curl_exec($curl);


// Fecha o cURL
curl_close($curl);


// Exibe o token de acesso
if ($response) {
    $json = json_decode($response);
    echo $json->access_token;
}


