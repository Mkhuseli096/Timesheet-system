// firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBBVVx_Y4oatqZUIGourHAquc_wSGdIZII",
  authDomain: "timesheet-4b79c.firebaseapp.com",
  databaseURL: "https://timesheet-4b79c-default-rtdb.firebaseio.com",
  projectId: "timesheet-4b79c",
  storageBucket: "timesheet-4b79c.appspot.com",
  messagingSenderId: "429029249383",
  appId: "1:429029249383:web:ec19eb0ec3e05bf1ed9fc2"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, get, child };
