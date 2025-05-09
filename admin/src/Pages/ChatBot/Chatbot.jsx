import React, { useState, useEffect, useRef } from 'react';
import { Send, Home, Building, Info, User, Bot, X, Maximize2, Minimize2, Mic, MicOff, RefreshCw, Sparkles } from 'lucide-react';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI-powered Apartment Assistant. How can I help you today? You can type or use voice to ask questions about apartments.",
      sender: 'bot',
      timestamp: new Date(),
      isAI: true
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [isAIEnabled, setIsAIEnabled] = useState(true);
  const [voiceCaption, setVoiceCaption] = useState('');
  const [showVoiceCaption, setShowVoiceCaption] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const speechRecognitionRef = useRef(null);

  // Check screen size for responsive design
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // Auto-scroll to the bottom when new messages come in
  useEffect(() => {
    scrollToBottom();
  }, [messages, isMinimized, voiceCaption]);

  // Focus input when chat opens
  useEffect(() => {
    if (!isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isMinimized]);

  // Initialize and setup Web Speech API
  useEffect(() => {
    // Check if browser supports the Web Speech API
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsRecording(true);
        setShowVoiceCaption(true);
        setVoiceCaption('Listening...');
      };
      
      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        // Update the live caption
        setVoiceCaption(finalTranscript || interimTranscript || 'Listening...');
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setVoiceCaption(`Error: ${event.error}. Please try again.`);
        setTimeout(() => {
          stopRecording();
        }, 2000);
      };
      
      recognition.onend = () => {
        // Store the final transcript
        const finalText = voiceCaption;
        
        if (finalText && finalText !== 'Listening...' && finalText.length > 3) {
          // Process the final transcript
          processVoiceInput(finalText);
        }
        
        setIsRecording(false);
        setShowVoiceCaption(false);
      };
      
      speechRecognitionRef.current = recognition;
    }
    
    // Cleanup on component unmount
    return () => {
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.stop();
        } catch {
          // Ignore errors when stopping recognition that may not be started
        }
      }
    };
  }, []);  // Remove voiceCaption from dependencies to avoid circular updates

  const scrollToBottom = () => {
    if (!isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Response data for apartment-related queries (fallback)
  const apartmentResponses = {
    search: "To help you find the perfect apartment, I need a few details: what's your preferred location, budget range, and how many bedrooms do you need?",
    amenities: "Our apartments offer various amenities including gym access, swimming pool, in-unit laundry, parking spaces, and pet-friendly options. Which specific amenities are most important to you?",
    lease: "Standard leases are typically 12 months, but we also offer 6-month and 18-month options. Early termination may incur fees. Would you like more details about lease terms?",
    maintenance: "For maintenance issues, you can submit a request through the resident portal or contact our maintenance team directly at maintenance@apartments.com. Emergency requests are handled 24/7.",
    rent: "Rent payments can be made online through the resident portal, by check at the leasing office, or through automatic bank drafts. Would you like to know about any current move-in specials?",
    application: "The application process involves credit and background checks, proof of income, and previous rental history. The application fee is $50, and you'll need to provide your ID and pay stubs.",
    pets: "Our pet policy allows cats and dogs under 50 pounds with a $300 pet deposit and $25 monthly pet rent. Breed restrictions apply. Would you like information about nearby pet amenities?",
    parking: "Parking options include one free assigned space per unit, with additional spaces available for $75/month. Visitor parking is available on a first-come basis.",
    utilities: "Most units include water and trash services. Tenants are typically responsible for electricity, gas, and internet/cable. Some premium units have utilities included in the rent.",
    moving: "For move-in, you'll need to schedule a time with the leasing office. The elevator can be reserved for your moving day, and we provide a move-in checklist to help you prepare.",
    security: "Security features include controlled access entry, 24/7 surveillance cameras, and on-site security personnel during evening hours. All units have deadbolt locks and peepholes.",
    default: "I'd be happy to help with your apartment-related questions. You can ask about finding apartments, amenities, lease terms, maintenance, rent payments, or anything else apartment-related!"
  };

  // Start voice recording using Speech Recognition API
  const startRecording = () => {
    if (!speechRecognitionRef.current) {
      addBotMessage("Sorry, voice recognition is not supported in your browser. Please try typing your question instead.");
      return;
    }
    
    try {
      // Reset caption state
      setVoiceCaption('');
      
      // Start recognition
      speechRecognitionRef.current.start();
      
      // Show initial listening message
      setVoiceCaption('Listening...');
      setShowVoiceCaption(true);
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      addBotMessage("I couldn't access your microphone. Please check your browser permissions or try typing your question instead.");
      setIsRecording(false);
      setShowVoiceCaption(false);
    }
  };

  // Stop voice recording
  const stopRecording = () => {
    if (speechRecognitionRef.current) {
      try {
        // Store final transcript before stopping
        const finalTranscript = voiceCaption;
        
        // Stop recognition
        speechRecognitionRef.current.stop();
        
        // If we have valid text, make sure we use it
        if (finalTranscript && finalTranscript !== 'Listening...' && finalTranscript.length > 3) {
          // Use a timeout to ensure we process after recognition has fully stopped
          setTimeout(() => {
            processVoiceInput(finalTranscript);
          }, 300);
        }
      } catch (e) {
        console.error("Error stopping speech recognition:", e);
      }
    }
    setIsRecording(false);
  };

  // Process final voice input text
  const processVoiceInput = async (transcribedText) => {
    if (!transcribedText || transcribedText === 'Listening...' || transcribedText.length < 3) {
      setShowVoiceCaption(false);
      return;
    }
    
    // Add user message with transcribed text
    const userMessage = {
      id: messages.length + 1,
      text: transcribedText,
      sender: 'user',
      timestamp: new Date(),
      isVoice: true
    };
    
    // Update state with the user message
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // Clean up the voice caption and show typing indicator
    setShowVoiceCaption(false);
    setVoiceCaption('');
    setIsTyping(true);
    
    // Process the transcribed text through appropriate response system
    try {
      if (isAIEnabled) {
        await handleAIResponse(transcribedText);
      } else {
        setTimeout(() => {
          respondWithBasicSystem(transcribedText);
        }, 1000);
      }
    } catch (error) {
      console.error("Error processing voice input:", error);
      addBotMessage("Sorry, I couldn't process your voice input properly. Please try again.");
    } finally {
      setIsTyping(false);
    }
  };

  // Add a bot message
  const addBotMessage = (text, isAI = false) => {
    const botMessage = {
      id: messages.length + 1,
      text: text,
      sender: 'bot',
      timestamp: new Date(),
      isAI: isAI
    };
    
    setMessages(prevMessages => [...prevMessages, botMessage]);
  };

  // Handle AI response
  const handleAIResponse = async (userInput) => {
    setIsProcessingAI(true);
    
    try {
      if (isAIEnabled) {
        // In a real implementation, you would call an AI API like OpenAI's GPT or similar
        // For demonstration purposes, we'll simulate AI responses after a delay
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Generate a more dynamic AI-like response
        let aiResponse;
        const input = userInput.toLowerCase();
        
        if (input.includes('bedroom') || input.includes('size')) {
          aiResponse = "Our apartments range from studio to 3-bedroom units. Studios are approximately 500-600 sq ft, 1-bedrooms range from 650-800 sq ft, 2-bedrooms from 900-1100 sq ft, and 3-bedrooms from 1200-1400 sq ft. All units feature open floor plans with abundant natural light. Would you like to schedule a viewing of any specific floor plan?";
        } else if (input.includes('deposit') || input.includes('fee')) {
          aiResponse = "The security deposit is typically equal to one month's rent for applicants with good credit scores. We also have a non-refundable $50 application fee per adult. For qualified applicants, we're currently offering a move-in special that reduces the deposit to $500 for leases signed this month. Would you like me to explain any other fees or costs?";
        } else if (input.includes('amenities')) {
          aiResponse = "Our property features premium amenities including a 24-hour fitness center with Peloton bikes, a resort-style pool with sundeck, co-working spaces with private booths, package reception service, a pet wash station, and a rooftop lounge with grilling areas. All units come with stainless steel appliances, in-unit washer/dryer, smart thermostats, and high-speed fiber internet ready. Which amenities are most important to you?";
        } else if (input.includes('pet') || input.includes('dog') || input.includes('cat')) {
          aiResponse = "We're definitely pet-friendly! We welcome both cats and dogs with a two-pet maximum per apartment. There's a one-time pet fee of $300 and monthly pet rent of $25 per pet. Weight limit for dogs is 50 pounds, and we do have some breed restrictions. The community features a fenced dog park and pet washing station. Would you like information about pet-friendly features in the neighborhood?";
        } else if (input.includes('lease') || input.includes('term')) {
          aiResponse = "We offer flexible lease terms ranging from 6 to 18 months. Our standard lease is 12 months, which provides the best monthly rate. Shorter terms have a slight premium. All leases include our 30-day satisfaction guarantee for new residents. If you're interested in a corporate or short-term furnished rental, we have special programs for those as well. What lease length interests you most?";
        } else {
          // For other queries, build a more contextual response
          const messageHistory = messages.slice(-4).map(m => m.text).join(' ');
          const conversationContext = messageHistory + " " + userInput;
          
          if (conversationContext.includes('price') || conversationContext.includes('cost') || conversationContext.includes('rent')) {
            aiResponse = "Our current rental rates range from $1,200 for studios, $1,450-$1,750 for one-bedrooms, $1,950-$2,400 for two-bedrooms, and $2,800+ for three-bedrooms. Rates vary based on floor plan, view, and floor level. We're running a special right now: sign a 12-month lease and get one month free! Would you like to know about any specific floor plan pricing?";
          } else if (conversationContext.includes('location') || conversationContext.includes('area') || conversationContext.includes('neighborhood')) {
            aiResponse = "Our property is ideally located in the heart of the city, just 10 minutes from downtown and 5 minutes from major shopping centers. We're within walking distance to public transportation, restaurants, and parks. The neighborhood has a walk score of 85 and a bike score of 90. Many residents commute easily to major employers in the area. Would you like specific information about nearby amenities or commute times?";
          } else {
            // Use a general but relevant response that sounds AI-like
            aiResponse = "Based on your inquiry, I'd be happy to provide more information about our apartment community. We offer modern living spaces with thoughtful amenities designed to enhance your lifestyle. Our professional management team is on-site and our maintenance staff responds quickly to requests. We've received a 4.7/5 resident satisfaction rating this year. What specific aspects of apartment living are most important for your decision?";
          }
        }
        
        // Add AI response to chat
        const botMessage = {
          id: messages.length + 2,
          text: aiResponse,
          sender: 'bot',
          timestamp: new Date(),
          isAI: true
        };
        
        setMessages(prevMessages => [...prevMessages, botMessage]);
      } else {
        // If AI is disabled, fall back to basic response system
        respondWithBasicSystem(userInput);
      }
    } catch (error) {
      console.error("Error getting AI response:", error);
      respondWithBasicSystem(userInput);
    } finally {
      setIsProcessingAI(false);
    }
  };

  // Basic rule-based response system (fallback)
  const respondWithBasicSystem = (userInput) => {
    const input = userInput.toLowerCase();
    let response;

    if (input.includes('find') || input.includes('search') || input.includes('looking')) {
      response = apartmentResponses.search;
    } else if (input.includes('amenities') || input.includes('features') || input.includes('offer')) {
      response = apartmentResponses.amenities;
    } else if (input.includes('lease') || input.includes('contract') || input.includes('agreement')) {
      response = apartmentResponses.lease;
    } else if (input.includes('maintenance') || input.includes('repair') || input.includes('fix')) {
      response = apartmentResponses.maintenance;
    } else if (input.includes('rent') || input.includes('payment') || input.includes('pay')) {
      response = apartmentResponses.rent;
    } else if (input.includes('apply') || input.includes('application') || input.includes('qualify')) {
      response = apartmentResponses.application;
    } else if (input.includes('pet') || input.includes('dog') || input.includes('cat')) {
      response = apartmentResponses.pets;
    } else if (input.includes('park') || input.includes('car') || input.includes('garage')) {
      response = apartmentResponses.parking;
    } else if (input.includes('utility') || input.includes('utilities') || input.includes('electric') || input.includes('water')) {
      response = apartmentResponses.utilities;
    } else if (input.includes('move') || input.includes('moving')) {
      response = apartmentResponses.moving;
    } else if (input.includes('security') || input.includes('safe') || input.includes('camera')) {
      response = apartmentResponses.security;
    } else {
      response = apartmentResponses.default;
    }

    const botMessage = {
      id: messages.length + 2,
      text: response,
      sender: 'bot',
      timestamp: new Date(),
      isAI: false
    };

    setMessages(prevMessages => [...prevMessages, botMessage]);
  };

  // Handle user message submission
  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      if (isAIEnabled) {
        await handleAIResponse(input);
      } else {
        // Simulate bot thinking time for non-AI mode
        setTimeout(() => {
          respondWithBasicSystem(input);
          setIsTyping(false);
        }, 1000);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Toggle AI mode
  const toggleAIMode = () => {
    setIsAIEnabled(!isAIEnabled);
    
    // Inform the user about the mode change
    const modeChangeMessage = {
      id: messages.length + 1,
      text: !isAIEnabled 
        ? "I've switched to AI-powered responses. I can now understand more complex questions and provide more detailed information."
        : "I've switched to standard responses. I'll be using predefined information to answer your questions.",
      sender: 'bot',
      timestamp: new Date(),
      isSystem: true
    };
    
    setMessages([...messages, modeChangeMessage]);
  };

  // Format timestamp for message display
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Clear chat history
  const handleClearChat = () => {
    setMessages([
      {
        id: 1,
        text: `Hello! I'm your ${isAIEnabled ? 'AI-powered ' : ''}Apartment Assistant. How can I help you today? ${isAIEnabled ? 'You can type or use voice to ask questions about apartments.' : ''}`,
        sender: 'bot',
        timestamp: new Date(),
        isAI: isAIEnabled
      }
    ]);
  };

  // Toggle chatbot expanded/minimized state
  const toggleChatMinimize = () => {
    setIsMinimized(!isMinimized);
    if (isExpanded && !isMinimized) {
      setIsExpanded(false);
    }
    
    // Stop recording if minimizing
    if (!isMinimized && isRecording) {
      stopRecording();
    }
  };

  const toggleChatExpand = () => {
    setIsExpanded(!isExpanded);
    if (isMinimized && !isExpanded) {
      setIsMinimized(false);
    }
  };

  // Render message bubble with appropriate styling
  const MessageBubble = ({ message }) => {
    const isBot = message.sender === 'bot';
    const isSystem = message.isSystem;
    
    return (
      <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
        {isBot && (
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
            isSystem ? 'bg-gray-200' : (message.isAI ? 'bg-purple-100' : 'bg-blue-100')
          }`}>
            {isSystem ? (
              <Info size={16} className="text-gray-600" />
            ) : message.isAI ? (
              <Sparkles size={16} className="text-purple-600" />
            ) : (
              <Bot size={16} className="text-blue-600" />
            )}
          </div>
        )}
        <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
          isSystem 
            ? 'bg-gray-100 text-gray-700 border border-gray-200' 
            : isBot 
              ? (message.isAI ? 'bg-purple-50 text-gray-800 border border-purple-100' : 'bg-gray-100 text-gray-800')
              : 'bg-blue-600 text-white'
        }`}>
          {message.isAI && isBot && !isSystem && (
            <div className="flex items-center mb-1">
              <Sparkles size={12} className="text-purple-600 mr-1" />
              <span className="text-xs text-purple-600 font-medium">AI response</span>
            </div>
          )}
          {message.isVoice && !isBot && (
            <div className="flex items-center mb-1">
              <Mic size={12} className="text-blue-100 mr-1" />
              <span className="text-xs text-blue-100 font-medium">Voice message</span>
            </div>
          )}
          <p>{message.text}</p>
          <p className={`text-xs mt-1 ${
            isSystem 
              ? 'text-gray-500' 
              : isBot 
                ? (message.isAI ? 'text-purple-400' : 'text-gray-500')
                : 'text-blue-100'
          }`}>
            {formatTime(message.timestamp)}
          </p>
        </div>
        {!isBot && (
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center ml-2">
            <User size={16} className="text-white" />
          </div>
        )}
      </div>
    );
  };

  // Render quick suggestion buttons for common queries
  const QuickSuggestions = () => {
    const suggestions = [
      { text: "Find an apartment", icon: <Home size={14} /> },
      { text: "Amenities", icon: <Building size={14} /> },
      { text: "Lease information", icon: <Info size={14} /> }
    ];

    const handleSuggestionClick = async (text) => {
      const userMessage = {
        id: messages.length + 1,
        text: text,
        sender: 'user',
        timestamp: new Date()
      };

      setMessages([...messages, userMessage]);
      setIsTyping(true);

      try {
        if (isAIEnabled) {
          await handleAIResponse(text);
        } else {
          // Simulate bot thinking time for non-AI mode
          setTimeout(() => {
            respondWithBasicSystem(text);
            setIsTyping(false);
          }, 1000);
        }
      } finally {
        setIsTyping(false);
      }
    };

    return (
      <div className="flex flex-wrap gap-2 mb-4">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => handleSuggestionClick(suggestion.text)}
            className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
          >
            {suggestion.icon}
            {suggestion.text}
          </button>
        ))}
      </div>
    );
  };

  // Render Voice Caption
  const VoiceCaption = () => {
    if (!showVoiceCaption) return null;
    
    return (
      <div className="fixed bottom-32 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg z-50 max-w-sm w-3/4 text-center shadow-lg">
        <div className="flex items-center justify-center mb-1">
          <Mic size={14} className="text-red-400 mr-2 animate-pulse" />
          <span className="text-xs font-medium">Voice Recognition</span>
        </div>
        <div className="min-h-[24px]">
          <p className="text-sm font-medium break-words">{voiceCaption || "Listening..."}</p>
        </div>
        <div className="mt-2 text-xs">
          <span>Speak clearly or </span>
          <button 
            onClick={stopRecording} 
            className="text-red-300 hover:text-red-100 underline"
          >
            tap to cancel
          </button>
        </div>
      </div>
    );
  };

  // Minimized chat button
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button 
          onClick={toggleChatMinimize}
          className={`w-16 h-16 rounded-full ${isAIEnabled ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'} text-white flex items-center justify-center shadow-lg transition-all`}
          aria-label="Open chat"
        >
          {isAIEnabled ? <Sparkles size={28} /> : <Bot size={28} />}
        </button>
      </div>
    );
  }

  // Main chatbot UI
  return (
    <>
      <VoiceCaption />
      
      <div 
        className={`${isExpanded ? 'fixed inset-4 z-50' : (isMobile ? 'fixed bottom-4 right-4 left-4 z-50' : 'fixed bottom-4 right-4 z-50 w-96')} 
          flex flex-col bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200`}
        style={{ maxHeight: isExpanded ? '100%' : '90vh', height: isExpanded ? 'auto' : (isMobile ? '70vh' : '600px') }}
      >
        <div className={`${isAIEnabled ? 'bg-purple-600' : 'bg-blue-600'} text-white p-3 flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            {isAIEnabled ? <Sparkles size={20} /> : <Building size={20} />}
            <h1 className="text-lg font-semibold">
              {isAIEnabled ? 'AI Apartment Assistant' : 'Apartment Assistant'}
            </h1>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={toggleAIMode}
              className={`p-1 rounded flex items-center gap-1 ${isAIEnabled ? 'bg-purple-700 hover:bg-purple-800' : 'bg-blue-700 hover:bg-blue-800'}`}
              aria-label={isAIEnabled ? "Disable AI" : "Enable AI"}
            >
              {isAIEnabled ? (
                <>
                  <Sparkles size={14} />
                  <span className="text-xs">AI</span>
                </>
              ) : (
                <>
                  <Bot size={14} />
                  <span className="text-xs">Basic</span>
                </>
              )}
            </button>
            <button
              onClick={toggleChatMinimize}
              className="p-1 hover:bg-opacity-80 rounded"
              aria-label="Minimize chat"
            >
              <Minimize2 size={16} />
            </button>
            <button
              onClick={toggleChatExpand}
              className="p-1 hover:bg-opacity-80 rounded"
              aria-label={isExpanded ? "Shrink chat" : "Expand chat"}
            >
              {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <button
              onClick={handleClearChat}
              className="p-1 hover:bg-opacity-80 rounded"
              aria-label="Clear chat"
            >
              <X size={16} />
            </button>
          </div>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto bg-white">
          {messages.map(message => (
            <MessageBubble key={message.id} message={message} />
          ))}
          
          {isTyping && (
            <div className="flex justify-start mb-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                isAIEnabled ? 'bg-purple-100' : 'bg-blue-100'
              }`}>
                {isAIEnabled ? (
                  <Sparkles size={16} className="text-purple-600" />
                ) : (
                  <Bot size={16} className="text-blue-600" />
                )}
              </div>
              <div className={`bg-gray-100 px-4 py-2 rounded-lg ${
                isProcessingAI ? 'border border-purple-200' : ''
              }`}>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-3 border-t">
          <QuickSuggestions />
          
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`${isRecording ? 'Listening...' : 'Ask about apartments...'}`}
              className={`flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                isAIEnabled ? 'focus:ring-purple-500' : 'focus:ring-blue-500'
              } ${isRecording ? 'bg-red-50 border-red-300' : ''}`}
              disabled={isRecording}
            />
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`p-2 rounded-lg text-white ${
                isRecording ? 'bg-red-500 hover:bg-red-600' : (isAIEnabled ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700')
              } transition-colors`}
              aria-label={isRecording ? "Stop recording" : "Start voice recording"}
              title={isRecording ? "Stop recording" : "Start voice recording"}
            >
              {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <button
              onClick={handleSendMessage}
              className={`text-white p-2 rounded-lg transition-colors ${
                isProcessingAI 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : (isAIEnabled ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700')
              }`}
              disabled={input.trim() === '' || isProcessingAI || isRecording}
            >
              {isProcessingAI ? (
                <RefreshCw size={20} className="animate-spin" />
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>
          
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>
              {isAIEnabled && "AI-powered assistance"}
            </span>
            <span>{isRecording ? "Recording voice..." : "Need help? Call (555) 123-4567"}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatbot;