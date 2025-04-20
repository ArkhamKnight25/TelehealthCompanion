const API_URL = 'http://localhost:5000/api';

// Define types for your data structures
type Doctor = {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  specialisation: string;
  created_at?: string;
};

type User = {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  created_at?: string;
};

// Doctor APIs
export const doctorSignUp = async (
  name: string, 
  email: string, 
  phone: string, 
  specialisation: string, 
  password: string
): Promise<Doctor> => {
  const response = await fetch(`${API_URL}/doctors/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, phone, specialisation, password }),
  });
  
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  
  return data;
};

export const doctorLogin = async (
  email: string, 
  password: string
): Promise<Doctor> => {
  const response = await fetch(`${API_URL}/doctors/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  
  return data;
};

export const getDoctorById = async (id: string | number): Promise<Doctor> => {
  const response = await fetch(`${API_URL}/doctors/${id}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  return data;
};

export const getAllDoctors = async (): Promise<Doctor[]> => {
  const response = await fetch(`${API_URL}/doctors`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  return data;
};

// User/Patient APIs
export const userSignUp = async (
  name: string, 
  email: string, 
  phone: string, 
  password: string
): Promise<User> => {
  const response = await fetch(`${API_URL}/users/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, phone, password }),
  });
  
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  
  return data;
};

export const userLogin = async (
  email: string, 
  password: string
): Promise<User> => {
  const response = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  
  return data;
};

export const getUserById = async (id: string | number): Promise<User> => {
  const response = await fetch(`${API_URL}/users/${id}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  return data;
};