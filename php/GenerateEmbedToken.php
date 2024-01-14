<?php

// Habilita o CORS do navegador
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");


// Recebe os parâmetros da requisição
$token = isset($_REQUEST['token']) ? $_REQUEST['token'] : "";
$datasetId = isset($_REQUEST['datasetId']) ? $_REQUEST['datasetId'] : "";
$reportId = isset($_REQUEST['reportId']) ? $_REQUEST['reportId'] : "";


// Monta o corpo da requisição
$body = "{
  \"datasets\": [
    {
      \"id\": \"{$datasetId}\"
    }
  ],
  \"reports\": [
    {
      \"allowEdit\": true,
      \"id\": \"{$reportId}\"
    }
  ]
}";


// Configura o cabeçalho da requisição
$headers = array(
    'Content-Type: application/json',
    'Authorization: Bearer ' . $token
);


// Inicializa o cURL
$curl = curl_init();


// Configura o cURL
curl_setopt_array($curl, array(
  CURLOPT_URL => 'https://api.powerbi.com/v1.0/myorg/GenerateToken',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'POST',
  CURLOPT_POSTFIELDS => $body,
  CURLOPT_HTTPHEADER => $headers,
));


// Executa o cURL
$response = curl_exec($curl);


// Fecha o cURL
curl_close($curl);


// Exibe o token de acesso
if ($response) {
    $json = json_decode($response);
    echo $json->token;
}