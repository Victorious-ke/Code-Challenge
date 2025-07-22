# PAYE (Net Salary) Calculator

This is a simple and interactive web application that calculates **Net Pay** based on a user's gross salary input. It accounts for key deductions in Kenya including:

PAYE (Pay As You Earn)
SHA (National Hospital Insurance Fund)
NSSF (National Social Security Fund)
NHDF (Housing Levy)

Built using **HTML**, **CSS**, **JavaScript**, and a **JSON Server** 



## Features

Real-time calculation of Net Pay based on gross salary and benefits
Automatic deduction of statutory taxes (PAYE, SHA, NSSF, NHDF)
Display of calculation breakdown in a dynamic HTML table
Ability to save salary records using a JSON API
View and delete saved salary records
Responsive UI styled with CSS



## Project Structure

index.html           # Main web page
style.css            # Styling
index.js             # Logic and fetch calls
db.json              # JSON Server database
server.js            # JSON Server configuration
README.md            # Project documentation


## Technologies Used
HTML
CSS
JavaScript
JSON Server (Mock backend API)
Fetch API (GET and POST methods)

## Setup Instructions
1. Clone the Repository
git clone https://github.com/yourusername/paye-calculator.git
cd paye-calculator

2. Install Dependencies
npm install json-server

3. Start JSON Server
npm start


## Live Demo (Optional)
If deployed using Render:

View Live API

💡 Usage
Enter your Basic Salary and Benefits

Click Calculate

View the breakdown of:

Gross Pay

Statutory Deductions

Net Pay

Click Save Record to store the result

View all saved records under “Salary Records”

🗃 Example JSON (db.json)
json
Copy
Edit
{
  "salaryRecords": [
    {
      "id": 1,
      "basic": 50000,
      "benefits": 10000,
      "netPay": 42000
    }
  ]
}
✨ Future Enhancements
User authentication for private salary records

Monthly vs. yearly breakdown toggle

Export to PDF or CSV

Responsive mobile-first UI

🧑‍💻 Author
Victorious-ke
GitHub: github.com/Victorious-ke

📜 License
This project is licensed under the MIT License — feel free to use and modify it!

yaml
Copy
Edit

---

Let me know if you'd like to:
- Add screenshots
- Localize it for other countries
- Use environment variables or build scripts

Want me to generate a `db.json` starter file again too?







Ask ChatGPT

