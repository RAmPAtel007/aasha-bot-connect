import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, Languages, LogOut, Calendar, AlertTriangle, Hospital, Bell, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ChatbotWidget from '@/components/ChatbotWidget';
import HealthTips from '@/components/HealthTips';
import VaccinationCalendar from '@/components/VaccinationCalendar';
import OutbreakAlerts from '@/components/OutbreakAlerts';
import HospitalFinder from '@/components/HospitalFinder';
import NotificationsList from '@/components/NotificationsList';

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showChatbot, setShowChatbot] = useState(false);
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (!session) {
          navigate('/auth');
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) {
        navigate('/auth');
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">{t('appName')}</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowChatbot(!showChatbot)}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              {t('chatbot')}
            </Button>
            <Select value={language} onValueChange={(val: any) => setLanguage(val)}>
              <SelectTrigger className="w-[140px]">
                <Languages className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिंदी</SelectItem>
                <SelectItem value="mr">मराठी</SelectItem>
                <SelectItem value="ta">தமிழ்</SelectItem>
                <SelectItem value="bn">বাংলা</SelectItem>
                <SelectItem value="ml">മലയാളം</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              {t('logout')}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">{t('dashboard')}</h2>
          <p className="text-muted-foreground">
            Welcome back! Here's your health overview.
          </p>
        </div>

        <Tabs defaultValue="health-tips" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto">
            <TabsTrigger value="health-tips" className="gap-2">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">{t('healthTips')}</span>
            </TabsTrigger>
            <TabsTrigger value="vaccination" className="gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">{t('vaccination')}</span>
            </TabsTrigger>
            <TabsTrigger value="outbreaks" className="gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">{t('outbreakAlerts')}</span>
            </TabsTrigger>
            <TabsTrigger value="hospitals" className="gap-2">
              <Hospital className="h-4 w-4" />
              <span className="hidden sm:inline">{t('hospitals')}</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">{t('notifications')}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="health-tips">
            <HealthTips />
          </TabsContent>

          <TabsContent value="vaccination">
            <VaccinationCalendar userId={user?.id} />
          </TabsContent>

          <TabsContent value="outbreaks">
            <OutbreakAlerts />
          </TabsContent>

          <TabsContent value="hospitals">
            <HospitalFinder />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationsList userId={user?.id} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Chatbot Widget */}
      {showChatbot && (
        <ChatbotWidget
          userId={user?.id}
          onClose={() => setShowChatbot(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
