<!-- Profile App Curl Examples -->
# Profile App Curl Examples
This folder contains examples of how to use curl to interact with the profile app backend API. <br>
The examples demonstrate how to create a user profile by sending a POST request to the "/api/profile" endpoint with a JSON body containing the name, age, and bio of the profile. <br>
To run the examples, make sure the profile app backend is running (you can start it by running "python app.py" in the profile-app-backend folder). <br>
Then, you can use the provided curl commands in the terminal to create a user profile and see the response from the backend. <br>
Make sure you have curl installed on your system to run these commands. You can install it using your package manager if you don't have it already. <br>
For example, on Windows, you can use the following command to create a profile:
```bash
curl -X POST http://localhost:5000/api/profile -H "Content-Type: application/json" -d "{\"name\": \"John Doe\", \"age\": 30, \"bio\": \"Software developer from NY.\"}"
```
This command sends a POST request to the profile app backend with a JSON body containing the name, age, and bio of the profile. The backend will validate the input and return the created profile as a JSON response.
