# Pixel to Pattern - Create Your Perfect Piece

**Pixel to Pattern** turns your pixel art into beautiful, beginner-friendly crochet patterns, stitch by stitch and row by row.  
Let the creativity flow.

---

## Features

### Create  
Turn any pixel drawing into a crochet-ready pattern.  
Each row lists the stitch counts per color, for example:

```
(sc = single crochet)
Row 1: 28 sc (white)
Row 2: 9 sc (white), 10 sc (yellow), 9 sc (white)
Row 3: 8 sc (white), 10 sc (yellow), 9 sc (white)
```

### Read  
Browse all submitted creations and view detailed, stitch-by-stitch patterns.

### Update  
Users will soon be able to edit their own patterns directly.

### Delete *(Coming Soon)*  
Remove any pattern you’ve posted with one click.

---

## Tech Stack

- **Frontend:** Next.js, Material UI, React  
- **Backend:** Node.js, Express  
- **Database:** MySQL with Sequelize ORM  
- **Deployment:** Docker containers, GitHub Container Repository (GHCR)  
- **Version:** Node 24+

---

## Environment Variables

This project utilizes environment variables for configuration.  
You will need to create both a `.env` file in the root directory and a `.env.local` file in the client directory, as outlined below.

### Server `.env` (example.env provided in root)

**Required Variables:**
- `DB_USER`: The username for the database user.  
- `DB_PASSWORD`: The password for the database user.  
- `DB_HOST`: The IP address for the machine running the database (use `localhost` for local development or `db` for Docker).  
- `DB_DATABASE`: The name of the database to access.  
- `DB_PORT`: The port number the database is running on.  
- `SERVER_PORT`: The port number for the backend server (default: 3000).

**Note:** The frontend uses relative URLs with Next.js rewrites to communicate with the backend. No environment variables are required for the client in Docker setups.

---

## Running Locally with Docker Compose

You can run the entire Pixel to Pattern stack locally using Docker Compose.

1. **Fork and clone** this repository:
   ```bash
   git clone https://github.com/AlexanderORuban/Pixel-to-Pattern.git
   ```
2. Ensure Docker and Docker Compose are installed.
3. Create a `.env` file in the root directory with the necessary credentials listed above.
4. Build and start all services:
   ```bash
   docker compose up --build
   ```
5. Visit [http://localhost:3001](http://localhost:3001) to access the application.

To stop containers:
```bash
docker compose down
```

### Rebuilding or Restarting Containers

If you make code changes and want to rebuild the images:
```bash
docker compose build --no-cache
docker compose up -d
```

To restart containers without rebuilding:
```bash
docker compose restart
```

---

## Local Setup (Non-Docker)

These steps apply only if you wish to run **Pixel to Pattern** manually without Docker.

1. **Fork and clone** this repository:
   ```bash
   git clone https://github.com/AlexanderORuban/Pixel-to-Pattern.git
   ```
2. In the root directory, create a `.env` file as described above.  
3. **Install dependencies** in the root, `server/`, and `client/` directories:
   ```bash
   npm install
   ```
4. Run the application from the root:
   ```bash
   npm run dev
   ```
5. Open your browser at [http://localhost:3001](http://localhost:3001)  
6. Start creating your pattern.

---

## Deployment Process

### Steps

1. Create GHCR containers for both frontend and backend.  
2. Log into GHCR in your terminal or code editor:
   ```bash
   echo "<YOUR_GITHUB_TOKEN>" | docker login ghcr.io -u <your_github_username> --password-stdin
   ```
3. **Build and push the backend container:**
   ```bash
   docker build --no-cache -t ghcr.io/<UserName>/<BackendContainer>:latest ./server
   docker push ghcr.io/<UserName>/<BackendContainer>:latest
   ```
4. **Build and push the frontend container:**
   ```bash
   docker build --no-cache -t ghcr.io/<Username>/<FrontendContainer>:latest ./client
   docker push ghcr.io/<UserName>/<FrontendContainer>:latest
   ```

---

## VM Setup

1. Log into your VM:
   ```bash
   ssh root@<VM_IP>
   ```
2. Update the package index:
   ```bash
   sudo apt-get update -y
   ```
3. Upgrade existing packages (non-interactive):
   ```bash
   yes | sudo DEBIAN_FRONTEND=noninteractive apt-get -yqq upgrade
   ```
4. Install Docker dependencies:
   ```bash
   sudo apt install -y ca-certificates curl gnupg lsb-release
   ```
5. Add the Docker GPG key and repository:
   ```bash
   sudo mkdir -p /etc/apt/keyrings
   curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
   echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg]    https://download.docker.com/linux/ubuntu    $(lsb_release -cs) stable" |    sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
   ```
6. Install the Docker engine and compose plugin:
   ```bash
   sudo apt update
   sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
   ```
7. Verify installation:
   ```bash
   sudo docker run hello-world
   ```
   Expected output: “Hello from Docker!”
8. Create a new project directory:
   ```bash
   mkdir <project_name> && cd <project_name>
   ```
9. Add your `docker-compose.deploy.yml` file to the directory.  
10. Create a `.env` file and place it at the same level as the YAML file.  
11. Pull the images:
    ```bash
    docker compose -f docker-compose.deploy.yml pull
    ```
12. Start the application:
    ```bash
    docker compose -f docker-compose.deploy.yml up -d
    ```
13. Verify the containers are running:
    ```bash
    docker ps
    ```

---

## Troubleshooting

**Common Docker Issues**

- **Ports already in use:**  
  Stop conflicting containers or change the port in `docker-compose.yml`.  
  ```bash
  docker ps
  docker stop <container_id>
  ```

- **Environment variables not loading:**  
  Ensure the `.env` file is in the root directory and not ignored by `.dockerignore`.

- **Containers not starting:**  
  Check logs for detailed errors:
  ```bash
  docker compose logs
  ```

- **MySQL connection errors:**  
  Use `DB_HOST=db` in your `.env` when using Docker Compose.  
  Test with:
  ```bash
  docker exec -it db mysql -u root -p
  ```

  ---

## Backend Unit Tests

This project includes **unit tests** for the backend using **Jest**.  

### Running the Tests

Run all backend unit tests and generate a coverage report:

```bash
cd server
npm install
npm test
```

  ---

## Frontend Unit Tests

This project includes **unit tests** for the frontend using **Jest**.  

### Running the Tests

Run all frontend unit tests and generate a coverage report:

```bash
cd client
npm install
npm test
```
## 📊 Generate a Coverage Report (if not automatic)
```
npm test -- --coverage
```
   ---