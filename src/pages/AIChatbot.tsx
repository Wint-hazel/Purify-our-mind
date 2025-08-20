import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import VoiceInterface from '@/components/VoiceInterface';

export default function AIChatbot() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="bg-gradient-subtle">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              AI Mental Health Support
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Connect with our AI-powered mental health companion for personalized voice support, 
              coping strategies, and emotional guidance available 24/7.
            </p>
          </div>
          
          {/* Voice Interface */}
          <VoiceInterface onSpeakingChange={setIsSpeaking} />
          
          {/* Support Information */}
          <div className="max-w-4xl mx-auto mt-12">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-xl font-semibold mb-4">What You Can Expect</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Compassionate listening and emotional validation</li>
                  <li>• Guided breathing and relaxation exercises</li>
                  <li>• Personalized coping strategies</li>
                  <li>• Crisis intervention resources when needed</li>
                  <li>• Safe space to express your feelings</li>
                </ul>
              </div>
              
              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-xl font-semibold mb-4">Important Notice</h3>
                <p className="text-muted-foreground text-sm">
                  This AI companion provides supportive listening and guidance but is not a replacement 
                  for professional mental health care. If you're experiencing a mental health crisis 
                  or having thoughts of self-harm, please contact emergency services or a crisis hotline immediately.
                </p>
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800">
                    Crisis Hotline: 988 (Suicide & Crisis Lifeline)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}