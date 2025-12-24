"""
Email service for sending verification codes and notifications.
For MVP, emails are simulated by printing to console.
Can be upgraded to use real SMTP later.
"""
from typing import Optional
from app.core.config import settings


def send_verification_email(email: str, code: str) -> bool:
    """
    Send verification code to user's email.
    Currently simulates email by printing to console.

    Args:
        email: Recipient email address
        code: 6-digit verification code

    Returns:
        True if email sent successfully
    """
    # For MVP: Simulate email sending
    print("\n" + "="*60)
    print(f"📧 VERIFICATION EMAIL (SIMULATED)")
    print("="*60)
    print(f"To: {email}")
    print(f"Subject: Verify your Bridge account")
    print(f"\nYour verification code is: {code}")
    print(f"\nEnter this code in the app to verify your email.")
    print("="*60 + "\n")

    # TODO: For production, implement real SMTP:
    # import smtplib
    # from email.mime.text import MIMEText
    # from email.mime.multipart import MIMEMultipart
    #
    # if settings.EMAIL_HOST and settings.EMAIL_USER:
    #     try:
    #         msg = MIMEMultipart()
    #         msg['From'] = settings.EMAIL_FROM
    #         msg['To'] = email
    #         msg['Subject'] = "Verify your Bridge account"
    #
    #         body = f"""
    #         Welcome to Bridge!
    #
    #         Your verification code is: {code}
    #
    #         Enter this code in the app to verify your email and start connecting.
    #
    #         Best regards,
    #         The Bridge Team
    #         """
    #         msg.attach(MIMEText(body, 'plain'))
    #
    #         with smtplib.SMTP(settings.EMAIL_HOST, settings.EMAIL_PORT) as server:
    #             server.starttls()
    #             server.login(settings.EMAIL_USER, settings.EMAIL_PASSWORD)
    #             server.send_message(msg)
    #
    #         return True
    #     except Exception as e:
    #         print(f"Error sending email: {e}")
    #         return False

    return True


def send_match_notification(email: str, matcher_name: str) -> bool:
    """
    Send notification when someone wants to match with user.
    Currently simulated.

    Args:
        email: Recipient email address
        matcher_name: Name of person who sent match request

    Returns:
        True if email sent successfully
    """
    print("\n" + "="*60)
    print(f"📧 MATCH NOTIFICATION (SIMULATED)")
    print("="*60)
    print(f"To: {email}")
    print(f"Subject: New match request from {matcher_name}")
    print(f"\n{matcher_name} wants to connect with you on Bridge!")
    print(f"Log in to view their profile and respond.")
    print("="*60 + "\n")

    return True


def send_group_joined_notification(email: str, group_member_name: str) -> bool:
    """
    Send notification when someone joins your group.
    Currently simulated.

    Args:
        email: Recipient email address
        group_member_name: Name of person who joined

    Returns:
        True if email sent successfully
    """
    print("\n" + "="*60)
    print(f"📧 GROUP NOTIFICATION (SIMULATED)")
    print("="*60)
    print(f"To: {email}")
    print(f"Subject: {group_member_name} joined your Bridge group!")
    print(f"\n{group_member_name} has joined your group.")
    print(f"Log in to start chatting!")
    print("="*60 + "\n")

    return True
