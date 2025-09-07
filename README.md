# ISO Compliance Platform - Document Control

A modern, enterprise-grade document control and compliance management platform built with Next.js, Node.js, and PostgreSQL.

## 🚀 Features

### Core Document Control
- **Document Repository**: Centralized storage for policies, procedures, and compliance documents
- **Version Control**: Track document versions with rollback capability
- **Workflow Management**: Configurable approval workflows (Draft → Review → Approved → Published)
- **Access Control**: Role-based permissions and secure document access
- **Search & Filter**: Advanced search across documents with category and status filters

### Compliance Features
- **Audit Trails**: Complete audit logging for all document actions
- **Approval Tracking**: Monitor document approval status and progress
- **Acknowledgment System**: Track employee document acknowledgments
- **Status Management**: Visual status indicators (Draft, Review, Approved, Published, Archived, Expired)

### User Experience
- **Clean, Intuitive UI**: Modern, responsive design optimized for enterprise use
- **Fast Performance**: Optimized queries and efficient data loading
- **Mobile Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- **Accessibility**: WCAG 2.1 AA compliant design

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Prisma ORM
- **Database**: MySQL 8.0
- **Authentication**: NextAuth.js
- **Deployment**: Docker, Docker Compose
- **Caching**: Redis (optional)

## 📋 Prerequisites

- Node.js 18+ 
- Docker and Docker Compose
- PostgreSQL (or use Docker)
- Git

## 🚀 Quick Start

### Option 1: Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd iso-compliance-platform
   ```

2. **Start the application**
   ```bash
   docker-compose up -d
   ```

3. **Initialize the database**
   ```bash
   docker-compose exec app npx prisma migrate dev
   ```

4. **Access the application**
   - Open http://localhost:3000 in your browser
   - The application will be running with a PostgreSQL database

### Option 2: Local Development

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd iso-compliance-platform
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Set up the database**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

4. **Start the development server**
```bash
npm run dev
   ```

5. **Access the application**
   - Open http://localhost:3000 in your browser

## 📁 Project Structure

```
iso-compliance-platform/
├── src/
│   ├── app/                 # Next.js app router
│   │   ├── api/            # API routes
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home page
│   ├── components/         # React components
│   ├── lib/               # Utility functions
│   └── types/             # TypeScript types
├── prisma/
│   └── schema.prisma      # Database schema
├── public/                # Static assets
├── Dockerfile             # Docker configuration
├── docker-compose.yml     # Docker Compose setup
└── README.md             # This file
```

## 🗄 Database Schema

The platform uses MySQL with the following main entities:

- **Users**: System users with roles and permissions
- **Documents**: Core document entities with metadata
- **DocumentApprovals**: Approval workflow tracking
- **DocumentAcknowledgment**: Employee acknowledgment tracking
- **AuditLog**: Complete audit trail for compliance

## 🔧 Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL="mysql://root@localhost:3306/iso_compliance"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# File Upload
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE=10485760 # 10MB
```

### Database Configuration

The application uses Prisma ORM. To modify the database schema:

1. Edit `prisma/schema.prisma`
2. Run `npx prisma migrate dev` to create a new migration
3. Run `npx prisma generate` to update the Prisma client

## 🚀 Deployment

### Production Deployment

1. **Build the Docker image**
   ```bash
   docker build -t iso-compliance-platform .
   ```

2. **Set up production environment variables**
   ```bash
   # Update docker-compose.yml with production values
   # Set strong passwords and secrets
   ```

3. **Deploy with Docker Compose**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Cloud Deployment

The application can be deployed to:
- **AWS**: Use ECS or EKS with RDS for PostgreSQL
- **Google Cloud**: Use Cloud Run with Cloud SQL
- **Azure**: Use Container Instances with Azure Database
- **DigitalOcean**: Use App Platform with managed databases

## 🔒 Security Features

- **Role-Based Access Control (RBAC)**: Different permission levels for users
- **Audit Logging**: Complete trail of all system actions
- **Input Validation**: Comprehensive form validation and sanitization
- **HTTPS Enforcement**: Secure communication protocols
- **Session Management**: Secure session handling with timeouts

## 📊 Monitoring & Logging

- **Application Logs**: Structured logging for debugging and monitoring
- **Database Logs**: PostgreSQL query performance monitoring
- **Audit Logs**: Compliance and security event tracking
- **Health Checks**: Application and database health monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in the `/docs` folder
- Review the API documentation at `/api/docs`

## 🔄 Roadmap

### Phase 1 (Current)
- ✅ Document Control System
- ✅ User Management
- ✅ Approval Workflows
- ✅ Audit Logging

### Phase 2 (Next)
- 🔄 Risk Management Module
- 🔄 Asset Management
- 🔄 Incident Management
- 🔄 Advanced Reporting

### Phase 3 (Future)
- 🔄 GDPR Toolkit
- 🔄 Multi-tenancy
- 🔄 Advanced AI Features
- 🔄 Mobile Application

---

**Built with ❤️ for enterprise compliance management**
