import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Calendar, Bot, Shield, Users, CheckCircle, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '@/assets/hero-image.jpg';

const Index = () => {
  const highlightCards = [
    {
      title: 'Daily Plans',
      description: 'Structured daily routines and wellness checklists designed to support your mental health journey with guided activities.',
      icon: Calendar,
      link: '/daily-plans',
      gradient: 'from-primary/20 to-primary-light/20'
    },
    {
      title: 'Guided Support',
      description: 'Step-by-step guidance, evidence-based exercises, and professional resources to help you build resilience.',
      icon: Users,
      link: '/services',
      gradient: 'from-success/20 to-success/30'
    },
    {
      title: 'AI Chatbot',
      description: 'Get immediate, compassionate support from our AI trained in mental health practices, available 24/7.',
      icon: Bot,
      link: '/ai-chatbot',
      gradient: 'from-primary-light/20 to-primary/20'
    },
    {
      title: 'Private & Secure',
      description: 'Your mental health journey is protected with end-to-end encryption and complete privacy safeguards.',
      icon: Shield,
      link: '/contact',
      gradient: 'from-muted/30 to-accent/20'
    }
  ];

  const testimonials = [
    {
      text: "MindPure has been a game-changer for my daily mental health routine. The guided plans help me stay centered and focused.",
      author: "Sarah M.",
      rating: 5
    },
    {
      text: "I love how private and secure everything feels. The AI chatbot provides amazing support whenever I need it.",
      author: "Michael R.",
      rating: 5
    },
    {
      text: "The daily routines are perfect for building healthy habits. I feel more in control of my mental wellness.",
      author: "Emma L.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-hero py-20 lg:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background/80 to-primary-light/10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-fade-in">
                <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-6">
                  Purify Your Mind, 
                  <span className="text-primary"> One Day at a Time</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  Discover inner peace through mindful daily practices, professional guidance, and a supportive community. 
                  Your journey to mental wellness starts with a single, gentle step.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
                  <Link to="/daily-plans">
                    <Button size="lg" className="bg-primary text-primary-foreground hover-glow transition-smooth px-8 py-4 text-lg font-medium">
                      Get Started
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link to="/services">
                    <Button size="lg" variant="outline" className="px-8 py-4 text-lg font-medium hover-glow transition-smooth">
                      Explore Services
                    </Button>
                  </Link>
                </div>
                
                {/* Supportive friendship image */}
                <div className="animate-fade-in">
                  <img 
                    src="/lovable-uploads/ece7f644-f532-4318-bb56-110ac4da7163.png" 
                    alt="Two friends supporting each other - one offering help to another in a warm, golden park setting"
                    className="w-full max-w-lg mx-auto h-auto rounded-2xl shadow-soft"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Highlight Cards Section */}
        <section className="py-20 bg-gradient-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Your Path to Mental Wellness
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Comprehensive tools and support designed to help you build resilience, find peace, and create lasting positive change.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {highlightCards.map((card, index) => (
                <Card key={index} className="bg-gradient-card shadow-card hover-glow transition-gentle animate-fade-in group">
                  <CardContent className="p-8 text-center">
                    <div className={`bg-gradient-to-br ${card.gradient} p-4 rounded-2xl w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-smooth`}>
                      <card.icon className="w-8 h-8 text-primary mx-auto" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">{card.title}</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">{card.description}</p>
                    <Link to={card.link}>
                      <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-smooth">
                        Learn More
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial Strip */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Trusted by Those on Their Wellness Journey
              </h2>
              <p className="text-xl text-muted-foreground">
                Real experiences from people who've found their path to mental wellness
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-gradient-card shadow-card hover-glow transition-gentle animate-fade-in">
                  <CardContent className="p-8">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-primary fill-current" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6 italic leading-relaxed">
                      "{testimonial.text}"
                    </p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                        <span className="text-primary font-semibold text-sm">
                          {testimonial.author.charAt(0)}
                        </span>
                      </div>
                      <span className="font-medium text-foreground">{testimonial.author}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-hero">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Take the first step towards better mental health with our comprehensive, gentle approach to wellness.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/daily-plans">
                <Button size="lg" className="bg-primary text-primary-foreground hover-glow px-8 py-4 text-lg font-medium">
                  Start Your Daily Practice
                  <CheckCircle className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/ai-chatbot">
                <Button size="lg" variant="outline" className="px-8 py-4 text-lg font-medium hover-glow">
                  Talk to Our AI Assistant
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
