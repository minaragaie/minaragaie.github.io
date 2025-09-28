# Hugging Face AI Setup Guide

## 🚀 Quick Setup

### 1. Get Your Free API Key
1. Go to [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
2. Create a free account (if you don't have one)
3. Click "New token"
4. Give it a name like "Resume Chat Bot"
5. Select "Read" permissions
6. Copy the generated token

### 2. Add to Environment
Create or edit `.env.local` file in your project root:
```bash
NEXT_PUBLIC_HUGGINGFACE_API_KEY=your_token_here
```

### 3. Restart Development Server
```bash
npm run dev
```

## 🎯 What Happens Next

### **With API Key:**
- ✅ **Real AI responses** using Hugging Face's DialoGPT model
- ✅ **Conversation context** maintained across messages
- ✅ **30,000 free requests** per month
- ✅ **Professional AI chat** experience

### **Without API Key:**
- ✅ **Fallback responses** (still works great!)
- ✅ **No external dependencies**
- ✅ **Instant responses**

## 📁 Files Used

### **`lib/ai-service.ts`**
- Main AI service integration
- Hugging Face API calls
- Fallback response system
- Error handling

### **`components/ChatTerminal.tsx`**
- UI component
- Uses `aiService.generateResponse()`
- Conversation history management
- Terminal styling

## 🔧 Configuration

The AI service is configured with:
- **Model**: `microsoft/DialoGPT-medium`
- **Free Tier**: 30k requests/month
- **Context**: Maintains conversation history
- **Fallback**: Professional responses when API unavailable

## 🎉 Ready to Use!

Once you add the API key, your chat terminal will automatically use real AI responses instead of fallback responses. No code changes needed!