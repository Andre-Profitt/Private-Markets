const API_BASE_URLS = {
  identity: process.env.NEXT_PUBLIC_IDENTITY_API_URL || 'http://localhost:3001',
  profiles: process.env.NEXT_PUBLIC_PROFILES_API_URL || 'http://localhost:3002',
  companies: process.env.NEXT_PUBLIC_COMPANIES_API_URL || 'http://localhost:3003',
  holdings: process.env.NEXT_PUBLIC_HOLDINGS_API_URL || 'http://localhost:3004',
};

interface RequestOptions extends RequestInit {
  token?: string;
}

class ApiClient {
  private getHeaders(token?: string): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = 'Bearer ' + token;
    }

    return headers;
  }

  async request<T>(
    service: keyof typeof API_BASE_URLS,
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { token, ...fetchOptions } = options;
    const url = API_BASE_URLS[service] + endpoint;

    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        ...this.getHeaders(token),
        ...fetchOptions.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  // Identity Service
  async login(email: string, password: string) {
    return this.request<{
      accessToken: string;
      refreshToken: string;
      user: any;
    }>('identity', '/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) {
    return this.request<{
      accessToken: string;
      refreshToken: string;
      user: any;
    }>('identity', '/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async refreshToken(refreshToken: string) {
    return this.request<{
      accessToken: string;
      refreshToken: string;
    }>('identity', '/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  async getMe(token: string) {
    return this.request<any>('identity', '/users/me', {
      token,
    });
  }

  // Profiles Service
  async getProfile(userId: string, token: string) {
    return this.request<any>('profiles', '/profiles/user/' + userId, {
      token,
    });
  }

  async createProfile(data: any, token: string) {
    return this.request<any>('profiles', '/profiles', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    });
  }

  async updateProfile(userId: string, data: any, token: string) {
    return this.request<any>('profiles', '/profiles/user/' + userId, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    });
  }

  async getKycStatus(userId: string, token: string) {
    return this.request<any>('profiles', '/kyc/user/' + userId + '/status', {
      token,
    });
  }

  async getAccreditationStatus(userId: string, token: string) {
    return this.request<any>('profiles', '/accreditation/user/' + userId, {
      token,
    });
  }

  async startKycCheck(userId: string, checkType: string, token: string) {
    return this.request<any>('profiles', '/kyc/user/' + userId + '/start', {
      method: 'POST',
      body: JSON.stringify({ checkType, provider: 'MOCK' }),
      token,
    });
  }

  // Companies Service
  async getCompanies(token: string, params?: { skip?: number; take?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.skip) queryParams.append('skip', params.skip.toString());
    if (params?.take) queryParams.append('take', params.take.toString());
    
    const query = queryParams.toString() ? '?' + queryParams.toString() : '';
    return this.request<any>('companies', '/companies' + query, {
      token,
    });
  }

  async getCompany(id: string, token: string) {
    return this.request<any>('companies', '/companies/' + id, {
      token,
    });
  }

  async getCompanyCapTable(id: string, token: string) {
    return this.request<any>('companies', '/companies/' + id + '/cap-table', {
      token,
    });
  }

  // Holdings Service
  async getUserHoldings(userId: string, token: string) {
    return this.request<any>('holdings', '/holdings/user/' + userId, {
      token,
    });
  }

  async getUserPositions(userId: string, token: string) {
    return this.request<any>('holdings', '/positions/user/' + userId, {
      token,
    });
  }

  async getPositionSummary(userId: string, token: string) {
    return this.request<any>('holdings', '/positions/user/' + userId + '/summary', {
      token,
    });
  }

  async getUserTransactions(userId: string, token: string, limit?: number) {
    const query = limit ? '?limit=' + limit : '';
    return this.request<any>('holdings', '/transactions/user/' + userId + query, {
      token,
    });
  }
}

export const apiClient = new ApiClient();
