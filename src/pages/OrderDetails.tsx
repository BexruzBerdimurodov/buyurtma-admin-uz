
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { 
  MapPin, User, Phone, Package, ArrowLeft, MapIcon, 
  Clock, CheckCircle2, ReceiptText, Check 
} from "lucide-react";

interface OrderDetailsProps {
  order: {
    id: string;
    customer: {
      name: string;
      phone: string;
    };
    location: string;
    items: {
      name: string;
      quantity: number;
      price: number;
    }[];
    status: string;
    createdAt: string;
  };
}

const OrderDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state as OrderDetailsProps;
  const [isCompleted, setIsCompleted] = useState(false);

  React.useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [navigate]);

  const handleGoogleMaps = () => {
    const encodedAddress = encodeURIComponent(order.location);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank');
    toast({
      title: "Yo'nalish ochildi",
      description: "Google Xaritalar ilovasida yo'nalish ko'rsatilmoqda",
      variant: "default",
    });
  };
  
  const handleOrderComplete = () => {
    setIsCompleted(true);
    
    toast({
      title: "Buyurtma yakunlandi!",
      description: `Buyurtma #${order.id} muvaffaqiyatli yakunlandi`,
      variant: "default",
    });
    
    setTimeout(() => {
      navigate('/');
    }, 2500);
  };

  // Calculate estimated delivery time (15-30 minutes from now)
  const now = new Date();
  const minDeliveryTime = new Date(now.getTime() + 15 * 60000);
  const maxDeliveryTime = new Date(now.getTime() + 30 * 60000);
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('uz-UZ', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate total price
  const calculateTotal = (items: OrderDetailsProps['order']['items']) => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };
  
  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('uz-UZ', { 
      style: 'currency', 
      currency: 'UZS',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-6">
          <Button 
            variant="outline" 
            className="gap-2 mb-4" 
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4" />
            Orqaga
          </Button>
          
          {isCompleted && (
            <div className="mb-4 bg-green-100 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-3 animate-fade-in">
              <div className="bg-green-200 p-2 rounded-full">
                <Check className="h-5 w-5 text-green-700" />
              </div>
              <div>
                <h3 className="font-medium">Buyurtma yakunlandi!</h3>
                <p className="text-sm">Buyurtma #{order.id} muvaffaqiyatli yakunlandi</p>
              </div>
            </div>
          )}
          
          <Card className="glass-panel border-none shadow-md">
            <CardHeader className="pb-2 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-t-xl">
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                  <ReceiptText className="h-6 w-6" />
                  Buyurtma #{order.id}
                </CardTitle>
                <Badge variant={isCompleted ? "outline" : "outline"} className={`text-sm px-3 py-1 ${isCompleted ? "text-green-600 bg-green-50" : "text-blue-600 bg-blue-50"}`}>
                  {isCompleted ? 'Yakunlandi' : order.status === 'accepted' ? 'Qabul qilingan' : 'Yangi'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {new Date(order.createdAt).toLocaleString('uz-UZ')}
              </p>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              {/* Admin Dashboard Alert */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <h3 className="text-blue-700 font-medium flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Yetkazib beruvchi uchun ma'lumot
                </h3>
                <p className="text-blue-600 text-sm">
                  Siz ushbu buyurtmani qabul qildingiz. Iloji boricha tezroq mijozga yetkazib berishingiz kerak.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {/* Customer Info Section */}
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                  <h3 className="font-medium mb-3 text-gray-700">Mijoz ma'lumotlari</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-sm">Ism</p>
                        <p className="text-gray-700">{order.customer.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-sm">Telefon</p>
                        <a 
                          href={`tel:${order.customer.phone}`} 
                          className="text-gray-700 hover:text-primary underline"
                        >
                          {order.customer.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Info Section */}
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                  <h3 className="font-medium mb-3 text-gray-700">Yetkazib berish</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <p className="font-medium text-sm">Manzil</p>
                        <p className="text-gray-700">{order.location}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <p className="font-medium text-sm">Yetkazib berish vaqti</p>
                        <p className="text-gray-700">{formatTime(minDeliveryTime)} - {formatTime(maxDeliveryTime)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />
              
              {/* Order Items Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  <h3 className="font-medium text-gray-700">Buyurtma tarkibi</h3>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">Soni: {item.quantity}</p>
                      </div>
                      <p className="font-medium">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                  <div className="pt-3 mt-2 border-t">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold">Jami summa:</p>
                      <p className="font-bold text-lg text-primary">
                        {formatCurrency(calculateTotal(order.items))}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 gap-2 text-white"
                onClick={handleGoogleMaps}
                disabled={isCompleted}
              >
                <MapIcon className="h-5 w-5" />
                Qani ketdik
              </Button>
              
              <Button
                className={`w-full gap-2 ${isCompleted ? 'bg-green-600 hover:bg-green-700' : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'}`}
                onClick={handleOrderComplete}
                disabled={isCompleted}
              >
                <CheckCircle2 className="h-5 w-5" />
                {isCompleted ? 'Yakunlandi' : 'Buyurtma yakunlandi'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
