// Demo data for first-time demo mode users
// This data showcases how the app works with realistic personas and journal entries

function getDemoData() {
  const now = Date.now();

  // Create demo personas (7 different personas)
  const personas = [
    {
      id: 'persona_work',
      name: 'Work Me',
      color: '#ef4444',
      avatarIcon: '💼',
      createdAt: new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'persona_creative',
      name: 'Creative Me',
      color: '#8b5cf6',
      avatarIcon: '🎨',
      createdAt: new Date(now - 6 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'persona_fitness',
      name: 'Fitness Me',
      color: '#10b981',
      avatarIcon: '💪',
      createdAt: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'persona_social',
      name: 'Social Me',
      color: '#f59e0b',
      avatarIcon: '🎉',
      createdAt: new Date(now - 4 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'persona_mindful',
      name: 'Mindful Me',
      color: '#06b6d4',
      avatarIcon: '🧘',
      createdAt: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'persona_learner',
      name: 'Student Me',
      color: '#ec4899',
      avatarIcon: '📚',
      createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'persona_adventurer',
      name: 'Adventure Me',
      color: '#84cc16',
      avatarIcon: '🌍',
      createdAt: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  // Create demo journals with realistic conversations
  const journals = [
    // 7 days ago
    {
      id: 'journal_demo_1',
      title: new Date(now - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      date: new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isSpecial: false,
      messages: [
        {
          id: 'msg_demo_1',
          personaId: 'persona_work',
          personaName: 'Work Me',
          personaColor: '#ef4444',
          personaIcon: '💼',
          content: 'Started the new project today! The team seems excited about the roadmap.',
          timestamp: new Date(now - 7 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000).toISOString(),
          reactions: [{ 
            emoji: '🚀', 
            personaId: 'persona_creative', 
            timestamp: new Date().toISOString() 
          }]
        },
        {
          id: 'msg_demo_1b',
          personaId: 'persona_learner',
          personaName: 'Student Me',
          personaColor: '#ec4899',
          personaIcon: '📚',
          content: 'Started that online course on machine learning. First lesson was actually pretty interesting!',
          timestamp: new Date(now - 7 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'msg_demo_2',
          personaId: 'persona_creative',
          personaName: 'Creative Me',
          personaColor: '#8b5cf6',
          personaIcon: '🎨',
          content: 'Feeling inspired! Sketched out some design ideas for the weekend project.',
          timestamp: new Date(now - 7 * 24 * 60 * 60 * 1000 + 19 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'msg_demo_2b',
          personaId: 'persona_mindful',
          personaName: 'Mindful Me',
          personaColor: '#06b6d4',
          personaIcon: '🧘',
          content: 'Evening meditation was peaceful. Finally feeling grounded after a hectic Monday.',
          timestamp: new Date(now - 7 * 24 * 60 * 60 * 1000 + 21 * 60 * 60 * 1000).toISOString(),
          reactions: [{ 
            emoji: '🙏', 
            personaId: 'persona_social', 
            timestamp: new Date().toISOString() 
          }]
        }
      ],
      createdAt: new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    
    // 5 days ago - SPECIAL DAY
    {
      id: 'journal_demo_2',
      title: new Date(now - 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      date: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isSpecial: true,
      specialNote: 'Hit a major milestone! 🎯',
      messages: [
        {
          id: 'msg_demo_3a',
          personaId: 'persona_mindful',
          personaName: 'Mindful Me',
          personaColor: '#06b6d4',
          personaIcon: '🧘',
          content: 'Morning gratitude: thankful for good health, supportive friends, and new opportunities ahead.',
          timestamp: new Date(now - 5 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'msg_demo_3',
          personaId: 'persona_fitness',
          personaName: 'Fitness Me',
          personaColor: '#10b981',
          personaIcon: '💪',
          content: 'Finally hit my goal of running 5k under 30 minutes! All that training paid off 🏃‍♂️',
          timestamp: new Date(now - 5 * 24 * 60 * 60 * 1000 + 7 * 60 * 60 * 1000).toISOString(),
          reactions: [
            { emoji: '🔥', personaId: 'persona_work', timestamp: new Date().toISOString() },
            { emoji: '💪', personaId: 'persona_social', timestamp: new Date().toISOString() },
            { emoji: '🎉', personaId: 'persona_learner', timestamp: new Date().toISOString() }
          ]
        },
        {
          id: 'msg_demo_3b',
          personaId: 'persona_learner',
          personaName: 'Student Me',
          personaColor: '#ec4899',
          personaIcon: '📚',
          content: 'Aced the Python assignment! The concepts are finally clicking. Feeling proud of the progress.',
          timestamp: new Date(now - 5 * 24 * 60 * 60 * 1000 + 11 * 60 * 60 * 1000).toISOString(),
          reactions: [{ emoji: '🎓', personaId: 'persona_work', timestamp: new Date().toISOString() }]
        },
        {
          id: 'msg_demo_4',
          personaId: 'persona_work',
          personaName: 'Work Me',
          personaColor: '#ef4444',
          personaIcon: '💼',
          content: 'Presented the prototype to stakeholders. Got amazing feedback! They want to move forward with phase 2.',
          timestamp: new Date(now - 5 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000).toISOString(),
          reactions: [{ 
            emoji: '👏', 
            personaId: 'persona_creative', 
            timestamp: new Date().toISOString() 
          }]
        },
        {
          id: 'msg_demo_4b',
          personaId: 'persona_creative',
          personaName: 'Creative Me',
          personaColor: '#8b5cf6',
          personaIcon: '🎨',
          content: 'Finished that watercolor painting I\'ve been working on for weeks. It turned out better than I imagined!',
          timestamp: new Date(now - 5 * 24 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000).toISOString(),
          reactions: [{ emoji: '😍', personaId: 'persona_social', timestamp: new Date().toISOString() }]
        },
        {
          id: 'msg_demo_5',
          personaId: 'persona_social',
          personaName: 'Social Me',
          personaColor: '#f59e0b',
          personaIcon: '🎉',
          content: 'Dinner with the squad was exactly what I needed. Laughed till my stomach hurt 😂',
          timestamp: new Date(now - 5 * 24 * 60 * 60 * 1000 + 20 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'msg_demo_5b',
          personaId: 'persona_mindful',
          personaName: 'Mindful Me',
          personaColor: '#06b6d4',
          personaIcon: '🧘',
          content: 'Reflecting on today... This is what balance feels like. Every part of me showed up. ✨',
          timestamp: new Date(now - 5 * 24 * 60 * 60 * 1000 + 22 * 60 * 60 * 1000).toISOString(),
          reactions: [
            { emoji: '❤️', personaId: 'persona_work', timestamp: new Date().toISOString() },
            { emoji: '🙏', personaId: 'persona_fitness', timestamp: new Date().toISOString() }
          ]
        }
      ],
      createdAt: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    
    // 3 days ago
    {
      id: 'journal_demo_3',
      title: new Date(now - 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      date: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isSpecial: false,
      messages: [
        {
          id: 'msg_demo_6a',
          personaId: 'persona_fitness',
          personaName: 'Fitness Me',
          personaColor: '#10b981',
          personaIcon: '💪',
          content: 'Rest day but still did some yoga. Active recovery is underrated.',
          timestamp: new Date(now - 3 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'msg_demo_6',
          personaId: 'persona_creative',
          personaName: 'Creative Me',
          personaColor: '#8b5cf6',
          personaIcon: '🎨',
          content: 'Spent the afternoon learning Blender. 3D modeling is harder than I thought but super rewarding!',
          timestamp: new Date(now - 3 * 24 * 60 * 60 * 1000 + 15 * 60 * 60 * 1000).toISOString(),
          reactions: [{ emoji: '🤓', personaId: 'persona_learner', timestamp: new Date().toISOString() }]
        },
        {
          id: 'msg_demo_7',
          personaId: 'persona_work',
          personaName: 'Work Me',
          personaColor: '#ef4444',
          personaIcon: '💼',
          content: 'Code review took longer than expected but caught some important bugs. Quality over speed.',
          timestamp: new Date(now - 3 * 24 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'msg_demo_7b',
          personaId: 'persona_adventurer',
          personaName: 'Adventure Me',
          personaColor: '#84cc16',
          personaIcon: '🌍',
          content: 'Started planning that summer road trip. So many places I want to see! 🗺️',
          timestamp: new Date(now - 3 * 24 * 60 * 60 * 1000 + 20 * 60 * 60 * 1000).toISOString(),
          reactions: [{ emoji: '✈️', personaId: 'persona_social', timestamp: new Date().toISOString() }]
        }
      ],
      createdAt: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    
    // Yesterday
    {
      id: 'journal_demo_4',
      title: new Date(now - 1 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      date: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isSpecial: false,
      messages: [
        {
          id: 'msg_demo_8',
          personaId: 'persona_fitness',
          personaName: 'Fitness Me',
          personaColor: '#10b981',
          personaIcon: '💪',
          content: 'Leg day = complete ✅ Everything hurts but in a good way',
          timestamp: new Date(now - 1 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(),
          reactions: [
            { emoji: '😂', personaId: 'persona_social', timestamp: new Date().toISOString() },
            { emoji: '💀', personaId: 'persona_work', timestamp: new Date().toISOString() }
          ]
        },
        {
          id: 'msg_demo_8b',
          personaId: 'persona_learner',
          personaName: 'Student Me',
          personaColor: '#ec4899',
          personaIcon: '📚',
          content: 'Neural networks are starting to make sense! That breakthrough feeling when concepts click is unmatched.',
          timestamp: new Date(now - 1 * 24 * 60 * 60 * 1000 + 13 * 60 * 60 * 1000).toISOString(),
          reactions: [{ emoji: '🧠', personaId: 'persona_work', timestamp: new Date().toISOString() }]
        },
        {
          id: 'msg_demo_9',
          personaId: 'persona_creative',
          personaName: 'Creative Me',
          personaColor: '#8b5cf6',
          personaIcon: '🎨',
          content: 'Finished the UI mockups! Really happy with how the color scheme turned out.',
          timestamp: new Date(now - 1 * 24 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'msg_demo_10',
          personaId: 'persona_social',
          personaName: 'Social Me',
          personaColor: '#f59e0b',
          personaIcon: '🎉',
          content: 'Coffee date turned into a 3-hour deep conversation. Love when that happens ☕',
          timestamp: new Date(now - 1 * 24 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'msg_demo_10b',
          personaId: 'persona_mindful',
          personaName: 'Mindful Me',
          personaColor: '#06b6d4',
          personaIcon: '🧘',
          content: 'Grateful for meaningful connections. Real conversations feed the soul.',
          timestamp: new Date(now - 1 * 24 * 60 * 60 * 1000 + 21 * 60 * 60 * 1000).toISOString(),
          reactions: [{ emoji: '💙', personaId: 'persona_social', timestamp: new Date().toISOString() }]
        }
      ],
      createdAt: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    
    // Today
    {
      id: 'journal_demo_5',
      title: new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      date: new Date().toISOString().split('T')[0],
      isSpecial: false,
      messages: [
        {
          id: 'msg_demo_11a',
          personaId: 'persona_mindful',
          personaName: 'Mindful Me',
          personaColor: '#06b6d4',
          personaIcon: '🧘',
          content: 'Morning pages done. Setting intentions: stay present, be kind to myself, embrace challenges.',
          timestamp: new Date(now + 7 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'msg_demo_11',
          personaId: 'persona_work',
          personaName: 'Work Me',
          personaColor: '#ef4444',
          personaIcon: '💼',
          content: 'Sprint planning went smoothly. Team is aligned on priorities for the next two weeks.',
          timestamp: new Date(now + 10 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'msg_demo_11b',
          personaId: 'persona_adventurer',
          personaName: 'Adventure Me',
          personaColor: '#84cc16',
          personaIcon: '🌍',
          content: 'Booked the hiking trail for next weekend! Finally getting out of the city 🏔️',
          timestamp: new Date(now + 13 * 60 * 60 * 1000).toISOString(),
          reactions: [
            { emoji: '🎒', personaId: 'persona_fitness', timestamp: new Date().toISOString() },
            { emoji: '🔥', personaId: 'persona_social', timestamp: new Date().toISOString() }
          ]
        },
        {
          id: 'msg_demo_11c',
          personaId: 'persona_learner',
          personaName: 'Student Me',
          personaColor: '#ec4899',
          personaIcon: '📚',
          content: 'Midterm project submitted! Nervous but proud of what I built.',
          timestamp: new Date(now + 15 * 60 * 60 * 1000).toISOString(),
          reactions: [{ emoji: '🤞', personaId: 'persona_work', timestamp: new Date().toISOString() }]
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // Create demo insights
  const insights = [
    {
      id: 'insight_demo_1',
      content: "You've been incredibly balanced this week! Your Work Me is crushing goals while Creative Me explores new skills. The fitness milestone shows dedication, and Social Me reminds you to celebrate with friends. Keep this momentum going! 🌟",
      createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  return { personas, journals, insights };
}
