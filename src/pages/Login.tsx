
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Utensils, LogIn } from "lucide-react";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    
    // Simple credential check
    const validCredentials = [
      { username: 'umidjon', password: '123' },
      { username: 'admins', password: '123' }
    ];
    
    const isValid = validCredentials.some(
      cred => cred.username === username.toLowerCase() && cred.password === password
    );
    
    setTimeout(() => {
      setIsLoading(false);
      
      if (isValid) {
        // Store login status in localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username.toLowerCase());
        
        toast({
          title: "Muvaffaqiyatli kirish!",
          description: "Xush kelibsiz, yetkazib beruvchi!",
          variant: "default",
        });
        
        navigate('/');
      } else {
        toast({
          title: "Xatolik!",
          description: "Login yoki parol noto'g'ri",
          variant: "destructive",
        });
      }
    }, 800);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <Card className="w-full max-w-md border-none shadow-lg">
        <CardHeader className="text-center space-y-2 pb-2 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-t-xl">
          <div className="mx-auto bg-primary/10 p-3 rounded-full">
            <Utensils className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">
            Ovqat yetkazib berish
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Tizimga kirish uchun ma'lumotlaringizni kiriting
          </p>
        </CardHeader>
        
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="username">Login</Label>
              <Input 
                id="username" 
                placeholder="Login kiriting"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Parol</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Parol kiriting"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 gap-2"
              disabled={isLoading}
            >
              <LogIn className="h-5 w-5" />
              {isLoading ? "Tekshirilmoqda..." : "Kirish"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
