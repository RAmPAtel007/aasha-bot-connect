import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';

interface VaccinationRecord {
  record_id: string;
  vaccine_name: string;
  due_date: string;
  status: string;
}

interface VaccinationCalendarProps {
  userId: string;
}

const VaccinationCalendar = ({ userId }: VaccinationCalendarProps) => {
  const [records, setRecords] = useState<VaccinationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    fetchVaccinationRecords();
  }, [userId]);

  const fetchVaccinationRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('vaccination_records' as any)
        .select('*')
        .eq('user_id', userId)
        .order('due_date', { ascending: true });

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error('Error fetching vaccination records:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'overdue':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading vaccination records...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold">{t('vaccination')}</h3>
        <Badge variant="secondary">{records.length} records</Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {records.map((record) => (
          <Card key={record.record_id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <Calendar className="h-5 w-5 text-primary mb-2" />
                <Badge className={getStatusColor(record.status)}>
                  {t(record.status.toLowerCase())}
                </Badge>
              </div>
              <CardTitle className="text-lg">{record.vaccine_name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{t('dueDate')}: {new Date(record.due_date).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {records.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No vaccination records found.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VaccinationCalendar;
