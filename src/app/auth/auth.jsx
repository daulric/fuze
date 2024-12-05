"use client"

import { useState, useCallback, useMemo } from 'react';
import { Eye, EyeOff, User, Lock, Mail, Calendar } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { encrypt } from "@/tools/encryption";
import { useSearchParams } from "next/navigation";
import { notFound } from "next/navigation";
import cookieStore from "@/tools/cookieStore";

async function handleSignupForm({email, password, username, dob}, setMsg) {
  const user_info = {
    loginType: "signup",
    email: email,
    password: encrypt(password, "passcode"),
    username: username,
    dob: dob,
  }

  const response = await fetch("/api/auth", { 
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user_info),
  });

  if (!response.ok) {
    setMsg({message: "Server Error!"});
  }

  const data = await response.json();

  if (data) {
    setMsg(data);
    console.log(data);
    return data.success;
  }
}

async function handleLoginForm({email, password}, setMsg) {
  const user_info = {
    loginType: "login",
    email: email,
    password: password,
  }

  const response = await fetch("api/auth", {
    method: "put",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user_info),
  });

  if (!response.ok) {
    setMsg({message: "Server Error"});
    return;
  };

  const data = await response.json();

  if (data) {
    setMsg(data);
    return data.success;
  }
}

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState(null);
  const [isLogining, setIsLogining] = useState(false);
  const [user_info, setUserInfo] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [dobError, setDobError] = useState('');
  const searchParams = useSearchParams();
  const redirected_path = searchParams.get("p");
  const cookies = cookieStore();

  let path_to_redirect = "";

  for (const [key, value] of Object.entries(Object.fromEntries(searchParams.entries()))) {
    if (key !== "p") {
      path_to_redirect += `${key}=${value}&`;
    }
  }

  const toggleForm = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setIsAnimating(false);
      setDobError('');
      setUserInfo({});
    }, 300); // Half of the animation duration
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const validateDateOfBirth = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 13) {
      setDobError('You must be at least 13 years old to register.');
      return false;
    } else if (age > 120) {
      setDobError('Please enter a valid date of birth.');
      return false;
    }

    setDobError('');
    return true;
  };

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (isLogining === true) return;

    if (!isLogin && !validateDateOfBirth(user_info.dob)) {
      return;
    }

    setIsLogining(true);
    if (isLogin === true) {
      handleLoginForm(user_info, setMsg).then((success) => {
        if (success === true) {
          setTimeout(() => {
            window.location.href = `${redirected_path || "/"}?${path_to_redirect}`;
          }, 1000);
        } else if (success === false) {
          setIsLogining(false);
        }
      });
    } else if (isLogin === false) {
      handleSignupForm(user_info, setMsg).then((success) => {
        if (success === true) {
          setTimeout(() => {
            window.location.href = `${redirected_path}?${path_to_redirect}`;
          }, 1000);
        } else if (success === false) {
          setIsLogining(false);
        }
      });
    }
  }, [isLogin, user_info, redirected_path, path_to_redirect, isLogining]);

  const user_exists = useMemo(() => {
    const user = cookies.get("user");
    if (user) return true;
    return false;
  }, [cookies])

  if (user_exists) { 
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md relative overflow-hidden">
        <div className={`transition-all duration-600 ease-in-out ${isAnimating ? (isLogin ? 'translate-x-full opacity-0' : '-translate-x-full opacity-0') : 'translate-x-0 opacity-100'}`}>
          <h2 className="text-3xl font-bold text-center text-white mb-8">
            {isLogin ? 'Login' : 'Sign Up'}
          </h2>
          <form
            onSubmit={(e) => {
              if (e.target.checkValidity() && (!isLogin || validateDateOfBirth(user_info.dob))) {
                handleSubmit(e);
              } else {
                e.preventDefault();
                setMsg({
                  success: false,
                  message: "Invalid Field Format"
                });
              }
            }}
            className="space-y-6"
          >
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-300">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    required
                    type="text"
                    id="name"
                    placeholder="example123"
                    className="pl-10 bg-gray-700 text-gray-300 border-gray-600 w-full"
                    onChange={(e) => { setUserInfo((state) => ({ ...state, username: e.target.value })) }}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-300">
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  required
                  type="email"
                  id="email"
                  pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                  placeholder="you@example.com"
                  className="pl-10 bg-gray-700 text-gray-300 border-gray-600 w-full"
                  onChange={(e) => { setUserInfo((state) => ({ ...state, email: e.target.value })) }}
                />
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="dob" className="text-sm font-medium text-gray-300">
                  Date of Birth
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    required
                    type="date"
                    id="dob"
                    max={new Date().toISOString().split('T')[0]}
                    className="pl-10 bg-gray-700 text-gray-300 border-gray-600 w-full"
                    onChange={(e) => {
                      const selectedDate = e.target.value;
                      setUserInfo((state) => ({ ...state, dob: selectedDate }));
                      validateDateOfBirth(selectedDate);
                    }}
                  />
                </div>
                {dobError && <p className="text-red-500 text-sm mt-1">{dobError}</p>}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-300">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  required
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="••••••••"
                  className="pl-10 pr-10 bg-gray-700 text-gray-300 border-gray-600 w-full"
                  onChange={(e) => { setUserInfo((state) => ({ ...state, password: e.target.value })) }}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 focus:outline-none focus:text-gray-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {msg !== null && (
              <div className="text-center">
                <Label className={`${msg.success ? "text-green-500" : "text-red-500"}`}>
                  {typeof(msg.message) === "string" ? msg.message : "Server Error"}
                </Label>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLogining || (!isLogin && dobError)}
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>

          <div className="mt-6">
            <Button
              variant="ghost"
              onClick={toggleForm}
              className="w-full text-sm text-gray-400 hover:text-gray-300 hover:bg-grayy-600"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : 'Already have an account? Log in'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;