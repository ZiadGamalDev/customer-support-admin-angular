# Customer Support Admin Dashboard – Angular

A full-featured **Angular** dashboard for **admins** to manage agents, monitor chats, and keep the customer support system running smoothly.

Built to connect with the backend system and provide direct control over support operations.

---

## 🛠️ Admin Features

- ✅ Login as Admin
- 👤 View agents & their status (Available, Busy, Away)
- 🎫 View all chats with filters (New, Open, Pending, Resolved)
- 🔄 Reassign chats manually to available agents
- 🕹️ Change agent status manually
- 💬 View chat details
- 📋 Change chat status directly

---

## 🚀 Getting Started

1. Clone the repo:
   ```bash
   git clone https://github.com/ZiadGamalDev/customer-support-admin-angular.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `src/app/environments/environment.ts` with:
   ```ts
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:5000',
     socketUrl: 'http://localhost:5000',
   };
   ```

4. Run the project:
   ```bash
   ng serve
   ```

---

## 🌐 Full Ecosystem

This dashboard is part of a multi-repo customer support system.
For full functionality, connect it to the backend:
👉 [Customer Support Backend Repo](https://github.com/ZiadGamalDev/customer-support-node)

Or see the entire project:
👉 [Customer Support System Root Repo](https://github.com/ZiadGamalDev/customer-support-system)

---

## 📄 License

MIT – free to use, modify, and share ❤️
