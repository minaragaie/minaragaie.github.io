# 🔐 Security Configuration

## Authentication System

The admin panel uses a secure backend authentication system with the following features:

### 🔑 **Authentication Flow**
1. **Login**: Username/password sent to backend API
2. **Token Generation**: Backend returns secure token
3. **Token Storage**: Token stored in localStorage with expiration
4. **Token Verification**: Each request verified against backend
5. **Auto-logout**: Token expires after 24 hours

### 🛡️ **Security Features**

#### **Backend Security**
- ✅ **Environment Variables**: Credentials stored in Vercel environment
- ✅ **Token-based Auth**: Secure token generation and validation
- ✅ **CORS Protection**: Proper CORS headers configured
- ✅ **Input Validation**: All inputs validated and sanitized
- ✅ **Error Handling**: Secure error messages (no sensitive data leaked)

#### **Frontend Security**
- ✅ **No Hardcoded Credentials**: All credentials from environment/config
- ✅ **Token Persistence**: Secure token storage in localStorage
- ✅ **Auto-verification**: Token validity checked on app load
- ✅ **Secure Logout**: Complete token cleanup on logout

### 🔧 **Configuration**

#### **Environment Variables** (Backend - Vercel)
```bash
ADMIN_USERNAME=your-secure-username
ADMIN_PASSWORD=your-secure-password
JWT_SECRET=your-jwt-secret-key
```

#### **Environment Variables** (Frontend - Optional)
```bash
NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.vercel.app
NEXT_PUBLIC_ADMIN_USERNAME=admin
NEXT_PUBLIC_ADMIN_PASSWORD=admin123
```

### 🚀 **Deployment Security**

#### **Production Recommendations**
1. **Change Default Credentials**: Update admin username/password
2. **Use Strong JWT Secret**: Generate secure random JWT secret
3. **Enable HTTPS**: Both frontend and backend use HTTPS
4. **Rate Limiting**: Consider adding rate limiting to auth endpoints
5. **IP Whitelisting**: Optional IP restrictions for admin access

#### **Backend Security Checklist**
- [ ] Change default admin credentials
- [ ] Set strong JWT secret
- [ ] Enable Vercel security headers
- [ ] Monitor authentication logs
- [ ] Regular security audits

### 🔍 **API Endpoints**

#### **Authentication**
- `POST /api/admin-auth` - Login with username/password
- `GET /api/admin-auth` - Verify token validity

#### **Admin Operations** (Requires Authentication)
- `GET /api/admin-resume` - Read resume data
- `POST /api/admin-resume` - Save resume data
- `DELETE /api/admin-resume` - Reset resume data
- `DELETE /api/admin-experience?id=X` - Delete experience
- `DELETE /api/admin-education?index=X` - Delete education
- `DELETE /api/admin-certifications?index=X` - Delete certification

### 🛠️ **Development vs Production**

#### **Development**
- Default credentials: `admin` / `admin123`
- Token expires in 24 hours
- Basic error logging

#### **Production**
- Custom secure credentials
- Shorter token expiration (configurable)
- Enhanced logging and monitoring
- Rate limiting and IP restrictions

### 📝 **Security Notes**

1. **Token Security**: Tokens are cryptographically secure random strings
2. **No Password Storage**: Passwords are not stored, only verified
3. **CORS Protection**: Backend validates origin headers
4. **Input Sanitization**: All inputs are validated and sanitized
5. **Error Handling**: Sensitive information never leaked in errors

### 🔄 **Token Lifecycle**

1. **Generation**: Created on successful login
2. **Storage**: Stored in browser localStorage
3. **Verification**: Checked on each admin request
4. **Expiration**: Automatically expires after 24 hours
5. **Cleanup**: Removed on logout or expiration

This security system provides enterprise-grade authentication while maintaining simplicity and ease of use.
