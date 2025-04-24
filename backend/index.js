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
      
      // Find doctor by email in Doctors table (note capital D)
      const { data: doctor, error } = await supabase
        .from("Doctors")
        .select("*")
        .eq("email", email)
        .maybeSingle();
      
      if (error) throw error;
      
      if (!doctor) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      
      // In a real app, you'd verify the password hash here
      // For this example, assuming direct comparison (not secure!)
      if (doctor.password !== password) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      
      // Remove password from response
      delete doctor.password;
      
      return res.status(200).json(doctor);
    } catch (error) {
      console.error("Doctor login error:", error);
      return res.status(500).json({ error: "Server error" });
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
      
      // Find user by email in Users table (note capital U)
      const { data: user, error } = await supabase
        .from("Users")
        .select("*")
        .eq("email", email)
        .maybeSingle();
      
      if (error) throw error;
      
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      
      // In a real app, you'd verify the password hash here
      // For this example, assuming direct comparison (not secure!)
      if (user.password !== password) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      
      // Remove password from response
      delete user.password;
      
      return res.status(200).json(user);
    } catch (error) {
      console.error("User login error:", error);
      return res.status(500).json({ error: "Server error" });
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

  // Add this to your Express backend
  app.post('/api/check-email', async (req, res) => {
    try {
      const { email } = req.body;
      console.log("Checking email:", email); // Debug log
      
      // Check in Users table - note the capital U
      const { data: users, error: userError } = await supabase
        .from('Users') // Changed from 'users' to 'Users'
        .select('id')
        .eq('email', email)
        .maybeSingle();
      
      if (userError) {
        console.error("User check error:", userError);
        throw userError;
      }
      
      console.log("Users check result:", users); // Debug log
      
      if (users) {
        return res.json({ exists: true, type: "patient" });
      }
      
      // Check in Doctors table - note the capital D
      const { data: doctors, error: doctorError } = await supabase
        .from('Doctors') // Changed from 'doctors' to 'Doctors'
        .select('id')
        .eq('email', email)
        .maybeSingle();
      
      if (doctorError) {
        console.error("Doctor check error:", doctorError);
        throw doctorError;
      }
      
      console.log("Doctors check result:", doctors); // Debug log
      
      if (doctors) {
        return res.json({ exists: true, type: "doctor" });
      }
      
      // Email doesn't exist in either table
      return res.json({ exists: false });
    } catch (error) {
      console.error("Error checking email:", error);
      return res.status(500).json({ error: "Server error checking email" });
    }
  });

  // Start server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} catch (error) {
  console.error("Error initializing Supabase client:", error);
}
