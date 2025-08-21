import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Stethoscope, 
  Building2, 
  Clock, 
  Phone, 
  MapPin, 
  Heart, 
  Star, 
  User,
  GraduationCap
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import AppointmentBookingModal from '@/components/AppointmentBookingModal';
import MapModal from '@/components/MapModal';
import { toast } from 'sonner';

const HealthRecommendations = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<any>(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  const handleBookAppointment = (doctor: any) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDoctor(null);
  };

  const handleGetDirections = (hospital: any) => {
    setSelectedHospital(hospital);
    setIsMapModalOpen(true);
  };

  const handleCloseMapModal = () => {
    setIsMapModalOpen(false);
    setSelectedHospital(null);
  };

  const handleCallNow = (phone: string) => {
    // For web browsers, we'll show a toast with instructions
    if (navigator.userAgent.match(/Mobile|Android|iPhone|iPad/)) {
      // On mobile devices, try to initiate a call
      window.location.href = `tel:${phone}`;
    } else {
      // On desktop, show helpful message
      toast.info(`Call ${phone}`, {
        description: 'Click to copy the phone number to your clipboard',
        action: {
          label: 'Copy',
          onClick: () => {
            navigator.clipboard.writeText(phone);
            toast.success('Phone number copied to clipboard');
          }
        }
      });
    }
  };

  const doctors = [
    {
      id: 1,
      name: 'Dr. Sarah Chen',
      title: 'Psychiatrist',
      qualifications: 'M.B.,B.S., M.Med.Sc., Ph.D.',
      specialization: 'Anxiety & Depression Treatment',
      rating: 4.9,
      experience: '15+ years',
      avatar: '👩‍⚕️'
    },
    {
      id: 2,
      name: 'Dr. Michael Rodriguez',
      title: 'Psychiatrist',
      qualifications: 'M.D., M.Sc. Psychiatry',
      specialization: 'Addiction & Recovery Specialist',
      rating: 4.8,
      experience: '12+ years',
      avatar: '👨‍⚕️'
    },
    {
      id: 3,
      name: 'Dr. Emily Watson',
      title: 'Psychiatrist',
      qualifications: 'M.B.,B.S., D.P.M.',
      specialization: 'Brain Stimulation Therapy',
      rating: 4.9,
      experience: '18+ years',
      avatar: '👩‍⚕️'
    },
    {
      id: 4,
      name: 'Dr. James Thompson',
      title: 'Psychiatrist',
      qualifications: 'M.D., Fellowship in Child Psychiatry',
      specialization: 'Child & Adolescent Mental Health',
      rating: 4.7,
      experience: '10+ years',
      avatar: '👨‍⚕️'
    }
  ];

  const hospitals = [
    {
      id: 1,
      name: 'Serenity Mental Health Center',
      address: '123 Wellness Drive, Healthcare District',
      hours: 'Mon-Fri: 8:00 AM - 6:00 PM, Sat: 9:00 AM - 4:00 PM',
      phone: '+1 (555) 123-4567',
      type: 'Specialized Mental Health Clinic'
    },
    {
      id: 2,
      name: 'Hope Springs Medical Center',
      address: '456 Recovery Lane, Central City',
      hours: '24/7 Emergency Services Available',
      phone: '+1 (555) 234-5678',
      type: 'General Hospital with Mental Health Wing'
    },
    {
      id: 3,
      name: 'Mindful Care Therapy Center',
      address: '789 Tranquil Street, Peaceful Valley',
      hours: 'Mon-Thu: 9:00 AM - 8:00 PM, Fri-Sat: 9:00 AM - 5:00 PM',
      phone: '+1 (555) 345-6789',
      type: 'Outpatient Therapy & Counseling'
    },
    {
      id: 4,
      name: 'Harmony Psychiatric Hospital',
      address: '321 Healing Boulevard, Medical Quarter',
      hours: 'Mon-Sun: 24/7 Inpatient & Outpatient Services',
      phone: '+1 (555) 456-7890',
      type: 'Full-Service Psychiatric Hospital'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Heart className="w-12 h-12 text-pink-400" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
              Doctor & Therapist Recommendations
            </h1>
            <Heart className="w-12 h-12 text-pink-400" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            🌟 Connecting you with trusted mental health professionals who care about your wellbeing. 
            Take the first step towards a healthier, happier you.
          </p>
        </div>

        {/* Doctors Section */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <Stethoscope className="w-8 h-8 text-blue-500" />
            <h2 className="text-3xl font-bold text-gray-800">
              ✨ Recommended Psychiatrists
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.map((doctor) => (
              <Card 
                key={doctor.id} 
                className="group hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm"
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-4xl">
                    {doctor.avatar}
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {doctor.name}
                  </CardTitle>
                  <Badge variant="secondary" className="mx-auto bg-blue-100 text-blue-700 hover:bg-blue-200">
                    <User className="w-3 h-3 mr-1" />
                    {doctor.title}
                  </Badge>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <GraduationCap className="w-4 h-4 text-purple-500" />
                    <span className="text-gray-600 font-medium">{doctor.qualifications}</span>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700 font-medium text-center">
                      {doctor.specialization}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-semibold text-gray-700">{doctor.rating}</span>
                    </div>
                    <span className="text-gray-600">{doctor.experience}</span>
                  </div>
                  
                  <Button 
                    onClick={() => handleBookAppointment(doctor)}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                  >
                    Book Appointment
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Hospitals Section */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Building2 className="w-8 h-8 text-green-500" />
            <h2 className="text-3xl font-bold text-gray-800">
              🏥 Hospital & Clinic Guidance
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hospitals.map((hospital) => (
              <Card 
                key={hospital.id} 
                className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm"
              >
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-blue-100 rounded-xl flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-green-600 transition-colors mb-2">
                        {hospital.name}
                      </CardTitle>
                      <Badge variant="outline" className="text-xs border-green-200 text-green-700">
                        {hospital.type}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-600 text-sm leading-relaxed">{hospital.address}</p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-600 text-sm leading-relaxed">{hospital.hours}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <a 
                      href={`tel:${hospital.phone}`} 
                      className="text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors"
                    >
                      {hospital.phone}
                    </a>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 border-green-200 text-green-700 hover:bg-green-50"
                      onClick={() => handleGetDirections(hospital)}
                    >
                      Get Directions
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                      onClick={() => handleCallNow(hospital.phone)}
                    >
                      Call Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Bottom Message */}
        <div className="text-center mt-16 p-8 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20">
          <Heart className="w-12 h-12 text-pink-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            💝 Remember: Seeking help is a sign of strength
          </h3>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Your mental health journey is unique, and these professionals are here to support you every step of the way. 
            Don't hesitate to reach out - you deserve care and compassion.
          </p>
        </div>
      </main>
      
      <Footer />
      
      <AppointmentBookingModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        doctor={selectedDoctor}
      />
      
      <MapModal
        isOpen={isMapModalOpen}
        onClose={handleCloseMapModal}
        hospitalName={selectedHospital?.name || ''}
        hospitalAddress={selectedHospital?.address || ''}
      />
    </div>
  );
};

export default HealthRecommendations;