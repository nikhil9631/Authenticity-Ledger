\# CLAUDE.md



\## Project

Anti-counterfeit product identification system using blockchain.



Stack:

\- Frontend: React

\- Backend: Node.js + Express

\- Database: PostgreSQL

\- Smart contract: Solidity + Hardhat



\## Workflow

\- Start from the repository root.

\- Keep changes scoped to the task; do not refactor unrelated files.

\- Before finishing, explain what changed and any risks still remaining.

\- Prefer small, reviewable edits over broad rewrites.



\## Key Commands

\- Frontend install: `cd identeefi-frontend-react \&\& npm install`

\- Frontend run: `cd identeefi-frontend-react \&\& npm start`

\- Backend install: `cd identeefi-backend-node \&\& npm install`

\- Backend run: `cd identeefi-backend-node \&\& node postgres.js`

\- Smart contract install: `cd identeefi-smartcontract-solidty \&\& npm install`

\- Smart contract compile: `cd identeefi-smartcontract-solidty \&\& npx hardhat compile`



\## Code Style

\- Follow the existing style in each folder instead of rewriting files to a new style.

\- Do not rename folders or move files unless required for the task.

\- Prefer clear variable names over short abbreviations.

\- Avoid adding new dependencies unless necessary.



\## Backend Rules

\- Do not hardcode new secrets, passwords, API keys, or contract addresses.

\- Prefer parameterized SQL queries over string interpolation.

\- Keep route logic readable; extract repeated logic into helper functions only when it clearly improves maintainability.

\- Return proper error responses instead of only logging errors.



\## Frontend Rules

\- Reuse existing components and patterns where possible.

\- Keep API base URLs configurable; avoid adding new hardcoded localhost URLs.

\- Do not store sensitive data such as passwords in frontend state longer than necessary.

\- Keep forms and user flows simple and predictable.



\## Smart Contract Rules

\- Do not change deployed contract addresses casually.

\- If contract logic changes, mention any migration or redeployment impact.

\- Prefer explicit access control and validation checks for state-changing functions.

\- Keep storage usage efficient; avoid unnecessary on-chain string data.



\## Testing

\- If backend logic changes, test the affected API flow manually.

\- If frontend logic changes, verify the affected page in the browser.

\- If smart contract logic changes, compile with Hardhat before finishing.

\- Prefer targeted checks for the changed area instead of unrelated work.



\## Do Not

\- Do not expose secrets in code or commit them.

\- Do not make unrelated formatting-only changes.

\- Do not change database schema silently; mention schema changes clearly.

\- Do not assume frontend role checks are enough for security; backend enforcement matters.



\## Common Gotchas

\- This project mixes frontend, backend, database, and blockchain pieces, so keep the source of truth clear.

\- Product data can diverge between database and blockchain if changes are not coordinated.

\- File uploads and auth flows are sensitive areas; be careful when editing them.

\- Check folder spelling carefully, especially `identeefi-smartcontract-solidty`.

