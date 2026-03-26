module.exports = {
  openapi: '3.0.0',
  info: {
    title: 'Tech Core CMS API',
    version: '1.0.0',
    description: 'API documentation cho hệ thống quản lý Project và Contact'
  },
  servers: [{ url: 'http://localhost:5000' }],
  paths: {
    // --- PROJECTS ---
    '/api/projects': {
      get: {
        tags: ['Projects'],
        summary: 'Lấy danh sách dự án',
        responses: { 200: { description: 'Success' } }
      },
      post: {
        tags: ['Projects'],
        summary: 'Tạo dự án mới',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string', example: 'Dự án Web App' },
                  shortDesc: { type: 'string', example: 'Mô tả ngắn gọn' },
                  content: { type: 'string', example: 'Nội dung chi tiết dự án' },
                  externalLink: { type: 'string', example: 'https://google.com' },
                  imageUrl: { type: 'string', example: 'https://link-anh.png' }
                }
              }
            }
          }
        },
        responses: { 
          201: { description: 'Created' },
          400: { description: 'Lỗi dữ liệu đầu vào' }
        }
      }
    },
    '/api/projects/{id}': {
      patch: {
        tags: ['Projects'],
        summary: 'Cập nhật dự án theo ID',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  shortDesc: { type: 'string' },
                  content: { type: 'string' },
                  externalLink: { type: 'string' },
                  imageUrl: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Updated thành công' },
          404: { description: 'Không tìm thấy project' }
        }
      },
      delete: {
        tags: ['Projects'],
        summary: 'Xóa dự án theo ID',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        responses: {
          200: { description: 'Xóa thành công' },
          404: { description: 'Không tìm thấy project' }
        }
      }
    },

    // --- CONTACTS ---
    '/api/contacts': {
      get: {
        tags: ['Contacts'],
        summary: 'Lấy danh sách liên hệ',
        responses: { 200: { description: 'Success' } }
      },
      post: {
        tags: ['Contacts'],
        summary: 'Gửi liên hệ mới',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Lê Minh Trung' },
                  email: { type: 'string', example: 'trung@example.com' },
                  phone: { type: 'string', example: '0901234567' },
                  message: { type: 'string', example: 'Chào bạn, tớ cần tư vấn' }
                }
              }
            }
          }
        },
        responses: { 201: { description: 'Sent' } }
      }
    },
    '/api/contacts/{id}': {
      delete: {
        tags: ['Contacts'],
        summary: 'Xóa liên hệ theo ID',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        responses: {
          200: { description: 'Xóa thành công' },
          404: { description: 'Không tìm thấy liên hệ' }
        }
      }
    }
  }
};