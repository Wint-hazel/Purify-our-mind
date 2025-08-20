import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Users, Shield, Clock } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Brain,
      title: "Guided Mental Wellness",
      description: "Professionally designed exercises and resources to support your mental health journey with evidence-based techniques.",
      features: ["Mindfulness exercises", "Cognitive behavioral tools", "Stress management", "Anxiety support"]
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Connect with others on similar journeys in a safe, moderated environment designed for mutual support and growth.",
      features: ["Support groups", "Peer connections", "Shared experiences", "Moderated discussions"]
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      description: "Your mental health journey is private. We use end-to-end encryption and never share your personal information.",
      features: ["End-to-end encryption", "Anonymous options", "HIPAA compliant", "Data protection"]
    },
    {
      icon: Clock,
      title: "24/7 AI Support",
      description: "Our AI chatbot provides immediate support and guidance whenever you need it, trained on evidence-based mental health practices.",
      features: ["Always available", "Immediate responses", "Crisis detection", "Professional referrals"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Our Mental Health Services
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive support designed to help you on your journey to better mental health and well-being
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => (
            <Card key={index} className="bg-gradient-card shadow-card hover-glow transition-gentle animate-fade-in">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="bg-primary/10 p-3 rounded-lg mr-4">
                    <service.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{service.title}</h3>
                </div>
                <p className="text-muted-foreground mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-muted-foreground">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-subtle rounded-2xl p-12 animate-fade-in">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Take the first step towards better mental health with our comprehensive support system
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover-glow transition-smooth">
              Get Started Today
            </button>
            <button className="bg-card text-foreground border border-border px-8 py-3 rounded-lg font-medium hover:bg-accent transition-smooth">
              Learn More
            </button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Services;