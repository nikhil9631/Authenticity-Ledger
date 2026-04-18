\# 🔐 Authenticity Ledger



Anti-Counterfeit Product Identification System using Blockchain



\---



\## 📌 Overview



\*\*Authenticity Ledger\*\* is a decentralized product verification system designed to combat counterfeit goods by leveraging \*\*blockchain technology\*\*, \*\*QR-based verification\*\*, and \*\*supply chain tracking\*\*.



The system enables manufacturers, suppliers, retailers, and consumers to:



\* Register products on-chain

\* Track product lifecycle across the supply chain

\* Verify authenticity using QR codes

\* Detect counterfeit or tampered products



\---



\## 🚀 Key Features



\* 🔗 \*\*Blockchain-backed product identity (Ethereum / Sepolia)\*\*

\* 📦 \*\*Supply chain tracking (Manufacturer → Supplier → Retailer → Consumer)\*\*

\* 🔍 \*\*QR code-based product verification\*\*

\* 👤 \*\*Role-based system (Admin, Manufacturer, Supplier, Retailer)\*\*

\* 🖼️ \*\*Product \& profile image uploads\*\*

\* 📜 \*\*Immutable product history\*\*

\* 🌍 \*\*Location tracking (via geocoding API)\*\*



\---



\## 🏗️ System Architecture



```

Frontend (React)

\&#x20;       ↓

Backend API (Node.js + Express)

\&#x20;       ↓

PostgreSQL Database  ←→  Blockchain (Solidity Smart Contract)

\&#x20;       ↓

File Storage (Images)

```



\---



\## 🧰 Tech Stack



\### Frontend



\* React.js

\* Material UI (MUI)

\* Axios

\* QR Code Generator



\### Backend



\* Node.js

\* Express.js

\* Multer (file uploads)

\* PostgreSQL



\### Blockchain



\* Solidity

\* Hardhat

\* Ethereum (Sepolia testnet)



\### Database



\* PostgreSQL



\---



\## 📂 Project Structure



```

Authenticity Ledger/

│

├── identeefi-frontend-react/      # React frontend

├── identeefi-backend-node/        # Node.js backend

├── identeefi-postgres-database/   # SQL schema \\\& scripts

├── identeefi-smartcontract-solidty/ # Solidity contracts

│

├── README.md

├── user-manual.pdf

└── CLAUDE.md

```



\---



\## ⚙️ Setup \& Installation



\### 🔹 1. Clone the repository



```bash

git clone https://github.com/your-username/Authenticity-Ledger.git

cd Authenticity-Ledger

```



\---



\### 🔹 2. Backend Setup



```bash

cd identeefi-backend-node

npm install

node postgres.js

```



\---



\### 🔹 3. Frontend Setup



```bash

cd identeefi-frontend-react

npm install

npm start

```



\---



\### 🔹 4. Database Setup



\* Install PostgreSQL

\* Create database

\* Run SQL script:



```sql

\\-- Run create\\\_table.txt or schema file

```



\---



\### 🔹 5. Smart Contract Setup



```bash

cd identeefi-smartcontract-solidty

npm install

npx hardhat compile

npx hardhat run scripts/deploy.js --network sepolia

```



\---



\## 🔐 Environment Configuration (IMPORTANT)



Create `.env` files instead of hardcoding secrets.



\### Backend `.env`



```

DB\\\_HOST=localhost

DB\\\_USER=your\\\_user

DB\\\_PASSWORD=your\\\_password

DB\\\_NAME=your\\\_db

PORT=5000

```



\### Frontend `.env`



```

REACT\\\_APP\\\_API\\\_URL=http://localhost:5000

REACT\\\_APP\\\_CONTRACT\\\_ADDRESS=your\\\_contract\\\_address

```



\---



\## 🔄 Workflow



1\. Manufacturer registers product → stored on blockchain

2\. QR code generated for product

3\. Supplier updates product location/status

4\. Retailer receives and updates product

5\. Consumer scans QR → verifies authenticity



\---



\## ⚠️ Current Limitations (Prototype Stage)



This project is a \*\*prototype\*\*, not production-ready yet.



Known issues:



\* ❌ Plaintext password authentication

\* ❌ SQL injection risk

\* ❌ No backend authorization middleware

\* ❌ Smart contract lacks access control

\* ❌ QR codes can be cloned

\* ❌ Hardcoded API keys and secrets

\* ❌ No automated tests or CI/CD



\---



\## 🛡️ Production Improvements (Recommended)



\### Security



\* Implement JWT authentication

\* Hash passwords using bcrypt

\* Use parameterized SQL queries

\* Add backend role-based access control



\### Blockchain



\* Add role-based permissions (Ownable / AccessControl)

\* Prevent duplicate product registration

\* Emit events for all transactions



\### Architecture



\* Move secrets to `.env`

\* Use cloud storage (AWS S3 / Cloudinary)

\* Introduce service layer in backend

\* Add API validation (Joi / Zod)



\### DevOps



\* Dockerize application

\* Add CI/CD pipeline (GitHub Actions)

\* Logging \& monitoring (Winston, Sentry)

\* Add automated tests



\---



\## 🧪 Testing



Currently manual testing is required.



Suggested:



\* Backend: Jest + Supertest

\* Frontend: React Testing Library

\* Smart Contracts: Hardhat tests



\---



\## 📊 Future Enhancements



\* NFC-based secure tagging (anti-cloning)

\* Mobile app for scanning

\* Blockchain event indexing

\* AI-based counterfeit detection

\* Multi-chain support



\---



\## 🤝 Contribution Guidelines



\* Create feature branch:

&#x20; `feature/your-feature-name`

\* Keep commits small and meaningful

\* Avoid pushing secrets

\* Test before submitting PR



\---



\## 📄 License



This project is for academic and demonstration purposes.



\---



\## 👨‍💻 Author



\*\*Nikhil Kumar\*\*



\* C++, SQL, DSA

\* Passionate about blockchain and backend systems



\---



\## ⭐ Support



If you like this project:



\* ⭐ Star the repository

\* 🍴 Fork and improve

\* 🧠 Suggest ideas



