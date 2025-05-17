# deluge-next

A modern web frontend for the [Deluge](https://deluge-torrent.org/) BitTorrent client, built with [Next.js](https://nextjs.org/), [TanStack Query](https://tanstack.com/query), [TanStack Table](https://tanstack.com/table), and [shadcn/ui](https://ui.shadcn.com/).

**deluge-next** addresses performance issues in the default Deluge Web UI when managing large numbers of torrents (500+).

## Features

- Fast and responsive UI for large torrent lists
- Modern React-based architecture
- Powerful filtering and sorting capabilities
- Real-time torrent status updates
- Customizable table views

## Getting Started

### Prerequisites

- Node.js (version sepcified in `.nvmrc`)
- pnpm (installed via `npm install -g pnpm`)
- A running Deluge instance with Web UI enabled

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jokejason/deluge-next.git
   cd deluge-next
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Configure environment variables:**

   Copy `.env.local.example` to `.env.local` and update the values:
   ```bash
   cp .env.local.example .env.local
   ```

   Required environment variables:
    - `DELUGE_URL`: URL of your Deluge Web UI
    - `DELUGE_PASSWORD`: Your Deluge Web UI password
   - `DELUGE_NEXT_BASE_URL`: Base URL where deluge-next is hosted
    - `SESSION_SECRET`: Secret key for session management, generated using `openssl rand -base64 32`

4. **Run the development server:**
   ```bash
   pnpm dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## Docker Deployment

### Using Docker Compose with build

```bash
docker-compose up --env-file .env.local
```

### Using Pre-built Image

```bash
docker-compose -f docker-compose-image.yml up
```

Environment variables can be configured in your host environment or via a `.env` file.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[MIT](LICENSE)

---

> Built with Next.js, TanStack Query, TanStack Table, and shadcn/ui.
```