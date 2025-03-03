"use client"

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
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
    username: username.trimEnd(),
    dob: dob,
  }

  const response = await fetch("/api/auth", { 
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user_info),
  });

  if (!response.ok) {
    setMsg({message: "Server Error!"});
    setTimeout(() => setMsg(null), 2000)
    return
  }

  const data = await response.json();

  if (data) {
    setMsg(data);
    setTimeout(() => setMsg(null), 2000)
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
    setTimeout(() => setMsg(null), 2000)
    return;
  };

  const data = await response.json();

  if (data) {
    setMsg(data);
    setTimeout(() => setMsg(null), 2000)
    return data.success;
  }
}

function isValidEmail(email) {
  if (!email) return false;
  // Split the email into local and domain parts
  const [localPart, domain] = email.split("@");

  // Check if both parts exist
  if (!localPart || !domain) return false;

  // Domain must contain at least one dot
  if (!domain.includes(".")) return false;

  // Ensure the domain has characters before and after the dot
  const domainParts = domain.split(".");
  if (domainParts.some((part) => part.length === 0)) return false;

  // Basic local part validation (optional, but ensures no invalid characters)
  if (localPart.length === 0 || /\s/.test(localPart)) return false;

  return true;
}  

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState(null);
  const [isLogining, setIsLogining] = useState(false);
  const userInfoRef = {
    email: useRef(null),
    password: useRef(null),
    username: useRef(null),
    dob: useRef(null),
  }
  const [isAnimating, setIsAnimating] = useState(false);
  const [dobError, setDobError] = useState(null);
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
      setIsLogin((state) => {
        setIsAnimating(false);
        return !state;
      });
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
      setDobError(() => 'You must be at least 13 years old to register.');
      return false;
    } else if (age > 120) {
      setDobError(() => 'Please enter a valid date of birth.');
      return false;
    }

    setDobError(() => null);
    return true;
  };

  const handleSubmit = useCallback((e) => {
    if (isLogining === true) return;

    if (!isLogin && !validateDateOfBirth(userInfoRef.dob.current.value)) return;
    
    if (!isValidEmail(userInfoRef.email.current.value)) {
      setMsg({success: false, message: "Invalid Email Format"});
      setTimeout(() => setMsg(null), 2000)
      return;
    }

    setIsLogining(true);
    if (isLogin === true) {
      handleLoginForm({ email: userInfoRef.email.current.value, password: userInfoRef.password.current.value }, setMsg).then((success) => {
        if (success === true) {
          globalThis.location.href = `${redirected_path || "/"}?${path_to_redirect}`;
        } else if (success === false) {
          setIsLogining(false);
        }
      });
    } else if (isLogin === false) {
      const UserInfo = {
        email: userInfoRef.email.current.value,
        password: userInfoRef.password.current.value,
        dob: userInfoRef.dob.current.value,
        username: userInfoRef.username.current.value,
      }
      handleSignupForm(UserInfo, setMsg).then((success) => {
        if (success === true) {
          globalThis.location.href = `${redirected_path || "/"}?${path_to_redirect}`;
        } else if (success === false) {
          setIsLogining(false);
        }
      });
    }
  }, [isLogin, redirected_path, path_to_redirect, isLogining]);

  useEffect(() => {
    console.log(dobError)
  }, [dobError])

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
            autoComplete='on'
            onSubmit={(e) => {
              e.preventDefault();

              try {

                if (!e.target.checkValidity()) throw "Invalid Format";
                if (!isLogin && !validateDateOfBirth(userInfoRef.dob.current.value)) throw "Age not Allowed";
                handleSubmit(e);

              } catch(e) {
                setMsg({
                  success: false,
                  message: e
                });
                setTimeout(() => setMsg(null), 2000)
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
                    ref={userInfoRef.username}
                    required
                    type="text"
                    id="name"
                    placeholder="example123"
                    className="pl-10 bg-gray-700 text-gray-300 border-gray-600 w-full"
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
                  ref={userInfoRef.email}
                  required
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  className="pl-10 bg-gray-700 text-gray-300 border-gray-600 w-full"
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
                    ref={userInfoRef.dob}
                    required
                    type="date"
                    id="dob"
                    max={new Date().toISOString().split('T')[0]}
                    className="pl-10 bg-gray-700 text-gray-300 border-gray-600 w-full"
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
                  ref={userInfoRef.password}
                  required
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="••••••••"
                  className="pl-10 pr-10 bg-gray-700 text-gray-300 border-gray-600 w-full"
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
              disabled={isLogining}
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