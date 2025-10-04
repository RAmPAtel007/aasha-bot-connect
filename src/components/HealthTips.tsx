import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb } from 'lucide-react';

interface HealthTip {
  kb_id: string;
  topic: string;
  content: string;
  language: string;
  last_updated: string;
}

const HealthTips = () => {
  const [tips, setTips] = useState<HealthTip[]>([]);
  const [loading, setLoading] = useState(true);
  const { language, t } = useLanguage();

  useEffect(() => {
    fetchHealthTips();
  }, [language]);

  const fetchHealthTips = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('knowledge_base_articles')
        .select('*')
        .eq('language', language)
        .order('last_updated', { ascending: false })
        .limit(6);

      if (error) throw error;
      setTips(data || []);
    } catch (error) {
      console.error('Error fetching health tips:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading health tips...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold">{t('healthTips')}</h3>
        <Badge variant="secondary">{tips.length} tips available</Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tips.map((tip) => (
          <Card key={tip.kb_id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <Lightbulb className="h-5 w-5 text-primary mb-2" />
                <Badge variant="outline">{tip.topic}</Badge>
              </div>
              <CardTitle className="text-lg">{tip.topic}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-4">{tip.content}</p>
              <p className="text-xs text-muted-foreground mt-4">
                Updated: {new Date(tip.last_updated).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HealthTips;
