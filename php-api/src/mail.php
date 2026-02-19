<?php
// HTML mail sender: prefer PHPMailer (composer) when SMTP env is configured,
// otherwise fall back to PHP mail() (works on cPanel/shared hosting).

function send_mail_html($to, $subject, $html) {
    $from = getenv('SMTP_FROM') ?: 'noreply@informaticacompany.com';

    // Use PHPMailer if available and SMTP settings provided
    $smtpHost = getenv('SMTP_HOST') ?: '';
    if ($smtpHost && file_exists(__DIR__ . '/../vendor/autoload.php')) {
        require_once __DIR__ . '/../vendor/autoload.php';
        $mail = new PHPMailer\PHPMailer\PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host = getenv('SMTP_HOST');
            $mail->SMTPAuth = true;
            $mail->Username = getenv('SMTP_USER');
            $mail->Password = getenv('SMTP_PASS');
            $mail->SMTPSecure = getenv('SMTP_SECURE') === 'true' ? PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS : PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = intval(getenv('SMTP_PORT') ?: 587);

            // embed the logo as an inline image (CID) when PHPMailer is used
            $logoPath = __DIR__ . '/../../public/logo.jpg';
            if (file_exists($logoPath)) {
                $mail->addEmbeddedImage($logoPath, 'logo@informaticacompany.com');
                if (strpos($html, 'cid:logo@informaticacompany.com') === false && strpos($html, '/logo.jpg') === false) {
                    $html = '<div style="padding-bottom:8px"><img src="cid:logo@informaticacompany.com" alt="Informatica" style="height:60px;object-fit:contain" /></div>' . $html;
                }
            }

            $mail->setFrom($from, 'Informatica SAV');
            $mail->addAddress($to);
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body = $html;

            $mail->send();
            return true;
        } catch (Exception $e) {
            error_log('PHPMailer error: ' . $e->getMessage());
            // fallback to mail()
        }
    }

    // Fallback to PHP mail()
    $headers = [];
    $headers[] = 'MIME-Version: 1.0';
    $headers[] = 'Content-type: text/html; charset=utf-8';
    $headers[] = 'From: Informatica SAV <' . $from . '>';
    $headers[] = 'Reply-To: ' . $from;

    return mail($to, $subject, $html, implode("\r\n", $headers));
}
