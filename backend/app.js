const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); 

const eventRoutes = require('./routes/events');
const authRoutes = require('./routes/auth');
const userEventsRoutes = require('./routes/userEvents');
const adminRoutes = require('./routes/admin');
const participantRoutes = require('./routes/participants'); // Add this line

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 50000, // fail fast if not reachable
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

app.use('/api/events', eventRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userEventsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/participants', participantRoutes); // Add this line

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));