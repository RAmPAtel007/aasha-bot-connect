import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, MapPin } from 'lucide-react';

interface OutbreakAlert {
  alert_id: string;
  disease_name: string;
  severity: string;
  location: string;
  issued_date: string;
  recommended_measures: string;
}

const OutbreakAlerts = () => {
  const [alerts, setAlerts] = useState<OutbreakAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    fetchOutbreakAlerts();
  }, []);

  const fetchOutbreakAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('outbreak_alerts' as any)
        .select('*')
        .order('issued_date', { ascending: false })
        .limit(10);

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error('Error fetching outbreak alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading outbreak alerts...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold">{t('outbreakAlerts')}</h3>
        <Badge variant="destructive">{alerts.length} active alerts</Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {alerts.map((alert) => (
          <Card key={alert.alert_id} className="hover:shadow-lg transition-shadow border-l-4 border-l-red-500">
            <CardHeader>
              <div className="flex items-start justify-between">
                <AlertTriangle className="h-5 w-5 text-red-500 mb-2" />
                <Badge className={getSeverityColor(alert.severity)}>
                  {t(alert.severity.toLowerCase())}
                </Badge>
              </div>
              <CardTitle className="text-lg">{alert.disease_name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{alert.location}</span>
              </div>
              <p className="text-sm">{alert.recommended_measures}</p>
              <p className="text-xs text-muted-foreground">
                Issued: {new Date(alert.issued_date).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      {alerts.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No active outbreak alerts.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OutbreakAlerts;
