<?php
// Evitamos que errores de texto ensucien la respuesta JSON
error_reporting(0);
ini_set('display_errors', 0);
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);
$userInput = $input['userInput'] ?? '';

if (empty($userInput)) {
    echo json_encode(['error' => 'No hay mensaje del entrenador.']);
    exit;
}

// 1. Cargar contexto de tu guía (info.txt)
$context = file_exists('info.txt') ? file_get_contents('info.txt') : "Eres el Profesor Oak de Pokémon Rojo Fuego.";

// 2. Configuración de Groq (Obtén tu clave en console.groq.com)
$GROQ_API_KEY = "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";
$MODEL_URL = "https://api.groq.com/openai/v1/chat/completions";

$data = [
    'model' => 'llama-3.3-70b-versatile',
    'messages' => [
        [
            'role' => 'system', 
            'content' => "Eres el Profesor Oak de Pokémon Rojo Fuego. 
                          REGLA ESTRICTA: Solo responde preguntas relacionadas con Pokémon, la región de Kanto o la información en este texto: " . $context . ". 
                          Si el usuario pregunta algo que NO es de Pokémon (como política, cocina o matemáticas), responde EXACTAMENTE: '¡Hola! Soy un experto en Pokémon, no en eso. ¡Pregúntame algo sobre tu aventura!'." . $context
        ],
        [
            'role' => 'user', 
            'content' => $userInput
        ]
    ],
    'temperature' => 0.7
];

$ch = curl_init($MODEL_URL);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
// Solución para errores SSL en XAMPP
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); 
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $GROQ_API_KEY",
    "Content-Type: application/json"
]);

$response = curl_exec($ch);
$error = curl_error($ch);
curl_close($ch);

if ($error) {
    echo json_encode(['error' => $error]);
} else {
    echo $response;
}