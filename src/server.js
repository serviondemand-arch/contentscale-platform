<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ContentScale Platform - Complete System</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }
        
        header {
            background: linear-gradient(135deg, #4A9BFF 0%, #3A7BFF 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        
        h1 {
            margin: 0;
            font-size: 2.5em;
            font-weight: 800;
        }
        
        .subtitle {
            font-size: 1.2em;
            opacity: 0.9;
            margin-top: 10px;
        }
        
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            padding: 40px;
        }
        
        .feature-card {
            background: #f8f9fa;
            border-radius: 15px;
            padding: 25px;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            border: 2px solid transparent;
        }
        
        .feature-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            border-color: #4A9BFF;
        }
        
        .feature-icon {
            font-size: 2em;
            margin-bottom: 15px;
            color: #4A9BFF;
        }
        
        .feature-title {
            font-weight: 600;
            margin-bottom: 10px;
            color: #2c3e50;
        }
        
        .endpoints {
            background: #f8f9fa;
            padding: 40px;
            margin: 20px;
            border-radius: 15px;
        }
        
        .endpoint {
            background: white;
            padding: 20px;
            margin: 15px 0;
            border-radius: 10px;
            border-left: 4px solid #4A9BFF;
            box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        }
        
        .method {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 5px;
            font-weight: 600;
            font-size: 0.9em;
            margin-right: 10px;
        }
        
        .method.get { background: #61affe; color: white; }
        .method.post { background: #49cc90; color: white; }
        .method.put { background: #fca130; color: white; }
        .method.delete { background: #f93e3e; color: white; }
        .method.patch { background: #50e3c2; color: white; }
        
        .path {
            font-family: monospace;
            background: #f1f3f4;
            padding: 8px 12px;
            border-radius: 5px;
            margin: 10px 0;
            display: block;
        }
        
        .status {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 12px;
            font-size: 0.8em;
            font-weight: 600;
            margin-left: 10px;
        }
        
        .status.live { background: #4caf50; color: white; }
        .status.dev { background: #ff9800; color: white; }
        
        .system-status {
            padding: 20px 40px;
            background: #2c3e50;
            color: white;
            text-align: center;
        }
        
        .system-status .online {
            color: #4caf50;
            font-weight: 600;
        }
        
        .quick-links {
            display: flex;
            justify-content: center;
            gap: 20px;
            padding: 30px;
            flex-wrap: wrap;
        }
        
        .link-button {
            padding: 15px 30px;
            background: #4A9BFF;
            color: white;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 600;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 10px;
        }
        
        .link-button:hover {
            background: #3A7BFF;
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(74, 155, 255, 0.3);
        }
        
        .link-button.secondary {
            background: #6c757d;
        }
        
        .link-button.secondary:hover {
            background: #5a6268;
        }
        
        @media (max-width: 768px) {
            .features-grid {
                grid-template-columns: 1fr;
                padding: 20px;
            }
            
            header {
                padding: 30px 20px;
            }
            
            h1 {
                font-size: 2em;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🎯 ContentScale Complete Platform</h1>
            <div class="subtitle">Hybrid AI Scoring System with Admin Management + Share Link System</div>
            <div style="margin-top: 20px;">
                <span class="status live">LIVE</span>
                <span style="opacity: 0.9;">Production Ready • All Systems Operational</span>
            </div>
        </header>
        
        <div class="system-status">
            <div>🟢 System Status: <span class="online">OPERATIONAL</span> • Version: 2.0 • System: Hybrid</div>
        </div>
        
        <div class="quick-links">
            <a href="/seo-contentscore" class="link-button">🔍 Free SEO Scanner</a>
            <a href="/admin" class="link-button">👑 Admin Dashboard</a>
            <a href="/agency" class="link-button">🏢 Agency Portal</a>
            <a href="/contact-form" class="link-button">📧 Contact/Lead Form</a>
            <a href="/setup" class="link-button secondary">⚙️ Setup Admin</a>
        </div>
        
        <div class="features-grid">
            <div class="feature-card">
                <div class="feature-icon">🤖</div>
                <div class="feature-title">Hybrid AI Scoring</div>
                <p>Combines deterministic parsing with Claude AI validation for accurate content scoring.</p>
            </div>
            
            <div class="feature-card">
                <div class="feature-icon">👑</div>
                <div class="feature-title">Super Admin Management</div>
                <p>Full user management, agency control, and system configuration.</p>
            </div>
            
            <div class="feature-card">
                <div class="feature-icon">🏢</div>
                <div class="feature-title">Agency System</div>
                <p>Multi-tenant agency management with white-label support and client portals.</p>
            </div>
            
            <div class="feature-card">
                <div class="feature-icon">🔗</div>
                <div class="feature-title">Share Link System</div>
                <p>Create shareable scan links with usage limits and expiration dates.</p>
            </div>
            
            <div class="feature-card">
                <div class="feature-icon">📊</div>
                <div class="feature-title">Leaderboards</div>
                <p>Country-specific leaderboards showing top-performing agencies.</p>
            </div>
            
            <div class="feature-card">
                <div class="feature-icon">🤝</div>
                <div class="feature-title">Lead Generation</div>
                <p>Integrated lead capture with automatic scan link generation.</p>
            </div>
        </div>
        
        <div class="endpoints">
            <h2 style="text-align: center; color: #2c3e50; margin-bottom: 30px;">API Endpoints</h2>
            
            <!-- Public Endpoints -->
            <h3 style="color: #4A9BFF; margin-top: 30px;">Public Endpoints</h3>
            
            <div class="endpoint">
                <span class="method get">GET</span>
                <span class="path">/</span>
                <p>API welcome and system info</p>
            </div>
            
            <div class="endpoint">
                <span class="method get">GET</span>
                <span class="path">/health</span>
                <p>System health check with database status</p>
            </div>
            
            <div class="endpoint">
                <span class="method post">POST</span>
                <span class="path">/api/scan-free</span>
                <p>Free SEO scan with shareable results</p>
            </div>
            
            <div class="endpoint">
                <span class="method get">GET</span>
                <span class="path">/api/scan-result/:shareId</span>
                <p>Retrieve scan result by share ID</p>
            </div>
            
            <div class="endpoint">
                <span class="method get">GET</span>
                <span class="path">/api/leaderboard/:country</span>
                <p>Get country-specific agency leaderboard</p>
            </div>
            
            <!-- Share Link Endpoints -->
            <h3 style="color: #4A9BFF; margin-top: 30px;">Share Link System</h3>
            
            <div class="endpoint">
                <span class="method get">GET</span>
                <span class="path">/api/share-link/validate/:code</span>
                <p>Validate share link status and limits</p>
            </div>
            
            <div class="endpoint">
                <span class="method post">POST</span>
                <span class="path">/api/share-link/scan</span>
                <p>Perform scan using share link code</p>
            </div>
            
            <!-- NEW: Share Link Callback Endpoint -->
            <div class="endpoint">
                <span class="method post">POST</span>
                <span class="path">/api/share-link/callback</span>
                <p>Callback endpoint for share link notifications</p>
            </div>
            
            <!-- Admin Endpoints -->
            <h3 style="color: #4A9BFF; margin-top: 30px;">Admin Management</h3>
            
            <div class="endpoint">
                <span class="method get">GET</span>
                <span class="path">/api/admins</span>
                <p>List all admin users (Super Admin only)</p>
            </div>
            
            <div class="endpoint">
                <span class="method post">POST</span>
                <span class="path">/api/admins</span>
                <p>Create new admin/helper user</p>
            </div>
            
            <!-- Share Link Admin Endpoints -->
            <div class="endpoint">
                <span class="method post">POST</span>
                <span class="path">/api/admin/share-links/create</span>
                <p>Create new share link (Super Admin)</p>
            </div>
            
            <div class="endpoint">
                <span class="method get">GET</span>
                <span class="path">/api/admin/share-links</span>
                <p>List all share links (Super Admin)</p>
            </div>
            
            <!-- Lead Management -->
            <h3 style="color: #4A9BFF; margin-top: 30px;">Lead Generation</h3>
            
            <div class="endpoint">
                <span class="method post">POST</span>
                <span class="path">/api/leads/submit</span>
                <p>Submit lead form and get scan link</p>
            </div>
            
            <!-- Agency Endpoints -->
            <h3 style="color: #4A9BFF; margin-top: 30px;">Agency System</h3>
            
            <div class="endpoint">
                <span class="method get">GET</span>
                <span class="path">/api/admin/agency/my-agency</span>
                <p>Get agency info (requires agency key)</p>
            </div>
            
            <div class="endpoint">
                <span class="method get">GET</span>
                <span class="path">/api/admin/agency/my-clients</span>
                <p>Get agency's clients</p>
            </div>
            
            <!-- Client Endpoints -->
            <h3 style="color: #4A9BFF; margin-top: 30px;">Client Portal</h3>
            
            <div class="endpoint">
                <span class="method get">GET</span>
                <span class="path">/api/client/info?key=SHARE_KEY</span>
                <p>Get client info using share key</p>
            </div>
            
            <div class="endpoint">
                <span class="method post">POST</span>
                <span class="path">/api/client/scan</span>
                <p>Client scan using share key</p>
            </div>
            
            <!-- Setup Endpoints -->
            <h3 style="color: #4A9BFF; margin-top: 30px;">Setup & Configuration</h3>
            
            <div class="endpoint">
                <span class="method post">POST</span>
                <span class="path">/api/setup/create-admin</span>
                <p>Create initial super admin</p>
            </div>
            
            <div class="endpoint">
                <span class="method post">POST</span>
                <span class="path">/api/setup/verify-admin</span>
                <p>Verify super admin credentials</p>
            </div>
        </div>
        
        <div style="padding: 40px; text-align: center; background: #f8f9fa; border-top: 1px solid #dee2e6;">
            <h3 style="color: #2c3e50; margin-bottom: 20px;">Quick Start</h3>
            <div style="max-width: 600px; margin: 0 auto; text-align: left; background: white; padding: 25px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.05);">
                <ol style="margin: 0; padding-left: 20px;">
                    <li><strong>Setup Admin:</strong> Go to <code>/setup</code> to create your first super admin</li>
                    <li><strong>Free Scan:</strong> Visit <code>/seo-contentscore</code> for free SEO analysis</li>
                    <li><strong>Admin Dashboard:</strong> Access <code>/admin</code> with your super admin credentials</li>
                    <li><strong>Create Agencies:</strong> Use admin dashboard to create agency accounts</li>
                    <li><strong>Share Links:</strong> Create scan links for clients or leads</li>
                </ol>
            </div>
        </div>
        
        <footer style="text-align: center; padding: 30px; color: #6c757d; border-top: 1px solid #dee2e6;">
            <p>ContentScale Complete Platform • Hybrid AI Scoring System • v2.0</p>
            <p style="font-size: 0.9em; opacity: 0.8;">All endpoints protected with proper authentication and rate limiting</p>
        </footer>
    </div>
    
    <script>
        // Optional: Add some interactivity
        document.addEventListener('DOMContentLoaded', function() {
            // Add click animation to feature cards
            const cards = document.querySelectorAll('.feature-card');
            cards.forEach(card => {
                card.addEventListener('click', function() {
                    this.style.transform = 'scale(0.98)';
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 150);
                });
            });
            
            // Check system health
            fetch('/health')
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'ok') {
                        console.log('✅ System is healthy:', data);
                    }
                })
                .catch(error => {
                    console.warn('⚠️ Health check failed:', error);
                });
        });
    </script>
</body>
</html>
