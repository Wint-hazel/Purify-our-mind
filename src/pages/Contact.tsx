import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Clock, Send, Heart } from 'lucide-react';

const Contact = () => {
  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Support',
      content: 'support@mindpure.com',
      description: 'Get help via email within 24 hours'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      content: '1-800-MINDPURE',
      description: 'Monday-Friday, 9AM-6PM EST'
    },
    {
      icon: MapPin,
      title: 'Office Location',
      content: '123 Wellness Drive, Calm City, CA',
      description: 'By appointment only'
    },
    {
      icon: Clock,
      title: 'Response Time',
      content: 'Within 24 hours',
      description: 'We prioritize your mental health'
    }
  ];

  const faqItems = [
    {
      question: 'Is my information secure and private?',
      answer: 'Yes, we use end-to-end encryption and follow HIPAA compliance standards. Your mental health journey is completely private and secure.'
    },
    {
      question: 'Can I use MindPure if I\'m already seeing a therapist?',
      answer: 'Absolutely! MindPure is designed to complement professional mental health care, not replace it. We encourage you to discuss our tools with your therapist.'
    },
    {
      question: 'What if I\'m in crisis or having suicidal thoughts?',
      answer: 'Please reach out to emergency services (911) or the National Suicide Prevention Lifeline (988) immediately. MindPure is for wellness support, not crisis intervention.'
    },
    {
      question: 'How much does MindPure cost?',
      answer: 'We offer both free and premium features. Basic wellness tools are free, while advanced features and personalized plans are available with a subscription.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're here to support you on your mental health journey. Reach out with questions, feedback, or if you need assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-card shadow-card animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl font-bold text-foreground">
                  <Heart className="w-6 h-6 text-primary mr-3" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">First Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Last Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Your last name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
                  <select className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>General Inquiry</option>
                    <option>Technical Support</option>
                    <option>Privacy Question</option>
                    <option>Feature Request</option>
                    <option>Partnership</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                  <textarea
                    rows={6}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>
                <Button className="w-full bg-primary text-primary-foreground hover-glow">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {contactInfo.map((info, index) => (
              <Card key={index} className="bg-gradient-card shadow-card hover-glow transition-gentle animate-fade-in">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <info.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{info.title}</h3>
                      <p className="text-primary font-medium mb-1">{info.content}</p>
                      <p className="text-sm text-muted-foreground">{info.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12 animate-fade-in">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqItems.map((faq, index) => (
              <Card key={index} className="bg-gradient-card shadow-card animate-fade-in">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-3">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Support Hours */}
        <Card className="bg-gradient-subtle shadow-card animate-fade-in">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Support Hours</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Email Support</h3>
                <p className="text-muted-foreground">24/7 - We'll respond within 24 hours</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Phone Support</h3>
                <p className="text-muted-foreground">Monday-Friday, 9AM-6PM EST</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">AI Chat</h3>
                <p className="text-muted-foreground">Available 24/7 for immediate support</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;