import React, { useState, Dispatch, SetStateAction } from 'react';  // Add these imports

// src/types/index.ts
export interface User {
    id: string;  // Changed from number to string because Java's Long comes as string
    username: string;
    email: string;
    active: boolean;
  }
  
  export interface LoginRequest {
    username: string;
    password: string;
  }
  
  export interface LoginResponse {
    user: User;
    token: string;
  }
  
  export interface LoginScreenProps {
    setUser: Dispatch<SetStateAction<User | null>>;  // Updated this type
  }
  
  export interface LoginProps {
    setUser: Dispatch<SetStateAction<User | null>>;  // Updated this type
  }