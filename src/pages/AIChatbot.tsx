import React, { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, AlertTriangle } from 'lucide-react';

declare global {
  interface Window {
    Landbot: any;
  }
}

const AIChatbot = () => {

  useEffect(() => {
    // Load Landbot script
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://cdn.landbot.io/landbot-3/landbot-3.0.0.mjs';
    script.setAttribute('SameSite', 'None; Secure');
    
    script.onload = () => {
      // Initialize Landbot after script loads
      if (window.Landbot) {
        new window.Landbot.Container({
          container: '#myLandbot',
          configUrl: 'https://storage.googleapis.com/landbot.online/v3/H-3100781-96WKYTQFV1TI4B25/index.json',
        });
      }
    };
    
    document.head.appendChild(script);
    
    return () => {
      // Cleanup script when component unmounts
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="bg-gradient-subtle">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              AI Mental Health Companion
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              A safe space for mental health support. Chat with our compassionate AI companion 
              designed to listen, understand, and provide helpful guidance through text conversations.
            </p>
          </div>

          {/* Landbot Chat Interface */}
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  AI Chat Assistant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div id="myLandbot" style={{ width: '100%', height: '600px' }}></div>
              </CardContent>
            </Card>
          </div>

          {/* Support Information */}
          <div className="max-w-4xl mx-auto mt-12 grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>How I Can Help</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Listen without judgment to your concerns</li>
                  <li>• Provide coping strategies for anxiety and stress</li>
                  <li>• Guide you through breathing and relaxation exercises</li>
                  <li>• Offer support for mood and sleep issues</li>
                  <li>• Help you process difficult emotions</li>
                  <li>• Available 24/7 for supportive text conversations</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                  <AlertTriangle className="w-5 h-5" />
                  Important Notice
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                  I'm here to provide emotional support and guidance, but I'm not a replacement for 
                  professional mental health care. For serious concerns or crisis situations, 
                  please reach out to qualified professionals.
                </p>
                <div className="bg-yellow-100 dark:bg-yellow-800/30 p-3 rounded-md">
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    🆘 Crisis Hotline: 988 (Suicide & Crisis Lifeline)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AIChatbot;