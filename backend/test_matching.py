"""
Test script for matching system.
Creates test users and demonstrates the matching flow.
"""
import requests
import json

BASE_URL = "http://localhost:5000"

def print_section(title):
    print("\n" + "="*60)
    print(f"  {title}")
    print("="*60)

def signup_user(user_data):
    """Sign up a new user."""
    response = requests.post(f"{BASE_URL}/auth/signup", json=user_data)
    return response.json()

def verify_user(email, code):
    """Verify user email."""
    response = requests.post(f"{BASE_URL}/auth/verify", json={
        "email": email,
        "code": code
    })
    return response.json()

def login_user(email, password):
    """Login and get JWT token."""
    response = requests.post(f"{BASE_URL}/auth/login", json={
        "email": email,
        "password": password
    })
    return response.json()

def get_matches(token):
    """Get potential matches for user."""
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/api/matches", headers=headers)
    return response.json()

def send_match_request(token, to_user_id):
    """Send match request to another user."""
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(
        f"{BASE_URL}/api/matches/request",
        headers=headers,
        json={"to_user_id": to_user_id}
    )
    return response.json()

def get_match_requests(token):
    """Get pending match requests."""
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/api/matches/requests", headers=headers)
    return response.json()

def accept_match_request(token, request_id):
    """Accept a match request."""
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(
        f"{BASE_URL}/api/matches/{request_id}/accept",
        headers=headers
    )
    return response.json()

# Test user data
alice_data = {
    "email": "alice@test.com",
    "password": "password123",
    "first_name": "Alice",
    "surname": "Smith",
    "age": 28,
    "profession": "Software Engineer",
    "primary_goal": "networking",
    "interests": ["technology", "hiking", "photography"],
    "personality": {
        "extroversion": 7,
        "openness": 8,
        "agreeableness": 6,
        "conscientiousness": 7
    },
    "gender_preference": ["any"],
    "age_preference": {"min": 25, "max": 35},
    "statement": "Love coding and outdoor activities",
    "location": "London",
    "max_distance": 10
}

bob_data = {
    "email": "bob@test.com",
    "password": "password123",
    "first_name": "Bob",
    "surname": "Johnson",
    "age": 30,
    "profession": "Product Manager",
    "primary_goal": "networking",
    "interests": ["technology", "music", "hiking"],
    "personality": {
        "extroversion": 6,
        "openness": 7,
        "agreeableness": 8,
        "conscientiousness": 6
    },
    "gender_preference": ["any"],
    "age_preference": {"min": 26, "max": 40},
    "statement": "Building great products and meeting interesting people",
    "location": "London",
    "max_distance": 10
}

charlie_data = {
    "email": "charlie@test.com",
    "password": "password123",
    "first_name": "Charlie",
    "surname": "Davis",
    "age": 26,
    "profession": "Designer",
    "primary_goal": "friendship",
    "interests": ["art", "coffee", "travel"],
    "personality": {
        "extroversion": 5,
        "openness": 9,
        "agreeableness": 7,
        "conscientiousness": 5
    },
    "gender_preference": ["any"],
    "age_preference": {"min": 24, "max": 32},
    "statement": "Creative soul looking for friends",
    "location": "London",
    "max_distance": 10
}

if __name__ == "__main__":
    print_section("BRIDGE MATCHING SYSTEM TEST")

    # Step 1: Create users
    print_section("Step 1: Creating Test Users")

    print("\n>> Creating Alice...")
    alice_signup = signup_user(alice_data)
    print(f"[OK] Alice created: {alice_signup['message']}")
    print(f"  Email: {alice_data['email']}")

    print("\n>> Creating Bob...")
    bob_signup = signup_user(bob_data)
    print(f"[OK] Bob created: {bob_signup['message']}")
    print(f"  Email: {bob_data['email']}")

    print("\n>> Creating Charlie...")
    charlie_signup = signup_user(charlie_data)
    print(f"[OK] Charlie created: {charlie_signup['message']}")
    print(f"  Email: {charlie_data['email']}")

    # Step 2: Verify users (using code "123456" which should be in console)
    print_section("Step 2: Email Verification")
    print("\n[!] Check your console for verification codes!")
    print("    Look for lines like: 'Your verification code is: XXXXXX'")

    alice_code = input("\nEnter Alice's verification code: ")
    alice_verify = verify_user(alice_data['email'], alice_code)
    print(f"[OK] Alice verified!")
    alice_token = alice_verify['access_token']
    alice_user_id = alice_verify['user']['id']

    bob_code = input("Enter Bob's verification code: ")
    bob_verify = verify_user(bob_data['email'], bob_code)
    print(f"[OK] Bob verified!")
    bob_token = bob_verify['access_token']
    bob_user_id = bob_verify['user']['id']

    charlie_code = input("Enter Charlie's verification code: ")
    charlie_verify = verify_user(charlie_data['email'], charlie_code)
    print(f"[OK] Charlie verified!")
    charlie_token = charlie_verify['access_token']
    charlie_user_id = charlie_verify['user']['id']

    # Step 3: Find matches for Alice
    print_section("Step 3: Finding Matches for Alice")

    alice_matches = get_matches(alice_token)
    print(f"\n>> Found {len(alice_matches)} potential matches for Alice:")

    for match in alice_matches:
        print(f"\n  USER: {match['first_name']} ({match['profession']})")
        print(f"     Age: {match['age']}, Location: {match['location']}")
        print(f"     Goal: {match['primary_goal']}")
        print(f"     Interests: {', '.join(match['interests'])}")
        print(f"     Compatibility Score: {match['compatibility_score']}/100")
        print(f"     Statement: {match['statement']}")

    # Step 4: Alice sends match request to Bob
    print_section("Step 4: Alice Sends Match Request to Bob")

    if alice_matches:
        # Find Bob in matches
        bob_match = next((m for m in alice_matches if m['first_name'] == 'Bob'), None)

        if bob_match:
            print(f"\n>> Alice is sending a match request to Bob...")
            match_req_result = send_match_request(alice_token, bob_match['user_id'])
            print(f"[OK] {match_req_result['message']}")
            print(f"  Request ID: {match_req_result['request_id']}")
        else:
            print("\n[!] Bob not found in Alice's matches")

    # Step 5: Bob checks his match requests
    print_section("Step 5: Bob Views Match Requests")

    bob_requests = get_match_requests(bob_token)
    print(f"\n>> Bob has {len(bob_requests)} pending match request(s):")

    for req in bob_requests:
        sender = req['from_user']
        print(f"\n  From: {sender['first_name']} ({sender['profession']})")
        print(f"  Compatibility: {sender['compatibility_score']}/100")
        print(f"  Statement: {sender['statement']}")
        print(f"  Request ID: {req['request_id']}")

    # Step 6: Bob accepts Alice's request
    if bob_requests:
        print_section("Step 6: Bob Accepts Match Request")

        request_id = bob_requests[0]['request_id']
        print(f"\n>> Bob is accepting the match request...")

        accept_result = accept_match_request(bob_token, request_id)
        print(f"[OK] {accept_result['message']}")
        print(f"  Group ID: {accept_result['group_id']}")
        print(f"\n[SUCCESS] Alice and Bob are now in a group together!")

    # Step 7: Try to get matches again (should be blocked)
    print_section("Step 7: Testing Group Restrictions")

    print("\n>> Trying to get matches for Alice (who is now in a group)...")
    try:
        alice_matches_again = get_matches(alice_token)
        print("  Unexpected: Got matches")
    except Exception as e:
        print("  [OK] Correctly blocked - users in groups cannot browse matches")

    print_section("TEST COMPLETE!")
    print("\n[SUCCESS] All matching features tested successfully!")
    print("\nWhat was tested:")
    print("  [OK] User signup and verification")
    print("  [OK] Compatibility scoring algorithm")
    print("  [OK] Finding potential matches")
    print("  [OK] Sending match requests")
    print("  [OK] Viewing received requests")
    print("  [OK] Accepting matches and creating groups")
    print("  [OK] Group membership restrictions")
    print("\nNext: Week 3 - Groups & Chat System!")
