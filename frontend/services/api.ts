export const api = {
  // Fetch schemes based on filters
  async getSchemes(params?: { category?: string; state?: string; search?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.category && params.category !== 'all') queryParams.append('category', params.category);
    if (params?.state && params.state !== 'All India') queryParams.append('state', params.state);
    if (params?.search) queryParams.append('search', params.search);

    const response = await fetch(`/api/schemes?${queryParams.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch schemes');
    return response.json();
  },

  // Get single scheme by ID
  async getSchemeById(id: string) {
    const response = await fetch(`/api/schemes/${id}`);
    if (!response.ok) throw new Error('Failed to fetch scheme details');
    return response.json();
  },

  async getRecommendations(userProfile: any) {
    const response = await fetch('/api/recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile: userProfile }),
    });
    if (!response.ok) throw new Error('Failed to fetch recommendations');
    return response.json();
  },

  async getSources() {
    const response = await fetch('/api/sources');
    if (!response.ok) throw new Error('Failed to fetch sources');
    return response.json();
  },

  async getAdminDashboard() {
    const response = await fetch('/api/admin/dashboard');
    if (!response.ok) throw new Error('Failed to fetch admin dashboard');
    return response.json();
  },

  async getVersionComparison() {
    const response = await fetch('/api/admin/versions/compare');
    if (!response.ok) throw new Error('Failed to fetch version comparison');
    return response.json();
  },

  async approveDocument(documentId: string) {
    const response = await fetch(`/api/admin/documents/${documentId}/approve`, { method: 'POST' });
    if (!response.ok) throw new Error('Failed to approve document');
    return response.json();
  },

  async archiveDocument(documentId: string) {
    const response = await fetch(`/api/admin/documents/${documentId}/archive`, { method: 'POST' });
    if (!response.ok) throw new Error('Failed to archive document');
    return response.json();
  },

  async uploadAdminDocument(document: Record<string, unknown>) {
    const response = await fetch('/api/admin/documents/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(document),
    });
    if (!response.ok) throw new Error('Failed to upload document');
    return response.json();
  },

  // Check eligibility for a specific scheme
  async checkEligibility(schemeId: string, userProfile: any) {
    const response = await fetch('/api/eligibility', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ schemeId, profile: userProfile }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to check eligibility');
    return data;
  },

  // Asha AI Assistant Endpoint
  async askAsha(question: string, userProfile?: any, language?: string) {
    const response = await fetch('/api/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: question, profile: userProfile, language }),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get response from Asha AI');
    }
    return data;
  },

  // Submit feedback on Asha's answers
  async submitFeedback(feedback: { question: any; answer: string; rating: string }) {
    const response = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feedback),
    });
    
    // If backend endpoint isn't strictly required to crash on failure, return json or resolve
    if (!response.ok) {
      console.warn('Feedback endpoint warning: non-ok response');
    }
    try {
      return await response.json();
    } catch {
      return { success: true };
    }
  }
};