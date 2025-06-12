export interface Memory {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchResult {
  answer: string;
  references: Memory[];
}

class MemoryService {
  private baseUrl = '/api/memories';
  private storageKey = 'second-brain-memories';

  async getMemories(): Promise<Memory[]> {
    try {
      // Get from localStorage for demo/guest mode
      const stored = localStorage.getItem(this.storageKey);
      console.log('Getting memories from storage:', stored);
      
      if (!stored) {
        console.log('No memories found in storage');
        return [];
      }
      
      const memories = JSON.parse(stored);
      console.log('Parsed memories:', memories.length);
      
      return memories.map((m: any) => ({
        ...m,
        createdAt: new Date(m.createdAt),
        updatedAt: new Date(m.updatedAt),
      }));
    } catch (error) {
      console.error('Error getting memories:', error);
      return [];
    }
  }

  async createMemory(memory: Omit<Memory, 'id' | 'createdAt' | 'updatedAt'>): Promise<Memory> {
    try {
      console.log('Creating memory:', memory);
      
      const newMemory: Memory = {
        ...memory,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const existingMemories = await this.getMemories();
      const updatedMemories = [newMemory, ...existingMemories];
      
      // Store in localStorage
      localStorage.setItem(this.storageKey, JSON.stringify(updatedMemories));
      
      console.log('Memory created successfully:', newMemory);
      console.log('Total memories now:', updatedMemories.length);
      
      // Verify storage
      const verification = localStorage.getItem(this.storageKey);
      console.log('Storage verification:', verification ? JSON.parse(verification).length : 'null');
      
      return newMemory;
    } catch (error) {
      console.error('Error creating memory:', error);
      throw new Error('Failed to create memory');
    }
  }

  async updateMemory(id: string, updates: Partial<Memory>): Promise<Memory> {
    try {
      const memories = await this.getMemories();
      const index = memories.findIndex(m => m.id === id);
      
      if (index === -1) throw new Error('Memory not found');
      
      const updated = {
        ...memories[index],
        ...updates,
        updatedAt: new Date(),
      };
      
      memories[index] = updated;
      localStorage.setItem(this.storageKey, JSON.stringify(memories));
      
      console.log('Memory updated:', updated);
      return updated;
    } catch (error) {
      console.error('Error updating memory:', error);
      throw new Error('Failed to update memory');
    }
  }

  async deleteMemory(id: string): Promise<void> {
    try {
      const memories = await this.getMemories();
      const filtered = memories.filter(m => m.id !== id);
      localStorage.setItem(this.storageKey, JSON.stringify(filtered));
      console.log('Memory deleted, remaining:', filtered.length);
    } catch (error) {
      console.error('Error deleting memory:', error);
      throw new Error('Failed to delete memory');
    }
  }

  // Enhanced AI knowledge base for general queries
  private getGeneralKnowledge(query: string): string {
    const queryLower = query.toLowerCase().trim();
    
    // Technology and Programming
    if (queryLower.includes('javascript') || queryLower.includes('js')) {
      return `JavaScript is a versatile programming language primarily used for web development. It's a high-level, interpreted language that supports object-oriented, imperative, and functional programming styles. JavaScript runs in browsers and on servers (Node.js), making it essential for both frontend and backend development.

Key features:
• Dynamic typing and first-class functions
• Event-driven programming model
• Extensive ecosystem with npm packages
• Modern features like async/await, modules, and arrow functions

JavaScript is fundamental for creating interactive web applications and is one of the most popular programming languages worldwide.`;
    }

    if (queryLower.includes('python')) {
      return `Python is a high-level, interpreted programming language known for its simplicity and readability. Created by Guido van Rossum, Python emphasizes code readability with its notable use of significant whitespace.

Key characteristics:
• Simple, easy-to-learn syntax
• Extensive standard library
• Strong community and ecosystem
• Versatile applications: web development, data science, AI, automation
• Popular frameworks: Django, Flask, FastAPI, NumPy, Pandas

Python is excellent for beginners and widely used in data science, machine learning, web development, and automation scripts.`;
    }

    if (queryLower.includes('react')) {
      return `React is a popular JavaScript library for building user interfaces, particularly web applications. Developed by Facebook, React uses a component-based architecture and virtual DOM for efficient rendering.

Core concepts:
• Component-based architecture
• Virtual DOM for performance optimization
• JSX syntax for writing components
• Unidirectional data flow
• Hooks for state management and side effects

React is widely adopted for frontend development and has a rich ecosystem including React Native for mobile development, Next.js for full-stack applications, and numerous UI libraries.`;
    }

    // Productivity and Learning
    if (queryLower.includes('productivity') || queryLower.includes('productive')) {
      return `Productivity refers to the efficiency of completing tasks and achieving goals. Here are key strategies for improving productivity:

Time Management:
• Use time-blocking techniques
• Prioritize tasks with methods like Eisenhower Matrix
• Implement the Pomodoro Technique (25-minute focused work sessions)
• Eliminate distractions and time-wasters

Organization:
• Maintain a clean, organized workspace
• Use task management tools and to-do lists
• Batch similar tasks together
• Plan your day the night before

Focus Enhancement:
• Practice deep work sessions
• Take regular breaks to maintain energy
• Use the two-minute rule for quick tasks
• Set clear, achievable goals

Remember: productivity is about working smarter, not harder.`;
    }

    if (queryLower.includes('learning') || queryLower.includes('study')) {
      return `Effective learning involves understanding how your brain processes and retains information. Here are proven learning strategies:

Active Learning Techniques:
• Spaced repetition for long-term retention
• Active recall instead of passive reading
• Teaching concepts to others (Feynman Technique)
• Practice testing and self-quizzing

Study Methods:
• Break information into smaller chunks
• Use multiple senses (visual, auditory, kinesthetic)
• Create mind maps and visual connections
• Apply the 80/20 rule (focus on high-impact concepts)

Memory Enhancement:
• Get adequate sleep for memory consolidation
• Use mnemonics and memory palaces
• Connect new information to existing knowledge
• Review material at increasing intervals

Consistency and environment matter as much as technique.`;
    }

    // Business and Career
    if (queryLower.includes('business') || queryLower.includes('entrepreneur')) {
      return `Business and entrepreneurship involve creating value through products, services, or solutions. Key principles for success:

Business Fundamentals:
• Understand your target market and customer needs
• Develop a clear value proposition
• Create sustainable revenue models
• Focus on cash flow and financial management

Entrepreneurial Mindset:
• Embrace calculated risks and learn from failures
• Stay adaptable and pivot when necessary
• Build strong networks and relationships
• Continuously innovate and improve

Growth Strategies:
• Validate ideas before full investment
• Focus on customer satisfaction and retention
• Leverage technology for efficiency and scale
• Invest in team building and company culture

Success in business requires persistence, strategic thinking, and the ability to execute ideas effectively.`;
    }

    // Health and Wellness
    if (queryLower.includes('health') || queryLower.includes('wellness') || queryLower.includes('fitness')) {
      return `Health and wellness encompass physical, mental, and emotional well-being. Here's a comprehensive approach:

Physical Health:
• Regular exercise (cardio, strength training, flexibility)
• Balanced nutrition with whole foods
• Adequate sleep (7-9 hours for most adults)
• Stay hydrated and limit processed foods

Mental Health:
• Practice stress management techniques
• Maintain social connections and relationships
• Engage in mindfulness or meditation
• Seek professional help when needed

Daily Habits:
• Establish consistent routines
• Take breaks from screens and technology
• Spend time in nature
• Practice gratitude and positive thinking

Remember: small, consistent changes often lead to the most sustainable improvements in overall health and well-being.`;
    }

    // Technology and AI
    if (queryLower.includes('ai') || queryLower.includes('artificial intelligence') || queryLower.includes('machine learning')) {
      return `Artificial Intelligence (AI) is the simulation of human intelligence in machines designed to think and act like humans. It's transforming industries and daily life.

Types of AI:
• Narrow AI: Specialized for specific tasks (current state)
• General AI: Human-level intelligence across domains (future goal)
• Machine Learning: Systems that learn from data
• Deep Learning: Neural networks with multiple layers

Applications:
• Natural Language Processing (chatbots, translation)
• Computer Vision (image recognition, autonomous vehicles)
• Recommendation Systems (Netflix, Amazon)
• Predictive Analytics (finance, healthcare)

Key Technologies:
• Neural Networks and Deep Learning
• Natural Language Processing
• Computer Vision
• Robotics and Automation

AI is rapidly evolving and becoming integral to modern technology solutions.`;
    }

    // Default response for unrecognized queries
    return `I'd be happy to help you with "${query}"! While I don't have specific information about this topic in your stored memories, here's what I can share:

This appears to be a topic worth exploring further. Consider researching:
• Key concepts and fundamentals
• Current trends and developments
• Practical applications and examples
• Expert opinions and resources

💡 Suggestion: Once you learn more about "${query}", consider adding your insights to your Second Brain so you can easily reference them later. This will help build your personal knowledge base on this topic.

Would you like me to help you find specific aspects of "${query}" to research, or would you prefer to add what you already know to your memories?`;
  }

  async searchMemories(query: string): Promise<SearchResult> {
    try {
      console.log('Searching for:', query);
      
      // Simulate AI search delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const memories = await this.getMemories();
      const queryLower = query.toLowerCase().trim();
      
      if (!queryLower) {
        return {
          answer: "Please provide a search query to find relevant memories from your knowledge base.",
          references: []
        };
      }
      
      // Enhanced search with multiple matching strategies
      const relevant = memories.filter(m => {
        const titleMatch = m.title.toLowerCase().includes(queryLower);
        const contentMatch = m.content.toLowerCase().includes(queryLower);
        const tagMatch = m.tags.some(tag => tag.toLowerCase().includes(queryLower));
        
        // Check for partial word matches (words longer than 2 characters)
        const queryWords = queryLower.split(/\s+/).filter(word => word.length > 2);
        const wordMatch = queryWords.some(word => 
          m.title.toLowerCase().includes(word) || 
          m.content.toLowerCase().includes(word) ||
          m.tags.some(tag => tag.toLowerCase().includes(word))
        );
        
        return titleMatch || contentMatch || tagMatch || wordMatch;
      });

      // Sort by relevance (exact matches first, then partial matches)
      relevant.sort((a, b) => {
        const aExactTitle = a.title.toLowerCase().includes(queryLower) ? 3 : 0;
        const aExactContent = a.content.toLowerCase().includes(queryLower) ? 2 : 0;
        const aTagMatch = a.tags.some(tag => tag.toLowerCase().includes(queryLower)) ? 1 : 0;
        
        const bExactTitle = b.title.toLowerCase().includes(queryLower) ? 3 : 0;
        const bExactContent = b.content.toLowerCase().includes(queryLower) ? 2 : 0;
        const bTagMatch = b.tags.some(tag => tag.toLowerCase().includes(queryLower)) ? 1 : 0;
        
        return (bExactTitle + bExactContent + bTagMatch) - (aExactTitle + aExactContent + aTagMatch);
      });

      console.log('Found relevant memories:', relevant.length);

      let answer: string;
      
      if (relevant.length === 0) {
        // No memories found - provide general AI knowledge
        answer = this.getGeneralKnowledge(query);
      } else if (relevant.length === 1) {
        const memory = relevant[0];
        answer = `Based on your stored knowledge, I found one relevant memory about "${query}":

📝 ${memory.title}

${memory.content.substring(0, 300)}${memory.content.length > 300 ? '...' : ''}`;
      } else {
        const topMemories = relevant.slice(0, 3);
        const memoryTitles = topMemories.map(m => `• ${m.title}`).join('\n');
        
        answer = `I found ${relevant.length} memories related to "${query}" in your knowledge base:

📚 Top Results:
${memoryTitles}

${relevant.length > 3 ? `And ${relevant.length - 3} more related memories.` : ''}

These memories contain your personal insights and knowledge about "${query}".`;
      }

      return {
        answer,
        references: relevant.slice(0, 10),
      };
    } catch (error) {
      console.error('Error searching memories:', error);
      return {
        answer: `I encountered an error while searching for "${query}". Please try your search again.`,
        references: []
      };
    }
  }

  // Helper method to clear all memories (for testing)
  async clearAllMemories(): Promise<void> {
    localStorage.removeItem(this.storageKey);
    console.log('All memories cleared');
  }

  // Helper method to get memory count
  async getMemoryCount(): Promise<number> {
    const memories = await this.getMemories();
    return memories.length;
  }

  // Helper method to search by specific criteria
  async searchByTag(tag: string): Promise<Memory[]> {
    const memories = await this.getMemories();
    return memories.filter(m => 
      m.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
    );
  }

  // Helper method to get recent memories
  async getRecentMemories(limit: number = 5): Promise<Memory[]> {
    const memories = await this.getMemories();
    return memories
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }
}

export const memoryService = new MemoryService();