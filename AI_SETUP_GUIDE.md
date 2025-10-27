# 🤖 AI Bot Setup Guide

## Free AI Services Available

### 1. **Hugging Face (Recommended)**
- **Free tier**: 30,000 requests/month
- **Setup**: 
  1. Go to https://huggingface.co/settings/tokens
  2. Create a free account
  3. Generate a new token
  4. Add to your environment variables

### 2. **Groq (Fast & Free)**
- **Free tier**: 14,400 requests/day
- **Setup**:
  1. Go to https://console.groq.com/
  2. Sign up for free
  3. Get your API key
  4. Add to environment variables

### 3. **OpenRouter (Multiple Models)**
- **Free tier**: Various models available
- **Setup**:
  1. Go to https://openrouter.ai/
  2. Sign up for free
  3. Get API key
  4. Add to environment variables

## Environment Variables

Add these to your `.env.local` file:

```bash
# AI Service Configuration
NEXT_PUBLIC_HUGGINGFACE_API_KEY=your_huggingface_api_key_here

# Alternative AI Services (uncomment to use)
# NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key_here
# NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here

# Backend API Configuration
NEXT_PUBLIC_API_BASE_URL=https://resume-backend-service-ft2elzp8i-minaragaie89-8717s-projects.vercel.app
```

## Features Included

### ✅ **Smart AI Integration**
- **Context-aware responses** using conversation history
- **Professional persona** tailored to your background
- **Fallback responses** when AI is unavailable
- **Realistic typing delays** based on response length

### ✅ **Multiple AI Providers**
- **Hugging Face**: Free, good for general conversation
- **Groq**: Very fast responses, great for real-time chat
- **OpenRouter**: Access to multiple AI models

### ✅ **Error Handling**
- **Graceful degradation** when AI service is down
- **Fallback to pattern matching** for reliability
- **User-friendly error messages**

## How It Works

1. **User sends message** → Chat interface
2. **AI Service processes** → Context + user message
3. **AI generates response** → Professional, contextual reply
4. **Response displayed** → With typing indicators and suggestions

## Testing the AI Bot

1. **Without API key**: Uses fallback responses (still works!)
2. **With API key**: Uses real AI for dynamic responses
3. **Error handling**: Falls back gracefully if AI fails

## Customization

### **Modify AI Personality**
Edit `lib/ai-service.ts`:
```typescript
content: `You are Mina's AI assistant, a professional full-stack developer...`
```

### **Add New Response Patterns**
Add to the `getFallbackResponse` method:
```typescript
if (lowerMessage.includes('your_keyword')) {
  return "Your custom response here..."
}
```

### **Change AI Model**
Update the model in `lib/ai-service.ts`:
```typescript
this.model = 'microsoft/DialoGPT-medium' // Change this
```

## Deployment

1. **Add environment variables** to your deployment platform
2. **Test the AI integration** in production
3. **Monitor usage** to stay within free tiers
4. **Update API keys** as needed

## Troubleshooting

### **AI Not Responding**
- Check API key is correct
- Verify environment variable is set
- Check browser console for errors
- Fallback responses should still work

### **Slow Responses**
- This is normal for free AI services
- Consider upgrading to paid tier
- Or use Groq for faster responses

### **Rate Limits**
- Free tiers have limits
- Monitor usage in service dashboards
- Fallback responses handle overages

## Next Steps

1. **Get a free API key** from Hugging Face
2. **Add it to your environment variables**
3. **Test the AI bot** on your portfolio
4. **Customize responses** for your specific needs
5. **Deploy and enjoy** your AI-powered chat!

The AI bot will work even without an API key (using fallback responses), but with a real AI service, it becomes much more intelligent and engaging! 🚀








