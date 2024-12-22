<?php
// Define recipient email and site name
$recepient = "garbiche.bucket90@gmail.com";
$sitename = "testcyber.tarasostasha.com";

// Check if the request method is POST
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Sanitize and validate input
    $name = htmlspecialchars(trim($_POST["name"]));
    $mail = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $phone = htmlspecialchars(trim($_POST["phone"]));
    $text = htmlspecialchars(trim($_POST["message"]));

    // Validate required fields
    if (empty($name) || empty($mail) || empty($phone) || empty($text)) {
        http_response_code(400); // Bad Request
        echo "All fields are required.";
        exit;
    }

    if (!filter_var($mail, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400); // Bad Request
        echo "Invalid email format.";
        exit;
    }

    // Build the message
    $message = "Name: $name\n";
    $message .= "Email: $mail\n";
    $message .= "Phone: $phone\n";
    $message .= "Message: $text\n";

    // Email subject
    $pagetitle = "New request from the website \"$sitename\"";

    // Email headers
    $headers = "From: $mail\r\n";
    $headers .= "Reply-To: $mail\r\n";
    $headers .= "Content-Type: text/plain; charset=\"utf-8\"\r\n";

    // Send the email
    if (mail($recepient, $pagetitle, $message, $headers)) {
        http_response_code(200); // OK
        echo "Your message has been sent successfully.";
    } else {
        http_response_code(500); // Internal Server Error
        echo "Failed to send your message. Please try again later.";
    }
} else {
    http_response_code(405); // Method Not Allowed
    echo "Invalid request method.";
}
?>
