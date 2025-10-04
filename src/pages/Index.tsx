import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, Shield, MessageCircle, Calendar, AlertTriangle, Hospital } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <Heart className="h-16 w-16 text-primary animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-fade-in">
            MedMitra Assistant
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground animate-fade-in">
            Your AI-powered companion for preventive healthcare, vaccination tracking, and health emergencies
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in pt-4">
            <Button size="lg" onClick={() => navigate('/auth')} className="text-lg px-8 py-6">
              Get Started
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/auth')} className="text-lg px-8 py-6">
              Sign In
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-16 max-w-6xl mx-auto">
          {[
            {
              icon: <MessageCircle className="h-8 w-8" />,
              title: "AI Chatbot Assistant",
              desc: "Get instant health advice and symptom checking through our multilingual AI chatbot"
            },
            {
              icon: <Calendar className="h-8 w-8" />,
              title: "Vaccination Schedule",
              desc: "Track and get reminders for all your vaccination appointments"
            },
            {
              icon: <AlertTriangle className="h-8 w-8" />,
              title: "Outbreak Alerts",
              desc: "Stay informed about disease outbreaks in your area with real-time alerts"
            },
            {
              icon: <Hospital className="h-8 w-8" />,
              title: "Hospital Finder",
              desc: "Find nearby hospitals with availability status and contact information"
            },
            {
              icon: <Shield className="h-8 w-8" />,
              title: "Emergency Help",
              desc: "Quick access to emergency services and family notifications"
            },
            {
              icon: <Heart className="h-8 w-8" />,
              title: "Health Tips",
              desc: "Daily preventive healthcare tips and seasonal health advice"
            }
          ].map((feature, i) => (
            <div
              key={i}
              className="p-6 bg-card rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105 border border-border"
            >
              <div className="text-primary mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Multilingual Support */}
        <div className="text-center pt-16 space-y-4">
          <h2 className="text-3xl font-bold">Available in 6 Languages</h2>
          <p className="text-muted-foreground">
            English • हिंदी • मराठी • தமிழ் • বাংলা • മലയാളം
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
