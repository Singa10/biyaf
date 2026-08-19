# Supabase Integration Setup Guide

## Overview
Your Biyaf Architecture Studio website is now integrated with Supabase as the backend database. This replaces localStorage and enables:
- ✅ Persistent data storage across all users
- ✅ Real-time updates from admin to frontend
- ✅ Scalable cloud database
- ✅ Automatic data synchronization

## Step 1: Set Up Supabase Database

### Option A: Using Supabase Dashboard (Recommended)

1. **Go to your Supabase project**:
   - URL: https://wsmbuwkdtscihdolcfql.supabase.co
   - Or visit: https://supabase.com/dashboard

2. **Open SQL Editor**:
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Setup Script**:
   - Copy the entire content from `supabase-setup.sql`
   - Paste it into the SQL Editor
   - Click "Run" or press Ctrl+Enter
   - You should see: "✅ Supabase database setup complete!"

4. **Verify Table Creation**:
   - Go to "Table Editor" in the sidebar
   - You should see a table named `website_content`
   - Columns: `id`, `section`, `content`, `created_at`, `updated_at`

### Option B: Automatic Setup (via Admin Dashboard)

The database table will be created automatically when:
1. You open the admin dashboard for the first time
2. The app detects no existing data
3. It initializes with default content

## Step 2: Verify Integration

### Frontend Pages (Website)
All pages now load data from Supabase:

✅ **index.html** - Hero section, Statistics
✅ **projects.html** - All projects with filtering
✅ **services.html** - All services
✅ **about.html** - Timeline
✅ **contact.html** - Contact information

### Admin Dashboard
All management pages use Supabase:

✅ **Dashboard** - Overview and statistics
✅ **Hero Section** - Edit homepage hero
✅ **Statistics** - Manage stat cards
✅ **Projects** - CRUD operations for projects
✅ **Services** - Manage services
✅ **Timeline** - Company milestones
✅ **Contact Info** - Update contact details
✅ **About Us** - Company information
✅ **Images** - Image management

## Step 3: Test the Integration

### Testing Data Flow

1. **Open Admin Dashboard**:
   ```
   http://localhost/biyaf/admin/index.html
   ```
   Login: admin / admin123

2. **Make a Change**:
   - Go to "Hero Section"
   - Update the title or description
   - Click "Save Changes"
   - You should see: "✅ Hero content saved successfully!"

3. **Verify on Frontend**:
   - Open the main website: `http://localhost/biyaf/index.html`
   - The changes should appear immediately (or after refresh)
   - Check browser console for: "✅ Hero section loaded from Supabase"

4. **Test Real-time Updates** (Optional):
   - Open website in one browser tab
   - Open admin dashboard in another tab
   - Make changes in admin
   - Website should update automatically (with realtime enabled)

## Step 4: Check Browser Console

### Expected Console Messages

**Admin Dashboard:**
```
✅ Supabase client initialized
✅ SupabaseData initialized
AdminApp initializing...
✅ Data loaded from Supabase
AdminApp initialized successfully
```

**Frontend Website:**
```
✅ Supabase client initialized
🔄 SupabaseFrontendLoader initializing...
✅ Hero section loaded from Supabase
✅ Statistics loaded from Supabase
✅ SupabaseFrontendLoader initialized successfully
✅ Realtime updates enabled
```

## Step 5: Troubleshooting

### Issue: "Supabase client not available"

**Solution:**
- Ensure Supabase CDN script is loaded:
  ```html
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  ```
- Check your internet connection
- Clear browser cache and reload

### Issue: "Error fetching data from Supabase"

**Solution:**
1. Verify Supabase credentials in `js/supabase-config.js`
2. Check if table `website_content` exists
3. Run the SQL setup script again
4. Check Row Level Security (RLS) policies

### Issue: "Permission denied" errors

**Solution:**
1. Go to Supabase Dashboard → Authentication → Policies
2. Ensure these policies exist on `website_content` table:
   - "Allow public read access" (SELECT)
   - "Allow public write access" (ALL)
3. Or run the SQL setup script which creates these automatically

### Issue: Changes not appearing on frontend

**Solution:**
1. Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
2. Check browser console for errors
3. Verify data was saved in Supabase Table Editor
4. Clear browser cache

### Issue: "Failed to load default data"

**Solution:**
1. Go to Admin Dashboard
2. Click on any section (e.g., Hero Section)
3. Data will be initialized automatically
4. Or manually run: Click Dashboard → "Reset and Reload" button

## Database Schema

### Table: `website_content`

| Column | Type | Description |
|--------|------|-------------|
| `id` | BIGSERIAL | Primary key (auto-increment) |
| `section` | TEXT | Section name (unique): 'hero', 'stats', 'projects', etc. |
| `content` | JSONB | Section data as JSON object |
| `created_at` | TIMESTAMP | When record was created |
| `updated_at` | TIMESTAMP | When record was last updated (auto-updated) |

### Sample Data Structure

**Hero Section:**
```json
{
  "section": "hero",
  "content": {
    "eyebrow": "Biyaf Architecture Studio",
    "title": "We design buildings that <em>hold their ground</em>.",
    "description": "Biyaf is a design-led architecture practice...",
    "image": "images/hero-residence.jpeg",
    "coordinates": "N 09°02' E 38°45'",
    "figureLabel": "FIG. 01 — RESIDENCE"
  }
}
```

**Statistics:**
```json
{
  "section": "stats",
  "content": [
    {"number": 14, "label": "Years in Practice", "suffix": ""},
    {"number": 86, "label": "Projects Delivered", "suffix": "+"}
  ]
}
```

## Security Considerations

### Current Setup (Development)
- ✅ Public read access (anyone can view data)
- ✅ Public write access (anyone can modify data)
- ⚠️ **This is suitable for development only**

### Production Recommendations

1. **Add Authentication**:
   - Restrict write access to authenticated admin users only
   - Update RLS policies to check `auth.uid()`

2. **Update Policies**:
   ```sql
   -- Remove public write policy
   DROP POLICY "Allow public write access" ON website_content;
   
   -- Add authenticated write policy
   CREATE POLICY "Allow authenticated write" ON website_content
   FOR ALL TO authenticated
   USING (true)
   WITH CHECK (true);
   ```

3. **Implement Admin Login**:
   - Use Supabase Authentication
   - Add admin user management
   - Implement role-based access control

## Features Enabled

### ✅ Real-time Synchronization
- Changes in admin dashboard instantly appear on website
- No page reload needed
- Uses Supabase Realtime subscriptions

### ✅ Data Persistence
- All data stored in cloud database
- Survives browser cache clears
- Accessible from any device

### ✅ Scalability
- Handles multiple concurrent users
- Automatic backups by Supabase
- CDN-optimized delivery

### ✅ Export/Import
- Export data as JSON file
- Import data from backup
- Easy data migration

## Monitoring & Maintenance

### View Data in Supabase Dashboard

1. Go to **Table Editor**
2. Select `website_content` table
3. See all sections and their content
4. Manually edit if needed

### Check API Usage

1. Go to **Settings** → **API**
2. View request counts
3. Monitor database size
4. Check for errors in logs

### Backup Data

**Automatic Method:**
- Supabase automatically backs up your data
- Point-in-time recovery available

**Manual Method:**
- Use Admin Dashboard → Export Data
- Downloads JSON file with all content
- Store securely for manual backup

## Support & Resources

### Official Documentation
- Supabase Docs: https://supabase.com/docs
- Supabase JS Client: https://supabase.com/docs/reference/javascript

### Project Files
- `js/supabase-config.js` - Supabase configuration
- `js/supabase-loader.js` - Frontend data loader
- `admin/js/supabase-data.js` - Admin data manager
- `supabase-setup.sql` - Database setup script

### Useful Commands

**View all sections:**
```sql
SELECT section, created_at, updated_at 
FROM website_content 
ORDER BY section;
```

**View specific section:**
```sql
SELECT * FROM website_content 
WHERE section = 'hero';
```

**Delete all data (reset):**
```sql
DELETE FROM website_content;
```

**Check table size:**
```sql
SELECT pg_size_pretty(pg_total_relation_size('website_content'));
```

## Next Steps

1. ✅ Run SQL setup script in Supabase
2. ✅ Open admin dashboard and verify data loads
3. ✅ Make test changes and verify on frontend
4. ✅ Check browser console for confirmation messages
5. ✅ (Optional) Set up authentication for production
6. ✅ (Optional) Configure custom domain
7. ✅ (Optional) Set up staging environment

## Success Indicators

You'll know everything is working correctly when:

- ✅ No console errors about Supabase
- ✅ Admin dashboard loads with data
- ✅ Changes in admin appear on website
- ✅ Page refreshes don't lose data
- ✅ Multiple tabs stay synchronized
- ✅ Export/Import functions work
- ✅ All sections load correctly

---

**Need Help?**
Check browser console for detailed error messages and refer to Supabase documentation for advanced configuration.
