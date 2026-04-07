# Restaurant Node.js Project (Docker Setup)

This project is an Express.js application connected to MongoDB Atlas and Cloudinary. 
It uses Docker to simplify running the project.

## Prerequisites

- Docker installed on your system
- Docker Compose installed

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/username/resturant-node-js.git
   cd resturant-node-js
2. Create your own .env file in the project root with the follwing variables:
    PORT=3000
    dburl=your_mongodb_uri
    secret=jwt_secret
    EMAIL_USER=your_email@example.com
    EMAIL_PASSWORD=your_email_password
    CLOUD_NAME=your_cloud_name
    API_KEY=your_api_key
    API_SECRET=your_api_secret
3. Build and run the project using Docker Compose:
    docker-compose build
    docker-compose up -d
4. You can open your browser on:
    http://localhost:3000
5. To stop the project:
    docker-compose down
