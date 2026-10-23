import json
from fastapi.testclient import TestClient
from app.main import app

def test_all_flows():
    with TestClient(app) as client:
        print("--- 1. Testing Root & Health Check ---")
        r = client.get("/")
        assert r.status_code == 200, f"Root failed: {r.text}"
        print("Root OK:", r.json())

        print("\n--- 2. Testing Schemes Listing & Filtering ---")
        r = client.get("/api/schemes")
        assert r.status_code == 200
        data = r.json()
        print(f"Total schemes found: {data['total']}, fetched: {len(data['schemes'])}")
        assert data['total'] >= 8, "Expected at least 8 seeded schemes"

        # Search filter
        r = client.get("/api/schemes?q=kisan")
        assert r.status_code == 200
        assert len(r.json()['schemes']) >= 1
        print("Search 'kisan' OK:", r.json()['schemes'][0]['name'])

        # Detail endpoint
        r = client.get("/api/schemes/pm-kisan")
        assert r.status_code == 200
        scheme = r.json()
        assert scheme['id'] == "pm-kisan"
        assert len(scheme['documents_required']) > 0
        assert len(scheme['application_steps']) > 0
        print("Scheme Detail OK:", scheme['name'], scheme['code'], scheme['benefit_amount'])

        print("\n--- 3. Testing Categories & States ---")
        r = client.get("/api/schemes/categories")
        assert r.status_code == 200
        assert len(r.json()) == 12
        print(f"Categories OK: {len(r.json())} categories loaded")

        r = client.get("/api/schemes/states")
        assert r.status_code == 200
        assert len(r.json()) > 10
        print(f"States OK: {len(r.json())} states loaded")

        print("\n--- 4. Testing Eligibility Wizard Match Algorithm ---")
        payload = {
            "age": 35,
            "gender": "female",
            "state": "Karnataka",
            "income_annual": 180000,
            "caste_category": "obc",
            "is_bpl": True,
            "needs": ["women", "education"]
        }
        r = client.post("/api/wizard/match", json=payload)
        assert r.status_code == 200
        matched = r.json()
        print(f"Wizard Matched: {matched['total_matched']} schemes")
        top_scheme = matched['schemes'][0]
        print(f"Top Matched Scheme: {top_scheme['name']} (Match: {top_scheme['match_percentage']}%)")
        assert top_scheme['match_percentage'] >= 90

        print("\n--- 5. Testing DigiLocker & Payment Status Check ---")
        r = client.get("/api/digilocker/payment-status?scheme_name=Gruha%20Lakshmi")
        assert r.status_code == 200
        p_status = r.json()
        print("Gruha Lakshmi Payment Status:", p_status)
        assert p_status['status'] == "Credited"
        assert p_status['amount'] == "Rs 2,000"

        print("\n--- 6. Testing CSC Operator Authentication & Citizen Assist ---")
        r = client.post("/api/csc/login", json={"operator_id": "operator@csc.gov.in", "password": "demo123"})
        assert r.status_code == 200
        print("CSC Login OK:", r.json()['operator']['name'], r.json()['operator']['center_code'])

        r = client.get("/api/csc/dashboard")
        assert r.status_code == 200
        print("CSC Dashboard Stats:", r.json()['stats'])

        r = client.post("/api/csc/assist", json={
            "citizen_name": "Ramesh Gowda",
            "phone": "9876543210",
            "age": 45,
            "gender": "male",
            "state": "Karnataka",
            "income_annual": 150000,
            "caste_category": "general",
            "is_bpl": True,
            "needs": ["agriculture"]
        })
        assert r.status_code == 200
        print("CSC Citizen Assist Intake OK:", r.json()['reference_id'], len(r.json()['matched_schemes']), "schemes matched")

        print("\n--- 7. Testing Grievance Submission & Tracking ---")
        r = client.post("/api/grievance/submit", json={
            "scheme_name": "PM Kisan Samman Nidhi",
            "issue_type": "payment_not_received",
            "description": "18th installment not received in bank account",
            "citizen_name": "Sunita Devi",
            "citizen_phone": "9845012345",
            "aadhaar_last4": "4521"
        })
        assert r.status_code == 200
        grv = r.json()
        print("Grievance Submitted OK:", grv['grievance_id'], grv['status'])

        r = client.get(f"/api/grievance/{grv['grievance_id']}")
        assert r.status_code == 200
        print("Grievance Tracking OK:", r.json())

        print("\n--- 8. Testing AI Chat SSE Streaming Endpoint ---")
        with client.stream("POST", "/api/chat", json={
            "message": "Did I get my Gruha Lakshmi money this month?",
            "language": "en"
        }) as response:
            assert response.status_code == 200
            events = []
            for line in response.iter_lines():
                if line:
                    events.append(line)
            print(f"AI Stream received {len(events)} chunks/events.")
            assert len(events) > 0
            print("Sample SSE line:", events[0])

        print("\n--- ALL BACKEND TESTS PASSED SUCCESSFULLY! ---")

if __name__ == "__main__":
    test_all_flows()
