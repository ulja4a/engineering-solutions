<?php

header('Content-Type: application/json; charset=utf-8');


// =========================================================
// НАСТРОЙКИ
// =========================================================

// Email, куда будут приходить заявки
$adminEmail = '9690101@ukr.net';


// Telegram Bot Token
$botToken = 'YOUR_BOT_TOKEN';


// Telegram Chat ID
$chatId = 'YOUR_CHAT_ID';


// =========================================================
// ПОЛУЧАЕМ ДАННЫЕ
// =========================================================

$name = trim($_POST['name'] ?? '');

$phone = trim($_POST['phone'] ?? '');

$formSource = trim($_POST['form_source'] ?? 'Форма сайту');

$pageTitle = trim($_POST['page_title'] ?? '');

$pageUrl = trim($_POST['page_url'] ?? '');

$pagePath = trim($_POST['page_path'] ?? '');


// =========================================================
// ПРОВЕРКА
// =========================================================

if ($name === '' || $phone === '') {

    echo json_encode([
        'success' => false,
        'message' => 'Будь ласка, заповніть усі поля.'
    ]);

    exit;
}


if (mb_strlen($name) < 2) {

    echo json_encode([
        'success' => false,
        'message' => 'Імʼя занадто коротке.'
    ]);

    exit;
}


// =========================================================
// ЗАЩИТА ОТ ПЕРЕНОСОВ СТРОК / HEADER INJECTION
// =========================================================

$name = str_replace(
    ["\r", "\n"],
    '',
    $name
);

$phone = str_replace(
    ["\r", "\n"],
    '',
    $phone
);

$formSource = str_replace(
    ["\r", "\n"],
    '',
    $formSource
);

$pageTitle = str_replace(
    ["\r", "\n"],
    '',
    $pageTitle
);


// =========================================================
// ТЕКСТ ЗАЯВКИ ДЛЯ EMAIL
// =========================================================

$message = "Нова заявка з сайту\n\n";

$message .= "Ім'я: " . $name . "\n";

$message .= "Телефон: " . $phone . "\n\n";

$message .= "Сторінка: " . $pageTitle . "\n";

$message .= "Форма: " . $formSource . "\n";

$message .= "URL: " . $pageUrl . "\n";

$message .= "Шлях: " . $pagePath . "\n";


// =========================================================
// EMAIL
// =========================================================

$emailSubject =
    'Нова заявка з сайту — ' . $formSource;


$emailHeaders = [];


// Получаем имя домена
$host = $_SERVER['HTTP_HOST'] ?? 'localhost';

// Убираем порт, если он есть
$host = preg_replace('/:\d+$/', '', $host);

// Защита от некорректного Host
$host = preg_replace(
    '/[^a-zA-Z0-9.\-]/',
    '',
    $host
);


// From
$emailHeaders[] =
    'From: noreply@' . $host;


// Кодировка
$emailHeaders[] =
    'Content-Type: text/plain; charset=UTF-8';


// Отправляем email
$emailSent = mail(
    $adminEmail,
    $emailSubject,
    $message,
    implode("\r\n", $emailHeaders)
);


// =========================================================
// TELEGRAM
// =========================================================

// Экранируем данные для HTML Telegram
$telegramName =
    htmlspecialchars(
        $name,
        ENT_QUOTES | ENT_SUBSTITUTE,
        'UTF-8'
    );

$telegramPhone =
    htmlspecialchars(
        $phone,
        ENT_QUOTES | ENT_SUBSTITUTE,
        'UTF-8'
    );

$telegramForm =
    htmlspecialchars(
        $formSource,
        ENT_QUOTES | ENT_SUBSTITUTE,
        'UTF-8'
    );

$telegramPage =
    htmlspecialchars(
        $pageTitle,
        ENT_QUOTES | ENT_SUBSTITUTE,
        'UTF-8'
    );

$telegramUrlText =
    htmlspecialchars(
        $pageUrl,
        ENT_QUOTES | ENT_SUBSTITUTE,
        'UTF-8'
    );


// Формируем сообщение
$telegramText =
    "📞 <b>Нова заявка</b>\n\n" .

    "👤 <b>Ім'я:</b> " .
    $telegramName . "\n" .

    "📱 <b>Телефон:</b> " .
    $telegramPhone . "\n\n" .

    "📄 <b>Сторінка:</b> " .
    $telegramPage . "\n" .

    "📝 <b>Форма:</b> " .
    $telegramForm . "\n\n" .

    "🔗 <b>URL:</b> " .
    $telegramUrlText;


// =========================================================
// TELEGRAM API
// =========================================================

$telegramUrl =
    "https://api.telegram.org/bot" .
    $botToken .
    "/sendMessage";


$telegramData = [

    'chat_id' => $chatId,

    'text' => $telegramText,

    'parse_mode' => 'HTML',

    'disable_web_page_preview' => true

];


// =========================================================
// CURL
// =========================================================

$ch = curl_init($telegramUrl);

curl_setopt(
    $ch,
    CURLOPT_POST,
    true
);

curl_setopt(
    $ch,
    CURLOPT_POSTFIELDS,
    http_build_query($telegramData)
);

curl_setopt(
    $ch,
    CURLOPT_RETURNTRANSFER,
    true
);

curl_setopt(
    $ch,
    CURLOPT_TIMEOUT,
    10
);


$telegramResponse =
    curl_exec($ch);


$telegramHttpCode =
    curl_getinfo(
        $ch,
        CURLINFO_HTTP_CODE
    );


curl_close($ch);


// =========================================================
// ПРОВЕРКА TELEGRAM
// =========================================================

$telegramResult =
    json_decode(
        $telegramResponse,
        true
    );


$telegramSent =
    $telegramHttpCode === 200 &&
    !empty($telegramResult['ok']);


// =========================================================
// РЕЗУЛЬТАТ
// =========================================================

if ($emailSent && $telegramSent) {

    echo json_encode([
        'success' => true
    ]);

    exit;
}


// =========================================================
// ЕСЛИ ЧТО-ТО НЕ ОТПРАВИЛОСЬ
// =========================================================

echo json_encode([

    'success' => false,

    'message' =>
        'Заявка не була відправлена. Спробуйте ще раз.'

]);

?>