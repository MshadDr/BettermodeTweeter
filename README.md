# BetterMode - Social Network Backend

A robust social networking backend built with NestJS, featuring group management, tweet functionality, and granular permission controls.

## 👤 Author

- **Name**: Mehrshad Darvish
- **Email**: mshad.darvish@gmail.com
- **Phone**: +1 (604) 220-2775
- [Linkedin](https://www.linkedin.com/in/mehrshad-darvish/)

## 🎥 Project Overview

Watch the video explanation of this project:
[Video Link](https://youtu.be/h0XOxBXRxrI)

## 🌟 Features

- **User Management**: Create and manage user accounts
- **Group System**:
  - Create hierarchical groups with parent-child relationships
  - Add/remove users from groups
- **Tweet System**:
  - Create and manage tweets
  - Support for hashtags, categories, and location
  - Reply functionality (parent-child tweet relationships)
- **Advanced Permission System**:
  - Granular control over view/edit permissions
  - User-level permissions
  - Group-level permissions
  - Public/private content control
  - Inheritance of permissions from parent tweets

## 🛠️ Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **API**: GraphQL
- **Containerization**: Docker
- **Testing**: Jest
- **Runtime**: Node.js (LTS)

## 🚀 Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js (LTS version)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone git@github.com:MshadDr/BettermodeTweeter.git
cd bettermode
```

2. Copy the example environment file:

```bash
cp .env.example .env
```

3. Configure your `.env` file with appropriate values

```
NODE_ENV={{ NODE_ENV }}
PORT={{ PORT }}
DB_LOGGING={{ DB_LOGGING }}
DB_HOST={{ DB_HOST }}
DB_PORT={{ DB_PORT }}
DB_USERNAME={{ DB_USERNAME }}
DB_PASSWORD={{ DB_PASSWORD }}
DB_NAME={{DB_NAME}}

```

## Running the Application

### Development Mode

#### Start the application in development mode

```bash
make dev
----------------------------------------
This command will:
1. Build the containers
2. Start the application
3. Run migrations
4. Automatically seed the database with:
   - Default users
   - Basic group structure
```

### Or run commands individually:

make build # Build containers
make start # Start containers
make migrate # Run migrations and seed data

```bash
make prod
----------------------------------------
This command will:
1. Build the containers
2. Start the application
3. Run migrations
```

### Additional Commands

```bash
# Stop the application
make stop

# Clean up containers and volumes
make clean

# View logs
make logs

# Restart the application
make restart

# Database Operations
make truncate-db   # Clear all data
make reset-db      # Reset and reseed database (dev mode only)
```

## GraphQL Endpoints

### Postman Collection

- [Postman Collection](postman/Bettermode.postman_collection.json)

### Queries

- `healthCheck`: Check the health status of the service

  ```graphql
  healthCheck: HealthCheckResponse!
  ```

- `paginateTweets`: Get paginated tweets for a user

  ```graphql
  paginateTweets(
    userId: Int!,
    page: Int! = 1,
    limit: Int! = 10,
    filterTweetDto: FilterTweetDto
  ): ReturnPaginateTweetsResponseDto!
  ```

- `canEditTweet`: Check if a user has permission to edit a tweet
  ```graphql
  canEditTweet(
    userId: Int!,
    tweetId: Int!
  ): CanEditTweetResponseDto!
  ```

### Mutations

- `createGroup`: Create a new group

  ```graphql
  createGroup(
    createGroupsDto: CreateGroupDto!
  ): ReturnGroupResponseDto!
  ```

- `createTweet`: Create a new tweet

  ```graphql
  createTweet(
    tweetCreateRequestDto: TweetCreateRequestDto!
  ): ReturnTweetResponseDto!
  ```

- `updateTweetPermission`: Update permissions for a tweet
  ```graphql
  updateTweetPermission(
    updateTweetPermissionDto: UpdateTweetPermissionDto!
  ): ReturnTweetResponseDto!
  ```

## 🧪 Testing

The project includes comprehensive test suites for services, resolvers, and permission logic:

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:cov

# Run tests in watch mode
npm run test:watch
```

## 📁 Project Structure

```
src/
├── users/           # User management
├── groups/          # Group management
├── tweets/          # Tweet functionality
├── permissions/     # Permission system
├── configs/         # Configs
├── database/        # Database - Seeds
└── app/             # Base utilities
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- BetterMode team for the amazing opportunity

```

This README provides a comprehensive guide for developers to understand, set up, and contribute to your project. It includes:

1. A clear description of the project and its features
2. The technology stack used
3. Detailed setup instructions
4. Available commands and their usage
5. Testing information
6. Project structure
7. Contributing guidelines

Feel free to customize it further based on your specific needs or additional features!
```
