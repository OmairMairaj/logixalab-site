<?php
/**
 * Contact form handler for Hostinger shared hosting (PHP mail).
 * The static Next.js build posts here via NEXT_PUBLIC_CONTACT_ENDPOINT=/contact.php
 *
 * Optional: copy contact-config.sample.php → contact-config.php and edit the recipient.
 */

header("Content-Type: application/json; charset=utf-8");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed."]);
    exit;
}

$configPath = __DIR__ . "/contact-config.php";
$config = file_exists($configPath) ? (require $configPath) : [];
$to = $config["to"] ?? "info@logixalab.com";

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);
if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid request body."]);
    exit;
}

$name = trim((string) ($data["name"] ?? ""));
$email = trim((string) ($data["email"] ?? ""));
$phone = trim((string) ($data["phone"] ?? ""));
$service = trim((string) ($data["service"] ?? ""));
$message = trim((string) ($data["message"] ?? ""));

if ($name === "" || $email === "" || $service === "") {
    http_response_code(400);
    echo json_encode(["error" => "Name, email, and service are required."]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["error" => "Please enter a valid email address."]);
    exit;
}

if (strlen($name) > 200 || strlen($email) > 320 || strlen($phone) > 60 || strlen($message) > 5000) {
    http_response_code(400);
    echo json_encode(["error" => "One of the fields is too long."]);
    exit;
}

$subject = "New inquiry — {$name} ({$service})";
$body = implode("\n", [
    "Name:    {$name}",
    "Email:   {$email}",
    "Phone:   " . ($phone !== "" ? $phone : "—"),
    "Service: {$service}",
    "",
    "Message:",
    $message !== "" ? $message : "—",
]);

$headers = [
    "From: LogixaLab Website <noreply@" . ($_SERVER["HTTP_HOST"] ?? "logixalab.com") . ">",
    "Reply-To: {$email}",
    "Content-Type: text/plain; charset=UTF-8",
    "X-Mailer: PHP/" . phpversion(),
];

$sent = @mail($to, $subject, $body, implode("\r\n", $headers));

if (!$sent) {
    http_response_code(502);
    echo json_encode([
        "error" => "Couldn't send your message. Please email us directly at info@logixalab.com.",
    ]);
    exit;
}

echo json_encode(["ok" => true]);
