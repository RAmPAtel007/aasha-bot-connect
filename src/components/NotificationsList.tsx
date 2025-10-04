import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Clock } from 'lucide-react';

interface Notification {
  notification_id: string;
  type: string;
  channel: string;
  content: string;
  schedule_time: string;
  status: string;
}

interface NotificationsListProps {
  userId: string;
}

const NotificationsList = ({ userId }: NotificationsListProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    fetchNotifications();
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('schedule_time', { ascending: false })
        .limit(20);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'sent':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    return <Bell className="h-5 w-5 text-primary" />;
  };

  if (loading) {
    return <div className="text-center py-8">Loading notifications...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold">{t('notifications')}</h3>
        <Badge variant="secondary">{notifications.length} notifications</Badge>
      </div>
      <div className="space-y-3">
        {notifications.map((notification) => (
          <Card key={notification.notification_id} className="hover:shadow-md transition-shadow">
            <CardContent className="flex items-start gap-4 p-4">
              <div className="mt-1">{getTypeIcon(notification.type)}</div>
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{notification.type}</p>
                    <p className="text-sm text-muted-foreground mt-1">{notification.content}</p>
                  </div>
                  <Badge className={getStatusColor(notification.status)}>
                    {notification.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(notification.schedule_time).toLocaleString()}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {notification.channel}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {notifications.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No notifications yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NotificationsList;
