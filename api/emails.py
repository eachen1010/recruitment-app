import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()
APP_PASSWORD = os.getenv('EMAIL_APP_PASSWORD')
SENDER = os.getenv('EMAIL_SENDER')
RECEIVER = os.getenv('EMAIL_RECEIVER')

# Test email content
subject = "Test Email from Python"
body = "Hello! This is a test email sent from a Python script."

# Email addresses
sender_email = SENDER
receiver_email = RECEIVER
password = APP_PASSWORD

# Set up email
msg = EmailMessage()
msg["From"] = sender_email
msg["To"] = receiver_email
msg["Subject"] = subject
msg.set_content(body)


try:
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login(sender_email, password)
        smtp.send_message(msg)
    print("Email sent successfully!")
except Exception as e:
    print(f"Failed to send email: {e}")