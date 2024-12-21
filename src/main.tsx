import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/home/Home.tsx";
import App from "./pages/app/App.tsx";
import Navbar from "./components/Navbar.tsx";
import AuthProvider from "./services/auth/AuthProvider.tsx";
import Login from "./pages/auth/Login.tsx";
import SignUp from "./pages/auth/SignUp.tsx";
import {QueryClientProvider} from "@tanstack/react-query";
import queryClient from "./services/queryClient.ts";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
        <AuthProvider>
            <QueryClientProvider client={queryClient}>
                <div className="min-h-screen bg-gradient-to-br from-shakespeare-400 to-aquamarine-400">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/app/*" element={<App />} />
                    </Routes>
                </div>
            </QueryClientProvider>
        </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
