# Starting the Servers

## Quick Start Instructions

### Option 1: Start Both Servers (Recommended)

Open **two separate terminal windows** and run:

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

### Option 2: Use PowerShell Background Jobs

Run these commands in PowerShell:

```powershell
# Start backend
Start-Job -ScriptBlock { Set-Location "C:\Users\dell 3190\Desktop\LDSS_website\backend"; npm run dev }

# Start frontend  
Start-Job -ScriptBlock { Set-Location "C:\Users\dell 3190\Desktop\LDSS_website\frontend"; npm run dev }

# Check job status
Get-Job

# View output
Receive-Job -Id 1  # Backend
Receive-Job -Id 2  # Frontend
```

## Expected Output

**Backend should show:**
```
LDSS API listening on port 4000
```

**Frontend should show:**
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## Testing Login

Once both servers are running:

1. Open your browser to: `http://localhost:5173`
2. Navigate to the login page
3. Try logging in with:
   - **Admin**: `202501` / `LDSSadmin123`
   - **Staff**: `2025001` / `LDSSstaff123`
   - **Learner**: `202500123456` / `LDSS2025`

## Troubleshooting

If login still doesn't work:

1. **Check browser console** (F12) for errors
2. **Check backend terminal** for error messages
3. **Verify CORS** - The backend now allows ports 5173, 5174, and 3000
4. **Check network tab** in browser DevTools to see the actual API request/response

## Fixed Issues

✅ CORS configuration updated to allow frontend on port 5173
✅ Improved error handling for better error messages
✅ Fixed JSON parsing errors


