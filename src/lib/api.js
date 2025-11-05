const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = {
  async register(userData) {
    const response = await fetch(`${API_BASE_URL}/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }
    
    return response.json();
  },
  
  async login(credentials) {
    // Mô phỏng delay của API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Luôn trả về đăng nhập thành công với thông tin người dùng
    return {
      user: {
        id: Date.now(), // Sử dụng timestamp làm ID tạm
        email: credentials.email,
        name: credentials.email.split('@')[0], // Lấy phần trước @ làm tên
        token: `mock-jwt-token-${Math.random().toString(36).substr(2, 9)}`
      }
    };
  },
};
