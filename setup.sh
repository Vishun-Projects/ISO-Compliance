#!/bin/bash

echo "🚀 Setting up ISO Compliance Platform..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if MySQL is running
if ! command -v mysql &> /dev/null; then
    echo "⚠️  MySQL is not installed. You can use Docker instead:"
    echo "   docker run --name mysql -e MYSQL_ROOT_PASSWORD= -e MYSQL_DATABASE=iso_compliance -p 3306:3306 -d mysql:8.0"
    echo "   Or install MySQL locally and create the database manually."
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create database if it doesn't exist
echo "🗄️  Setting up database..."
mysql -u root -e "CREATE DATABASE IF NOT EXISTS iso_compliance;" 2>/dev/null || echo "⚠️  Could not create database. Please create it manually: CREATE DATABASE iso_compliance;"

# Run database migrations
echo "🔄 Running database migrations..."
npx prisma migrate dev

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

echo "✅ Setup complete!"
echo ""
echo "🎉 You can now start the development server:"
echo "   npm run dev"
echo ""
echo "🌐 Open http://localhost:3000 in your browser"
echo ""
echo "📚 For more information, see README.md"
