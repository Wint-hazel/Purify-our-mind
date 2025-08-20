import { Link } from 'react-router-dom';
import { Phone, Mail, AlertTriangle } from 'lucide-react';
import logo from '@/assets/logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-subtle border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Crisis Support Notice */}
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-8">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-destructive mb-1">Crisis Support</h3>
              <p className="text-sm text-muted-foreground">
                If you are in crisis, please reach out to a licensed professional or local support hotline immediately. 
                This platform is for wellness support, not crisis intervention.
              </p>
              <div className="mt-2 text-sm">
                <p className="text-muted-foreground">
                  <strong>Emergency:</strong> 911 | <strong>Crisis Text Line:</strong> Text HOME to 741741
                  | <strong>National Suicide Prevention Lifeline:</strong> 988
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center mb-4">
              <img src={logo} alt="Purify Our Mind" className="h-12 w-auto" />
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Purifying minds, one day at a time. Your journey to mental wellness starts here.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/" className="block text-sm text-muted-foreground hover:text-primary transition-smooth">
                Home
              </Link>
              <Link to="/services" className="block text-sm text-muted-foreground hover:text-primary transition-smooth">
                Services
              </Link>
              <Link to="/daily-plans" className="block text-sm text-muted-foreground hover:text-primary transition-smooth">
                Daily Plans
              </Link>
              <Link to="/ai-chatbot" className="block text-sm text-muted-foreground hover:text-primary transition-smooth">
                AI Support
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Support</h3>
            <div className="space-y-2">
              <Link to="/contact" className="block text-sm text-muted-foreground hover:text-primary transition-smooth">
                Contact Us
              </Link>
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-smooth">
                Privacy Policy
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-smooth">
                Terms of Service
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-smooth">
                FAQ
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact Info</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>support@mindpure.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>1-800-MINDPURE</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} MindPure. All rights reserved. | Building a safer, healthier digital space for mental wellness.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;