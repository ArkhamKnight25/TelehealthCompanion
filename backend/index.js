const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
const path = require("path");

// Configure dotenv - only need to do this once
const result = dotenv.config();
if (result.error) {
  console.error("Error loading .env file:", result.error);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Debug log for environment variables
// console.log("Environment variables loaded:");
// console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
// console.log(
//   "SUPABASE_SERVICE_KEY:",
//   process.env.SUPABASE_SERVICE_KEY ? "[REDACTED]" : "undefined"
// );

// Validate required environment variables
// if (!process.env.SUPABASE_URL) {
//   throw new Error("SUPABASE_URL is required but not defined in .env file");
// }

// if (!process.env.SUPABASE_SERVICE_KEY) {
//   throw new Error(
//     "SUPABASE_SERVICE_KEY is required but not defined in .env file"
//   );
// }

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

try {
  console.log("Supabase client initialized successfully");

  // Doctor Authentication
  app.post("/api/doctors/signup", async (req, res) => {
    try {
      const { name, email, phone, specialisation, password } = req.body;

      // Insert into Doctors table
      const { data, error } = await supabase
        .from("Doctors")
        .insert([{ name, email, phone, specialisation, password }])
        .select();

      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json(data[0]);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/doctors/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      // Query the Doctors table for matching credentials
      const { data, error } = await supabase
        .from("Doctors")
        .select("*")
        .eq("email", email)
        .eq("password", password)
        .single();

      if (error) return res.status(400).json({ error: error.message });
      if (!data) return res.status(401).json({ error: "Invalid credentials" });

      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Patient (User) Authentication
  app.post("/api/users/signup", async (req, res) => {
    try {
      const { name, email, phone, password } = req.body;

      // Insert into Users table
      const { data, error } = await supabase
        .from("Users")
        .insert([{ name, email, phone, password }])
        .select();

      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/users/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      // Query the Users table for matching credentials
      const { data, error } = await supabase
        .from("Users")
        .select("*")
        .eq("email", email)
        .eq("password", password)
        .single();

      if (error) return res.status(400).json({ error: error.message });
      if (!data) return res.status(401).json({ error: "Invalid credentials" });

      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Get all doctors
  app.get("/api/doctors", async (req, res) => {
    try {
      const { data, error } = await supabase.from("Doctors").select("*");

      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Get doctor by ID
  app.get("/api/doctors/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from("Doctors")
        .select("*")
        .eq("id", id)
        .single();

      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Get user profile
  app.get("/api/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from("Users")
        .select("*")
        .eq("id", id)
        .single();

      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Start server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} catch (error) {
  console.error("Error initializing Supabase client:", error);
}
