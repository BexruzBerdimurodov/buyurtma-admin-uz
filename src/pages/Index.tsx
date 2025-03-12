import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, User, Phone, Pizza, CheckCircle, Utensils, LogOut } from "lucide-react";

// Buyurtma (Order) tipi
interface Order {
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
  status: 'new' | 'accepted' | 'completed';
  createdAt: string;
}

// Namunali ma'lumotlar (Sample data)
const sampleOrders: Order[] = [
  {
    id: "1",
    customer: {
      name: "Umarov Sardor",
      phone: "+998 90 123 45 67"
    },
    location: "Toshkent, Chilonzor tumani, 7-kvartal",
    items: [
      {
        name: "Lavash Mol go'shtli",
        quantity: 2,
        price: 28_000
      },
      {
        name: "Coca-Cola 1.5L",
        quantity: 1,
        price: 15_000
      }
    ],
    status: "new",
    createdAt: "2023-10-15T10:30:00Z"
  },
  {
    id: "2",
    customer: {
      name: "Karimova Nilufar",
      phone: "+998 94 765 43 21"
    },
    location: "Toshkent, Yunusobod tumani, 19-kvartal",
    items: [
      {
        name: "Osh (1 porsiya)",
        quantity: 3,
        price: 45_000
      },
      {
        name: "Non",
        quantity: 2,
        price: 5_000
      },
      {
        name: "Pepsi 1L",
        quantity: 1,
        price: 12_000
      }
    ],
    status: "new",
    createdAt: "2023-10-15T11:15:00Z"
  },
  {
    id: "3",
    customer: {
      name: "Rasulov Javohir",
      phone: "+998 99 888 77 66"
    },
    location: "Toshkent, Mirobod tumani, Hamid Olimjon ko'chasi",
    items: [
      {
        name: "Pitsa Margarita (katta)",
        quantity: 1,
        price: 80_000
      },
      {
        name: "Fri kartoshka",
        quantity: 2,
        price: 18_000
      }
    ],
    status: "new",
    createdAt: "2023-10-15T12:45:00Z"
  },
  {
    id: "4",
    customer: {
      name: "Ahmedov Nodir",
      phone: "+998 91 234 56 78"
    },
    location: "Toshkent, Sergeli tumani, 3-mavze",
    items: [
      {
        name: "Chizburger",
        quantity: 3,
        price: 30_000
      },
      {
        name: "Sprite 1L",
        quantity: 1,
        price: 12_000
      }
    ],
    status: "new",
    createdAt: "2023-10-15T13:20:00Z"
  },
  {
    id: "5",
    customer: {
      name: "Abdullayeva Gulnora",
      phone: "+998 93 456 78 90"
    },
    location: "Toshkent, Shayxontohur tumani, Labzak ko'chasi",
    items: [
      {
        name: "Sho'rva (1 porsiya)",
        quantity: 2,
        price: 35_000
      },
      {
        name: "Somsa go'shtli",
        quantity: 5,
        price: 15_000
      }
    ],
    status: "new",
    createdAt: "2023-10-15T14:10:00Z"
  },
  {
    id: "6",
    customer: {
      name: "Qodirov Bekzod",
      phone: "+998 95 678 90 12"
    },
    location: "Toshkent, Olmazor tumani, 5-kvartal",
    items: [
      {
        name: "Tandir kabob",
        quantity: 2,
        price: 60_000
      },
      {
        name: "Achiq-chuchuk salat",
        quantity: 1,
        price: 20_000
      },
      {
        name: "Suv 1L",
        quantity: 2,
        price: 5_000
      }
    ],
    status: "new",
    createdAt: "2023-10-15T15:30:00Z"
  },
  {
    id: "7",
    customer: {
      name: "Aliyeva Mohira",
      phone: "+998 97 890 12 34"
    },
    location: "Toshkent, Mirzo Ulug'bek tumani, 15-mavze",
    items: [
      {
        name: "Norin (porsiya)",
        quantity: 1,
        price: 45_000
      },
      {
        name: "Choy set",
        quantity: 1,
        price: 15_000
      }
    ],
    status: "new",
    createdAt: "2023-10-15T16:45:00Z"
  },
  {
    id: "8",
    customer: {
      name: "Xoliqov Rustam",
      phone: "+998 98 012 34 56"
    },
    location: "Toshkent, Bektemir tumani, Sputnik mavzesi",
    items: [
      {
        name: "Manti (5 dona)",
        quantity: 2,
        price: 40_000
      },
      {
        name: "Qatiq",
        quantity: 1,
        price: 10_000
      }
    ],
    status: "new",
    createdAt: "2023-10-15T17:20:00Z"
  }
];

// Valyuta formati (Currency formatter)
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('uz-UZ', { 
    style: 'currency', 
    currency: 'UZS',
    maximumFractionDigits: 0
  }).format(amount);
};

const Index: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const fetchOrders = () => {
      setTimeout(() => {
        setOrders(sampleOrders);
        setLoading(false);
      }, 800);
    };

    fetchOrders();
  }, [navigate]);

  const handleAcceptOrder = (orderId: string) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, status: 'accepted' } 
          : order
      )
    );
    
    const order = orders.find(o => o.id === orderId);
    
    if (order) {
      toast({
        title: "Buyurtma qabul qilindi",
        description: `Buyurtma #${orderId} muvaffaqiyatli qabul qilindi.`,
        variant: "default",
      });
      
      navigate('/order-details', { state: { order: { ...order, status: 'accepted' } } });
    }
  };

  // Jami narxni hisoblash (Calculate total price)
  const calculateTotal = (items: Order['items']) => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="sticky top-0 z-10 glass-panel px-6 py-4 mx-auto mb-6 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-center text-primary flex items-center justify-center gap-2">
            <Utensils className="h-6 w-6" /> 
            Ovqat yetkazib berish
          </h1>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              localStorage.removeItem('isLoggedIn');
              localStorage.removeItem('username');
              navigate('/login');
            }}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Chiqish
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-12 animate-fade-in">
        <div className="mb-6 text-center">
          <Badge variant="outline" className="mb-2 px-3 py-1 text-sm font-medium text-primary">
            Yangi buyurtmalar
          </Badge>
          <h2 className="text-xl font-semibold text-gray-800">Mavjud buyurtmalar ro'yxati</h2>
          <p className="text-sm text-gray-600 mt-1">
            Salom, {localStorage.getItem('username')}! Bugun {new Date().toLocaleDateString('uz-UZ')}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i} className="order-item animate-pulse-subtle">
                <CardContent className="h-64 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <Card 
                key={order.id} 
                className={`order-item glass-panel border border-gray-100 overflow-hidden animate-fade-up ${
                  order.status === 'accepted' ? 'bg-green-50/70' : ''
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-medium">
                      Buyurtma #{order.id}
                    </CardTitle>
                    <Badge variant={order.status === 'accepted' ? "outline" : "default"}>
                      {order.status === 'new' ? 'Yangi' : 'Qabul qilingan'}
                    </Badge>
                  </div>
                  <CardDescription>
                    {new Date(order.createdAt).toLocaleString('uz-UZ')}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pb-4 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-primary" />
                      <span className="font-medium">Mijoz:</span>
                      <span>{order.customer.name}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-primary" />
                      <span className="font-medium">Telefon:</span>
                      <span>{order.customer.phone}</span>
                    </div>
                    
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-primary mt-1" />
                      <div>
                        <span className="font-medium">Manzil:</span>
                        <p className="text-gray-600">{order.location}</p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Pizza className="h-4 w-4 text-primary" />
                      Buyurtma tafsilotlari:
                    </h4>
                    <ul className="space-y-2">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="text-sm px-2 py-1 bg-white rounded-md flex justify-between">
                          <span>
                            {item.name} x{item.quantity}
                          </span>
                          <span className="text-gray-600 font-medium">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 text-right">
                      <span className="text-sm font-semibold">
                        Jami: {formatCurrency(calculateTotal(order.items))}
                      </span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-0">
                  {order.status === 'new' ? (
                    <Button
                      onClick={() => handleAcceptOrder(order.id)}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Qabul qilish
                    </Button>
                  ) : (
                    <Button
                      onClick={() => navigate('/order-details', { state: { order } })}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      Batafsil ma'lumot
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {!loading && orders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Hozircha buyurtmalar yo'q</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
