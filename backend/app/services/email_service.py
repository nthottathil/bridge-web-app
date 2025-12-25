"""
Email service for sending verification codes and notifications using Resend.
"""
from typing import Optional
from app.core.config import settings
import requests


def send_verification_email(email: str, code: str) -> bool:
    """
    Send verification code to user's email using Resend.

    Args:
        email: Recipient email address
        code: 6-digit verification code

    Returns:
        True if email sent successfully
    """
    # Print to console for debugging
    print("\n" + "="*60)
    print(f"[EMAIL] Sending verification email to {email}")
    print(f"Verification code: {code}")
    print("="*60 + "\n")

    # Send via Resend API
    if settings.RESEND_API_KEY:
        try:
            response = requests.post(
                "https://api.resend.com/emails",
                headers={
                    "Authorization": f"Bearer {settings.RESEND_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "from": "Bridge <onboarding@resend.dev>",
                    "to": [email],
                    "subject": "Verify your Bridge account",
                    "html": f"""
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #1a5f5a;">Welcome to Bridge!</h2>
                        <p>Your verification code is:</p>
                        <div style="background-color: #f0f7f6; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; color: #1a5f5a; letter-spacing: 5px; border-radius: 8px; margin: 20px 0;">
                            {code}
                        </div>
                        <p>Enter this code in the app to verify your email and start connecting with like-minded people.</p>
                        <p style="color: #666; font-size: 14px; margin-top: 30px;">
                            Best regards,<br>
                            The Bridge Team
                        </p>
                    </div>
                    """
                }
            )

            if response.status_code == 200:
                print(f"✅ Email sent successfully to {email}")
                return True
            else:
                print(f"❌ Failed to send email: {response.status_code} - {response.text}")
                return False

        except Exception as e:
            print(f"❌ Error sending email: {e}")
            return False
    else:
        print("⚠️  RESEND_API_KEY not configured - email not sent")
        return True  # Return True to not block signup during development

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
    print(f"[EMAIL] MATCH NOTIFICATION (SIMULATED)")
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
    print(f"[EMAIL] GROUP NOTIFICATION (SIMULATED)")
    print("="*60)
    print(f"To: {email}")
    print(f"Subject: {group_member_name} joined your Bridge group!")
    print(f"\n{group_member_name} has joined your group.")
    print(f"Log in to start chatting!")
    print("="*60 + "\n")

    return True
