import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Hospital, Phone, MapPin, ExternalLink } from 'lucide-react';

interface HospitalData {
  hospital_id: string;
  name: string;
  address: string;
  phone: string;
  availability: string;
  geo_location: string;
}

const HospitalFinder = () => {
  const [hospitals, setHospitals] = useState<HospitalData[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('hospitals')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setHospitals(data || []);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAvailabilityColor = (availability: string) => {
    return availability.toLowerCase() === 'available' ? 'bg-green-500' : 'bg-red-500';
  };

  const openDirections = (geoLocation: string) => {
    if (geoLocation) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${geoLocation}`, '_blank');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading hospitals...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold">{t('hospitals')}</h3>
        <Badge variant="secondary">{hospitals.length} hospitals</Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hospitals.map((hospital) => (
          <Card key={hospital.hospital_id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <Hospital className="h-5 w-5 text-primary mb-2" />
                <Badge className={getAvailabilityColor(hospital.availability)}>
                  {t(hospital.availability.toLowerCase())}
                </Badge>
              </div>
              <CardTitle className="text-lg">{hospital.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{hospital.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href={`tel:${hospital.phone}`} className="text-primary hover:underline">
                  {hospital.phone}
                </a>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2"
                onClick={() => openDirections(hospital.geo_location)}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                {t('getDirections')}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {hospitals.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No hospitals found.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HospitalFinder;
