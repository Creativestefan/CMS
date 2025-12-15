import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
import { RateLimiter, getClientIP, createRateLimitHeaders } from "./rateLimit.ts";

const app = new Hono();

app.use("*", cors({
  origin: "*",
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization", "Cache-Control"],
  exposeHeaders: ["Content-Length", "X-RateLimit-Remaining", "X-RateLimit-Reset"],
  credentials: true,
}));
app.use("*", logger(console.log));

// Rate limiters for different endpoints
const signupLimiter = new RateLimiter({ windowMs: 60 * 60 * 1000, maxRequests: 3 }, "signup"); // 3 per hour
const authLimiter = new RateLimiter({ windowMs: 15 * 60 * 1000, maxRequests: 5 }, "auth"); // 5 per 15 min
const apiLimiter = new RateLimiter({ windowMs: 60 * 1000, maxRequests: 60 }, "api"); // 60 per minute
const uploadLimiter = new RateLimiter({ windowMs: 60 * 60 * 1000, maxRequests: 20 }, "upload"); // 20 per hour

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

// Track if data has been initialized
let dataInitialized = false;

// Initialize default data if database is empty
const initializeDefaultData = async () => {
  if (dataInitialized) return;
  
  try {
    const profile = await kv.get("profile");
    if (!profile) {
      console.log("Initializing default profile data...");
      await kv.set("profile", {
        name: "Stephen Jude",
        bio: "Senior Product Designer with engineering depth. I design consumer and enterprise digital products, with a focus on AI and system-level UX",
        twitter: "X (Twitter)",
        linkedin: "LinkedIn",
        github: "Github",
        dribbble: "Dribbble",
        location: "Lagos",
        letsTalkUrl: "https://example.com/lets-talk",
      });
    }

    const projects = await kv.getByPrefix("project:");
    if (!projects || projects.length === 0) {
      console.log("Initializing default projects data...");
      const defaultProjects = [
        {
          id: "project:1",
          title: "Project 1",
          mediaUrl: "https://images.unsplash.com/photo-1726556267339-b8af2ccbb2f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkZXNpZ24lMjBwb3J0Zm9saW98ZW58MXx8fHwxNzY1NDgzNTg0fDA&ixlib=rb-4.1.0&q=80&w=1080",
          mediaType: "image",
          order: 0,
        },
        {
          id: "project:2",
          title: "Project 2",
          mediaUrl: "https://images.unsplash.com/photo-1629494893504-d41e26a02631?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1aSUyMGRlc2lnbiUyMG1vY2t1cHxlbnwxfHx8fDE3NjU0NjgxMDl8MA&ixlib=rb-4.1.0&q=80&w=1080",
          mediaType: "image",
          order: 1,
        },
        {
          id: "project:3",
          title: "Project 3",
          mediaUrl: "https://images.unsplash.com/photo-1613068687893-5e85b4638b56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXNpZ24lMjBzY3JlZW58ZW58MXx8fHwxNzY1NDA0MTY2fDA&ixlib=rb-4.1.0&q=80&w=1080",
          mediaType: "image",
          order: 2,
        },
        {
          id: "project:4",
          title: "Project 4",
          mediaUrl: "https://images.unsplash.com/photo-1661246627162-feb0269e0c07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcHAlMjBpbnRlcmZhY2UlMjBkZXNpZ258ZW58MXx8fHwxNzY1NDI5MDkxfDA&ixlib=rb-4.1.0&q=80&w=1080",
          mediaType: "image",
          order: 3,
        },
        {
          id: "project:5",
          title: "Project 5",
          mediaUrl: "https://images.unsplash.com/photo-1683818051102-dd1199d163b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwcHJvZHVjdCUyMGRlc2lnbnxlbnwxfHx8fDE3NjU0MzM1MTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
          mediaType: "image",
          order: 4,
        },
      ];

      for (const project of defaultProjects) {
        await kv.set(project.id, project);
      }
    }
    
    dataInitialized = true;
    console.log("Default data initialization complete");
  } catch (error) {
    console.log(`Error initializing default data: ${error}`);
  }
};

// Initialize data in background (don't block server startup)
initializeDefaultData().catch(err => {
  console.error("Failed to initialize default data:", err);
});

// ============================================
// PUBLIC ENDPOINTS (NO AUTH REQUIRED)
// ============================================

// Get public profile info
app.get("/make-server-c0b89456/public/profile", async (c) => {
  try {
    console.log("GET /public/profile - Fetching public profile data...");
    const profile = await kv.get("profile");
    console.log("Public profile data retrieved:", JSON.stringify(profile));
    
    if (!profile) {
      console.log("No profile found in database, returning default");
      const defaultProfile = {
        name: "Stephen Jude",
        bio: "Senior Product Designer with engineering depth. I design consumer and enterprise digital products, with a focus on AI and system-level UX",
        twitter: "X (Twitter)",
        linkedin: "LinkedIn",
        github: "Github",
        dribbble: "Dribbble",
        location: "Lagos",
        letsTalkUrl: "https://example.com/lets-talk",
      };
      return c.json(defaultProfile);
    }
    
    return c.json(profile);
  } catch (error) {
    console.error(`Error fetching public profile: ${error}`);
    console.error(`Error stack: ${error.stack}`);
    return c.json({ error: `Failed to fetch profile: ${error.message}` }, 500);
  }
});

// Get public projects
app.get("/make-server-c0b89456/public/projects", async (c) => {
  try {
    console.log("GET /public/projects - Fetching public projects...");
    const projects = await kv.getByPrefix("project:");
    console.log(`Public projects retrieved: ${projects?.length || 0} found`);
    console.log(`Projects data:`, JSON.stringify(projects));
    
    if (!projects || projects.length === 0) {
      console.log("No projects found, returning empty array");
      return c.json([]);
    }
    
    // Sort by order
    const sortedProjects = projects.sort((a, b) => (a.order || 0) - (b.order || 0));
    
    return c.json(sortedProjects);
  } catch (error) {
    console.error(`Error fetching public projects: ${error}`);
    console.error(`Error stack: ${error.stack}`);
    return c.json({ error: `Failed to fetch projects: ${error.message}` }, 500);
  }
});

// Get public works
app.get("/make-server-c0b89456/public/works", async (c) => {
  try {
    console.log("GET /public/works - Fetching public works...");
    const works = await kv.getByPrefix("work:");
    console.log(`Public works retrieved: ${works?.length || 0} found`);
    
    if (!works || works.length === 0) {
      console.log("No works found, returning empty array");
      return c.json([]);
    }
    
    // Sort by order
    const sortedWorks = works.sort((a, b) => (a.order || 0) - (b.order || 0));
    
    return c.json(sortedWorks);
  } catch (error) {
    console.error(`Error fetching public works: ${error}`);
    console.error(`Error stack: ${error.stack}`);
    return c.json({ error: `Failed to fetch works: ${error.message}` }, 500);
  }
});

// Get public featured items (for homepage carousel)
app.get("/make-server-c0b89456/public/featured-items", async (c) => {
  try {
    console.log("GET /public/featured-items - Fetching featured playground items...");
    const items = await kv.getByPrefix("playground:");
    console.log(`Playground items retrieved: ${items?.length || 0} found`);
    
    // Filter for featured items only
    const featuredItems = items.filter(item => item.featured === true);
    console.log(`Featured items found: ${featuredItems?.length || 0}`);
    
    if (featuredItems.length === 0) {
      console.log("No featured items found, returning empty array");
      return c.json([]);
    }
    
    // Sort by order
    const sortedItems = featuredItems.sort((a, b) => (a.order || 0) - (b.order || 0));
    
    // Ensure we have enough items to fill viewport - duplicate items if needed
    const minItemsForSmooth = 3;
    let displayItems = [...sortedItems];
    
    while (displayItems.length < minItemsForSmooth && sortedItems.length > 0) {
      displayItems = [...displayItems, ...sortedItems];
    }
    
    return c.json(displayItems);
  } catch (error) {
    console.error(`Error fetching featured items: ${error}`);
    return c.json({ error: `Failed to fetch featured items: ${error.message}` }, 500);
  }
});

// Get about page data
app.get("/make-server-c0b89456/about", async (c) => {
  try {
    console.log("GET /about - Fetching about page data...");
    
    // Get about profile info
    const aboutProfile = await kv.get("about:profile");
    
    // Get work experience
    const workExperience = await kv.getByPrefix("about:experience:");
    console.log(`Work experience retrieved: ${workExperience?.length || 0} found`);
    
    // Default data if not set
    if (!aboutProfile) {
      return c.json({
        profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
        bio: [
          "My journey into product design started in 2018 as a graphic designer, where I built websites using Blogger and WordPress. That early exposure to layout, structure, and the web shaped how I think about design today. In 2020, I transitioned fully into Product Design, moving from static visuals to solving product problems through research, flows, and scalable interface systems.",
          "Today, I design products, build with LLM support, and develop websites using Framer. I'm also actively learning Rive for interactive motion and deepening my focus on AI and automation to support more dynamic, adaptive product experiences."
        ],
        workExperience: [
          {
            id: "exp1",
            startYear: "2025",
            position: "Product Designer at",
            company: "Utopia",
            companyLogo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=40&h=40&fit=crop",
            order: 0
          },
          {
            id: "exp2",
            startYear: "2024",
            endYear: "2025",
            position: "Product Designer at",
            company: "Clouddley",
            companyLogo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=40&h=40&fit=crop",
            order: 1
          },
          {
            id: "exp3",
            startYear: "2023",
            endYear: "2024",
            position: "Product Designer at",
            company: "Askyourpdf",
            companyLogo: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=40&h=40&fit=crop",
            order: 2
          },
          {
            id: "exp4",
            startYear: "2021",
            endYear: "2022",
            position: "Product Designer at",
            company: "Genius on Demand",
            companyLogo: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=40&h=40&fit=crop",
            order: 3
          }
        ]
      });
    }
    
    // Sort work experience by order
    const sortedExperience = workExperience 
      ? workExperience.sort((a, b) => (a.order || 0) - (b.order || 0))
      : [];
    
    return c.json({
      ...aboutProfile,
      workExperience: sortedExperience
    });
  } catch (error) {
    console.error(`Error fetching about data: ${error}`);
    console.error(`Error stack: ${error.stack}`);
    return c.json({ error: `Failed to fetch about data: ${error.message}` }, 500);
  }
});

// Admin: Get about data for editing
app.get("/make-server-c0b89456/about/admin", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || error) {
      console.log("Unauthorized access to about admin data");
      return c.json({ error: "Unauthorized" }, 401);
    }

    console.log("GET /about/admin - Fetching about data for admin...");
    
    // Get about profile
    const aboutProfile = await kv.get("about:profile");
    
    // Get work experience
    const workExperience = await kv.getByPrefix("about:experience:");
    
    // Sort work experience by order
    const sortedExperience = workExperience 
      ? workExperience.sort((a, b) => (a.order || 0) - (b.order || 0))
      : [];
    
    return c.json({
      profile: aboutProfile || {
        profileImage: "",
        bio: [""],
      },
      workExperience: sortedExperience,
    });
  } catch (error) {
    console.error(`Error fetching about admin data: ${error}`);
    return c.json({ error: `Failed to fetch about data: ${error.message}` }, 500);
  }
});

// Admin: Update about profile
app.put("/make-server-c0b89456/about/profile", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || error) {
      console.log("Unauthorized access to update about profile");
      return c.json({ error: "Unauthorized" }, 401);
    }

    const body = await c.req.json();
    console.log("PUT /about/profile - Updating about profile:", body);
    
    await kv.set("about:profile", body);
    
    return c.json({ success: true });
  } catch (error) {
    console.error(`Error updating about profile: ${error}`);
    return c.json({ error: `Failed to update about profile: ${error.message}` }, 500);
  }
});

// Admin: Add work experience
app.post("/make-server-c0b89456/about/experience", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || error) {
      console.log("Unauthorized access to add work experience");
      return c.json({ error: "Unauthorized" }, 401);
    }

    const body = await c.req.json();
    console.log("POST /about/experience - Adding work experience:", body);
    
    const key = `about:experience:${body.id}`;
    await kv.set(key, body);
    
    return c.json({ success: true, id: body.id });
  } catch (error) {
    console.error(`Error adding work experience: ${error}`);
    return c.json({ error: `Failed to add work experience: ${error.message}` }, 500);
  }
});

// Admin: Update work experience
app.put("/make-server-c0b89456/about/experience/:id", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || error) {
      console.log("Unauthorized access to update work experience");
      return c.json({ error: "Unauthorized" }, 401);
    }

    const id = c.req.param("id");
    const body = await c.req.json();
    console.log(`PUT /about/experience/${id} - Updating work experience:`, body);
    
    const key = `about:experience:${id}`;
    await kv.set(key, body);
    
    return c.json({ success: true });
  } catch (error) {
    console.error(`Error updating work experience: ${error}`);
    return c.json({ error: `Failed to update work experience: ${error.message}` }, 500);
  }
});

// Admin: Delete work experience
app.delete("/make-server-c0b89456/about/experience/:id", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || error) {
      console.log("Unauthorized access to delete work experience");
      return c.json({ error: "Unauthorized" }, 401);
    }

    const id = c.req.param("id");
    console.log(`DELETE /about/experience/${id} - Deleting work experience`);
    
    const key = `about:experience:${id}`;
    await kv.del(key);
    
    return c.json({ success: true });
  } catch (error) {
    console.error(`Error deleting work experience: ${error}`);
    return c.json({ error: `Failed to delete work experience: ${error.message}` }, 500);
  }
});

// Get weather for Lagos, Nigeria
app.get("/make-server-c0b89456/public/weather", async (c) => {
  try {
    console.log("GET /public/weather - Fetching weather data for Lagos...");
    
    // Open-Meteo API for Lagos, Nigeria (no API key required!)
    // Coordinates: Lagos (6.5244°N, 3.3792°E)
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=6.5244&longitude=3.3792&current_weather=true&temperature_unit=celsius`;
    
    console.log(`Calling Open-Meteo API...`);
    
    // Add retry logic with timeout
    const fetchWithRetry = async (url: string, retries = 3, timeout = 5000) => {
      for (let i = 0; i < retries; i++) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), timeout);
          
          const response = await fetch(url, { 
            signal: controller.signal,
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; WeatherApp/1.0)',
            }
          });
          
          clearTimeout(timeoutId);
          return response;
        } catch (error) {
          console.log(`Weather API attempt ${i + 1}/${retries} failed: ${error.message}`);
          if (i === retries - 1) throw error;
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
      }
    };
    
    const response = await fetchWithRetry(weatherUrl);
    
    console.log(`Weather API response status: ${response.status}`);
    
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Weather API error: ${response.status} ${response.statusText}`);
      console.error(`Error body: ${errorBody}`);
      return c.json({ weather: "Cloudy, 27°" }); // Fallback
    }

    const data = await response.json();
    console.log(`Open-Meteo response:`, JSON.stringify(data));
    
    // Extract current weather data
    const temp = Math.round(data.current_weather.temperature);
    const weatherCode = data.current_weather.weathercode;
    
    // Map WMO Weather codes to descriptions
    // https://open-meteo.com/en/docs
    const getWeatherDescription = (code: number): string => {
      if (code === 0) return "Clear";
      if (code === 1 || code === 2) return "Partly Cloudy";
      if (code === 3) return "Cloudy";
      if (code === 45 || code === 48) return "Foggy";
      if (code >= 51 && code <= 55) return "Drizzle";
      if (code >= 61 && code <= 65) return "Rainy";
      if (code >= 71 && code <= 77) return "Snowy";
      if (code >= 80 && code <= 82) return "Rainy";
      if (code >= 85 && code <= 86) return "Snowy";
      if (code >= 95 && code <= 99) return "Thunderstorm";
      return "Cloudy";
    };
    
    const description = getWeatherDescription(weatherCode);
    const weatherString = `${description}, ${temp}°`;
    
    console.log(`Weather data retrieved: ${weatherString}`);
    
    return c.json({ weather: weatherString });
  } catch (error) {
    console.error(`Error fetching weather data: ${error}`);
    console.error(`Error stack: ${error.stack}`);
    // Return fallback weather on error
    return c.json({ weather: "Cloudy, 27°" });
  }
});

// Dynamic sitemap.xml endpoint
app.get("/make-server-c0b89456/sitemap.xml", async (c) => {
  try {
    console.log("GET /sitemap.xml - Generating dynamic sitemap...");
    
    const baseUrl = "https://creativestefan.work";
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Get all works
    const works = await kv.getByPrefix("work:");
    const sortedWorks = works ? works.sort((a, b) => (a.order || 0) - (b.order || 0)) : [];
    
    // Get all playground items
    const playgroundItems = await kv.getByPrefix("playground:");
    const sortedPlayground = playgroundItems ? playgroundItems.sort((a, b) => (a.order || 0) - (b.order || 0)) : [];
    
    // Build XML sitemap
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <!-- Homepage / Portfolio -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Works Page -->
  <url>
    <loc>${baseUrl}/#works</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Playground Page -->
  <url>
    <loc>${baseUrl}/#playground</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- About Page -->
  <url>
    <loc>${baseUrl}/#about</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;

    // Add individual work items with image references
    sortedWorks.forEach((work, index) => {
      const workId = work.id.replace('work:', '');
      const priority = 0.7 - (index * 0.05); // Decreasing priority
      xml += `
  <!-- Work: ${work.client || work.title || workId} -->
  <url>
    <loc>${baseUrl}/#work-${workId}</loc>
    <lastmod>${work.updatedAt?.split('T')[0] || work.createdAt?.split('T')[0] || currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${Math.max(priority, 0.5).toFixed(1)}</priority>`;
      
      if (work.imageUrl) {
        xml += `
    <image:image>
      <image:loc>${work.imageUrl}</image:loc>
      <image:title>${work.client || work.title || 'Portfolio Work'}</image:title>
    </image:image>`;
      }
      
      xml += `
  </url>`;
    });

    // Add individual playground items
    sortedPlayground.forEach((item, index) => {
      const itemId = item.id.replace('playground:', '');
      const priority = 0.6 - (index * 0.05);
      xml += `
  <!-- Playground: ${item.title || itemId} -->
  <url>
    <loc>${baseUrl}/#playground-${itemId}</loc>
    <lastmod>${item.updatedAt?.split('T')[0] || item.createdAt?.split('T')[0] || currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${Math.max(priority, 0.4).toFixed(1)}</priority>`;
      
      if (item.mediaUrl && (item.mediaType === 'image' || item.mediaType === 'jpg' || item.mediaType === 'png')) {
        xml += `
    <image:image>
      <image:loc>${item.mediaUrl}</image:loc>
      <image:title>${item.title || 'Playground Item'}</image:title>
    </image:image>`;
      }
      
      xml += `
  </url>`;
    });

    xml += `
</urlset>`;

    console.log(`Sitemap generated with ${sortedWorks.length} works and ${sortedPlayground.length} playground items`);
    
    // Return XML with proper content type
    return c.text(xml, 200, {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    });
  } catch (error) {
    console.error(`Error generating sitemap: ${error}`);
    console.error(`Error stack: ${error.stack}`);
    
    // Return minimal sitemap on error
    const baseUrl = "https://creativestefan.work";
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
    
    return c.text(fallbackXml, 200, {
      'Content-Type': 'application/xml; charset=utf-8',
    });
  }
});

// ============================================
// AUTHENTICATED ENDPOINTS
// ============================================

// Sign up route - Create admin user
app.post("/make-server-c0b89456/signup", async (c) => {
  try {
    const ip = getClientIP(c.req.raw);
    const rateLimitResult = await signupLimiter.checkLimit(ip);
    
    if (!rateLimitResult.allowed) {
      const headers = createRateLimitHeaders(rateLimitResult);
      return c.json({ error: "Too many sign-up requests. Please try again later." }, 429, headers);
    }

    const { email, password, name } = await c.req.json();

    if (!email || !password || !name) {
      return c.json({ error: "Email, password, and name are required" }, 400);
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true,
    });

    if (error) {
      console.log(`Error creating user during signup: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ success: true, user: data.user });
  } catch (error) {
    console.log(`Server error during signup: ${error}`);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Reset password route - Update user password (requires auth)
app.post("/make-server-c0b89456/reset-password", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { newPassword } = await c.req.json();

    if (!newPassword) {
      return c.json({ error: "New password is required" }, 400);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (!user || authError) {
      console.log(`Unauthorized password reset attempt: ${authError?.message}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Update user password
    const { error } = await supabase.auth.admin.updateUserById(user.id, {
      password: newPassword,
    });

    if (error) {
      console.log(`Error resetting password: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.log(`Server error during password reset: ${error}`);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Get profile info (requires auth)
app.get("/make-server-c0b89456/profile", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (!user || authError) {
      console.log(`Unauthorized profile access attempt: ${authError?.message}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    console.log("GET /profile - Fetching profile data for authenticated user...");
    const profile = await kv.get("profile");
    console.log("Profile data retrieved:", profile ? "exists" : "not found, using defaults");
    
    if (!profile) {
      // Return default profile if none exists
      return c.json({
        name: "Stephen Jude",
        bio: "Senior Product Designer with engineering depth. I design consumer and enterprise digital products, with a focus on AI and system-level UX",
        twitter: "X (Twitter)",
        linkedin: "LinkedIn",
        github: "Github",
        dribbble: "Dribbble",
        location: "Lagos",
        letsTalkUrl: "https://example.com/lets-talk",
      });
    }

    return c.json(profile);
  } catch (error) {
    console.log(`Error fetching profile: ${error}`);
    return c.json({ error: "Failed to fetch profile" }, 500);
  }
});

// Update profile info (requires auth)
app.put("/make-server-c0b89456/profile", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (!user || authError) {
      console.log(`Unauthorized profile update attempt: ${authError?.message}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    const profileData = await c.req.json();
    await kv.set("profile", profileData);

    return c.json({ success: true, profile: profileData });
  } catch (error) {
    console.log(`Error updating profile: ${error}`);
    return c.json({ error: "Failed to update profile" }, 500);
  }
});

// Get all projects (requires auth)
app.get("/make-server-c0b89456/projects", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (!user || authError) {
      console.log(`Unauthorized projects access attempt: ${authError?.message}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    console.log("GET /projects - Fetching projects for authenticated user...");
    const projects = await kv.getByPrefix("project:");
    console.log(`Projects retrieved: ${projects?.length || 0} found`);
    
    // Sort by order
    const sortedProjects = projects.sort((a, b) => (a.order || 0) - (b.order || 0));
    
    return c.json(sortedProjects);
  } catch (error) {
    console.log(`Error fetching projects: ${error}`);
    return c.json({ error: "Failed to fetch projects" }, 500);
  }
});

// Create project (requires auth)
app.post("/make-server-c0b89456/projects", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (!user || authError) {
      console.log(`Unauthorized project creation attempt: ${authError?.message}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    const projectData = await c.req.json();
    const projectId = `project:${Date.now()}`;
    
    const project = {
      ...projectData,
      id: projectId, // Place id AFTER projectData so it doesn't get overwritten
      createdAt: new Date().toISOString(),
    };

    await kv.set(projectId, project);
    console.log(`Project created successfully: "${projectId}"`);

    return c.json({ success: true, project });
  } catch (error) {
    console.log(`Error creating project: ${error}`);
    return c.json({ error: "Failed to create project" }, 500);
  }
});

// Update project (requires auth)
app.put("/make-server-c0b89456/projects/:id", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (!user || authError) {
      console.log(`Unauthorized project update attempt: ${authError?.message}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    const projectId = c.req.param("id");
    const projectData = await c.req.json();
    
    const existingProject = await kv.get(projectId);
    if (!existingProject) {
      return c.json({ error: "Project not found" }, 404);
    }

    const updatedProject = {
      ...existingProject,
      ...projectData,
      id: projectId,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(projectId, updatedProject);

    return c.json({ success: true, project: updatedProject });
  } catch (error) {
    console.log(`Error updating project: ${error}`);
    return c.json({ error: "Failed to update project" }, 500);
  }
});

// Delete project (requires auth)
app.delete("/make-server-c0b89456/projects/:id", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (!user || authError) {
      console.log(`Unauthorized project deletion attempt: ${authError?.message}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    const projectId = c.req.param("id");
    await kv.del(projectId);

    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting project: ${error}`);
    return c.json({ error: "Failed to delete project" }, 500);
  }
});

// Get all works (requires auth)
app.get("/make-server-c0b89456/works", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (!user || authError) {
      console.log(`Unauthorized works access attempt: ${authError?.message}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    console.log("GET /works - Fetching works for authenticated user...");
    const works = await kv.getByPrefix("work:");
    console.log(`Works retrieved: ${works?.length || 0} found`);
    
    // Sort by order
    const sortedWorks = works.sort((a, b) => (a.order || 0) - (b.order || 0));
    
    return c.json(sortedWorks);
  } catch (error) {
    console.log(`Error fetching works: ${error}`);
    return c.json({ error: "Failed to fetch works" }, 500);
  }
});

// Create work (requires auth)
app.post("/make-server-c0b89456/works", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (!user || authError) {
      console.log(`Unauthorized work creation attempt: ${authError?.message}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    const workData = await c.req.json();
    const workId = `work:${Date.now()}`;
    
    const work = {
      ...workData,
      id: workId, // Place id AFTER workData so it doesn't get overwritten
      createdAt: new Date().toISOString(),
    };

    await kv.set(workId, work);
    console.log(`Work created successfully: "${workId}"`);

    return c.json({ success: true, work });
  } catch (error) {
    console.log(`Error creating work: ${error}`);
    return c.json({ error: "Failed to create work" }, 500);
  }
});

// Update work (requires auth)
app.put("/make-server-c0b89456/works/:id", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (!user || authError) {
      console.log(`Unauthorized work update attempt: ${authError?.message}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    const workId = decodeURIComponent(c.req.param("id"));
    console.log(`PUT /works/:id - Received work ID: "${workId}"`);
    const workData = await c.req.json();
    
    const existingWork = await kv.get(workId);
    if (!existingWork) {
      console.log(`Work not found with ID: "${workId}"`);
      return c.json({ error: "Work not found" }, 404);
    }

    // Remove the id from workData to prevent overwriting
    const { id, ...workDataWithoutId } = workData;

    const updatedWork = {
      ...existingWork,
      ...workDataWithoutId,
      id: workId,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(workId, updatedWork);
    console.log(`Work updated successfully: "${workId}"`);

    return c.json({ success: true, work: updatedWork });
  } catch (error) {
    console.log(`Error updating work: ${error}`);
    return c.json({ error: "Failed to update work" }, 500);
  }
});

// Delete work (requires auth)
app.delete("/make-server-c0b89456/works/:id", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (!user || authError) {
      console.log(`Unauthorized work deletion attempt: ${authError?.message}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    const workId = decodeURIComponent(c.req.param("id"));
    console.log(`DELETE /works/:id - Received work ID: "${workId}"`);
    await kv.del(workId);
    console.log(`Work deleted successfully: "${workId}"`);

    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting work: ${error}`);
    return c.json({ error: "Failed to delete work" }, 500);
  }
});

// ============================================
// PLAYGROUND ENDPOINTS
// ============================================

// Get all playground items (public - no auth required)
app.get("/make-server-c0b89456/playground", async (c) => {
  try {
    console.log("GET /playground - Fetching playground items...");
    const items = await kv.getByPrefix("playground:");
    console.log(`Playground items retrieved: ${items?.length || 0} found`);
    
    // Sort by score descending (5 first), then by order ascending (0 first)
    const sortedItems = items.sort((a, b) => {
      const scoreA = a.score || 5;
      const scoreB = b.score || 5;
      if (scoreB !== scoreA) {
        return scoreB - scoreA; // Higher scores first
      }
      return (a.order || 0) - (b.order || 0); // Within same score, lower order first
    });
    
    return c.json({ items: sortedItems });
  } catch (error) {
    console.log(`Error fetching playground items: ${error}`);
    return c.json({ error: "Failed to fetch playground items" }, 500);
  }
});

// Get playground items with spatial positions for V2 (public - no auth required)
app.get("/make-server-c0b89456/playground/v2", async (c) => {
  try {
    console.log("GET /playground/v2 - Fetching playground items with spatial positions...");
    const items = await kv.getByPrefix("playground:");
    console.log(`Playground items retrieved: ${items?.length || 0} found`);
    
    // Sort by score descending (5 first), then by order ascending (0 first)
    const sortedItems = items.sort((a, b) => {
      const scoreA = a.score || 5;
      const scoreB = b.score || 5;
      if (scoreB !== scoreA) {
        return scoreB - scoreA; // Higher scores first
      }
      return (a.order || 0) - (b.order || 0); // Within same score, lower order first
    });
    
    // Deterministic position generation using item.id as seed
    const hashCode = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return Math.abs(hash);
    };
    
    // Check if two rectangles overlap (with padding for spacing)
    const checkOverlap = (
      x1: number, y1: number, w1: number, h1: number,
      x2: number, y2: number, w2: number, h2: number,
      padding: number = 40
    ) => {
      // Add padding around each item
      const left1 = x1 - w1 / 2 - padding;
      const right1 = x1 + w1 / 2 + padding;
      const top1 = y1 - h1 / 2 - padding;
      const bottom1 = y1 + h1 / 2 + padding;
      
      const left2 = x2 - w2 / 2 - padding;
      const right2 = x2 + w2 / 2 + padding;
      const top2 = y2 - h2 / 2 - padding;
      const bottom2 = y2 + h2 / 2 + padding;
      
      return !(right1 < left2 || left1 > right2 || bottom1 < top2 || top1 > bottom2);
    };
    
    // Generate positions with collision detection
    const placedItems: Array<{
      id: string;
      worldX: number;
      worldY: number;
      width: number;
      height: number;
      [key: string]: any;
    }> = [];
    
    for (const item of sortedItems) {
      const score = item.score || 5;
      const seed = hashCode(item.id);
      
      // Deterministic random function
      const random = (n: number) => {
        const x = Math.sin(seed + n) * 10000;
        return x - Math.floor(x);
      };
      
      // Determine size based on media type and add some variety
      const sizeVariation = random(3) * 0.3 + 0.85; // 0.85 to 1.15
      const baseWidth = item.mediaType === 'video' ? 400 : 350;
      const width = Math.round(baseWidth * sizeVariation);
      const height = Math.round(width * 0.75); // 4:3 aspect ratio
      
      // Score determines preferred distance from origin - tighter clustering for high scores
      const scoreRadius = {
        5: 200,   // Very close to origin (tightly clustered)
        4: 550,   // Closer
        3: 900,   // Medium distance
        2: 1300,  // Far
        1: 1800,  // Farthest
      }[score] || 200;
      
      // Try to find a non-overlapping position
      let placed = false;
      let finalX = 0;
      let finalY = 0;
      
      // Try multiple candidate positions in expanding rings
      const maxAttempts = 200;
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        // Generate position using spiral pattern for better distribution
        const ringIndex = Math.floor(attempt / 12); // 12 positions per ring
        const angleIndex = attempt % 12;
        
        const distance = scoreRadius + ringIndex * 150; // Tighter expansion (was 300)
        const baseAngle = (angleIndex / 12) * Math.PI * 2;
        const angleOffset = random(10 + attempt) * 0.4 - 0.2; // Small random offset
        const angle = baseAngle + angleOffset;
        
        const candidateX = Math.round(Math.cos(angle) * distance);
        const candidateY = Math.round(Math.sin(angle) * distance);
        
        // Check for overlaps with all previously placed items
        let hasOverlap = false;
        for (const placedItem of placedItems) {
          if (checkOverlap(
            candidateX, candidateY, width, height,
            placedItem.worldX, placedItem.worldY, placedItem.width, placedItem.height
          )) {
            hasOverlap = true;
            break;
          }
        }
        
        if (!hasOverlap) {
          finalX = candidateX;
          finalY = candidateY;
          placed = true;
          break;
        }
      }
      
      // Fallback: if still not placed, put it far away
      if (!placed) {
        const fallbackAngle = random(100) * Math.PI * 2;
        const fallbackDistance = scoreRadius + placedItems.length * 400;
        finalX = Math.round(Math.cos(fallbackAngle) * fallbackDistance);
        finalY = Math.round(Math.sin(fallbackAngle) * fallbackDistance);
      }
      
      placedItems.push({
        ...item,
        worldX: finalX,
        worldY: finalY,
        width,
        height,
      });
    }
    
    return c.json({ items: placedItems });
  } catch (error) {
    console.log(`Error fetching playground v2 items: ${error}`);
    return c.json({ error: "Failed to fetch playground items" }, 500);
  }
});

// Get all playground items for admin (requires auth)
app.get("/make-server-c0b89456/playground/admin", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (!user || authError) {
      console.log(`Unauthorized playground access attempt: ${authError?.message}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    console.log("GET /playground/admin - Fetching playground items for authenticated user...");
    const items = await kv.getByPrefix("playground:");
    console.log(`Playground items retrieved: ${items?.length || 0} found`);
    
    // Sort by score descending (5 first), then by order ascending (0 first)
    const sortedItems = items.sort((a, b) => {
      const scoreA = a.score || 5;
      const scoreB = b.score || 5;
      if (scoreB !== scoreA) {
        return scoreB - scoreA; // Higher scores first
      }
      return (a.order || 0) - (b.order || 0); // Within same score, lower order first
    });
    
    return c.json(sortedItems);
  } catch (error) {
    console.log(`Error fetching playground items: ${error}`);
    return c.json({ error: "Failed to fetch playground items" }, 500);
  }
});

// Get featured playground items (public - no auth required)
app.get("/make-server-c0b89456/playground/featured", async (c) => {
  try {
    console.log("GET /playground/featured - Fetching featured playground items...");
    const items = await kv.getByPrefix("playground:");
    console.log(`Playground items retrieved: ${items?.length || 0} found`);
    
    // Filter for featured items only
    const featuredItems = items.filter(item => item.featured === true);
    console.log(`Featured items found: ${featuredItems?.length || 0}`);
    
    // Sort by order
    const sortedItems = featuredItems.sort((a, b) => (a.order || 0) - (b.order || 0));
    
    return c.json(sortedItems);
  } catch (error) {
    console.log(`Error fetching featured playground items: ${error}`);
    return c.json({ error: "Failed to fetch featured playground items" }, 500);
  }
});

// Upload to Cloudflare (requires auth)
app.post("/make-server-c0b89456/upload-cloudflare", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (!user || authError) {
      console.log(`Unauthorized upload attempt: ${authError?.message}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    const accountId = Deno.env.get("CLOUDFLARE_ACCOUNT_ID");
    const r2AccessKeyId = Deno.env.get("CLOUDFLARE_R2_ACCESS_KEY_ID");
    const r2SecretAccessKey = Deno.env.get("CLOUDFLARE_R2_SECRET_ACCESS_KEY");
    const r2PublicDomain = Deno.env.get("CLOUDFLARE_R2_PUBLIC_DOMAIN") || "https://pub-3092f30748a044f6abcf47bd10270d53.r2.dev";
    const r2BucketName = Deno.env.get("CLOUDFLARE_R2_BUCKET_NAME") || "stephen";

    if (!accountId || !r2AccessKeyId || !r2SecretAccessKey) {
      console.log("Cloudflare R2 credentials not configured");
      console.log(`Account ID: ${accountId ? 'present' : 'MISSING'}`);
      console.log(`Access Key ID: ${r2AccessKeyId ? 'present' : 'MISSING'}`);
      console.log(`Secret Access Key: ${r2SecretAccessKey ? 'present' : 'MISSING'}`);
      return c.json({ error: "Cloudflare R2 credentials not configured" }, 500);
    }

    console.log(`Using Cloudflare Account ID: ${accountId.substring(0, 8)}...`);
    console.log(`Using R2 Access Key ID: ${r2AccessKeyId.substring(0, 8)}...`);
    console.log(`Using R2 Bucket: ${r2BucketName}`);

    const formData = await c.req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return c.json({ error: "No file provided" }, 400);
    }

    console.log(`File received: ${file.name}, type: ${file.type}, size: ${file.size} bytes`);

    // Generate a unique filename with timestamp
    const timestamp = Date.now();
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${timestamp}-${sanitizedFilename}`;
    const bucketName = r2BucketName;

    // Read file as ArrayBuffer
    const fileBuffer = await file.arrayBuffer();
    const fileBytes = new Uint8Array(fileBuffer);

    // Create AWS Signature V4 for R2
    const { createPresignedURL } = await import("https://deno.land/x/aws_sign_v4@1.0.2/mod.ts");
    
    const region = "auto"; // R2 uses "auto" as region
    const service = "s3";
    const method = "PUT";
    const host = `${accountId}.r2.cloudflarestorage.com`;
    const url = `https://${host}/${bucketName}/${filename}`;
    
    // Create date strings
    const now = new Date();
    const dateString = now.toISOString().replace(/[:\-]|\.\d{3}/g, "").slice(0, 8);
    const datetimeString = now.toISOString().replace(/[:\-]|\.\d{3}/g, "").slice(0, 15) + "Z";
    
    // Create canonical request
    const canonicalUri = `/${bucketName}/${filename}`;
    const canonicalQuerystring = "";
    const canonicalHeaders = `host:${host}\nx-amz-content-sha256:UNSIGNED-PAYLOAD\nx-amz-date:${datetimeString}\n`;
    const signedHeaders = "host;x-amz-content-sha256;x-amz-date";
    const payloadHash = "UNSIGNED-PAYLOAD";
    
    const canonicalRequest = `${method}\n${canonicalUri}\n${canonicalQuerystring}\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;
    
    // Create string to sign
    const algorithm = "AWS4-HMAC-SHA256";
    const credentialScope = `${dateString}/${region}/${service}/aws4_request`;
    
    const encoder = new TextEncoder();
    const canonicalRequestHash = await crypto.subtle.digest(
      "SHA-256",
      encoder.encode(canonicalRequest)
    );
    const canonicalRequestHashHex = Array.from(new Uint8Array(canonicalRequestHash))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");
    
    const stringToSign = `${algorithm}\n${datetimeString}\n${credentialScope}\n${canonicalRequestHashHex}`;
    
    // Calculate signature
    async function hmac(key: Uint8Array | string, data: string): Promise<Uint8Array> {
      const cryptoKey = await crypto.subtle.importKey(
        "raw",
        typeof key === "string" ? encoder.encode(key) : key,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );
      const signature = await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(data));
      return new Uint8Array(signature);
    }
    
    const kDate = await hmac(`AWS4${r2SecretAccessKey}`, dateString);
    const kRegion = await hmac(kDate, region);
    const kService = await hmac(kRegion, service);
    const kSigning = await hmac(kService, "aws4_request");
    const signature = await hmac(kSigning, stringToSign);
    
    const signatureHex = Array.from(signature)
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");
    
    // Create authorization header
    const authorization = `${algorithm} Credential=${r2AccessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signatureHex}`;
    
    // Upload file to R2
    const uploadResponse = await fetch(url, {
      method: "PUT",
      headers: {
        "Authorization": authorization,
        "x-amz-content-sha256": payloadHash,
        "x-amz-date": datetimeString,
        "Content-Type": file.type || "application/octet-stream",
      },
      body: fileBytes,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.log(`R2 upload error: ${uploadResponse.status} - ${errorText}`);
      
      // Provide more helpful error messages
      if (uploadResponse.status === 403 || uploadResponse.status === 401) {
        console.log('R2 Authentication failed. Please verify:');
        console.log('1. CLOUDFLARE_ACCOUNT_ID is correct');
        console.log('2. CLOUDFLARE_R2_ACCESS_KEY_ID is correct');
        console.log('3. CLOUDFLARE_R2_SECRET_ACCESS_KEY is correct');
        console.log('4. The R2 bucket "stephen" exists');
        console.log('5. The API token has R2 Write permissions');
        return c.json({ 
          error: `R2 Authentication failed. Please verify your Cloudflare R2 credentials in the environment variables.`,
          details: errorText 
        }, 500);
      }
      
      return c.json({ error: `Failed to upload to R2: ${errorText}` }, 500);
    }

    // Construct the public URL using your R2 public domain
    const publicUrl = `${r2PublicDomain}/${filename}`;
    console.log(`File uploaded successfully to R2: ${publicUrl}`);

    return c.json({ success: true, url: publicUrl });
  } catch (error) {
    console.log(`Error uploading to Cloudflare R2: ${error}`);
    console.log(`Error stack: ${error.stack}`);
    return c.json({ error: `Failed to upload file: ${error.message}` }, 500);
  }
});

// Create playground item (requires auth)
app.post("/make-server-c0b89456/playground", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (!user || authError) {
      console.log(`Unauthorized playground creation attempt: ${authError?.message}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    const itemData = await c.req.json();
    const itemId = `playground:${Date.now()}`;
    
    // Remove the id from itemData to prevent overwriting the generated ID
    const { id, ...dataWithoutId } = itemData;
    
    const item = {
      id: itemId,
      ...dataWithoutId,
      score: dataWithoutId.score || 5, // Default score is 5 (highest)
      createdAt: new Date().toISOString(),
    };

    await kv.set(itemId, item);

    return c.json({ success: true, item });
  } catch (error) {
    console.log(`Error creating playground item: ${error}`);
    return c.json({ error: "Failed to create playground item" }, 500);
  }
});

// Update playground item (requires auth)
app.put("/make-server-c0b89456/playground/:id", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (!user || authError) {
      console.log(`Unauthorized playground update attempt: ${authError?.message}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    const itemId = c.req.param("id");
    const updates = await c.req.json();
    
    console.log(`Updating playground item ${itemId} with data:`, updates);
    
    const existingItem = await kv.get(itemId);
    
    if (!existingItem) {
      console.log(`Playground item not found: ${itemId}`);
      return c.json({ error: "Playground item not found" }, 404);
    }

    // Remove the id from updates to prevent overwriting
    const { id, ...updatesWithoutId } = updates;

    const updatedItem = {
      ...existingItem,
      ...updatesWithoutId,
      id: itemId, // Ensure ID stays the same
      updatedAt: new Date().toISOString(),
    };

    console.log(`Saving updated playground item:`, updatedItem);
    await kv.set(itemId, updatedItem);

    return c.json({ success: true, item: updatedItem });
  } catch (error) {
    console.log(`Error updating playground item: ${error}`);
    return c.json({ error: "Failed to update playground item" }, 500);
  }
});

// Delete playground item (requires auth)
app.delete("/make-server-c0b89456/playground/:id", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (!user || authError) {
      console.log(`Unauthorized playground deletion attempt: ${authError?.message}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    const itemId = c.req.param("id");
    await kv.del(itemId);

    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting playground item: ${error}`);
    return c.json({ error: "Failed to delete playground item" }, 500);
  }
});

Deno.serve(app.fetch);