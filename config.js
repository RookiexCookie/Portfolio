const CONFIG = {
    // Identity
    brand: "PortFolio.",
    
    // Hero Section
    hero: {
        greeting: "Welcome, I am",
        name: "K Harish",
        role: "> PROTOCOL_3: { Protect the Code }",
        description: "",
        ctaText: "Explore Work"
    },

    // About Section
    about: {
        text: [
            "I am a developer currently navigating the 2nd year of my Computer Science degree.",
            "I build projects that are both functional and visually distinct."
        ],
        stats: [
                { label: "Education", value: "UnderGraduate" },
                { label: "Projects", value: "6+ Built" },
                { label: "Focus", value: "AI & Web" }
            ],
        skills: [
            "Python", "Three.js", "Html", "Node.js", 
            "CSS", "Bash", "C", "Git", "Django" ,"MySQL"
        ]
    },

    // Projects Section
    // NOTE: If you add more than 3, a "View More" button will appear automatically.
    projects: [
                {
            title: "BT-7274 AI Core",
            description: "Desktop voice assistant inspired by Titanfall. Uses LLMs and Python for natural language processing and system automation.",
            tags: ["Python", "OpenRouter", "NLP"],
            image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
            link: "#",
            github: "https://github.com/RookiexCookie/BT_7274_LLM"
        },

        {
            title: "Spotify Roast",
            description: "An AI-powered application that analyzes your Spotify listening history to deliver savage, Hinglish-style roasts and calculate your music taste 'replaceability' score.",
            tags: ["Next.js", "Spotify Api", "Gen AI"],
            image: "https://images.unsplash.com/photo-1643208589896-07b8feb4dffa?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            link: "https://spotify-roast-fx.vercel.app/",
            github: "https://github.com/RookiexCookie/Spotify_Roast"
        },
        {
            title: "WhatsApp AI Bot (n8n)",
            description: "A self-hosted WhatsApp agent orchestrated via n8n and Docker. Features OpenRouter LLM integration, conversation memory, and a secure user whitelisting system.",
            tags: ["n8n", "Node.js", "AI Agents"],
            image: "https://plus.unsplash.com/premium_photo-1684761949804-fd8eb9a5b6cc?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            link: "#",
            github: "https://github.com/RookiexCookie/Whatsapp-ChatBot-n8n"
        },
{
            title: "Utility Software Hub",
            description: "A curated collection of powerful web-based tools.",
            tags: ["JavaScript", "HTML5", "CSS"],
            image: "https://plus.unsplash.com/premium_photo-1720287601920-ee8c503af775?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            link: "https://rookiexcookie.github.io/Utility_Projects/",
            github: "https://github.com/RookiexCookie/Utility_Projects"
        },

        {
            title: "Ethereal Music Player",
            description: "A visually immersive, frameless local music player built with PyQt6.",
            tags: ["Python", "PyQt6", "Multimedia"],
            image: "https://images.unsplash.com/photo-1683142567282-b5e4aeb5b15e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            link: "#",
            github: "https://github.com/RookiexCookie/MusicPlayer"
        },
        {
            title: "GeoSphere Challenge",
            description: "An immersive geography guessing game powered by Google Street View. Features a dark neon-amber UI, real-time Haversine distance scoring, and a 5-round timed challenge mode.",
            tags: ["Google Maps", "JavaScript"],
            image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
            link: "https://rookiexcookie.github.io/GeoGuessr/",
            github: "https://github.com/RookiexCookie/GeoGuessr"
        },

    ],

    // Contact Section
    contact: {
        email: "kormaharish52@gmail.com",
        socials: [
            { name: "GitHub", icon: "fab fa-github", url: "https://github.com/RookiexCookie" },
            { name: "LinkedIn", icon: "fab fa-linkedin", url: "https://www.linkedin.com/in/k-harish1234" },
        ]
    }
};