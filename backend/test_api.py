import urllib.request
import json

def test_crud():
    # 1. Root status
    res = urllib.request.urlopen("http://localhost:8000/")
    print("GET / ->", res.read().decode())

    # 2. Stats
    res = urllib.request.urlopen("http://localhost:8000/api/stats")
    print("GET /api/stats ->", res.read().decode())

    # 3. Tasks list
    res = urllib.request.urlopen("http://localhost:8000/api/tasks")
    tasks = json.loads(res.read().decode())
    print(f"GET /api/tasks -> Found {len(tasks)} tasks")

    # 4. Create Task with Subtasks
    task_payload = {
        "title": "Automated Test Task",
        "description": "Verified REST API endpoints",
        "category": "Work",
        "priority": "High",
        "status": "Pending",
        "due_date": "2026-08-15",
        "subtasks": [
            {"id": "st-1", "title": "Subtask 1: Write test case", "completed": False},
            {"id": "st-2", "title": "Subtask 2: Run assertion", "completed": True}
        ]
    }
    req = urllib.request.Request(
        "http://localhost:8000/api/tasks",
        data=json.dumps(task_payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    created = json.loads(urllib.request.urlopen(req).read().decode())
    task_id = created["id"]
    print(f"POST /api/tasks -> Created Task ID {task_id} with {len(created.get('subtasks', []))} subtasks")

    # 5. Toggle Subtask endpoint
    req = urllib.request.Request(
        f"http://localhost:8000/api/tasks/{task_id}/subtasks/st-1/toggle",
        headers={"Content-Type": "application/json"},
        method="PUT"
    )
    toggled = json.loads(urllib.request.urlopen(req).read().decode())
    st1_status = toggled["subtasks"][0]["completed"]
    print(f"PUT /api/tasks/{task_id}/subtasks/st-1/toggle -> Subtask completed state: {st1_status}")

    # 6. Update Task
    update_payload = {"status": "Completed", "title": "Automated Test Task (Updated)"}
    req = urllib.request.Request(
        f"http://localhost:8000/api/tasks/{task_id}",
        data=json.dumps(update_payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="PUT"
    )
    updated = json.loads(urllib.request.urlopen(req).read().decode())
    print(f"PUT /api/tasks/{task_id} -> Updated Status: {updated['status']}, Title: {updated['title']}")

    # 7. Delete Task
    req = urllib.request.Request(f"http://localhost:8000/api/tasks/{task_id}", method="DELETE")
    deleted = json.loads(urllib.request.urlopen(req).read().decode())
    print(f"DELETE /api/tasks/{task_id} -> Result: {deleted['message']}")

if __name__ == "__main__":
    test_crud()
