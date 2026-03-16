async function testFirestore() {
    console.log("Testing Firestore REST API...");
    const url = "https://firestore.googleapis.com/v1/projects/fitvision-ai-a4b4e/databases/(default)/documents/users/test_check";
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log("Response status:", response.status);
        console.log("Response body:", JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error:", error);
    }
}

testFirestore();
