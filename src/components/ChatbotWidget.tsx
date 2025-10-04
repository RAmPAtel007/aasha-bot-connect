import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Send, Mic, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ChatbotWidgetProps {
  userId: string;
  onClose: () => void;
}

const ChatbotWidget = ({ userId, onClose }: ChatbotWidgetProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const { toast } = useToast();

  useEffect(() => {
    initConversation();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const initConversation = async () => {
    try {
      const { data, error } = await supabase
        .from('conversations' as any)
        .insert({
          user_id: userId,
          channel: 'web',
          status: 'active',
        })
        .select()
        .single();

      if (error) throw error;
      setConversationId(data?.conversation_id);

      // Add welcome message
      const welcomeMsg: Message = {
        id: 'welcome',
        sender: 'bot',
        content: t('startChat'),
        timestamp: new Date(),
      };
      setMessages([welcomeMsg]);
    } catch (error: any) {
      console.error('Error initializing conversation:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !conversationId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Save user message
      await supabase.from('messages' as any).insert({
        conversation_id: conversationId,
        sender: 'user',
        message_text: input,
      });

      // Log the query
      await supabase.from('chatbot_logs' as any).insert({
        user_id: userId,
        query: input,
        response: 'Processing...',
      });

      // Simulate bot response (replace with actual AI integration)
      const botResponse = await generateBotResponse(input);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        content: botResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);

      // Save bot message
      await supabase.from('messages' as any).insert({
        conversation_id: conversationId,
        sender: 'bot',
        message_text: botResponse,
      });

      // Update log
      await supabase
        .from('chatbot_logs' as any)
        .update({ response: botResponse } as any)
        .eq('user_id', userId)
        .eq('query', input);
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateBotResponse = async (query: string): Promise<string> => {
    // Simple keyword-based responses (replace with actual AI integration)
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('fever') || lowerQuery.includes('temperature')) {
      return "I understand you're experiencing fever. Common causes include infections, flu, or COVID-19. Please monitor your temperature and if it persists above 102°F (38.9°C) or you have difficulty breathing, seek immediate medical attention. Would you like me to find nearby hospitals?";
    }

    if (lowerQuery.includes('headache') || lowerQuery.includes('head pain')) {
      return "Headaches can be caused by stress, dehydration, or other conditions. Try resting in a quiet, dark room and staying hydrated. If the headache is severe or accompanied by vision problems, seek medical help. Would you like preventive health tips?";
    }

    if (lowerQuery.includes('cough') || lowerQuery.includes('cold')) {
      return "For cough and cold, stay hydrated, rest well, and consider warm liquids. If symptoms worsen or persist beyond a week, please consult a doctor. I can help you find nearby hospitals or check vaccination schedules.";
    }

    if (lowerQuery.includes('emergency') || lowerQuery.includes('urgent')) {
      return "This seems urgent. I'm alerting your registered family members and finding the nearest hospitals. Please call emergency services (108 in India) if needed. Stay calm and describe your symptoms.";
    }

    if (lowerQuery.includes('vaccine') || lowerQuery.includes('vaccination')) {
      return "You can check your vaccination schedule in the Vaccination tab. Common vaccines include COVID-19, Flu, Hepatitis B, and others. Would you like to see your upcoming vaccinations?";
    }

    if (lowerQuery.includes('hospital') || lowerQuery.includes('doctor')) {
      return "I can help you find nearby hospitals. Please check the Hospitals tab for a list of facilities with availability status and contact information.";
    }

    return "I'm here to help you with health information, symptom checking, vaccination schedules, and finding hospitals. How can I assist you today?";
  };

  const handleVoiceInput = () => {
    toast({
      title: "Voice Input",
      description: "Voice input feature coming soon! (Integrate Web Speech API or cloud STT)",
    });
  };

  return (
    <Card className="fixed bottom-4 right-4 w-96 h-[600px] shadow-2xl z-50 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
        <CardTitle className="text-lg font-semibold">{t('chatbot')}</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t('typeMessage')}
              disabled={loading}
            />
            <Button size="icon" variant="outline" onClick={handleVoiceInput}>
              <Mic className="h-4 w-4" />
            </Button>
            <Button size="icon" onClick={handleSend} disabled={loading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatbotWidget;
